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
 import { getHoldings, getSingleCoin } from "../stores/market/marketActions";
 import { useFocusEffect } from "@react-navigation/native";

import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { BallenceInfo, IconTextButton, ChartProfile } from "../components";

 import { MainLayout } from "./";

const Portfolio = ({ getHoldings, myHoldings, getSingleCoin, coin_chart, coin_chart_loading  }) => {

    const [ selectedCoin, setSelectedCoin ] = React.useState(null); 
    const [ isRefreshing , setRefreshing ] = React.useState(false);
    const [ range, setRange ] = React.useState(7);

    
    useFocusEffect(
        React.useCallback(() => {
            setRange(7);
            getHoldings(holdings = dummyData.holdings);
            myHoldings && setSelectedCoin(myHoldings[0]);
            getSingleCoin(selectedCoin ? id=selectedCoin?.id : id=myHoldings[0]?.id, days=range)
        }, [])
    )

    function onRefresh() {
        return [            
            getHoldings(holdings = dummyData.holdings),
            getSingleCoin(selectedCoin ? id=selectedCoin?.id : id=myHoldings[0]?.id, days=range)
        ]
    }

    const setTimeRange = ( id, days ) => {
        // console.log(id, days)
        setRange(days);
        getSingleCoin(id=id, days=days);
        // console.log(coin_chart)
    }

    let totalWallet = myHoldings.reduce( (a, b) => a + ( b.total || 0 ), 0 );

    // 7 day change
    // let valueChange = myHoldings.reduce( (a, b) => a + ( b.holding_value_change_7d || 0 ), 0 );
    // let percentage_change = valueChange / ( totalWallet - valueChange ) * 100;

    // 24 hours change
    let valueChange = myHoldings.reduce( (a, b) => a + ( b.holding_value_change_24h || 0 ), 0 );
    let percentage_change = valueChange / ( totalWallet - valueChange ) * 100;

    // console.log(myHoldings[0])


    function renderWalletInfo () {
        // console.log(myHoldings)
        return (
            <View style={{
                paddingHorizontal: SIZES.padding,
                paddingHorizontal: SIZES.padding,
                borderBottomRightRadius: SIZES.radius,
                borderBottomLeftRadius: SIZES.radius,
                backgroundColor: COLORS.primary
            }}>
                {/* Ballence info */}
                <BallenceInfo 
                    title="Portfolio"
                    displayAmount={totalWallet}
                    changePct={percentage_change}
                    valueChange={valueChange}
                    containerStyle={{
                        marginTop: 50
                    }}
                />
            </View>
        )
    }

    function profitLoss ( value ) {
        let price = (value.current_price * value.qty - value.average_price * value.qty);
        return price
    }

    function setColor ( a, b ) {
        if ( a < b ) {
            return COLORS.red
        } else if ( a > b ) {
            return COLORS.lightGreen
        } else {
            return COLORS.lightGray
        }
    }

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

    const mainColor7D = plColor(selectedCoin?.price_change_percentage_7d_in_currency, myHoldings[0]?.price_change_percentage_7d_in_currency, 0 );
    const mainColor24H = plColor(selectedCoin?.price_change_percentage_24h, myHoldings[0]?.price_change_percentage_24h, 0 );
    const mainColor30d = plColor(selectedCoin?.price_change_percentage_30d_in_currency, myHoldings[0]?.price_change_percentage_30d_in_currency, 0 );
    const mainColor1y = plColor(selectedCoin?.price_change_percentage_1y_in_currency, myHoldings[0]?.price_change_percentage_1y_in_currency, 0 );

    return (
        <MainLayout>
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
                {/* Header - Ballence info */}
                { renderWalletInfo() }

                {/* Chart */}
                <View style={{
                    paddingHorizontal: SIZES.padding,
                    marginTop: SIZES.padding,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>

                    {/* Name */}
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

                    {/* Price */}
                    
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
                                    selectedCoin?.holding_value_change_7d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : myHoldings[0]?.holding_value_change_7d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor7D
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_7d_in_currency.toFixed(2) 
                                : myHoldings[0]?.price_change_percentage_7d_in_currency.toFixed(2) }%
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
                                    selectedCoin?.holding_value_change_30d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : myHoldings[0]?.holding_value_change_30d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor30d
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_30d_in_currency.toFixed(2) 
                                : myHoldings[0]?.price_change_percentage_30d_in_currency.toFixed(2) }%
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
                                    selectedCoin?.holding_value_change_24h.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : myHoldings[0]?.holding_value_change_24h.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor24H
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_24h.toFixed(2) 
                                : myHoldings[0]?.price_change_percentage_24h.toFixed(2) }%
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
                                    selectedCoin?.holding_value_change_1y.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                : myHoldings[0]?.holding_value_change_1y.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                            </Text>
                            <Text style={{
                                ...FONTS.h5,
                                textAlign: 'right',
                                lineHeight: 15,
                                color: mainColor1y
                            }}>
                            { selectedCoin ? 
                                    selectedCoin?.price_change_percentage_1y_in_currency.toFixed(2) 
                                : myHoldings[0]?.price_change_percentage_1y_in_currency.toFixed(2) }%
                            </Text>
                        </View>
                    }

                </View>
                <ChartProfile 
                    containerStyle={{
                        position:'relative',
                        elevation: 5,
                        marginVertical: 15,
                        zIndex: 5,
                    }}
                    coin_chart_loading={coin_chart_loading}
                    chartPrices={ coin_chart && coin_chart?.prices }
                />

                {/* Portfolio Crypto List */}
                <View
                    style={{
                        paddingHorizontal: SIZES.padding,
                        paddingBottom: 40,
                        zIndex: 0,
                        elevation: 0
                    }}
                > 

                {/* P\l info */}
                    <View 
                        style={{
                            marginVertical: SIZES.padding / 2,
                        }}
                    >
                        <View 
                            style={{
                                flexDirection: 'row',
                            }}
                        >
                            <Text 
                                style={{ 
                                    flex: 1, 
                                    color: COLORS.lightGray,
                                    ...FONTS.body3 
                                }}>
                                Asset
                            </Text>
                            <Text 
                                style={{ 
                                    flex: 1, 
                                    textAlign: 'right',
                                    color: COLORS.lightGray,
                                    ...FONTS.body3 
                                }}>
                                Avg. Price
                            </Text>
                            <Text 
                                style={{ 
                                    flex: 1, 
                                    textAlign: 'right',
                                    color: COLORS.lightGray,
                                    ...FONTS.body3 
                                }}>
                                P\L
                            </Text>
                        </View>

                        {/* Asset */}
                        <View 
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={{
                                flex: 1
                            }}>
                                <Text 
                                    style={{
                                        ...FONTS.body4, 
                                        color: COLORS.white,
                                        // lineHeight: 15
                                    }}
                                >
                                    { selectedCoin ? 
                                        `${selectedCoin?.qty} ${selectedCoin?.symbol.toUpperCase()}` 
                                    : 
                                        `${myHoldings[0].qty} ${myHoldings[0]?.symbol.toUpperCase()}`  }
                                </Text>
                                <Text style={{
                                    color: COLORS.white,
                                    ...FONTS.h5,
                                    lineHeight: 15
                                }}>
                                    $ { selectedCoin ? 
                                        ( selectedCoin?.current_price * selectedCoin?.qty ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                    : 
                                        ( myHoldings[0]?.current_price * myHoldings[0]?.qty ).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                </Text>
                            </View>

                            {/* Avarage Price */}
                            <View style={{
                                flex: 1, 
                            }}>
                                <Text 
                                style={{
                                    textAlign: 'right',
                                    ...FONTS.body4,
                                    // lineHeight: 15,
                                    color: 
                                        selectedCoin ?
                                            setColor(selectedCoin?.current_price, selectedCoin?.average_price)
                                        :
                                            setColor(myHoldings[0]?.current_price, myHoldings[0]?.average_price)
                                }}>
                                    $ { selectedCoin ? selectedCoin?.average_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : myHoldings[0].average_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                </Text>
                                <Text 
                                    style={{ 
                                        textAlign: 'right', 
                                        ...FONTS.body5,
                                        lineHeight: 15,
                                        color: COLORS.white
                                }}
                                >
                                    $ { selectedCoin ? 
                                        (selectedCoin?.average_price * selectedCoin?.qty).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                    : 
                                        (myHoldings[0].average_price * myHoldings[0].qty).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
                                </Text>
                            </View>

                            {/* Profit \ loss */}
                            <View style={{ flex: 1}}>
                                {/* Total P\L */}
                                <Text 
                                    style={{ 
                                        textAlign: 'right',
                                        ...FONTS.body4,
                                        // lineHeight: 15,
                                        color: 
                                            selectedCoin ?
                                                setColor(selectedCoin?.current_price, selectedCoin?.average_price)
                                            :
                                                setColor(myHoldings[0]?.current_price, myHoldings[0]?.average_price)
                                    }}>
                                        $ { 
                                        selectedCoin ? 
                                            profitLoss(selectedCoin).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                        : 
                                            profitLoss(myHoldings[0]).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
                                        }
                                </Text>
                                <Text 
                                    style={{ 
                                        textAlign: 'right',
                                        ...FONTS.body5,
                                        lineHeight: 15,
                                        color: 
                                            selectedCoin ?
                                                setColor(selectedCoin?.current_price, selectedCoin?.average_price)
                                            :
                                                setColor(myHoldings[0]?.current_price, myHoldings[0]?.average_price)
                                    }}>
                                        {/* Calculate ROI */}
                                        { 
                                        selectedCoin ? 
                                            ( ( selectedCoin?.current_price - selectedCoin?.average_price ) / selectedCoin?.average_price * 100 ).toFixed(2)
                                        : 
                                            ( ( myHoldings[0]?.current_price - myHoldings[0]?.average_price ) / myHoldings[0]?.average_price * 100 ).toFixed(2)
                                        }%
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Chart time range */}
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
                        <TouchableOpacity
                            disabled={coin_chart_loading}
                            onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : myHoldings[0]?.id, '1') }}
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
                            onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : myHoldings[0]?.id, '7') }}
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
                            onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : myHoldings[0]?.id, '30') }}
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
                            onPress={() => { setTimeRange(selectedCoin ? selectedCoin?.id : myHoldings[0]?.id, '365') }}
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

                    {/* Section title */}
                    <View style={{ marginBottom: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Text 
                        style={{ 
                            color: COLORS.white, 
                            ...FONTS.h3,
                            fontSize: 20,
                            fontWeight: 'bold' 
                        }}>
                            Your Assets
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
                            Asset
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
                        <Text 
                            style={{ 
                                flex: 1, 
                                textAlign: 'right',
                                color: COLORS.lightGray,
                                ...FONTS.body3 
                            }}>
                            Holdings
                        </Text>
                    </View>

                    {/* Map the list */}
                    { myHoldings.map((item, index) => {
                        
                        let priceColor = setColor(item?.price_change_percentage_24h, 0);

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

                                {/* Asset */}
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image 
                                        source={{uri: item?.image}}
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                    <View style={{ flex: 1,  }}>
                                        <Text style={{...FONTS.body4, color: COLORS.white, marginLeft: SIZES.radius / 2 }}>
                                            {item?.name}
                                        </Text>
                                        <Text style={{ ...FONTS.body5, color: COLORS.lightGray, marginLeft: SIZES.radius / 2, lineHeight: 15 }}>
                                            {item?.qty + ' ' +item?.symbol.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                {/* Price */}
                                <View 
                                style={{
                                    flex: 1,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        textAlign: 'right',
                                        color: COLORS.white,
                                        ...FONTS.body4
                                    }}>
                                        $ {item?.current_price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {
                                            item?.price_change_percentage_24h == 0 ?
                                                <Image 
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: priceColor,
                                                        marginRight: 5
                                                    }}
                                                    resizeMode="contain"
                                                    source={icons.trendUp}
                                                />
                                            : item?.price_change_percentage_24h > 0 ?
                                                <Image 
                                                    style={{
                                                        width: 15,
                                                        height: 15,
                                                        tintColor: priceColor,
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
                                                        tintColor: priceColor,
                                                        marginRight: 5
                                                    }}
                                                    resizeMode="contain"
                                                    source={icons.trendDown}
                                                />
                                        }
                                        <Text style={{...FONTS.body5, color: priceColor, lineHeight: 15}}>
                                            {/* {console.log(item?.price_change_percentage_24h)} */}
                                            {+item?.price_change_percentage_24h.toFixed(2)}%
                                        </Text>
                                    </View>
                                </View>

                                {/* Holdings */}
                                <View style={{
                                    flex: 1
                                }}>
                                    <Text style={{
                                        textAlign: 'right',
                                        color: COLORS.white,
                                        ...FONTS.body4
                                    }}>
                                        $ {(+item?.current_price * +item?.qty).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                    <Text style={{
                                        ...FONTS.body5, 
                                        color: priceColor, 
                                        lineHeight: 15, 
                                        textAlign: 'right'}}
                                    >
                                       $ {item?.holding_value_change_24h.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </MainLayout>
    )
}

function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        error: state.marketReducer.error,
        loading: state.marketReducer.loading,
        coin_chart: state.marketReducer.coin_chart,
        coin_chart_loading: state.marketReducer.coin_chart_loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy, sparkline, price_change_percentage, per_page, page) => {
            return dispatch(getHoldings(holdings, currency, coinList, orderBy, sparkline, price_change_percentage, per_page, page))
        },
        getSingleCoin: (id, days, currency) => {
            return dispatch(getSingleCoin(id, days, currency))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Portfolio);