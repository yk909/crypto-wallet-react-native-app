import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl
} from 'react-native';

import { connect } from "react-redux";
import { getHoldings, getMarket, getSingleCoin } from "../stores/market/marketActions";
import { useFocusEffect } from "@react-navigation/native";

import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { BallenceInfo, IconTextButton, Chart } from "../components";

import { MainLayout } from "./";

const Home = ({ getHoldings, getMarket, myHoldings, coins, getSingleCoin, coin_chart, coin_chart_loading }) => {

    const [ selectedCoin, setSelectedCoin ] = React.useState(null);
    const [ isRefreshing , setRefreshing ] = React.useState(false);
    const [ range, setRange ] = React.useState(7);

    useFocusEffect(
        React.useCallback(() => {
            setRange(7);
            getHoldings(holdings = dummyData.holdings);
            getMarket();
            coins && setSelectedCoin(coins[0]);
            getSingleCoin(selectedCoin ? id=selectedCoin?.id : id=coins[0]?.id, days=range)
        }, [])
    )

    function onRefresh() {
        return [            
            getHoldings(holdings = dummyData.holdings),
            getMarket(),
            getSingleCoin(selectedCoin ? id=selectedCoin?.id : coins[0]?.id, days=range)
        ]
    }

    const setTimeRange = ( id, days ) => {
        // console.log(id, days)
        setRange(days);
        getSingleCoin(id=id, days=days);
        // console.log(coin_chart)
    }

    const formatNumber = ( value, roundingPoint ) => {
        // console.log(value)
        if(Math.abs(value) > 1e12) {
            return `$ ${(value / 1e12).toFixed(roundingPoint)}T`;
        } else if (Math.abs(value) > 1e9) {
            return `$ ${(value / 1e9).toFixed(roundingPoint)}B`;
        } else if (Math.abs(value) > 1e6) {
            return `$ ${(value / 1e6).toFixed(roundingPoint)}M`;
        } else if (Math.abs(value) > 1e3) {
            return `$ ${(value / 1e3).toFixed(roundingPoint)}K`;
        } else {
            return `$${value.toFixed(roundingPoint)}`;
        }
    }

    // console.log(myHoldings)
    let totalWallet = myHoldings.reduce( (a, b) => a + ( b.total || 0 ), 0 );

    // 7 day change
    // let valueChange = myHoldings.reduce( (a, b) => a + ( b.holding_value_change_7d || 0 ), 0 );
    // let percentage_change = valueChange / ( totalWallet - valueChange ) * 100;

    // 24 hours change
    let valueChange = myHoldings.reduce( (a, b) => a + ( b.holding_value_change_24h || 0 ), 0 );
    let percentage_change = valueChange / ( totalWallet - valueChange ) * 100;

    function renderWalletInfo () {

        return (
            <View style={{
                paddingHorizontal: SIZES.padding,
                borderBottomRightRadius: SIZES.radius,
                borderBottomLeftRadius: SIZES.radius,
                backgroundColor: COLORS.primary
            }}>
                {/* Ballence info */}
                <BallenceInfo 
                    title="Your Wallet"
                    // displayAmount="50,000.00"
                    displayAmount={totalWallet}
                    // changePct="3.26"
                    changePct={percentage_change}
                    valueChange={valueChange}
                    containerStyle={{
                        marginTop: 50
                    }}
                />
                {/* Buttons */}
                <View style={{
                    // marginTop: 30,
                    flexDirection: "row",
                    marginBottom: -20,
                    // paddingHorizontal: SIZES.radiusBtn
                }}>
                    <IconTextButton
                        label="Transfer"
                        icon={icons.transfer}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius
                        }}
                        onPress={() => console.log('transfer')}
                    />
                    <IconTextButton
                        label="Withdraw"
                        icon={icons.moneyCheck}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                        }}
                        onPress={() => console.log('withdraw')}
                    />
                </View>
            </View>
        )
    }
    // console.log(coins[0])

    function plColor (selected, first, value) {
        if ( selectedCoin ) {
            if( selected < value )
            {
                return COLORS.red
            } else if ( selected > value ) 
            {
                return COLORS.lightGreen
            } else {
                return COLORS.lightGray
            }
        } else {
            if ( first > value ) {
                return COLORS.lightGreen
            } else if ( first < value ) {
                return COLORS.red
            } else {
                return COLORS.lightGray
            }
        } 
    }

    const mainColor7D = plColor(selectedCoin?.price_change_percentage_7d_in_currency, coins[0]?.price_change_percentage_7d_in_currency, 0 );
    const mainColor24H = plColor(selectedCoin?.price_change_percentage_24h, coins[0]?.price_change_percentage_24h, 0 );
    const mainColor30d = plColor(selectedCoin?.price_change_percentage_30d_in_currency, coins[0]?.price_change_percentage_30d_in_currency, 0 );
    const mainColor1y = plColor(selectedCoin?.price_change_percentage_1y_in_currency, coins[0]?.price_change_percentage_1y_in_currency, 0 );

    return (
        <MainLayout>
        { coins &&
            <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
            style={{
                flex: 1,
                backgroundColor: COLORS.black,
                position: 'relative'
            }}
            >

                {/* Header - wallet info */}
                { renderWalletInfo() }

                {/* Chart */}
                <View style={{
                    paddingHorizontal: SIZES.padding,
                    marginTop: SIZES.padding * 2,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                    {/* Title Name and logo */}
                    {/* <View style={{flexDirection: 'column'}}> */}
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image 
                            source={{uri: selectedCoin ? selectedCoin?.image : myHoldings[0]?.image}}
                            style={{
                                width: 25,
                                height: 25
                            }}
                        />
                        <Text style={{
                            ...FONTS.h1,
                            color: COLORS.white,
                            marginLeft: 5,
                            fontWeight: 'bold',
                        }}>
                            {selectedCoin ? selectedCoin?.name : myHoldings[0]?.name}
                        </Text>
                    </View>
                        {/* <Text style={{
                            ...FONTS.h5,
                            color: COLORS.lightGray,
                            lineHeight: 15
                        }}>
                            7d Change
                        </Text>
                    </View> */}

                    {/* Price change */}
                    { range == 7 ?
                        <View>
                            <Text style={{
                                ...FONTS.h4,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor7D
                            }}>
                                $ { selectedCoin ? 
                                    selectedCoin?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : coins[0]?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor7D
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_7d_in_currency.toFixed(2) 
                                : coins[0]?.price_change_percentage_7d_in_currency.toFixed(2) }%
                            </Text>
                        </View>
                    : range == 1 ?
                        <View>
                            <Text style={{
                                ...FONTS.h4,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor24H
                            }}>
                                $ { selectedCoin ? 
                                    selectedCoin?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : coins[0]?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor24H
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_24h.toFixed(2) 
                                : coins[0]?.price_change_percentage_24h.toFixed(2) }%
                            </Text>
                        </View>
                    : range == 30 ?
                        <View>
                            <Text style={{
                                ...FONTS.h4,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor30d
                            }}>
                                $ { selectedCoin ? 
                                    selectedCoin?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : coins[0]?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor30d
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_30d_in_currency.toFixed(2) 
                                : coins[0]?.price_change_percentage_30d_in_currency.toFixed(2) }%
                            </Text>
                        </View>
                    :
                        <View>
                            <Text style={{
                                ...FONTS.h4,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor1y
                            }}>
                                $ { selectedCoin ? 
                                    selectedCoin?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : coins[0]?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor1y
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_1y_in_currency.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : coins[0]?.price_change_percentage_1y_in_currency.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }%
                            </Text>
                        </View>
                    }
                </View>
                <Chart 
                    containerStyle={{
                        position:'relative',
                        elevation: 5,
                        marginVertical: 15,
                        zIndex: 5,
                    }}
                    coin_chart_loading={coin_chart_loading}
                    chartPrices={ coin_chart && coin_chart?.prices }
                />

                {/* Chart time range */}
                <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                    <TouchableOpacity
                        disabled={coin_chart_loading}
                        onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : coins[0]?.id, '1') }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 75,
                            backgroundColor: range == 1 ? COLORS.lightGray: COLORS.gray,
                            borderRadius: SIZES.radiusBtn,
                            marginRight: SIZES.padding/4,
                            height: 40,
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: 20,
                                fontWeight: '900',
                                color: COLORS.white,
                            }}
                        >
                            24H
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={coin_chart_loading}
                        onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : coins[0]?.id, '7') }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 75,
                            backgroundColor: range == 7 ? COLORS.lightGray: COLORS.gray,
                            borderRadius: SIZES.radiusBtn,
                            height: 40,
                            marginRight: SIZES.padding/4,
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: 20,
                                fontWeight: '900',
                                color: COLORS.white,
                            }}
                        >
                            7D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={coin_chart_loading}
                        onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : coins[0]?.id, '30') }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 75,
                            backgroundColor: range == 30 ? COLORS.lightGray: COLORS.gray,
                            borderRadius: SIZES.radiusBtn,
                            marginRight: SIZES.padding/4,
                            height: 40,
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: 20,
                                fontWeight: '900',
                                color: COLORS.white,
                            }}
                        >
                            30D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={coin_chart_loading}
                        onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : coins[0]?.id, '365') }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 75,
                            backgroundColor: range == '365' ? COLORS.lightGray: COLORS.gray,
                            borderRadius: SIZES.radiusBtn,
                            height: 40,
                        }}
                    >
                        <Text 
                            style={{
                                fontSize: 20,
                                fontWeight: '900',
                                color: COLORS.white,
                            }}
                        >
                            1Y
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Top Crypto */}
                <View
                    style={{
                        paddingHorizontal: SIZES.padding,
                        paddingVertical: 20,
                        zIndex: 0,
                        elevation: 0
                    }}
                > 
                    <View style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text 
                        style={{ 
                            color: COLORS.white, 
                            ...FONTS.h3, 
                            fontSize: 20,
                            fontWeight: 'bold' 
                        }}>
                            Top Cryptocurrency
                        </Text>
                        <Text 
                            style={{ 
                                color: COLORS.lightGray, 
                                ...FONTS.body5, 
                                lineHeight: 15,
                                textAlign: 'right',
                                fontWeight: 'bold' 
                            }}>
                            1 day change
                        </Text>
                    </View>

                    
                    {/* Label title */}
                    <View 
                        style={{
                            flexDirection: 'row',
                            paddingTop: SIZES.padding / 2,
                        }}>
                        <Text 
                            style={{ 
                                flex: 1, 
                                color: COLORS.lightGray,
                                ...FONTS.body3 
                            }}>
                            Name
                        </Text>
                        <Text 
                            style={{ 
                                flex: 1, 
                                textAlign: 'right',
                                color: COLORS.lightGray,
                                ...FONTS.body3 
                            }}>
                            Market Cap
                        </Text>
                        <Text 
                            style={{ 
                                flex: 1, 
                                textAlign: 'right',
                                color: COLORS.lightGray,
                                ...FONTS.body3 
                            }}>
                            Price
                        </Text>
                    </View>
                    {/* map the list */}
                    { coins.map((item, index) => {

                        let priceColor = 
                                        (item.price_change_percentage_7d_in_currency == 0)? COLORS.lightGray :
                                        (item.price_change_percentage_7d_in_currency > 0)? COLORS.lightGreen :
                                        COLORS.red;
                                        
                        let percentage24hColor = 
                                        (item.price_change_percentage_24h == 0)? COLORS.lightGray :
                                        (item.price_change_percentage_24h > 0)? COLORS.lightGreen :
                                        COLORS.red;

                        let priceColor24h = 
                                        (item.market_cap_change_24h == 0)? COLORS.lightGray :
                                        (item.market_cap_change_24h > 0)? COLORS.lightGreen :
                                        COLORS.red;

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => { setSelectedCoin(item), setTimeRange( item.id, days=range ) }}
                                style={{
                                    flexDirection: 'row',
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >

                                {/* Name */}
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image 
                                        source={{uri: item.image}}
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                    <View style={{ flex: 1,  }}>
                                        <Text style={{...FONTS.body4, color: COLORS.white, marginLeft: SIZES.radius / 2 }}>
                                            {item.name}
                                        </Text>
                                        <Text style={{ ...FONTS.body5, color: COLORS.lightGray, marginLeft: SIZES.radius / 2, lineHeight: 15 }}>
                                            {item.symbol.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Market Cap */}
                                <View
                                    style={{
                                        flex: 1,
                                    }}>
                                    <Text style={{
                                            textAlign: 'right',
                                            color: COLORS.white,
                                            ...FONTS.body4,
                                        }}>
                                        { formatNumber(item.market_cap, 2) }
                                    </Text>
                                    
                                    <Text style={{
                                        ...FONTS.body5, 
                                        color: priceColor24h, 
                                        lineHeight: 15, 
                                        textAlign: 'right'}}>
                                        {formatNumber(item.market_cap_change_24h, 2)}
                                    </Text>
                                </View>

                                {/* Price */}
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        textAlign: 'right',
                                        color: COLORS.white,
                                        ...FONTS.h4
                                    }}>
                                        $ {item.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {
                                            item.price_change_percentage_24h == 0 ?
                                                <Image 
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: percentage24hColor,
                                                        marginRight: 5
                                                    }}
                                                    resizeMode="contain"
                                                    source={icons.trendUp}
                                                />
                                            : item.price_change_percentage_24h > 0 ?
                                                <Image 
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: percentage24hColor,
                                                        marginRight: 5
                                                    }}
                                                    resizeMode="contain"
                                                    source={icons.trendUp}
                                                />
                                            :
                                                <Image 
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: percentage24hColor,
                                                        marginRight: 5
                                                    }}
                                                    resizeMode="contain"
                                                    source={icons.trendDown}
                                                />
                                        }
                                        <Text style={{...FONTS.body5, color: percentage24hColor, lineHeight: 15}}>
                                            {item.price_change_percentage_24h.toFixed(2)}%
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        }
        </MainLayout>
    )
}

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        coins: state.marketReducer.coins,
        error: state.marketReducer.error,
        coin_chart: state.marketReducer.coin_chart,
        coin_chart_loading: state.marketReducer.coin_chart_loading,
        loading: state.marketReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy, sparkline, price_change_percentage, per_page, page) => {
            return dispatch(getHoldings(holdings, currency, coinList, orderBy, sparkline, price_change_percentage, per_page, page))
        },
        getMarket: (currency, coinlist, orderBy, sparkline, price_change_percentage, per_page, page) => {
            return dispatch(getMarket(currency, coinlist, orderBy, sparkline, price_change_percentage, per_page, page))
        },
        getSingleCoin: (id, days, currency) => {
            return dispatch(getSingleCoin(id, days, currency))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Home);