use candid::{CandidType, Decode, Deserialize, Encode};
use serde::Serialize;
use std::borrow::Cow;

// Stable Structures
use ic_stable_structures::{BoundedStorable, Storable};
const MAX_VALUE_SIZE: u32 = 1024 * 1024;

pub type Embeddings = Vec<f32>;

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub struct VecDoc {
    pub content: String,
    pub embeddings: Embeddings,
}

impl Storable for VecDoc {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

impl BoundedStorable for VecDoc {
    const MAX_SIZE: u32 = MAX_VALUE_SIZE;
    const IS_FIXED_SIZE: bool = false;
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone)]
pub enum VecQuery {
    Embeddings(Vec<f32>),
}

#[derive(CandidType, Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
pub struct PlainDoc {
    pub content: String,
}

#[derive(Serialize)]
pub struct SearchResult {
    pub similar_docs: Vec<PlainDoc>,
}
