use candid::Deserialize;
use std::{cell::RefCell, time::Duration};

use serde::Serialize;

mod guards;
use guards::is_controller;

// Candid
use candid::{candid_method, Principal};

use ic_cdk::{
    api::{self},
    init, post_upgrade, pre_upgrade, query, update,
};

// KDTree
use kiddo::float::{distance::squared_euclidean, kdtree::KdTree};
mod datatype;
use datatype::{PlainDoc, VecDoc, VecQuery};
mod hash;
use hash::hash;

mod embeddings;
use embeddings::{normalize_embeddings, EMBEDDING_SIZE};

const BUCKET_SIZE: usize = 32;
pub type Tree = KdTree<f32, u64, EMBEDDING_SIZE, BUCKET_SIZE, u16>;
use std::collections::HashMap;
pub type PlainMap = HashMap<u64, PlainDoc>;

// --- Cycles topup ---
// 3 days
const CYCLES_BALANCE_CHECK_MIN_INTERVAL_SECS: u64 = 60 * 60 * 24 * 3;
// Cycle usage threshold
const CYCLES_ONE_TC: u64 = 1_000_000_000_000;
const CYCLES_THRESHOLD: u64 = 3 * CYCLES_ONE_TC;
const CYCLES_TOPUP_AMT: u64 = 4 * CYCLES_ONE_TC;

const CYCLES_TOPUP_GROUP: &str = "arcmindvectordb";

// Stable Structure
use ic_stable_structures::{writer::Writer, Memory as _, StableVec};
mod memory;
use memory::Memory;

#[derive(Serialize, Deserialize)]
pub struct State {
    pub owner: Option<Principal>,
    pub battery_api_key: Option<String>,
    pub battery_canister: Option<Principal>,

    #[serde(skip, default = "init_stable_vec_content")]
    stable_vec_content: StableVec<VecDoc, Memory>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            owner: None,
            battery_api_key: None,
            battery_canister: None,
            stable_vec_content: init_stable_vec_content(),
        }
    }
}

// Mutable global state
thread_local! {
    // persistent state
    static STATE: RefCell<State> = RefCell::default();

    // volatile state
    static TREE: RefCell<Tree> = RefCell::new(KdTree::new());
    static PLAIN_MAP: RefCell<PlainMap> = RefCell::new(HashMap::new());
}

fn init_stable_vec_content() -> StableVec<VecDoc, Memory> {
    StableVec::init(memory::get_stable_vec_content_memory())
        .expect("call to init_stable_vec_content fails")
}

// Vector DB main functions
//#[update(guard = "assert_owner")]
#[update(guard = "is_controller")]
#[candid_method(update)]
pub fn add(doc: VecDoc) -> String {
    let embeddings = normalize_embeddings(doc.embeddings.clone());
    let query: &[f32; EMBEDDING_SIZE] = &embeddings.try_into().unwrap();
    let plain_doc = PlainDoc {
        content: doc.content.to_owned(),
    };

    let id = hash(&plain_doc);

    // Update KDTree and PlainMap
    PLAIN_MAP.with(|plain_map| plain_map.borrow_mut().insert(id, plain_doc));
    TREE.with(|tree| tree.borrow_mut().add(query, id));

    // Add to stable vector content
    STATE.with(|state| {
        state
            .borrow_mut()
            .stable_vec_content
            .push(&doc)
            .expect("call to stable_vec_content.push fails")
    });

    return "success".to_string();
}

//#[update(guard = "assert_owner")]
#[update(guard = "is_controller")]
#[candid_method(query)]
pub fn search(vec_query: VecQuery, k: usize) -> Option<Vec<PlainDoc>> {
    let mut query: Vec<f32> = match vec_query {
        VecQuery::Embeddings(q) => q.to_owned(),
    };
    query.resize(EMBEDDING_SIZE, 0.0);

    let query: &[f32; EMBEDDING_SIZE] = &query.try_into().unwrap();
    let neighbors = TREE.with(|tree| tree.borrow().nearest_n(query, k, &squared_euclidean));
    let plain_map = PLAIN_MAP.with(|plain_map| plain_map.borrow().clone());

    let mut result: Vec<PlainDoc> = vec![];
    for neighbor in &neighbors {
        let doc = plain_map.get(&neighbor.item);
        if let Some(document) = doc {
            result.push(document.to_owned());
        }
    }

    Some(result)
}

//#[update(guard = "assert_owner")]
#[update(guard = "is_controller")]
#[candid_method(update)]
pub fn delete(doc: VecDoc) {
    let mut embeddings = doc.embeddings.clone();
    embeddings.resize(EMBEDDING_SIZE, 0.0);

    let query: &[f32; EMBEDDING_SIZE] = &embeddings.try_into().unwrap();
    let id = hash(&PlainDoc {
        content: doc.content.to_owned(),
    });

    TREE.with(|tree| tree.borrow_mut().remove(query, id));
    PLAIN_MAP.with(|plain_map| plain_map.borrow_mut().remove(&id));
}

fn init_index() {
    let vec_content: Vec<VecDoc> = STATE.with(|s| s.borrow().stable_vec_content.iter().collect());

    let data_vec: Vec<(u64, PlainDoc)> = vec_content
        .iter()
        .map(|doc| PlainDoc {
            content: doc.content.to_owned(),
        })
        .map(|document| (hash(&document), document))
        .collect();

    // assign data_vec to PLAIN_MAP
    PLAIN_MAP.with(|plain_map| {
        let mut map = plain_map.borrow_mut();
        for (id, doc) in data_vec.iter() {
            map.insert(*id, doc.to_owned());
        }
    });

    // iterate through vec_content and add to TREE
    TREE.with(|tree| {
        let mut tree = tree.borrow_mut();
        for doc in vec_content.iter() {
            let embeddings = normalize_embeddings(doc.embeddings.clone());
            let query: &[f32; EMBEDDING_SIZE] = &embeddings.try_into().unwrap();
            let plain_doc = PlainDoc {
                content: doc.content.to_owned(),
            };

            let id = hash(&plain_doc);
            tree.add(query, id);
        }
    });
}

//#[update(guard = "assert_owner")]
#[update(guard = "is_controller")]
#[candid_method(query)]
pub fn size() -> usize {
    return PLAIN_MAP.with(|plain_map| plain_map.borrow().len());
}

// ---------------------- Supporting Functions ----------------------
#[init]
#[candid_method(init)]
fn init() {
    let my_owner: Principal = api::caller();
    STATE.with(|state| {
        *state.borrow_mut() = State {
            owner: Some(my_owner),
            battery_api_key: Some("1".to_string()),
            battery_canister: Some(api::caller()),
            stable_vec_content: init_stable_vec_content(),
        };
    });

    start_cycles_check_timer(CYCLES_BALANCE_CHECK_MIN_INTERVAL_SECS);
}
/* fn init(
    owner: Option<Principal>,
    battery_api_key: Option<String>,
    battery_canister: Option<Principal>,
) {
    let my_owner: Principal = owner.unwrap_or_else(|| api::caller());
    STATE.with(|state| {
        *state.borrow_mut() = State {
            owner: Some(my_owner),
            battery_api_key: battery_api_key,
            battery_canister: battery_canister,
            stable_vec_content: init_stable_vec_content(),
        };
    });

    start_cycles_check_timer(CYCLES_BALANCE_CHECK_MIN_INTERVAL_SECS);
} */

#[query]
#[candid_method(query)]
pub fn get_owner() -> Option<Principal> {
    STATE.with(|state| (*state.borrow()).owner)
}

//#[update(guard = "assert_owner")]
#[update(guard = "is_controller")]
#[candid_method(update)]
pub fn update_owner(new_owner: Principal) {
    STATE.with(|state| {
        state.borrow_mut().owner = Some(new_owner);
    });
}

//  Check if the cycles balance is below the threshold, and topup from Cycles Battery canister if necessary
#[update]
#[candid_method(update)]
async fn check_cycles_and_topup() {
    // Get the cycles balance
    let current_canister_balance = ic_cdk::api::canister_balance();

    // log the cycles balance
    ic_cdk::println!("Current canister balance: {}", current_canister_balance);

    let battery_api_key: Option<String> =
        STATE.with(|state| (*state.borrow()).battery_api_key.clone());
    let battery_canister = STATE.with(|state| (*state.borrow()).battery_canister.unwrap());

    // Make Topup request if the balance is below the threshold
    if current_canister_balance < CYCLES_THRESHOLD {
        ic_cdk::println!("Cycles balance is below the threshold");

        let cycles_topup: u64 = CYCLES_TOPUP_AMT;
        // convert cycles_topup to u128
        let cycles_topup_input: u128 = cycles_topup as u128;

        let (result,): (Result<(), String>,) = ic_cdk::api::call::call(
            battery_canister.clone(),
            "topup_cycles",
            (
                CYCLES_TOPUP_GROUP,
                battery_api_key.unwrap(),
                cycles_topup_input,
                current_canister_balance,
            ),
        )
        .await
        .expect("call to ask failed");

        if result.is_ok() {
            ic_cdk::println!("Cycles balance topped up by {}", cycles_topup);
        } else {
            ic_cdk::println!("Cycles balance topup failed: {}", result.unwrap_err());
        }
    } else {
        ic_cdk::println!("Cycles balance is above the threshold");

        let (result,): (Result<(), String>,) = ic_cdk::api::call::call(
            battery_canister.clone(),
            "log_cycles",
            (
                CYCLES_TOPUP_GROUP,
                battery_api_key.unwrap(),
                current_canister_balance,
            ),
        )
        .await
        .expect("call to ask failed");

        if result.is_ok() {
            ic_cdk::println!("Cycles balance logged: {}", current_canister_balance);
        } else {
            ic_cdk::println!("Cycles balance log failed: {}", result.unwrap_err());
        }
    }
}

#[update]
fn start_cycles_check_timer(secs: u64) {
    let secs: Duration = Duration::from_secs(secs);
    ic_cdk::println!(
        "Controller canister: checking its cycles balance and request topup with {secs:?} interval..."
    );

    ic_cdk_timers::set_timer_interval(secs, || ic_cdk::spawn(check_cycles_and_topup()));
}

// ---------------------- Canister upgrade process ----------------------
#[pre_upgrade]
fn pre_upgrade() {
    // Serialize the state.
    // This example is using CBOR, but you can use any data format you like.
    let mut state_bytes = vec![];
    STATE
        .with(|s| ciborium::ser::into_writer(&*s.borrow(), &mut state_bytes))
        .expect("failed to encode state");

    // Write the length of the serialized bytes to memory, followed by the
    // by the bytes themselves.
    let len = state_bytes.len() as u32;
    let mut memory = memory::get_upgrades_memory();
    let mut writer = Writer::new(&mut memory, 0);
    writer.write(&len.to_le_bytes()).unwrap();
    writer.write(&state_bytes).unwrap();
}

#[post_upgrade]
fn post_upgrade(
    _owner: Option<Principal>,
    battery_api_key: Option<String>,
    battery_canister: Option<Principal>,
) {
    let memory = memory::get_upgrades_memory();

    // Read the length of the state bytes.
    let mut state_len_bytes = [0; 4];
    memory.read(0, &mut state_len_bytes);
    let state_len = u32::from_le_bytes(state_len_bytes) as usize;

    // Read the bytes
    let mut state_bytes = vec![0; state_len];
    memory.read(4, &mut state_bytes);

    // Deserialize and set the state.
    let state = ciborium::de::from_reader(&*state_bytes).expect("failed to decode state");
    STATE.with(|s| *s.borrow_mut() = state);

    // Rebuild the index from the stable vector content
    init_index();

    // only update battery canister and api key
    STATE.with(|state| {
        state.borrow_mut().battery_api_key = battery_api_key;
        state.borrow_mut().battery_canister = battery_canister;
    });

    start_cycles_check_timer(CYCLES_BALANCE_CHECK_MIN_INTERVAL_SECS);
}

// ---------------------- Custom getrandom ----------------------
use getrandom::register_custom_getrandom;

fn custom_getrandom(_buf: &mut [u8]) -> Result<(), getrandom::Error> {
    // TODO get some randomness
    return Ok(());
}

register_custom_getrandom!(custom_getrandom);

// ---------------------- Candid declarations did file generator ----------------------
#[cfg(test)]
mod tests {
    use crate::datatype::{PlainDoc, VecDoc, VecQuery};
    use candid::{export_service, Principal};

    #[test]
    fn save_candid() {
        use std::env;
        use std::fs::write;
        use std::path::PathBuf;

        let dir = PathBuf::from(env::current_dir().unwrap());
        export_service!();
        write(dir.join("arcmindvectordb.did"), __export_service()).expect("Write failed.");
    }
}
