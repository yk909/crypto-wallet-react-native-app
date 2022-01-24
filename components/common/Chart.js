import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
 } from 'react-native';
import { 
    ChartDot, 
    ChartPath, 
    ChartPathProvider,
    ChartXLabel,
    ChartYLabel,
    monotoneCubicInterpolation,
 } from '@rainbow-me/animated-charts';
import moment from 'moment';

import { SIZES, COLORS, FONTS } from '../../constants';

const Chart = ({ containerStyle, chartPrices, coin_chart_loading }) => {
    
    // points
    let startUnixTimestamp = moment().subtract(30, 'day').unix();

    let data =  chartPrices ? chartPrices.map((item, index) => {

        const date = new Date(item[0]).getTime();
        // console.log(date.getTime())

        return {
            // x: startUnixTimestamp + index * 3600 ,
            x: date,
            y: item[1],
        }
    }) : []; 

    let points = monotoneCubicInterpolation({ data, range: 240 })
    let firstPointY = points[0]?.y;
    let lastPointY = points[points.length - 1]?.y;

    const formatUsd = value => {
        'worklet';

        if ( value === '' ) {
            return '';
        }

        return `$${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }

    // const formatDateTime = value => {
    //     'worklet';

    //     if (value === '') {
    //         return ''
    //     }

    //     let startUnixTimestamp = moment().subtract(30, 'day').unix()

        
    //     // let hours = `0${selectedDate.getHours()}`.slice(-2);
    //     // let minutes = `0${ selectedDate.getMinutes() }`.slice(-2);
    //     // console.log(selectedDate)

    //     return 

    // }

    const formatNumber = ( value, roundingPoint ) => {
        // console.log(value)
        if(value > 1e9) {
            return `$${(value / 1e9).toFixed(roundingPoint)}B`;
        } else if (value > 1e6) {
            return `$${(value / 1e6).toFixed(roundingPoint)}M`;
        } else if (value > 1e3) {
            return `$${(value / 1e3).toFixed(roundingPoint)}K`;
        } else {
            return `$${value.toFixed(roundingPoint)}`;
        }
    }

    const getYAxisLabelValues = () => {
        if(chartPrices != undefined) {
            let price =  chartPrices ? chartPrices.map((item, index) => {
                return item[1]
            }) : null; 

            let minValue = Math.min(...price);
            let maxValue = Math.max(...price);

            let midValue = ( minValue + maxValue ) / 2;
            
            let higherMidValue = ( maxValue + midValue ) / 2;
            let lowerMidValue = ( minValue + midValue ) / 2;

            let roundingPoint = 2;

            return [
                formatNumber(maxValue, roundingPoint),
                formatNumber(higherMidValue, roundingPoint),
                formatNumber(midValue, roundingPoint),
                formatNumber(lowerMidValue, roundingPoint),
                formatNumber(minValue, roundingPoint),
            ]
        } else {
            return []
        }
    }

    return (
        <View>
            <View style={{ ...containerStyle }}>

                {/* Y Axis Label */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        top: 0,
                        justifyContent: 'space-between',
                        left: SIZES.padding / 2,
                    }}
                >
                    {
                        getYAxisLabelValues().map((item, index) => {
                            return (
                                <Text 
                                key={index}
                                style={{
                                    color: COLORS.lightGray,
                                    ...FONTS.body5,
                                }}
                                >
                                    {item}
                                </Text>
                            )
                        })
                    }
                </View>

                {/* Chart */}
                { data.length > 0 &&
                    <ChartPathProvider
                    data={{
                        points,
                        smoothingStrategy: 'bezier',
                    }}>
                        {coin_chart_loading &&
                            <ActivityIndicator style={{ position: 'absolute', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', top: 70, elevation: 3 }} size="large" color={COLORS.white} />
                        }
                        {!coin_chart_loading ?
                            <ChartPath
                                height={150}
                                width={SIZES.width}
                                strokeWidth={3}
                                selectedStrokeWidth={2}
                                stroke={ firstPointY > lastPointY ? COLORS.red : COLORS.lightGreen }
                            />
                            :
                            <View style={{height:175}}/>
                        }
                        <ChartDot>
                            <View
                            style={{
                                position: 'absolute',
                                left: -35,
                                width: 80,
                                alignItems: 'center',
                                backgroundColor: COLORS.transparentBlack2,
                                zIndex: 1000,
                            }}>
                                {/* Dot */}
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 20,
                                        height: 20,
                                        borderRadius: 15,
                                        backgroundColor: COLORS.white
                                    }}
                                >
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: COLORS.gray
                                        }}
                                    />
                                </View>
                                {/* labels */}
                                <View 
                                    style={{
                                        marginTop: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: "130%",
                                        // backgroundColor: COLORS.transparentWhite,
                                        backgroundColor: COLORS.black,
                                        borderRadius: SIZES.radiusBtn,
                                        paddingHorizontal: 5,
                                    }}
                                >
                                    {/* Y label */}
                                    <ChartYLabel 
                                        format={formatUsd}
                                        style={{
                                            color: COLORS.white,
                                            ...FONTS.body5,
                                            paddingTop: 0,
                                        }}
                                    />

                                    {/* X label */}
                                    {/* <ChartXLabel 
                                        format={formatDateTime}
                                        style={{
                                            marginTop: -30,
                                            paddingBottom: 0,
                                            color: COLORS.lightGray,
                                            ...FONTS.body5,
                                            lineHeight: 15
                                        }}
                                    /> */}
                                </View>
                            </View>
                        </ChartDot>
                    </ChartPathProvider>
                }
            </View>
        </View>
    )

}

export default Chart;