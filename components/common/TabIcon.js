import React from 'react';
import { View, Text, Image } from 'react-native';

import { FONTS, COLORS } from '../../constants';

const TabIcon = ({ focused, icon, iconStyle, label, isMain }) => {
    
    if ( isMain ) {
        return (
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    borderWidth: 2,
                    borderColor: focused ? COLORS.white : COLORS.secondary,
                }}
            >
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width:25,
                        height: 25,
                        tintColor: focused ? COLORS.white : COLORS.secondary,
                        ...iconStyle
                    }}
                />
                {/* <Text style={{
                    color: focused? COLORS.white : COLORS.secondary,
                    ...FONTS.h5
                }}>
                    {label}
                </Text> */}
            </View>
        )
    } else {
        return (
            <View style={{
                alignItems: "center",
                justifyContent: "center",

            }}>
                <Image
                    source={icon}
                    resizeMode="contain"
                    style={{
                        width:20,
                        height: 20,
                        tintColor: focused ? COLORS.white : COLORS.secondary,
                        ...iconStyle
                    }}
                />
                <Text style={{
                    color: focused? COLORS.white : COLORS.secondary,
                    ...FONTS.h5
                }}>
                    {label}
                </Text>
            </View>
        )
    }
}

export default TabIcon;