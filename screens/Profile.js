import React from 'react';
import { 
    View,
    Text,
    Image,
    Switch,
    TouchableOpacity,
    ScrollView
 } from 'react-native';

import { FONTS, COLORS, SIZES, dummyData, icons } from '../constants';
import { HeaderBar } from '../components';

import { MainLayout } from './';

const Profile = () => {
    return (
        <MainLayout>
            <View
                style={{
                    flex: 1,
                }}
            >
                {/* Header */}
                <HeaderBar title={'Profile'} />

                {/* Details */}
                <ScrollView >
                    {/* Email & ID */}
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: SIZES.padding,
                            marginTop: SIZES.radius,
                            alignItems: 'center'
                        }}
                    >

                        {/* email */}
                        <View style={{flex: 1}}>
                            <Text style={{color: COLORS.white, ...FONTS.h3}}>
                                {dummyData.profile.email}
                            </Text>
                            <Text style={{color: COLORS.lightGray, ...FONTS.body4}}>
                                ID: {dummyData.profile.id}
                            </Text>
                        </View>

                        {/* status */}
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: COLORS.lightGreen, ...FONTS.h3, textAlign: 'right'}}>
                                Verified
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </View>
        </MainLayout>
    )
}

export default Profile;