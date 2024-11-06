"""Uploads backend canister wasm

Run with:

    python -m scripts.upload_backend_canister.py
"""

# pylint: disable=invalid-name, too-few-public-methods, no-member, too-many-statements

import sys
from pathlib import Path
from typing import Generator
from .ic_py_canister import get_canister
from .parse_args_upload import parse_args

ROOT_PATH = Path(__file__).parent.parent

#  0 - none
#  1 - minimal
#  2 - a lot
DEBUG_VERBOSE = 1


# ------------------------------------------------------------------------------
def read_file_bytes(file_path: Path) -> bytes:
    """Returns the file as a bytes array"""
    file_bytes = b""
    try:
        with open(file_path, "rb") as file:
            file_bytes = file.read()

    except FileNotFoundError:
        print(f"ERROR: Unable to open the file {file_path}!")
        sys.exit(1)

    return file_bytes


def generate_chunks(data: bytes, chunk_size: int) -> Generator[bytes, None, None]:
    """Generator function to iterate over chunks"""
    for i in range(0, len(data), chunk_size):
        yield data[i : i + chunk_size]


def main() -> int:
    """Uploads the backend canister wasm."""

    args = parse_args()

    network = args.network
    canister_name = args.canister
    canister_id = args.canister_id
    candid_path = ROOT_PATH / args.candid
    chunk_size_mb = args.chunksize
    wasm_path = ROOT_PATH / args.wasm

    dfx_json_path = ROOT_PATH / "dfx.json"

    print(
        f"Summary:"
        f"\n - network         = {network}"
        f"\n - canister        = {canister_name}"
        f"\n - canister_id     = {canister_id}"
        f"\n - dfx_json_path   = {dfx_json_path}"
        f"\n - candid_path     = {candid_path}"
        f"\n - wasm_path  = {wasm_path}"
    )

    # ---------------------------------------------------------------------------
    # get ic-py based Canister instance
    canister_creator = get_canister(canister_name, candid_path, network, canister_id)

    # ---------------------------------------------------------------------------
    # THE WASM FILE

    # Read the wasm from disk
    print(f"--\nReading the wasm file into a bytes object: {wasm_path}")
    wasm_bytes = read_file_bytes(wasm_path)

    # Upload wasm_bytes to the canister
    print("--\nUploading the wasm bytes")

    # converting MB to bytes
    chunk_size = int(chunk_size_mb * 1024 * 1024)

    # Iterate over all chunks
    count_bytes = 0
    for i, chunk in enumerate(generate_chunks(wasm_bytes, chunk_size)):
        count_bytes += len(chunk)
        if DEBUG_VERBOSE == 0:
            pass
        elif DEBUG_VERBOSE == 1:
            print(
                f"chunk size = {len(chunk)} bytes "
                f"({count_bytes / len(wasm_bytes) * 100:.1f}%)"
            )
        else:
            print("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
            print(f"Sending candid for {len(chunk)} bytes :")
            print(f"- i         = {i}")
            print(f"- progress  = {count_bytes / len(wasm_bytes) * 100:.1f} % ")
            print(f"- chunk[0]  = {chunk[0]}")
            print(f"- chunk[-1] = {chunk[-1]}")

        response = canister_creator.upload_backend_canister_wasm_bytes_chunk(
            chunk
        )  # pylint: disable=no-member
        if "Ok" in response[0].keys():
            print("OK!")
        else:
            print("Something went wrong:")
            print(response)
            sys.exit(1)

    # ---------------------------------------------------------------------------
    return 0


if __name__ == "__main__":
    sys.exit(main())
