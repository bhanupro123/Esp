import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, PermissionsAndroid, PixelRatio, Platform } from "react-native";
import ColorConstants from "./ColorConstants";
import { StringConstants } from "./StringConstants";
import { PERMISSIONS, check, checkMultiple, openSettings, request, requestMultiple } from "react-native-permissions";
import moment from "moment";
const base64 = require('base-64');
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from "react-native-device-info";
import { ServiceUrls } from "../Network/ServiceUrls";
import { requestPost } from "../Network/NetworkOperations";
import ScreenNames from "./ScreenNames";
const defaultHosts = ["192.168.1.150", "192.168.1.151", "192.168.1.152", "192.168.1.153"]
export function getTypeById(id = 0) {
    if (id == 0)
        return "Front Left"
    if (id == 1)
        return "Front Right"
    if (id == 2)
        return "Back Left"
    if (id == 3)
        return "Back Right"
}
export function clearUserDataAndReset(props, containerRefroute = "") {
    console.error(containerRefroute, new Date())
    AsyncStorage.clear().then(() => {

    }).catch(() => {

    }).finally(() => {
        try {
            if (props.resetContextData)
                props.resetContextData()
            messaging().deleteToken().catch(() => {

            })
            if (containerRefroute) {
                console.error(containerRefroute, "{{}}")
                if (containerRefroute == "Auto Verify" ||
                    containerRefroute == "Config Cam" ||
                    containerRefroute == "Manual Verify") {
                    console.error(containerRefroute, "{{------}}")
                    props.navigation.replace(ScreenNames.Login)
                    return
                }
            }
            try {
                while (props.navigation.canGoBack()) {

                    if (props.navigation.canGoBack())
                        props.navigation.pop()
                }

            }
            catch (e) {
                console.error("FINALLYYYYY", e)
            }
            props.navigation.replace(ScreenNames.Login)

        } catch (error) {

        }
    })

}
export function defaultIps() {
    return [{
        camname: "Front Left",
        camId: 1,
        active: false,
        userName: StringConstants.defaultUserName,
        userPassword: StringConstants.defaultPassWord,
        ip: defaultHosts[0],
        port: StringConstants.defaultIp,
        auth: "Basic " + base64.encode(StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord),
        rtspUri: "rtsp://" + StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord + "@" + defaultHosts[0]
    }, {
        camname: "Front Right",
        camId: 2,
        active: false,
        userName: StringConstants.defaultUserName,
        userPassword: StringConstants.defaultPassWord,
        ip: defaultHosts[1],
        port: StringConstants.defaultIp,
        auth: "Basic " + base64.encode(StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord),
        rtspUri: "rtsp://" + StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord + "@" + defaultHosts[1]
    }, {
        camname: "Back Left",
        camId: 3,
        active: false,
        userName: StringConstants.defaultUserName,
        userPassword: StringConstants.defaultPassWord,
        ip: defaultHosts[2],
        port: StringConstants.defaultIp,
        auth: "Basic " + base64.encode(StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord),
        rtspUri: "rtsp://" + StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord + "@" + defaultHosts[2]
    }, {
        camname: "Back Right",
        camId: 4,
        active: false,
        userName: StringConstants.defaultUserName,
        userPassword: StringConstants.defaultPassWord,
        ip: defaultHosts[3],
        port: StringConstants.defaultIp,
        auth: "Basic " + base64.encode(StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord),
        rtspUri: "rtsp://" + StringConstants.defaultUserName + ":" + StringConstants.defaultPassWord + "@" + defaultHosts[3]
    }]
}
export function generateRandomString(upto = 10) {
    const characters = 'UPSQUADABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789BLOOMING';
    let result = '';

    for (let i = 0; i < upto; i++) {
        result += characters.charAt(Math.floor(Math.random() * upto));
    }
    return result;
}

export function getUTCStringFromTowTimeZoneToLocalString(TOWEXPIREDATE = null) {
    return new Date(moment.tz(TOWEXPIREDATE, "MM/DD/YYYY hh:mm:ss A", moment.tz.guess())).toLocaleString()
}
export function getUTCStringFromTowTimeZone(Expiry_date = null) {
    return moment.tz(Expiry_date, "MM/DD/YYYY hh:mm:ss A", moment.tz.guess())
}
let miscellaneouschars = ["S", "1", "0", "T", "B", "D", "5", "I", "O", "7", "8", "O"]
let matchedMiscellaneouschars = ["5", "I", "O", "7", "8", "O", "S", "1", "0", "T", "B", "D"]

export function checkMisslleneousData(globalData, originalPlateNumber = "") {
    try {
        let plateKeys = globalData.plateKeys

        let stringRegx = "^"
        for (let i = 0; i < originalPlateNumber.length; i++) {
            let index = miscellaneouschars.indexOf(originalPlateNumber.charAt(i))
            if (index != -1) {
                stringRegx = stringRegx + "[" + miscellaneouschars[index] + "|" + matchedMiscellaneouschars[index] + "]"
            }
            else {
                stringRegx = stringRegx + originalPlateNumber.charAt(i)
            }
        }
        stringRegx = stringRegx + "$"
        for (let j = 0; j < plateKeys.length; j++) {

            if (new RegExp(stringRegx).test(plateKeys[j])) {

                let foundData = renderUIByPlateNumber(globalData, plateKeys[j], false, true)
                if (foundData) {
                    return foundData
                }

            }
        }
        return {
            camera_message: StringConstants.unauthorized
        }

    } catch (error) {
        return {
            camera_message: StringConstants.unauthorized
        }
    }
}



export const generateUpdateFCMTokenObject = (newToken, sessionData = {}, is_logout = false) => {
    try {
        return {
            session_id: sessionData.session_id,
            authentication_token: sessionData.authentication_token,
            api_key: sessionData.api_keys.get_team_members,
            "mobile_no": sessionData.phoneno,
            "fcm_device_token": newToken,
            tow_company_id: sessionData.tow_company_id,
            driver_user_id: sessionData.driver_id,
            "app_version": Platform.OS == 'ios' ? DeviceInfo.getVersion() : DeviceInfo.getVersion() + "--" + DeviceInfo.getBuildNumber(),
            "device_type": Platform.OS,
            "device_udid": DeviceInfo.getUniqueIdSync(),
            "device_version": DeviceInfo.getVersion(),
            "device_model": DeviceInfo.getModel(),
            "device_name": DeviceInfo.getDeviceNameSync(),
            "is_logout": is_logout ? "yes" : "no",
            "created_at": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            "updated_at": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        }
    } catch (error) {
        console.warn(error, sessionData)
    }
}

export function renderUIByPlateNumber(globaldata = {}, plateNumber, getData = true, onlyActive = false) {
    if (globaldata && plateNumber) {
        let foundedArray = globaldata[plateNumber]
        console.log(plateNumber, "PLAte")
        let filteredArray = []
        if (foundedArray && foundedArray.length) {
            let atmostExpirydate = null
            let foundAt = 0
            let activeArray = []
            for (let i = 0; i < foundedArray.length; i++) {
                let res = foundedArray[i]
                if (!res.deleted) {

                    let utc_expiry_date = getUTCStringFromTowTimeZone(res?.Expiry_date)
                    if (res.camera_message.toLowerCase().includes("active") && utc_expiry_date && new Date() < new Date(utc_expiry_date)) {
                        if (res.type.toLowerCase().includes("dnt")) return getMessageColorWithData(res)
                        else activeArray.push(res)
                    }
                    if (!onlyActive) {
                        if (i == 0) {
                            atmostExpirydate = utc_expiry_date
                            filteredArray.push(res)
                        }
                        else if (new Date(utc_expiry_date) > new Date(atmostExpirydate)) {
                            console.log(plateNumber, "Found at", i)
                            foundAt = i
                            atmostExpirydate = res?.Expiry_date
                            filteredArray.push(res)
                        }
                    }
                }
            }
            if (activeArray.length) return  getMessageColorWithData(activeArray[0]) 
            if (onlyActive)    return 
            if (foundAt != null) {
                let foundedItem = foundedArray[foundAt]
                if (!foundedItem.deleted) {
                    if (new Date() < new Date(getUTCStringFromTowTimeZone(foundedItem?.Expiry_date)))
                        return getMessageColorWithData(foundedItem)
                    else {
                        foundedItem.camera_message = "Expired"
                        return getMessageColorWithData(foundedItem)
                    }
                }
            }

        }
    }
    console.log(plateNumber, "Finally at")
    if (getData)
        return {
            camera_message: StringConstants.unauthorized
        }


}

export function getColorByMessage(camera_message = "") {
    if (camera_message.toLowerCase().includes("active"))
        return "green"
    else if (camera_message.toLowerCase().includes('cancelled'))
        return "orange"
    else if (camera_message.toLowerCase().includes('expired'))
        return "red"
    return ColorConstants.primaryColor
}

export const dropAlogintoDB = (sessionData, statusData, innerValue = "", imageData = "") => {
    requestPost(ServiceUrls.updateDriverScanLogs, {
        session_id: sessionData.session_id,
        authentication_token: sessionData.authentication_token,
        api_key: sessionData.api_keys.get_team_members,
        "driverScanLogs": [
            {
                "driver_id": sessionData.session_id,
                "tow_company_id": statusData?.tow_company_id ? statusData.tow_company_id : sessionData.tow_company_id,
                "property_id": statusData.property_id ? statusData.property_id : 0,
                "auto_scan": imageData ? "True" : "False",
                "lic_plate_no": innerValue,
                "scan_timezone":moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('z'), //statusData?.time_zone ? statusData?.time_zone : sessionData.timezone,
                "scan_time": moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                "scan_status": statusData?.type?.toLowerCase()?.includes("dnt") || statusData?.type?.toLowerCase()?.includes("permit") ? statusData?.type + " " + statusData.camera_message : statusData.camera_message,
                "scan_type": statusData.type,
                "camera_message": statusData.camera_message,
                "app_version": Platform.OS == 'ios' ? DeviceInfo.getVersion() : DeviceInfo.getVersion() + "--" + DeviceInfo.getBuildNumber(),
                "device_type": Platform.OS,
                "device_version": DeviceInfo.getSystemVersion(),
                "device_model": DeviceInfo.getModel(),
                "device_name": DeviceInfo.getDeviceNameSync(),
                "license_plate_image": imageData,
                "meta_data": JSON.stringify({
                    "unique_id": DeviceInfo.getUniqueIdSync(),
                    "driver_name": sessionData.driver_name,
                    "email": sessionData.email,
                    "fcm_device_token": sessionData.fcm_device_token,
                    "phoneno": sessionData.phoneno,
                })
            }
        ]
    })
}

function getMessageColorWithData(res) {
    if (res?.camera_message.toLowerCase().includes("active"))
        return {
            ...res,
            color: "green"
        }
    else if (res?.camera_message.toLowerCase().includes('cancelled'))
        return {
            ...res,
            color: "orange"
        }
    return {
        color: 'red',
        ...res,
    }
}

export function generateRandomColor() {
    let maxVal = 0xFFFFFF; // 16777215.
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    return `#${randColor.toUpperCase()}`
}
export const getMandatoryColor = (state) => {
    if (state == 1)
        return "red"
    if (state == 2)
        return ColorConstants.secondaryColor
    return null

}

export const getFontSize = (size) => {
    const newSize = (size / Dimensions.get("window").fontScale);
    if (Platform.OS === "ios") {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
};
export const getiOSPermissions = async (props) => {
    let statuses = await requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.PHOTO_LIBRARY])
    if (statuses[PERMISSIONS.IOS.CAMERA] != "granted") {
        showAlertWithValue(props, "Camera permissions are denied")
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    else if (statuses[PERMISSIONS.IOS.MICROPHONE] != "granted") {
        showAlertWithValue(props, "Microphone permissions are denied")
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    // else if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] != "granted") {
    //     showAlertWithValue(props, "Storage/Photo library permissions are denied")
    //     setTimeout(() => {
    //         openSettings()
    //     }, 2000);
    //     return
    // }
    return true
}
export const getAndroidPermissions = async (props) => {

    let granted = await PermissionsAndroid.requestMultiple(
        [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ],
        {
            title: "Pass2ParkIt Permission",
            message: "Pass2ParkIt Track app needs access to your permissions",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
        }
    );

    if (granted["android.permission.CAMERA"] != "granted") {
        showAlertWithValue(props, "Camera permissions are denied");
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    if (granted["android.permission.READ_EXTERNAL_STORAGE"] != "granted") {
        showAlertWithValue(props, "Read Storage permissions are denied");
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    if (granted["android.permission.WRITE_EXTERNAL_STORAGE"] != "granted") {
        showAlertWithValue(props, "Write Storage permissions are denied");
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    if (granted["android.permission.RECORD_AUDIO"] != "granted") {
        showAlertWithValue(props, "Record Audio permissions are denied");
        setTimeout(() => {
            openSettings()
        }, 2000);
        return
    }
    return true;
};
export const setStoragePref = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
}
export const getStoragePref = async (key) => {
    let value = await AsyncStorage.getItem(key)
    return value ? JSON.parse(value) : value
}

export const showAlertWithValue = (props, value = "") => {
    if (value)
        props.alert(true, { value: value })
}