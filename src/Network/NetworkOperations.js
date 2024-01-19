import axios from "axios"
import { showAlertWithValue } from "../Utils/Util";
import ScreenNames from "../Utils/ScreenNames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsynKeys } from "../Utils/StringConstants";
import messaging from '@react-native-firebase/messaging';
export const requestPost = async (url = "", reqObj = {}, headers = {}) => {
    let res;
    try { 
        console.warn("Request POST=>>>>>>",url,reqObj)
        res = await axios.post(url, reqObj, headers)
    } catch (error) {
        res = error && error.response ? error.response : error
    }
    return res
}

export const handleResponsewithNetworkError = (props, res, ignoreSuccess = false,showSuccessAlert=false) => {
 
    try {
        if (props && res) {
            if (typeof (res) == 'string') {
                props.loader(false)
                showAlertWithValue(props, res)
            }
            else if (typeof (res) == "object") {
                if (res.status == 200) {
                    if (ignoreSuccess) {
                        return res.data
                    }
                    
                    if (res.data.api_status == "success" || res.data.status == "success" || res.data.status == "warning") {
                        if(showSuccessAlert)
                        {
                         showAlertWithValue(props,res.data.api_message)
                           props.loader(false)
                            return
                        }
                        return res.data
                    } else {
                        props.loader(false)


                        if (res.data.api_status == "error" && res.data.api_message == "Invalid session.") {
                             
                            AsyncStorage.clear().then(()=>{
                                while (props.navigation.canGoBack())
                                props.navigation.pop()
                                props.navigation.replace(ScreenNames.Login)
                                if (props.resetContextData)
                                props.resetContextData()
                            })
                            messaging().deleteToken().catch(()=>{
                
                            }) 
                        }


                        else {
                            props.loader(false)
                            showAlertWithValue(props, res.data.api_message)
                        }
                    }
                }
                else if (res?.response?.data?.message) { 
                    showAlertWithValue(props, res?.response?.data?.message)
                }
                else if (res?.response?.message) { 
                    showAlertWithValue(props, res?.response?.message)
                }
                else if (res.message) {  
                        showAlertWithValue(props, res?.message) 
                }
                else if (res?.status) {
                    showAlertWithValue(props, "Request failed with " + res.status)
                }
            }
        }
    }
    catch (e) {
        if (props.loader) props.loader(false)
    }
}
export const handleResponse = (props, res, ignoreSuccess = false,showSuccessAlert=false) => {
    try {
        if (props && res) {
            if (typeof (res) == 'string') {
                props.loader(false)
                showAlertWithValue(props, res)
            }
            else if (typeof (res) == "object") {
                if (res.status == 200) {
                    if (ignoreSuccess) {
                        return res.data
                    }
                    
                    if (res.data.api_status == "success" || res.data.status == "success" || res.data.status == "warning") {
                        if(showSuccessAlert)
                        {
                            showAlertWithValue(props,res.data.api_message)
                           props.loader(false)
                            return
                        }
                        return res.data
                    } else {
                        props.loader(false)


                        if (res.data.api_status == "error" && res.data.api_message == "Invalid session.") {
                            
                            if (props.resetContextData)
                            props.resetContextData()
                            AsyncStorage.clear().then(()=>{
                                while (props.navigation.canGoBack())
                                props.navigation.pop()
                                props.navigation.replace(ScreenNames.Login) 
                            }) 
                            messaging().deleteToken(()=>{
                                            
                            }).catch((e)=>{ 
                            })
                        }


                        else {
                            props.loader(false)
                            showAlertWithValue(props, res.data.api_message)
                        }
                    }
                }
                else if (res?.response?.data?.message) { 
                    showAlertWithValue(props, res?.response?.data?.message)
                }
                else if (res?.response?.message) { 
                    showAlertWithValue(props, res?.response?.message)
                }
                else if (res.message) { 
                    if(res.message!="Network Error")
                    {
                        showAlertWithValue(props, res?.message)
                    }
                }
                else if (res?.status) {
                    showAlertWithValue(props, "Request failed with " + res.status)
                }
            }
        }
    }
    catch (e) {
        if (props.loader) props.loader(false)
    }
}