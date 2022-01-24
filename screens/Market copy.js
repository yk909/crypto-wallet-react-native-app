import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl
} from 'react-native';

import { connect } from 'react-redux';
import { getMarket } from '../stores/market/marketActions';
import { useFocusEffect } from "@react-navigation/native";

import { FONTS, icons, COLORS, SIZES } from '../constants';

import { MainLayout } from "./";

const Market = ({ getMarket, coins }) => {
    const [ isRefreshing , setRefreshing ] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            getMarket(per_page=25);
        }, [])
    )

    function onRefresh() {
        return [            
            getMarket(per_page=25)
        ]
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
            <View 
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: SIZES.padding,
                    paddingTop: SIZES.padding
                }}
            >
                <Text 
                    style={{ 
                        flex: 1, 
                        color: COLORS.white,
                        ...FONTS.body3 
                    }}>
                    Name
                </Text>
                <Text 
                    style={{ 
                        flex: 1, 
                        textAlign: 'right',
                        color: COLORS.white,
                        ...FONTS.body3 
                    }}>
                    Market Cap
                </Text>
                <Text 
                    style={{ 
                        flex: 1, 
                        textAlign: 'right',
                        color: COLORS.white,
                        ...FONTS.body3 
                    }}>
                    Price
                </Text>
            </View>
            <ScrollView 
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
            style={{paddingHorizontal: SIZES.padding}}>
                {
                    coins.map((item, index) => {

                        let priceColor = 
                                        (item.price_change_percentage_7d_in_currency == 0)? COLORS.lightGray :
                                        (item.price_change_percentage_7d_in_currency > 0)? COLORS.lightGreen :
                                        COLORS.red;
                                        
                        let priceColor24h = 
                                        (item.market_cap_change_24h == 0)? COLORS.lightGray :
                                        (item.market_cap_change_24h > 0)? COLORS.lightGreen :
                                        COLORS.red;

                        return (
                            <TouchableOpacity
                                key={index}
                                // onPress={() => { setSelectedCoin(item) }}
                                style={{
                                    flexDirection: 'row',
                                    height: 55,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {/* Logo */}
                                <View style={{width: 35}}>
                                    <Image 
                                        source={{uri: item.image}}
                                        style={{
                                            width: 20,
                                            height: 20
                                        }}
                                    />
                                </View>

                                {/* Name */}
                                <View
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <Text style={{ ...FONTS.body4, color: COLORS.white }}>
                                        {item.name}
                                    </Text>
                                    <Text style={{ ...FONTS.body5, color: COLORS.lightGray, lineHeight: 15 }}>
                                        {item.symbol.toUpperCase()}
                                    </Text>
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
                                            item.price_change_percentage_7d_in_currency == 0 ?
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
                                            : item.price_change_percentage_7d_in_currency > 0 ?
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
                                            {item.price_change_percentage_7d_in_currency.toFixed(2)}%
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
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