use crate::datatype::Embeddings;

pub const EMBEDDING_SIZE: usize = 768;

pub fn normalize_embeddings(embeddings: Embeddings) -> Embeddings {
    let mut embeddings = embeddings.clone();
    embeddings.resize(EMBEDDING_SIZE, 0.0);
    return embeddings;
}
