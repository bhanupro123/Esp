import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, View, Text, TextInput, Image, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import FastImage from 'react-native-fast-image';
import ImagesWrapper from '../Utils/ImagesWrapper';
import ColorConstants from "../Utils/ColorConstants";
import LoginForm from "./LoginForm";
import Fonts from "../Utils/Fonts";
import { generateUpdateFCMTokenObject, setStoragePref, showAlertWithValue } from "../Utils/Util";
import ValueConstants from "../Utils/ValueConstants";
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import GlobalButton from "../CustomComponents/GlobalButton";
import { handleResponse, handleResponsewithNetworkError, requestPost } from "../Network/NetworkOperations";
import { ServiceUrls } from "../Network/ServiceUrls";
import ScreenNames from "../Utils/ScreenNames";
import { AsynKeys } from "../Utils/StringConstants";
import messaging from '@react-native-firebase/messaging'; 
import DeviceInfo from "react-native-device-info";
const Verify = ({ ...props }) => {
    const params = props.route.params
    const dimWidth = Dimensions.get('window').width
    const dimHeight = Dimensions.get('window').height
    const isInverted = dimWidth > dimHeight
    const [otp, setOtp] = useState({ otp: ["", "", "", "", "", ""] })
    const [activeFocusAt, setActiveFocusAt] = useState(["", "", "", "", "", ""])
    const renderComp1 = () => {
        return <View style={{
            height: 200, width: '100%',
        }}>
            <FastImage
                resizeMode="cover"
                source={ImagesWrapper.toplogo}
                style={{
                    flex: 1,
                }}
            >
            </FastImage>
        </View>

    }

    return <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? "padding" : undefined}
        style={{
            flex: 1,
            backgroundColor: ColorConstants.primaryColor,
        }}>
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{
                flex: 1,
                backgroundColor: ColorConstants.primaryColor,
            }}
            >
                {renderComp1()}

                <Text style={{
                    color: 'white',
                    alignSelf: 'center',
                    fontFamily: Fonts.Mulish_Bold,
                    fontSize: (ValueConstants.size26)
                }}>Verification Code</Text>
                <Text
                    style={{
                        marginVertical: 15,
                        color: "#a6aac3",
                        textAlign: 'center',
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size16)
                    }}
                >
                    Sit back and relax while we verify your mobile number
                </Text>

                <Image style={{
                    marginVertical: 20,
                    alignSelf: 'center',
                    maxWidth: 60,
                    maxHeight: 60
                }}
                    source={ImagesWrapper.sms}></Image>

                <View style={{
                    marginBottom: 15, alignItems: 'center', flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: 'white',
                        fontFamily: Fonts.Mulish_SemiBold,
                        fontSize: (ValueConstants.size18)
                    }}>Please type verification code sent to <Text style={{
                        color: 'white',
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size18)
                    }}> +1 {params.input}</Text></Text>

                </View>




                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    flexWrap: 'wrap', justifyContent: 'center',
                    marginVertical: 20
                }}>

                    {otp.otp.map((item, index) => {
                        return <TextInput
                            ref={(ref) => {
                                activeFocusAt[index] = ref
                            }}
                            key={item + index}
                            maxLength={1}
                            focusable
                            value={otp.otp[index]}
                            keyboardType="phone-pad"
                            autoFocus={activeFocusAt == index}
                            onKeyPress={(nativeEvent) => {

                                if (!otp.otp[index] && nativeEvent.nativeEvent.key == "Backspace" && activeFocusAt[index - 1]) {
                                    activeFocusAt[index - 1].focus()
                                }
                                else if (otp.otp[index] && /^\d/.test(nativeEvent.nativeEvent.key) && otp.otp.length > index + 1) {
                                    otp.otp[index + 1] = nativeEvent.nativeEvent.key
                                    setOtp({ ...otp })
                                    if (otp.otp.length > index + 2) {
                                        activeFocusAt[index + 2].focus()
                                    }
                                }
                            }}
                            onChangeText={(value) => {

                                if (!value) {
                                    otp.otp[index] = value
                                    setOtp({ ...otp })
                                    if (activeFocusAt[index - 1]) {
                                        otp.otp[index] = value
                                        setOtp({ ...otp })
                                        activeFocusAt[index - 1].focus()
                                    }
                                }
                                else if (/^\d/.test(value)) {
                                    otp.otp[index] = value
                                    setOtp({ ...otp })
                                    if (activeFocusAt[index + 1]) {
                                        activeFocusAt[index + 1].focus()
                                    }
                                }

                            }}
                            style={{
                                margin: 5,
                                borderColor: 'white',
                                width: 40,
                                padding: 2,
                                textAlign: 'center',
                                height: 40,
                                borderWidth: 1,
                                color: 'white',
                                fontFamily: Fonts.Mulish_SemiBold,
                                fontSize: (ValueConstants.size22)
                            }}
                        >
                        </TextInput>
                    })}

                </View>


                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>
                    <GlobalButton
                        style={{ backgroundColor: '#6a6a6afa' }}
                        onPress={() => {
                            props.navigation.pop()
                        }}
                        title="Back"
                    ></GlobalButton>
                    <GlobalButton
                        title="Submit"
                        onPress={() => {
                            let finalOTP = ""
                            let isEmpty = otp.otp.some((item, index) => {
                                finalOTP += item
                                if (!item)
                                    return true
                            })

                            if (isEmpty) return showAlertWithValue(props, "Please enter 6 digit OTP")
  
                             props.loader(true)
                            messaging().getToken().then( (getToken) => {  
                                 requestPost(ServiceUrls.validateOTP, {
                                session_id: params.res.session_id,
                                authentication_token:
                                    params.res.authentication_token,
                                api_key: params.res.api_keys.verify_otp,
                                otp: finalOTP,
                                device_udid:DeviceInfo.getUniqueIdSync(),
                                fcm_device_token: getToken
                            }).then(async (res) => {

                                res = handleResponsewithNetworkError(props, res)
                                if (res) {  
                                    let session = {
                                        fcm_device_token: getToken,
                                        api_keys: params.res.api_keys,
                                        api_key: params.res.api_keys,
                                        authentication_token: params.res.authentication_token,
                                        session_id: params.res.session_id,
                                        ...res.driver_details
                                    }  
                            //         let fcmRes=  await  requestPost(ServiceUrls.checkAndUpdateDriverFCMToken, generateUpdateFCMTokenObject(getToken,{...session},false))
                            //    fcmRes=handleResponse(props,fcmRes) 
                                    setStoragePref(AsynKeys.session, session) 
                                    props.setSessionData(session) 
                                  setTimeout(() => {
                                    props.navigation.pop()
                                    props.navigation.replace(ScreenNames.VehicleScan)
                                  }, 500);
                                }
                                else {
                                    props.loader(false)
                                }
                            }).catch((e)=>{
                              showAlertWithValue(props,JSON.stringify(e))
                            }) 
                              }).catch((e)=>{
                                props.loader(false)
                                showAlertWithValue(props,JSON.stringify(e))
                              })
                            



                        }}
                    ></GlobalButton>
                </View>


            </ScrollView>
        </SafeAreaView>

    </KeyboardAvoidingView>
}

export default withGlobalContext(Verify)