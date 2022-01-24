import React from 'react';
import { View, Animated, ActivityIndicator, Text } from 'react-native';

import { connect } from 'react-redux';

import { COLORS, SIZES, icons, FONTS, dummyData } from '../constants';
import { IconTextButton } from '../components';

const MainLayout = ({ children, isMainModalVisible, loading }) => {

    const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if(isMainModalVisible){
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false
            }).start();
        }
    }, [isMainModalVisible]);

    const modalY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height - 220]
    });

    return (
        // <>
        // { loading ? 
        //     <View 
        //         style={{
        //             flex: 1,
        //             backgroundColor: COLORS.black,
        //             justifyContent: 'center',
        //             alignContent: 'center'
        //         }}
        //     >
        //         <ActivityIndicator size="large" color={COLORS.white} />
        //         <Text style={{textAlign:'center', ...FONTS.h3, color: COLORS.white}}>
        //             Please Wait...
        //         </Text>
        //     </View>
        // :
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.black,
            }}>
                { children }

                {/* Dim Background */}
                {isMainModalVisible && 
                    <Animated.View
                        onPress={()=> {console.log('f')}}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                            backgroundColor: COLORS.transparentWhite
                        }}
                        opacity={modalAnimatedValue}
                    >

                    </Animated.View>
                }

                {/* Modal */}
                <Animated.View 
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: 150,
                        borderTopRightRadius: SIZES.radius,
                        borderTopLeftRadius: SIZES.radius,
                        padding: SIZES.padding,
                        backgroundColor: COLORS.primary, 
                        
                        top: modalY
                    }}
                >
                    <IconTextButton
                        label="Transfer"
                        icon={icons.transfer}
                        onPress={() => console.log("Transfer")}
                    />
                    <IconTextButton
                        label="Withdtaw"
                        icon={icons.moneyCheck}
                        containerStyle={{
                            marginTop: SIZES.base
                        }}
                        onPress={() => {dummyData.holdings[0].qty += 1, console.log(dummyData.holdings[0].qty)}}
                    />
                </Animated.View>
            </View>
        // }
        // </>
    )
}

function mapStateToProps(state) {
    return {
        isMainModalVisible: state.tabReducer.isMainModalVisible,
        loading: state.marketReducer.loading,
    }
}

function mapDispatchToProps(dispatch) {
    return{
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (MainLayout);