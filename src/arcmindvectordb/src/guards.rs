use crate::STATE;
use candid::Principal;
use ic_cdk::caller;

pub fn assert_owner() -> Result<(), String> {
    let caller: Principal = caller();
    let owner: Principal = STATE.with(|state| state.borrow().owner).unwrap();

    if caller == owner {
        Ok(())
    } else {
        Err("Caller must be the owner of the canister.".to_string())
    }
}
