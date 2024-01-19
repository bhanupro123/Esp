import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, TextInput, Platform, Linking } from 'react-native'
import Fonts from "../Utils/Fonts";
import { showAlertWithValue } from "../Utils/Util";
import ValueConstants from "../Utils/ValueConstants";
import IconEntypo from "react-native-vector-icons/Entypo";
import GlobalButton from "../CustomComponents/GlobalButton";
import ScreenNames from "../Utils/ScreenNames";
import { handleResponse, handleResponsewithNetworkError, requestPost } from "../Network/NetworkOperations";
import { ServiceUrls } from "../Network/ServiceUrls";
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import DeviceInfo from "react-native-device-info";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ColorConstants from "../Utils/ColorConstants";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

export default LoginForm = ({ style, ...props }) => {
    const [input, setInput] = useState("")
    const [checked, setChecked] = useState(false);
    const hitVerfiyCall = (lat, long) => {
        props.loader(true)
        
            requestPost(ServiceUrls.login, {
                device_id:DeviceInfo.getUniqueIdSync(),
                ip_address: DeviceInfo.getIpAddressSync(),
                user_lat: lat,
                user_long: long,
                device_push_id: "",
                mobile_no: input,
                last_page_visited: "login screen",
            }).then((res) => {
                props.loader(false)
                res = handleResponsewithNetworkError(props, res)
                if (res) {
                    props.navigation.push(ScreenNames.Verify, { input: input, res: res })
                }
            })
        
        
    }
    const getLoca = () => {
        props.loader(true)
        try {
            Geolocation.getCurrentPosition(info => {
                hitVerfiyCall(info.coords.latitude, info.coords.longitude)
            }, err => {
                props.loader(false)
                props.alert(true, { value: err.message + " Please turn on device location." })

            });
        } catch (error) {
            props.loader(false)
            props.alert(true, { value: "Please turn on device location. " + error.message })
        }
    }

    const requestLocationPermission = async () => {
        try {
            if (Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Pass2park Driver',
                        'message': "Pass2park Driver requires access to your device's location. Would you like to grant access to your location?",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                ).catch(() => {
                    if (Platform.OS == 'android')
                        requestLocationPermission()
                    else {
                        getLoca()
                    }
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getLoca()
                }
                else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                    requestLocationPermission()
                }
                else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    props.alert(true, { value: "Device location permission is required." })
                    setTimeout(() => {
                        Linking.openSettings()
                    }, 2000);
                }

            }
            else {
                request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
                    switch (result) {
                        case RESULTS.LIMITED:
                            getLoca()
                            break;
                        case RESULTS.GRANTED:
                            getLoca()
                            break;
                        default:
                            props.alert(true, { value: "Device location permission is required." })
                            setTimeout(() => {
                                Linking.openSettings()
                            }, 2000);
                            break;
                    }
                });
            }
        } catch (err) {
            //console.warn(err)
        }
    }
    const color = ColorConstants.white
    return <View style={{ flex: 1, margin: 20, }}>
        <Text style={{
            color: 'white',
            alignSelf: 'center',
            fontFamily: Fonts.Mulish_Bold,
            fontSize: (ValueConstants.size26)
        }}>User Login</Text>

        <View style={{ marginVertical: 30 }}>
            <Text style={{
                color: 'white',
                marginVertical: 10,
                fontFamily: Fonts.Mulish_Black,
                fontSize: ValueConstants.size18
            }}>Your Phone Number</Text>

            <View style={{
                flexDirection: 'row',
                borderColor: "#ffffff8f",
                borderBottomWidth: 1,
                paddingBottom: 10
            }}>
                <TextInput
                    maxLength={10}
                    value={input}
                    onChangeText={(text) => {
                        text = text.trim()
                        if (text && /^\d+$/.test(text))
                            setInput(text)
                        else if (!text)
                            setInput(text)
                    }}
                    style={{
                        flex: 1,
                        color: 'white',
                        padding: 0, margin: 0,
                        fontFamily: Fonts.Mulish_Light,
                        fontSize: (ValueConstants.size18)
                    }}
                    keyboardType="number-pad"
                    placeholder="Type in your phone number"
                    placeholderTextColor={"#ffffff8f"}
                >

                </TextInput>
                <IconEntypo
                    accessible={true}
                    color={"#ffffff"}
                    testID={"searchCancelButton"}
                    accessibilityLabel={"searchCancelButton"}
                    name={"phone"}
                    size={30}
                    style={{ alignSelf: "center", marginRight: 10, }}

                />
            </View>
        </View>
        <Text style={{
            color: 'white',
            marginVertical: 10,
            fontFamily: Fonts.Mulish_Light,
            fontSize: (ValueConstants.size18)
        }}>We will send you a One Time SMS to this phone
            number</Text>
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => {
                    setChecked(!checked)
                }}>
                {checked ? <AntDesign
                    size={25}
                    color={"white"}
                    name="checksquare" /> :
                    <Ionicons
                        size={25}
                        color={"white"}
                        name="square-outline" />}
            </TouchableOpacity>
            <Text style={{
                marginHorizontal: 10,
                color: color,
                flexShrink: 1,
                fontFamily: Fonts.Mulish_Regular,
                fontSize: ValueConstants.size18
            }}>I agree with all <Text
                onPress={() => {
                    props.navigation.push(ScreenNames.CustomWebViewTNC, { webLink: ServiceUrls.termsandconditions })
                }}
                style={{
                    textDecorationLine: 'underline',
                    color: color,
                    flexShrink: 1,
                    fontFamily: Fonts.Mulish_Regular,
                    fontSize: ValueConstants.size18
                }}>Terms of Use</Text> &{" "}
                <Text
                    onPress={() => {
                        props.navigation.push(ScreenNames.CustomWebViewTNC, { webLink: ServiceUrls.privacyPolicy })
                    }}
                    style={{
                        textDecorationLine: 'underline',
                        color: color,
                        flexShrink: 1,
                        fontFamily: Fonts.Mulish_Regular,
                        fontSize: ValueConstants.size18
                    }}>{"Privacy Policy"}</Text>
            </Text>

        </View>
        <GlobalButton onPress={() => {
            if (!checked)
                return showAlertWithValue(props, "Please accept Terms of Use & Privacy Policy")
            if (/^\d{10}/.test(input)) {
                requestLocationPermission()
            }
            else
                showAlertWithValue(props, "Please enter 10 digits mobile number")
        }}>

        </GlobalButton>

    </View>
}
