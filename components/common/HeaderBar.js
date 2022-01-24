import React from 'react';
import { View, Text } from 'react-native';

import { SIZES, FONTS, COLORS } from '../../constants';

const HeaderBar = ({ title }) => {
    return (
        <View>

            <View style={{
                paddingHorizontal: SIZES.padding,
                height: 50,
                justifyContent: 'flex-end'
            }}>
                <Text 
                    style={{ 
                        color: COLORS.white,
                        ...FONTS.largeTitle,
                        fontWeight: '900',
                    }}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default HeaderBar;