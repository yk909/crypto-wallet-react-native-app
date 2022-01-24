import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { SIZES, COLORS, FONTS } from '../../constants';

const TextButton = ({ label, containerStyle, onPress }) => {
    return (
        <TouchableOpacity
            style={{
                ...containerStyle,
                backgroundColor: COLORS.gray,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                justifyContent: "center",
                paddingHorizontal: 15,
                paddingVertical: 3

            }}
            onPress={onPress}
        >
            <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default TextButton;