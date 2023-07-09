use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, DeckResponse, ResultResponse, InstantiateMsg, QueryMsg};
use crate::state::{config, config_read, State, SECRET_ADDRESS};


#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let state = State {
        deck: msg.deck,
        owner: info.sender.clone(),
    };

    config(deps.storage).save(&state)?;

    deps.api
        .debug(&format!("Contract was initialized by {}", info.sender));

    Ok(Response::default())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Deck {} => build_deck(deps, env),
    }
}

pub fn build_deck(deps: DepsMut, env: Env) -> Result<Response, ContractError> {
        let address = SECRET_ADDRESS
        .add_suffix("secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".as_bytes());
        let mut cards: Vec<u8> = vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];
        let rnd_vec = env.block.random.unwrap().0;
        let mut tempdeck: Vec<u8> = Vec::new();
        for i in 0..32 {
            let temp:usize = rnd_vec[i] as usize;
            let index:usize = temp % cards.len();
            tempdeck.push(cards[index]);
            cards.remove(index);
        }
        address.insert(deps.storage, &("secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".to_string()), &tempdeck)?;
    Ok(Response::default())
}





#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetDeck {} => to_binary(&query_deck(deps)?),
        QueryMsg::Get2Cards {} => to_binary(&query_2cards(deps)?),
        QueryMsg::GetCard { idx } => to_binary(&query_card(deps, idx)?),
        QueryMsg::CheckWin { idx } => to_binary(&check_win(deps, idx)?),
    }
}

fn query_deck(deps: Deps) -> StdResult<DeckResponse> {
    let address = SECRET_ADDRESS
        .add_suffix("secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".as_bytes());
    let mut deck = (address.get(deps.storage, &("secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".to_string()))).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    Ok(DeckResponse { deck: deck })
}


fn query_2cards(deps: Deps) -> StdResult<DeckResponse> {
    let state = config_read(deps.storage).load()?;
    let tempdeck: Vec<u8> = vec![state.deck[0], state.deck[1]];
    Ok(DeckResponse { deck: tempdeck })
}

fn query_card(deps: Deps, idx: u8) -> StdResult<DeckResponse> {
    let state = config_read(deps.storage).load()?;
    let tempdeck: Vec<u8> = vec![state.deck[idx as usize]];
    Ok(DeckResponse { deck: tempdeck })
}

fn check_win(deps: Deps, idx: u8) -> StdResult<ResultResponse> {
    let state = config_read(deps.storage).load()?;
    let mut result = String::from("You lost");
    let values: Vec<u8> = vec![6, 7, 8, 9, 10, 2, 3, 4, 1];
    let mut sum : u8 = 0;
    let mut sum_a : u8 = 0;
    let index = idx as usize;
    for i in 0..index {
            if sum_a > 0
            {
                sum_a += values[state.deck[i] as usize];
            }
            else if state.deck[i] == 8
            {
                sum_a += sum + 11;
            }
            sum += values[state.deck[i] as usize];
    }
    if (sum > 18 && sum < 22) || (sum_a > 18 && sum_a < 22)
    {
        result = String::from("You Won");
    }
    Ok(ResultResponse { result: result })
}


#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::*;
    use cosmwasm_std::{from_binary, Coin, StdError, Uint128};


    #[test]
    fn increment() {
        let mut deps = mock_dependencies_with_balance(&[Coin {
            denom: "token".to_string(),
            amount: Uint128::new(2),
        }]);
        let info = mock_info(
            "creator",
            &[Coin {
                denom: "token".to_string(),
                amount: Uint128::new(2),
            }],
        );

        let  cards: Vec<u8> = vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];
        let init_msg = InstantiateMsg { deck: cards  };

        let _res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

        // anyone can increment
        let info = mock_info(
            "anyone",
            &[Coin {
                denom: "token".to_string(),
                amount: Uint128::new(2),
            }],
        );

        let exec_msg = ExecuteMsg::Deck {};
        let _res = execute(deps.as_mut(), mock_env(), info, exec_msg).unwrap();

        // should increase counter by 1
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetDeck {}).unwrap();
        let value: DeckResponse = from_binary(&res).unwrap();
        for i in 0..32 {
            println!("{}", value.deck[i]);
        }

        println!("2 cards");

        let res2 = query(deps.as_ref(), mock_env(), QueryMsg::Get2Cards {}).unwrap();
        let value2: DeckResponse = from_binary(&res2).unwrap();
        for i in 0..2 {
            println!("{}", value2.deck[i]);
        }
    }



}