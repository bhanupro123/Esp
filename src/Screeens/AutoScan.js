import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from 'axios';
import {
    SafeAreaView,
    Text,
    View, ScrollView,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    AppState,
    StatusBar,
    BackHandler,
    Alert,
    Platform
} from 'react-native';
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import { useIsFocused } from "@react-navigation/native";
import XMLParser from 'react-xml-parser';
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import { ServiceUrls } from "../Network/ServiceUrls";
import PlateCardItem from "./PlateCardItem";
import { clearUserDataAndReset, generateRandomString, generateUpdateFCMTokenObject, getStoragePref, showAlertWithValue } from "../Utils/Util";
import { handleResponse, requestPost } from "../Network/NetworkOperations";
import moment from "moment-timezone";
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Toast from 'react-native-simple-toast';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenNames from "../Utils/ScreenNames";
import Clipboard from "@react-native-clipboard/clipboard";
import { AsynKeys } from "../Utils/StringConstants";

const AutoScan = ({ ...props }) => {
    const globaldata = props.getContextGlobalData() 
    const appState = useRef("")
    const canIRefreshUI = useRef(false)
    const [continueAPI, setcontinueAPI] = useState({
        status: true,
        shortNamesArray: [],
        isLogouted:false
    })
    const isInternetAlive = useRef(null)
    let [data, setData] = useState([])
    const [status, setStatus] = useState("Connecting...")
    const base64 = require('base-64');
    let [cams, setCams] = useState([])
    const [refresh, setRefresh] = useState("")
    let [mainPlatesObject, setMainPlatesObject] = useState({})
    const [isApiCalled, setIsApiCalled] = useState(false)
    const [isTimeZoneMatched, setIsTimeZonematched] = useState(false)
    const [isTimeZoneMatchedStatus, setIsTimeZonematchedStatus] = useState("")

    const showNotification = async (remoteMessage) => {
        try {
            await notifee.requestPermission()

            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'default',
                visibility: 1,
                importance: AndroidImportance.HIGH,
                name: 'Default Channel',
            });

            // Display a notification
            await notifee.displayNotification({
                ...remoteMessage.notification,
                android: {
                    channelId,  // optional, defaults to 'ic_launcher'.
                    // pressAction is needed if you want the notification to open the app when pressed
                    pressAction: {
                        id: 'default',
                    },
                },
            });
        } catch (error) {

        }
    }
    const makeAPI = async () => {
        props.loader(true)
        let res = await requestPost(ServiceUrls.get_property_registrations, {
            session_id: globaldata.sessionData.session_id,
            authentication_token: globaldata.sessionData.authentication_token,
            api_key: globaldata.sessionData.api_keys.get_team_members,
            tow_company_id: globaldata.sessionData.tow_company_id,
        })
        res = handleResponse(props, res)

        if (res) {
            res.data.plateKeys = Object.keys(res.data)
            props.setTowData(res.data)
            setTimeout(() => {
                setRefresh(generateRandomString())
            }, 1000)
        }
        props.loader(false)
    }

    const handleAppStateChange = (nextAppState) => {
        let start = continueAPI.status
        console.error(nextAppState, appState.current, start)
         
        if (nextAppState === 'active' && start) {
            getStoragePref(AsynKeys.session).then((res)=>{
if(!res)
{
    messaging().deleteToken().catch(() => {

    })
    if (props?.resetContextData)
        props.resetContextData()
    let containerRefroute = props.route.params.containerRef.current.getCurrentRoute().name
    if (containerRefroute == "Auto Verify" || containerRefroute == "Config Cam" || containerRefroute == "Manual Verify") {
        props.navigation.replace(ScreenNames.Login)
    }
    else {
        try {
            props.navigation.pop()
            props.navigation.replace(ScreenNames.Login)
        } catch (error) {

        }
    }   
}
            })
            let localTimeZone = moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('z')
            if (continueAPI.shortNamesArray.length && !continueAPI.shortNamesArray.includes(localTimeZone)) {
                Alert.alert(
                    'Time zone miss matched please relunch app',
                    'Do you want to exit?',
                    [

                        {
                            text: 'Ok', onPress: () => {
                                AsyncStorage.clear().then(() => {
                                    messaging().deleteToken().catch(() => {

                                    })
                                    if (props?.resetContextData)
                                        props.resetContextData()
                                    let containerRefroute = props.route.params.containerRef.current.getCurrentRoute().name
                                    if (containerRefroute == "Auto Verify" || containerRefroute == "Config Cam" || containerRefroute == "Manual Verify") {
                                        props.navigation.replace(ScreenNames.Login)
                                    }
                                    else {
                                        try {
                                            props.navigation.pop()
                                            props.navigation.replace(ScreenNames.Login)
                                        } catch (error) {

                                        }
                                    }



                                    BackHandler.exitApp();
                                })
                            }
                        },
                    ],
                    { cancelable: false });


            }
            else if (start) {
                canIRefreshUI.current = false
                setTimeout(() => {
                    makeAPI()
                }, 500);
            }
        }
        appState.current = nextAppState;
    };


    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) { 
            Toast.show("Push notifications are disabled, please enable it from settings")
        }
       
        messaging().onMessage(async pushRemoteMessage => { 
            let remoteMessage = pushRemoteMessage
            renderRemoteMessage(remoteMessage)
        });
    }

    const renderRemoteMessage = (remoteMessage, canIRefresh = false) => {
        if(continueAPI.isLogouted) 
            return   
        try {
            let message = remoteMessage
            if (message?.data?.is_logout == "yes") {
                 
                 continueAPI.isLogouted=true 
                try{
                    if(Platform.OS=='ios'&&props?.mainModelRef?.current)
                    {  
                        props.mainModelRef.current.close()
                    }
                }
                catch(e)
                {  
                    console.error(e)
                }  
                 
               props.loader(true)
                requestPost(ServiceUrls.checkAndUpdateDriverFCMToken,generateUpdateFCMTokenObject("",globaldata.sessionData,true)).then((res)=>{
                  res=handleResponse(props,res)
                  props.loader(false)
                  if(res)
                  {
                    showAlertWithValue(props,message.notification.body) 
                    let containerRefroute = props.route.params.containerRef.current.getCurrentRoute().name
                    clearUserDataAndReset(props,containerRefroute)
                  }
                })
               
                return;
            }
            if (typeof (message.data.vehicle_details) == 'string')
                message.data.vehicle_details = JSON.parse(message.data.vehicle_details)
            props.setTowData(message.data, message.data.vehicle_details.lic_plate_no)
            if (canIRefresh) {
                canIRefreshUI.current = canIRefresh;
            }
            else {
                setRefresh(generateRandomString())
                setTimeout(() => {
                  //  Toast.show("Refreshed");
                    setRefresh(generateRandomString())
                }, 4000);
            }
            // showNotification(message)  
        }
        catch (e) {
            console.error(e)
            Toast.show("Error block" + JSON.stringify(e));
        }
    }


    const onLayoutChanges = async () => {
        await makeAPI()
        if (!isApiCalled) {
            requestPost(ServiceUrls.towTZ, {
                session_id: globaldata.sessionData.session_id,
                authentication_token: globaldata.sessionData.authentication_token,
                api_key: globaldata.sessionData.api_keys.get_team_members,
                tow_company_id: globaldata.sessionData.tow_company_id,
            }).then((res) => {
                props.loader(false)
                res = handleResponse(props, res)
                if (res) {
                    let localTimeZone = moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('z')
                    setIsApiCalled(true)
                    continueAPI.shortNamesArray = res.timezone_details.short_name
                    let ismatched = res.timezone_details.short_name.includes(localTimeZone)
                    if (ismatched) {
                        cams = globaldata.defaultIps
                        setCams(globaldata.defaultIps)
                        getTriggers()
                        
                    }
                    else
                        setIsTimeZonematchedStatus(`Your timezone is ${localTimeZone}. Tow company's timezone is ${res.timezone_details.short_name[0]}. Make sure your timezone is same as tow company's timezone.`)
                    setIsTimeZonematched(ismatched)

                }
            })
        }


    }

    const updateFCMToken = (newToken) => {
        //  Clipboard.setString(newToken)
        globaldata.sessionData.fcm_device_token = newToken
        requestPost(ServiceUrls.checkAndUpdateDriverFCMToken, generateUpdateFCMTokenObject(newToken, { ...globaldata.sessionData }, false)).then((res) => {
            handleResponse(props, res)
        })
        return
        requestPost(ServiceUrls.update_device_fcm_token, {
            session_id: globaldata.sessionData.session_id,
            authentication_token: globaldata.sessionData.authentication_token,
            api_key: globaldata.sessionData.api_keys.get_team_members,
            "mobile_no": globaldata.sessionData.phoneno,
            "fcm_device_token": newToken
        }).then((res) => {
            console.warn(res.data)
            res = handleResponse(props, res, false, false)
            if (res) {
                // Toast.show("FCM tocken updated.")
            }
        })
    }


    useEffect(() => {
        onLayoutChanges()
        messaging().onTokenRefresh(async (newToken) => {
            updateFCMToken(newToken)
        })
        messaging().getToken().then((token) => {
            updateFCMToken(token)
        })
        requestUserPermission()
        const subscribe = AppState.addEventListener('change', handleAppStateChange);
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("stateChanged", state.isConnected)
            let a = isInternetAlive.current
            let stateIsConnected = state.isConnected
            if (a != stateIsConnected) {
                console.log("INTERNET STATE CHANGED", stateIsConnected, a, isInternetAlive.current)
                props.internetChange(!stateIsConnected)
                isInternetAlive.current = stateIsConnected
                if (!isApiCalled) {
                    onLayoutChanges()
                }
                else
                    makeAPI()
            }
        })

        return () => {
            subscribe.remove()
            continueAPI.status = false
            unsubscribe()

        };
    }, [])
    const getTriggers = async () => {

        cams.map(async (item, index) => {
            if (item && item.active && continueAPI.status) {
                let uri = "http://" + item.userName + ":" + item.userPassword + "@" + item.ip + ":" + item.port + ServiceUrls.getPlates
                setTimeout(() => {
                    // //console.warn("calling.........", continueAPI.status, uri)
                    requestPost(uri, "<AfterTime><picTime></picTime></AfterTime>",
                        {
                            headers: {
                                "Accept": 'application/xml',
                                "Authorization": "Basic " + base64.encode(item.userName + ":" + item.userPassword),
                            },
                        }
                    ).then((res) => {

                        if (res && res.status == 200) {
                            cams[index].active = true
                            var xml = new XMLParser().parseFromString(res.data);

                            if (xml.children && xml.children.length) {
                                let updateState = false
                                for (let i = 0; i < xml.children.length; i++) {
                                    if (xml.children[i].children) {
                                        let random = generateRandomString(10 + i)
                                        let obj = {
                                            netInfo: item,
                                            uuid: random,
                                            isAPIHitted: false,
                                            capturedAt: new Date()
                                        }
                                        for (let j = 0; j < xml.children[i].children.length; j++) {
                                            obj[xml.children[i].children[j].name] = xml.children[i].children[j].value
                                        }
                                        if (obj.plateNumber.length >= 5) {
                                            let found = false
                                            for (let k = 0; k < data.length; k++) {
                                                let plateObj = data[k]
                                                if (plateObj.picName == obj.picName || plateObj.plateNumber == obj.plateNumber) {
                                                    found = true
                                                    break;
                                                }
                                            }
                                            if (!found) {
                                                updateState = true
                                                mainPlatesObject[random] = obj
                                                data.unshift(obj)
                                            }
                                        }
                                    }
                                }
                                if (updateState)
                                    setData([...data])
                            }
                            setStatus("Connected and fetching...")
                        }

                    }).catch((res) => {
                        cams[index].active = false
                        setStatus("Camera is not available" + res)

                    })
                }, 200);
            }
        })
        if (continueAPI.status)
            reCallApi()
    }

    const reCallApi = async () => {
        if (continueAPI.status) {
            setTimeout(() => {
                getTriggers()
            }, 8000);
        }
    }

    if (isTimeZoneMatched)
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
            <StatusBar backgroundColor={"white"} barStyle={'light-content'}></StatusBar>

            <View style={{
                flexDirection: 'row',
                padding: 10, flexWrap: 'wrap'
            }}>

                {cams.map((item, index) => {
                    return <View key={index} style={{
                        alignItems: 'center', marginRight: 15, marginBottom: 5,
                        flexDirection: 'row', flexShrink: 1
                    }}>
                        <View style={{
                            width: 15, height: 15,
                            borderRadius: 15,
                            backgroundColor: item && item.active ? "green" : "red"
                        }}>
                        </View>
                        <Text style={{
                            color: "black",
                            marginHorizontal: 5, flexShrink: 1,
                            fontSize: ValueConstants.size20,
                            fontFamily: Fonts.Mulish_Bold,
                        }}>{item.camname}</Text>
                    </View>
                })}
            </View>

            {data.length ? <Text style={{ fontFamily: Fonts.Mulish_Bold, color: 'black', marginHorizontal: 10, marginVertical: 5 }}>
                Total: {JSON.stringify(data.length)}</Text> : null}
            <ScrollView style={{ flex: 1 }}>
                {data.length == 0 ? <Text style={{
                    flex: 1, textAlignVertical: 'center',
                    fontSize: ValueConstants.size20, fontFamily: Fonts.Mulish_Bold, color: 'black', alignSelf: 'center'
                }}>{status}</Text> :


                    data.map((item, index) => {
                        return <PlateCardItem key={item.uuid}
                            uuid={item.uuid}
                            globaldata={globaldata}
                            item={mainPlatesObject[item.uuid]}
                            dataSet={mainPlatesObject} {...props}></PlateCardItem>

                    })
                }
            </ScrollView >
        </SafeAreaView >
    else return <View style={{
        flex: 1, alignItems: 'center',
        justifyContent: 'center'
    }}>
        {isTimeZoneMatchedStatus ? null : <ActivityIndicator size={'large'}></ActivityIndicator>}
        <Text
            onPress={() => {

                console.error(props.route.params.containerRef.current.getCurrentRoute())
            }}
            style={{
                color: 'red',
                margin: 20,
                marginHorizontal: 30,
                fontSize: ValueConstants.size20,
                fontFamily: Fonts.Mulish_Bold,
            }}>{isTimeZoneMatchedStatus}</Text>
    </View>
}

export default withGlobalContext(AutoScan)
