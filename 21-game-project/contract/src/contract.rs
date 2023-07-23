use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, DeckResponse, CardResponse, ResultResponse, InstantiateMsg, QueryMsg};
use crate::state::{config, State, ADDRESSES};




#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let state = State {
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
        ExecuteMsg::Deck {} => build_deck(deps, env, _info),
        ExecuteMsg::Increment {} => increment_index(deps, _info),
        ExecuteMsg::Enough {} => enough_cards(deps, _info),
    }
}

pub fn build_deck(deps: DepsMut, env: Env, _info: MessageInfo) -> Result<Response, ContractError> {
        let mut cards: Vec<u8> = vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];
        let rnd_vec = env.block.random.unwrap().0;
        let mut tempdeck: Vec<u8> = Vec::new();

        tempdeck.push(0); //is_game_finished
        tempdeck.push(6); //index 
        tempdeck.push(0); //card_sum  
        tempdeck.push(0); //card_sum_with_ace

        for i in 0..32 {
            let temp:usize = rnd_vec[i] as usize;
            let index:usize = temp % cards.len();
            tempdeck.push(cards[index]);
            cards.remove(index);
        }

        let values: Vec<u8> = vec![6, 7, 8, 9, 10, 2, 3, 4, 1];
        for i in 4..6 {
            if tempdeck[3] > 0
            {
                tempdeck[3] += values[tempdeck[i] as usize];
            }
            else if tempdeck[i] == 8 {
                tempdeck[3] += tempdeck[2] + 11;
            }
            tempdeck[2] += values[tempdeck[i] as usize];
        }

        ADDRESSES.insert(deps.storage, &(_info.sender.clone().to_string()), &tempdeck)?;
    Ok(Response::default())
}

pub fn increment_index(deps: DepsMut, _info: MessageInfo) -> Result<Response, ContractError> {
    let mut deck = ADDRESSES.get(deps.storage, &(_info.sender.clone().to_string())).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    if deck[0] == 0
    {    
        let values: Vec<u8> = vec![6, 7, 8, 9, 10, 2, 3, 4, 1];
        if deck[0] == 0
        {
            if deck[3] > 0
            {
                deck[3] += values[deck[deck[1] as usize] as usize];
            }
            else if deck[deck[1] as usize] == 8 {
                deck[3] += deck[2] + 11;
            }
        }
        if deck[2] + values[deck[deck[1] as usize] as usize] > 21
        {
           deck[0] = 1;
        }
        deck[2] += values[deck[deck[1] as usize] as usize];
        deck[1] += 1;
        ADDRESSES.insert(deps.storage, &(_info.sender.clone().to_string()), &deck)?;
    }
    Ok(Response::default())
}

pub fn enough_cards(deps: DepsMut, _info: MessageInfo) -> Result<Response, ContractError> {
    let mut deck = ADDRESSES.get(deps.storage, &(_info.sender.clone().to_string())).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    deck[0] = 1;
    ADDRESSES.insert(deps.storage, &(_info.sender.clone().to_string()), &deck)?;
    Ok(Response::default())
}



#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetDeck {wallet} => to_binary(&query_deck(deps, wallet)?),
        QueryMsg::Get2Cards {wallet} => to_binary(&query_2cards(deps, wallet)?),
        QueryMsg::GetCard {wallet} => to_binary(&query_card(deps, wallet)?),
        QueryMsg::CheckWin {wallet} => to_binary(&check_win(deps, wallet)?),
    }
}

fn query_deck(deps: Deps, wallet: String) -> StdResult<DeckResponse> {
    let result;
    let deck = (ADDRESSES.get(deps.storage, &(wallet))).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    if deck[0] == 1 || deck[2] > 21
    {
        result = deck;
    }
    else
    {
        result = vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8];
    }
    Ok(DeckResponse { deck: result })
}


fn query_2cards(deps: Deps, wallet: String) -> StdResult<DeckResponse> {
    let deck = (ADDRESSES.get(deps.storage, &(wallet))).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    Ok(DeckResponse { deck: vec![deck[4], deck[5]] })
}


fn query_card(deps: Deps, wallet: String) -> StdResult<CardResponse> {
    let deck = (ADDRESSES.get(deps.storage, &(wallet))).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    Ok(CardResponse { card: deck[deck[1] as usize - 1]})
}




fn check_win(deps: Deps, wallet: String) -> StdResult<ResultResponse> {
    let mut result = String::from("You lost");
    let  deck = (ADDRESSES.get(deps.storage, &(wallet))).unwrap_or(vec![0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8]);
    if (deck[2] > 18 && deck[2] < 22) || (deck[3] > 18 && deck[3] < 22)
    {
        result = String::from("You Won");
    }
    Ok(ResultResponse { result: result })
}


#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::*;
    use cosmwasm_std::{from_binary, Coin, Uint128};


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


        let init_msg = InstantiateMsg {   };

        let _res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

        // anyone can increment
        let info = mock_info(
            "secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6",
            &[Coin {
                denom: "token".to_string(),
                amount: Uint128::new(2),
            }],
        );

        let exec_msg = ExecuteMsg::Deck {};
        let _res = execute(deps.as_mut(), mock_env(), info, exec_msg).unwrap();

        // should increase counter by 1
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetDeck {wallet: "secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".to_string()}).unwrap();
        let value: DeckResponse = from_binary(&res).unwrap();
        for i in 0..32 {
            println!("{}", value.deck[i]);
        }

        println!("2 cards");

        let res2 = query(deps.as_ref(), mock_env(), QueryMsg::Get2Cards {wallet: "secret1grgcderf32vn8zpcy3fu3k96cxaffynrncyjf6".to_string()}).unwrap();
        let value2: DeckResponse = from_binary(&res2).unwrap();
        for i in 0..2 {
            println!("{}", value2.deck[i]);
        }
    }



}