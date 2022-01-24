import React from 'react';
import { View, Text, Image } from 'react-native';

import { COLORS, SIZES, FONTS, icons } from '../../constants';

export const BallenceInfo = ({title, displayAmount, changePct, valueChange }) => {
    return (
        <View style={{
            paddingVertical: SIZES.padding,
        }}>
            {/* Title */}
            <Text style={{
                color: COLORS.white,
                // paddingBottom: 10,
                ...FONTS.largeTitle,
                fontWeight: '900'
            }}>
                {title}
            </Text>
            <Text style={{
                color: COLORS.lightGray,
                ...FONTS.h3
            }}>
                Current Ballance
            </Text>
            {/* Balance */}
            <View style={{
                flexDirection: 'row', 
                alignItems: 'flex-end',
            }}>
                <Text style={{
                    color: COLORS.lightGray,
                    ...FONTS.h3
                }}>
                    $ 
                </Text>
                <Text style={{
                    color: COLORS.white,
                    ...FONTS.h2
                }}>
                    {/* {` ${ (+displayAmount.replace(/,/g, '') + +(+parseFloat((displayAmount.replace(/,/g, '') * + changePct / 100 )))).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") } `} */}
                    {` ${ displayAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") } `}
                </Text>
                <Text style={{
                    color: COLORS.lightGray,
                    ...FONTS.h3
                }}>
                    USD
                </Text>
            </View>
            {/* Percentage change */}
            <View style={{
                flexDirection: 'row', 
                alignItems: 'center',
            }}>
                <Text style={{
                    color: +changePct > 0 ? COLORS.lightGreen : COLORS.red,
                    ...FONTS.h5
                }}>
                <Image 
                    source={+changePct > 0 ? icons.trendUp : icons.trendDown}
                    resizeMode="contain"
                    style={{
                        width: 12,
                        height: 12,
                        tintColor: +changePct > 0 ? COLORS.lightGreen : COLORS.red,
                    }}
                />
                     {/* {` ${ (+changePct).toFixed(2) } %  ($ ${ (+parseFloat(displayAmount.replace(/,/g, '')* + changePct / 100)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") })  `} */}
                     {` ${ changePct.toFixed(2) } %  ($ ${ valueChange.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") })  `}
                </Text>
                <Text style={{
                    color: COLORS.lightGray,
                    ...FONTS.h5
                }}>
                    {/* 7d change */}
                    24h change
                </Text>
            </View>
        </View>
    )
}

export default BallenceInfo;