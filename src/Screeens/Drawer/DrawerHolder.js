import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import IconEntypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ReactNativeModal from "react-native-modal";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import ColorConstants from "../../Utils/ColorConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenNames from "../../Utils/ScreenNames";
import messaging from '@react-native-firebase/messaging';
import { handleResponse, requestPost } from "../../Network/NetworkOperations";
import { ServiceUrls } from "../../Network/ServiceUrls";
import { generateUpdateFCMTokenObject } from "../../Utils/Util";
export default DrawerHolder = ({ back = false, ...props }) => {
    const globaldata = props.getContextGlobalData()
    const [showModel, setShowModel] = useState(false)
    const [preSelectedScreen, setPreSelectedScreen] = useState(props.route.name)
    const screenNames = [
        // {
        //     title: "Home",
        //     icon: <IconEntypo
        //         accessible={true}
        //         color={preSelectedScreen == "Home" ? "white" : ColorConstants.secondaryColor}
        //         testID={"searchCancelButton"}
        //         accessibilityLabel={"searchCancelButton"}
        //         name={"home"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },
        {
            title: "Vehicle Scan",
            id: ScreenNames.VehicleScan,
            icon: <FontAwesome5
                accessible={true}
                color={preSelectedScreen == ScreenNames.VehicleScan ? "white" : ColorConstants.secondaryColor}
                testID={"searchCancelButton"}
                accessibilityLabel={"searchCancelButton"}
                name={"car-alt"}
                size={30}
                style={{ alignSelf: "center", marginRight: 10, }}
            />
        },
        // {
        //     title: "Check-In",
        //     id: ScreenNames.CheckIn,
        //     icon: <IconEntypo
        //         accessible={true}
        //         color={preSelectedScreen == "Check-In" ? "white" : ColorConstants.secondaryColor}
        //         testID={"searchCancelButton"}
        //         accessibilityLabel={"searchCancelButton"}
        //         name={"location-pin"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },

        // {
        //     title: "Dispatching",
        //     id: ScreenNames.Dispatching,
        //     icon: <MaterialIcons
        //         color={preSelectedScreen == "Dispatching" ? "white" : ColorConstants.secondaryColor}
        //         name={"call"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },
        // {
        //     title: "Residence Check",
        //     id: ScreenNames.ResidenceCheck,
        //     icon: <AntDesign
        //         color={preSelectedScreen == "Residence Check" ? "white" : ColorConstants.secondaryColor}
        //         name={"checkcircleo"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },
        {
            id: ScreenNames.Impound,
            title: "Impound",
            icon: <MaterialCommunityIcons
                color={preSelectedScreen == "Impound" ? "white" : ColorConstants.secondaryColor}
                name={"tow-truck"}
                size={30}
                style={{ alignSelf: "center", marginRight: 10, }}
            />
        },
        // {
        //     title: "Team",
        //     id: ScreenNames.Team,
        //     icon: <MaterialCommunityIcons
        //         color={preSelectedScreen == "Team" ? "white" : ColorConstants.secondaryColor}
        //         name={"tow-truck"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },
        // {
        //     title: "History",
        //     id: ScreenNames.History,
        //     icon: <Fontisto
        //         color={preSelectedScreen == "History" ? "white" : ColorConstants.secondaryColor}
        //         name={"history"}
        //         size={30}
        //         style={{ alignSelf: "center", marginRight: 10, }}
        //     />
        // },
        {
            title: "Property Search",
            id: ScreenNames.ViewPropertyDetails,
            icon: <Ionicons
                color={preSelectedScreen == "ViewPropertyDetails" ? ColorConstants.white : ColorConstants.secondaryColor}
                name={"business"}
                size={30}
                style={{ alignSelf: "center", marginRight: 10, }}
            />
        },
        {
            title: "Logout",
            id: "Logout",
            icon: <MaterialCommunityIcons
                color={preSelectedScreen == "Logout" ? "white" : ColorConstants.secondaryColor}
                name={"logout"}
                size={30}
                style={{ alignSelf: "center", marginRight: 10, }}
            />
        },



    ]
 

    return <View >


        {

            back ?
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.pop()
                    }}
                    accessible={true}
                    testID={"searchCancelButton"}
                    accessibilityLabel={"searchCancelButton"}
                >


                    <Ionicons
                        color={"#fff"}
                        name={"chevron-back"}
                        size={30}
                        style={{ alignSelf: "center", marginRight: 10, }}
                    />

                </TouchableOpacity> :

                <TouchableOpacity
                    onPress={() => {
                        setPreSelectedScreen(props.route.name)
                        setShowModel(true)
                    }}
                    accessible={true}
                    testID={"searchCancelButton"}
                    accessibilityLabel={"searchCancelButton"}
                >


                    <IconEntypo
                        color={"#ffffff"}
                        name={"menu"}
                        size={30}
                        style={{ alignSelf: "center", marginRight: 10, }}
                    />

                </TouchableOpacity>
        }


        <ReactNativeModal
        ref={(ref)=>{  
            if(props?.mainModelRef)
            props.mainModelRef.current=ref
        }} 
        onModalWillHide={()=>{
             setShowModel(false)  
        }}
            isVisible={showModel}
            backdropOpacity={0.2}
            animationOutTiming={10}
            style={{ margin: 0 }}  
            onBackdropPress={() => {
                setShowModel(false)
            }}
            onBackButtonPress={() => {
                setShowModel(false)
            }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ width: '70%', height: "100%", backgroundColor: 'white' }}>

                    <View style={{ flexDirection: 'row', marginTop: 20, }}>
                        <Text
                            style={{
                                color: "black",
                                flex: 1,
                                textAlign: 'center',
                                marginVertical: 10,
                                fontFamily: Fonts.Mulish_Bold,
                                fontSize: (ValueConstants.size20)
                            }}
                        >
                            Welcome back,{"\n"}{globaldata?.sessionData?.driver_name}
                            <Text
                                style={{
                                    color: ColorConstants.secondaryColor,
                                    textAlign: 'center',
                                    marginVertical: 10,
                                    fontFamily: Fonts.Mulish_Medium,
                                    fontSize: (ValueConstants.size24)
                                }}
                            >
                                {" "}(On Work)
                            </Text>
                        </Text>

                        <AntDesign
                            onPress={() => {
                                setShowModel(false)
                            }}
                            accessible={true}
                            color={"#000000"}
                            testID={"searchCancelButton"}
                            accessibilityLabel={"searchCancelButton"}
                            name={"close"}
                            size={30}
                            style={{ alignSelf: "center", marginRight: 10, }}
                        />

                    </View>
                    <ScrollView style={{ flex: 1, marginVertical: 10 }}>

                        {screenNames.map((item, index) => {
                            const color = preSelectedScreen == item.id ? "white" : "black"
                            return <TouchableOpacity
                                onPress={() => {
                                    setShowModel(false)

                                    setTimeout(() => {
                                        if (item.title == "Logout") {
                                              props.loader(true)
                                            requestPost(ServiceUrls.checkAndUpdateDriverFCMToken, generateUpdateFCMTokenObject("", { ...globaldata.sessionData }, true)).then((res) => {
                                               props.loader(false)
                                                res = handleResponse(props, res)
                                                if (res) {
                                                    messaging().deleteToken(() => {

                                                    }).catch((e) => {
                                                        console.log(e)
                                                    })
                                                    AsyncStorage.clear().then(() => {
                                                        while (props.navigation.canGoBack())
                                                            props.navigation.pop()
                                                        props.navigation.replace(ScreenNames.Login)
                                                        if (props.resetContextData)
                                                            props.resetContextData()
                                                    })
                                                }
                                            })

                                            return
                                        }

                                        if (item.id == preSelectedScreen) return
                                        setPreSelectedScreen(item.id)
                                        if (item.id == ScreenNames.VehicleScan) {
                                            if (props.navigation.canGoBack())
                                                props.navigation.pop()
                                        }
                                        else if (ScreenNames[item.id]) {
                                            if (props.navigation.canGoBack()) {

                                                if (item.id == ScreenNames.ViewPropertyDetails) {
                                                    props.navigation.replace(ScreenNames[item.id])
                                                } else {
                                                    props.navigation.replace(ScreenNames[item.id])
                                                }
                                            }

                                            else
                                                props.navigation.push(ScreenNames[item.id])
                                        }

                                    }, 200)
                                }}
                                key={item.title}
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 20,
                                    marginVertical: 3,
                                    paddingVertical: 10,
                                    backgroundColor: preSelectedScreen == item.id ? ColorConstants.secondaryColor : null,
                                    alignItems: 'center',
                                }}>
                                {item.icon}
                                <Text
                                    style={{
                                        color: color,
                                        flexShrink: 1,
                                        paddingRight: 10,
                                        textAlignVertical: 'center',
                                        fontFamily: Fonts.Mulish_Medium,
                                        fontSize: (ValueConstants.size20)
                                    }}
                                >
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        })}



                    </ScrollView>
                    {/* <Text onPress={() => {
                    AsyncStorage.removeItem(AsynKeys.defaultCamConfig)
                    setShowModel(false)
                }} style={{
                    color: 'red', alignSelf: 'center', margin: 20
                }}>Reset to default</Text> */}
                </View>
            </SafeAreaView>

        </ReactNativeModal> 
    </View >
}

