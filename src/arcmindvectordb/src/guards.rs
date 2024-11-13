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

/* pub fn is_controller() -> Result<(), String> {
    RUNTIME_STATE.with(|state| {
        if state
            .borrow()
            .data
            .canister_settings
            .controllers
            .contains(caller())
        {
            Ok(())
        } else {
            Err("You are not a controller".to_string())
        }
    })
} */
