import React, { useEffect, useRef } from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from "./HomeScreen";
import AutoScan from "./AutoScan";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import ColorConstants from "../Utils/ColorConstants";
import { AppState, SafeAreaView } from "react-native";
import Header from "../CustomComponents/Header";
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import CamConfig from "./CamConfig/CamConfig"; 
const Tab = createMaterialTopTabNavigator();
const TopTabs = ({ ...props }) => {
    const globaldata = props.getContextGlobalData()
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header {...props} globaldata={globaldata}></Header>
            <Tab.Navigator>
                <Tab.Screen name="Config Cam"
                    options={{
                        tabBarIndicatorStyle: {
                            backgroundColor: ColorConstants.primaryColor
                        },
                        tabBarInactiveTintColor: ColorConstants.placeHolderColor,
                        tabBarActiveTintColor: ColorConstants.secondaryColor,
                        tabBarLabelStyle: {
                            fontFamily: Fonts.Mulish_Bold,
                            fontSize: ValueConstants.size16
                        }
                    }}
                    component={CamConfig} />
                <Tab.Screen options={{
                    tabBarIndicatorStyle: {
                        backgroundColor: ColorConstants.primaryColor
                    },
                    tabBarInactiveTintColor: ColorConstants.placeHolderColor,
                    tabBarActiveTintColor: ColorConstants.secondaryColor,
                    tabBarLabelStyle: {
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: ValueConstants.size16
                    }
                }} name="Auto Verify" component={AutoScan}
                initialParams={{containerRef:props.route.params.containerRef}}
                />
                <Tab.Screen name="Manual Verify"
                    options={{
                        tabBarIndicatorStyle: {
                            backgroundColor: ColorConstants.primaryColor
                        },
                        tabBarInactiveTintColor: ColorConstants.placeHolderColor,
                        tabBarActiveTintColor: ColorConstants.secondaryColor,
                        tabBarLabelStyle: {
                            fontFamily: Fonts.Mulish_Bold,
                            fontSize: ValueConstants.size16
                        }
                    }}
                    component={HomeScreen} />



            </Tab.Navigator>
        </SafeAreaView>
    );

}
export default withGlobalContext(TopTabs)

