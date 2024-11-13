"""Import command line arguments for the scripts."""

import argparse


def parse_args() -> argparse.Namespace:
    """Returns the command line arguments"""
    parser = argparse.ArgumentParser(description="Load a model and set parameters")
    parser.add_argument(
        "--network",
        type=str,
        default="local",
        help="Network: ic or local",
    )
    parser.add_argument(
        "--canister",
        type=str,
        default="no-default",
        help="canister name in dfx.json",
    )
    parser.add_argument(
        "--canister_id",
        type=str,
        default="",
        help="canister_id name canister_ids.json",
    )
    parser.add_argument(
        "--candid",
        type=str,
        default="files/llama2.did",
        help="canister's candid file",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="files/stories15M.bin",
        help="Model file (e.g. models/stories15M.bin)",
    )
    parser.add_argument(
        "--tokenizer",
        type=str,
        default="tokenizers/tokenizer.bin",
        help="Tokenizer file (e.g. tokenizers/tokenizer.bin)",
    )
    parser.add_argument(
        "--chunksize",
        type=float,
        default=1.9,
        help="Chunk Size for upload, in Mb",
    )
    parser.add_argument(
        "--temperature",
        type=float,
        default=0.9,
        help="Temperature (e.g. 1.0, or 0.0)",
    )
    parser.add_argument(
        "--topp",
        type=float,
        default=1.0,
        help="p value in top-p (nucleus) sampling. default 1.0 (=off)",
    )
    parser.add_argument(
        "--steps",
        type=int,
        default=256,
        help="Max number of steps to run for, 0: use seq_len",
    )
    parser.add_argument(
        "--rng-seed",
        type=int,
        default=0,
        help="seed, 0: use random seed based on time",
    )
    parser.add_argument(
        "--model_id",
        type=str,
        default="Llama2_260K",
        help="id of LLM as used in canister, e.g. Llama2_260K or Llama2_15M",
    )
    parser.add_argument(
        "--wasm",
        type=str,
        default="files/llama2.wasm",
        help="path to canister's wasm",
    )
    args = parser.parse_args()
    return args
