import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    Animated, 
    FlatList
} from 'react-native';

import { LineChart, } from 'react-native-chart-kit';

import { connect } from 'react-redux';
import { getMarket } from '../stores/market/marketActions';

import { constants, FONTS, icons, COLORS, SIZES } from '../constants';

import { HeaderBar, TextButton } from '../components';

import { MainLayout } from "./";

const Market = ({ getMarket, coins }) => {
    const [ isRefreshing , setRefreshing ] = React.useState(false);

    React.useEffect(() => {
        getMarket(per_page=25);
    }, [])


    function onRefresh() {
        return [            
            getMarket(per_page=25)
        ]
    }

    function renderTabBar () {
        return (
            <View
                style={{
                    marginTop: SIZES.radius,
                    marginHorizontal: SIZES.radius,
                    borderRadius: SIZES.radius,
                    backgroundColor: COLORS.gray
                }}
            >
                <Tabs 
                    scrollX={scrollX}
                />
            </View>
        )
    }

    function renderButtons () {
        return (
            <View style={{ flexDirection: 'row', marginTop: SIZES.radius, marginHorizontal: SIZES.radius }}>
                <TextButton label="USD"/>
                <TextButton label="% (24h)" containerStyle={{marginLeft: SIZES.base}}/>
                <TextButton label="Top" containerStyle={{ marginLeft: SIZES.base }}/>
            </View>
        )
    }

    function renderList() {
        return(

            <FlatList
                data={coins}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => {

                    let priceColor = 
                                    (item.price_change_percentage_24h == 0) ? 
                                        COLORS.lightGray 
                                    : (item.price_change_percentage_24h > 0) ? 
                                        COLORS.lightGreen 
                                    :
                                        COLORS.red;

                    let chartColor = 
                                    (item.price_change_percentage_7d_in_currency == 0) ? 
                                        COLORS.lightGray 
                                    : (item.price_change_percentage_7d_in_currency > 0) ? 
                                        COLORS.lightGreen 
                                    :
                                        COLORS.red;

                    let marketCapColor24h = 
                                        (item.market_cap_change_24h == 0)? COLORS.lightGray :
                                        (item.market_cap_change_24h > 0)? COLORS.lightGreen :
                                        COLORS.red;

                    return (
                        <View 
                            style={{
                                flexDirection: 'row',
                                marginBottom: SIZES.radius,
                                paddingHorizontal: SIZES.padding
                            }}
                        >
                            {/* Coin  */}
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
                                        height: 20,
                                        marginRight: 5
                                    }}
                                />
                                <View
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <Text style={{ ...FONTS.body5, color: COLORS.white, lineHeight: 15 }}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ ...FONTS.body5, color: COLORS.lightGray, lineHeight: 15 }}>
                                        {item.symbol.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            {/* Chart */}
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center'
                                }}
                            >
                                <LineChart
                                    withHorizontalLabels={false}
                                    withHorizontalLabels={false}
                                    withDots={false}
                                    withInnerLines={false}
                                    withVerticalLabels={false}
                                    withOuterLines={false}
                                    data={{
                                        datasets: [
                                            {
                                                data: item.sparkline_in_7d.price
                                            }
                                        ]
                                    }}
                                    width={100}
                                    height={60}
                                    chartConfig={{
                                        color: () => chartColor
                                    }}
                                    bezier
                                    style={{
                                        paddingRight: 0,
                                    }}
                                />
                            </View>

                            {/* Market Cap */}
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center'
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
                                    color: marketCapColor24h, 
                                    lineHeight: 15, 
                                    textAlign: 'right'}}>
                                    {formatNumber(item.market_cap_change_24h, 2)}
                                </Text>
                            </View>

                            {/* Price */}
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={{
                                    // textAlign: 'right',
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
                                                    tintColor: priceColor,
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
                                        {item.price_change_percentage_24h.toFixed(2)}%
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        )
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
        
    return (
        <MainLayout>

            {/* Title */}
            <HeaderBar
                title="Market"
            />
            
            <View 
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: SIZES.padding,
                    paddingTop: SIZES.padding,
                    paddingBottom: SIZES.padding / 2,
                    alignItems: 'center'
                }}
            >
                <Text 
                    style={{ 
                        flex: 1, 
                        color: COLORS.white,
                        ...FONTS.body3,
                    }}>
                    Name
                </Text>
                <View style={{flex: 1, }}>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.white,
                            ...FONTS.body3 
                        }}>
                        7d Chart
                    </Text>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.lightGray,
                            ...FONTS.body5 
                        }}>
                        7d change
                    </Text>
                </View>
                <View style={{flex: 1, }}>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.white,
                            ...FONTS.body3 
                        }}>
                        Mkt Cap
                    </Text>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.lightGray,
                            ...FONTS.body5 
                        }}>
                        1d change
                    </Text>
                </View>
                <View style={{flex: 1, }}>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.white,
                            ...FONTS.body3 
                        }}>
                        Price
                    </Text>
                    <Text 
                        style={{ 
                            textAlign: 'right',
                            color: COLORS.lightGray,
                            ...FONTS.body5 
                        }}>
                        1d change
                    </Text>
                </View>
            </View>
            {/* List */}
            {renderList()}

        </MainLayout>
    )
}

function mapStateToProps(state) {
    return {
        coins: state.marketReducer.coins,
        error: state.marketReducer.error,
        loading: state.marketReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMarket: (currency, coinlist, orderBy, sparkline, price_change_percentage, per_page, page) => {
            return dispatch(getMarket(currency, coinlist, orderBy, sparkline, price_change_percentage, per_page, page))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Market);