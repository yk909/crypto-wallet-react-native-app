import React from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";
import { setMainModalVisibility } from "../stores/tab/tabActions";

import { Home, Search, Market, Portfolio, Profile } from "../screens";

import { TabIcon } from "../components/index";
import { COLORS, icons, SIZES } from "../constants";

const Tab = createBottomTabNavigator();

const TabBarCustomButton = ({children, onPress}) => {
    return (
        <TouchableOpacity
            style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    )
}

const Tabs = ({setMainModalVisibility, isMainModalVisible}) => {

    function mainTabButtonOnClick () {
        setMainModalVisibility(!isMainModalVisible)
        console.log("is main modal visible " + isMainModalVisible)
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                style: {
                },
                tabBarStyle: {
                    backgroundColor: COLORS.primary,
                    borderTopColor: "transparent",
                    height: 80,
                    // borderTopRightRadius: isMainModalVisible ? 0 : SIZES.radius,
                    // borderTopLeftRadius: isMainModalVisible ? 0 : SIZES.radius,
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if ( !isMainModalVisible ) {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.home}
                                    label="Home"
                                    isMain={false}
                                />
                            )
                        }
                    }
                }}
                listeners={{
                    tabPress: e => {
                        if(isMainModalVisible) {
                            e.preventDefault();
                        }
                    }
                }}
            />
            <Tab.Screen
                name="Portfolio"
                component={Portfolio}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if ( !isMainModalVisible ) {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.portfolio}
                                    label="Portfolio"
                                    isMain={false}
                                />
                            )
                        }
                    }
                }}
                listeners={{
                    tabPress: e => {
                        if(isMainModalVisible) {
                            e.preventDefault();
                        }
                    }
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if ( !isMainModalVisible ) {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.search}
                                    label="Search"
                                    isMain={true}
                                />
                            )
                        } else {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.close}
                                    label="Close"
                                    isMain={true}
                                />
                            )
                        }
                    },
                    tabBarButton: (props) => (
                        <TabBarCustomButton 
                            {...props}
                            onPress={() => mainTabButtonOnClick()}
                        />
                    )
                }}
            />
            <Tab.Screen
                name="Market"
                component={Market}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if ( !isMainModalVisible ) {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.chart}
                                    label="Market"
                                    isMain={false}
                                />
                            )
                        }
                    }
                }}
                listeners={{
                    tabPress: e => {
                        if(isMainModalVisible) {
                            e.preventDefault();
                        }
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        if ( !isMainModalVisible ) {
                            return (
                                <TabIcon 
                                    focused={focused}
                                    icon={icons.user}
                                    label="Profile"
                                    isMain={false}
                                />
                            )
                        }
                    }
                }}
                listeners={{
                    tabPress: e => {
                        if(isMainModalVisible) {
                            e.preventDefault();
                        }
                    }
                }}
            />
        </Tab.Navigator>
    )
}

function mapStateToProps(state) {
    return {
        isMainModalVisible: state.tabReducer.isMainModalVisible
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setMainModalVisibility: (isVisible) => { return dispatch(setMainModalVisibility(isVisible)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps) (Tabs);