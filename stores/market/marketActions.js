import axios from "axios";

export const GET_HOLDINGS_BEGIN = "GET_HOLDINGS_BEGIN";
export const GET_HOLDINGS_SUCCESS = "GET_HOLDINGS_SUCCESS";
export const GET_HOLDINGS_FAILURE = "GET_HOLDINGS_FAILURE";

export const GET_COIN_MARKET_BEGIN = "GET_COIN_MARKET_BEGIN";
export const GET_COIN_MARKET_SUCCESS = "GET_COIN_MARKET_SUCCESS";
export const GET_COIN_MARKET_FAILURE = "GET_COIN_MARKET_FAILURE";

export const GET_SINGLE_COIN_BEGIN = "GET_SINGLE_COIN_BEGIN";
export const GET_SINGLE_COIN_SUCCESS = "GET_SINGLE_COIN_SUCCESS";
export const GET_SINGLE_COIN_FAILURE = "GET_SINGLE_COIN_FAILURE";

// Holdings / My goldings

export const getHoldingsBegin = () => ({
    type: GET_HOLDINGS_BEGIN
})

export const getHoldingsSuccess = (myHoldings) => ({
    type: GET_HOLDINGS_SUCCESS,
    payload: { myHoldings }
})

export const getHoldingsFailure = (error) => ({
    type: GET_HOLDINGS_FAILURE,
    payload: { error }
})

export function getHoldings (
        holdings = [], 
        currency = "usd", 
        orderBy="market_cap_desc", 
        sparkline=true, 
        price_change_percentage="1h,7d,30d,1y", 
        per_page=10,
        page=1
    ){
    return dispatch => {
        dispatch(getHoldingsBegin())

        let ids = holdings.map((item) => {return item.id}).join(",")

        let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=${price_change_percentage}&ids=${ids}`
    
        return axios({
            url: apiUrl,
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        }).then((response) => {
            // console.log("Holdings responce: ")
            // console.log(response)

            if(response.status == 200) {
                // Massage data
                let myHoldings = response.data.map((item) => {
                    // Retrieve our current holdings -> current quantitty
                    let coin = holdings.find(a => a.id == item.id)

                    // Price from 7 days ago
                    let price7d = item.current_price / (1 + item.price_change_percentage_7d_in_currency * 0.01)
                    let price24h = item.current_price / (1 + item.price_change_percentage_24h * 0.01)
                    let price30d = item.current_price / (1 + item.price_change_percentage_30d_in_currency * 0.01)
                    let price1y = item.current_price / (1 + item.price_change_percentage_1y_in_currency * 0.01)

                    return {
                        id: item.id,
                        symbol: item.symbol,
                        name: item.name,
                        image: item.image,
                        current_price: item.current_price,
                        qty: coin.qty,
                        average_price: coin.average_price,
                        total: coin.qty * item.current_price,
                        price_change_percentage_7d_in_currency: item.price_change_percentage_7d_in_currency,
                        price_change_percentage_30d_in_currency: item.price_change_percentage_30d_in_currency,
                        price_change_percentage_1y_in_currency: item.price_change_percentage_1y_in_currency,
                        price_change_percentage_24h: item.price_change_percentage_24h,
                        holding_value_change_7d: (item.current_price - price7d) * coin.qty,
                        holding_value_change_24h: (item.current_price - price24h) * coin.qty,
                        holding_value_change_30d: (item.current_price - price30d) * coin.qty,
                        holding_value_change_1y: (item.current_price - price1y) * coin.qty,
                        sparkline_in_7d: {
                            value: item.sparkline_in_7d.price.map((price) => {
                                return price * coin.qty
                            })
                        }
                    }
                });

                dispatch(getHoldingsSuccess(myHoldings));
            } else {
                dispatch(getHoldingsFailure(response.data));
            } 

        }).catch((error) => {
            console.log('Error', error)
            dispatch(getHoldingsFailure(error));
        });
    }
}


// Coin Market

export const getCoinMarketBegin = () => ({
    type: GET_COIN_MARKET_BEGIN
})

export const getCoinMarketSuccess = (coins) => ({
    type: GET_COIN_MARKET_SUCCESS,
    payload: {coins}
})

export const getCoinMarketFailure = (error) => ({
    type: GET_COIN_MARKET_FAILURE,
    payload: {error}
})

export function getMarket ( 
        per_page=10,
        price_change_percentage="1h%2C%2C7d%2C30d%2C1y",
        currency="usd", 
        orderBy="market_cap_desc", 
        sparkline=true,
        // sparkline=false,
        page=1
    ) {
        return dispatch => { 
            dispatch(getCoinMarketBegin() )

            let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=${price_change_percentage}`
            
            return axios ({
                url: apiUrl,
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }).then((response) => {
                // console.log("Market responce: ")
                // console.log(response)
                // console.log(response.data)

                if(response.status == 200) {
                    // console.log(response.data)
                    dispatch(getCoinMarketSuccess(response.data))
                } else {
                    dispatch(getCoinMarketFailure(response.data))
                }

            }).catch((error) => {
                console.log('Error', error)
                dispatch.getCoinMarketFailure(error)
            })
        
        }
}

// Get single coin
export const getSingleCoinBegin = () => ({
    type: GET_SINGLE_COIN_BEGIN
})

export const getSingleCoinSuccess = (coins) => ({
    type: GET_SINGLE_COIN_SUCCESS,
    payload: {coins}
})

export const getSingleCoinFailure = (error) => ({
    type: GET_SINGLE_COIN_FAILURE,
    payload: {error}
})

export function getSingleCoin (
        id="bitcoin",
        days="1",
        currency="usd", 
    ) {
        return dispatch => { 
            dispatch(getSingleCoinBegin() )

            let apiUrl = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/?vs_currency=${currency}&days=${days}`
            
            return axios ({
                url: apiUrl,
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }).then((response) => {
                if(response.status == 200) {
                    dispatch(getSingleCoinSuccess(response.data))
                } else {
                    dispatch(getSingleCoinFailure(response.data))
                }

            }).catch((error) => {
                console.log('Error', error)
                dispatch.getSingleCoinFailure(error)
            })
        
        }
}
