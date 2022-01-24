import * as marketActions from "./marketActions";

const initstate = {
    myHoldings: [],
    coins: [],
    coin_chart: [],
    coin_chart_loading: false,
    error: null,
    loading: false
}

const marketReducer = (state = initstate, action) => {
    switch (action.type) {
        case marketActions.GET_HOLDINGS_BEGIN:
            return {
                ...state,
                loading: true
            }
        case marketActions.GET_HOLDINGS_SUCCESS:
            return {
                ...state,
                myHoldings: action.payload.myHoldings,
                loading: false
            }
        case marketActions.GET_HOLDINGS_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                loading: false
            }
        case marketActions.GET_COIN_MARKET_BEGIN:
            return {
                ...state,
                loading: true,
            }
        case marketActions.GET_COIN_MARKET_SUCCESS:
            return {
                ...state,
                coins: action.payload.coins,
                loading: false
            }
        case marketActions.GET_COIN_MARKET_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                loading: false
            }
        case marketActions.GET_SINGLE_COIN_BEGIN:
            return {
                ...state,
                coin_chart_loading: true,
            }
        case marketActions.GET_SINGLE_COIN_SUCCESS:
            return {
                ...state,
                coin_chart: action.payload.coins,
                coin_chart_loading: false
            }
        case marketActions.GET_SINGLE_COIN_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                coin_chart_loading: false
            }
        default:
            return state
    }
}

export default marketReducer;