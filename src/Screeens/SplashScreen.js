import React, { useEffect, useState } from "react";
import { View, Text, Linking, Platform } from 'react-native'
import FastImage from 'react-native-fast-image';
import ImagesWrapper from '../Utils/ImagesWrapper';
import ScreenNames from "../Utils/ScreenNames";
import { defaultIps, getStoragePref, setStoragePref, showAlertWithValue } from "../Utils/Util";
import { AsynKeys, StringConstants } from "../Utils/StringConstants";
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import SpInAppUpdates, {
    NeedsUpdateResponse,
    IAUUpdateKind,
    StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import DeviceInfo from "react-native-device-info";
import ValueConstants from "../Utils/ValueConstants";
import Fonts from "../Utils/Fonts";
import ColorConstants from "../Utils/ColorConstants";
import GlobalButton from "../CustomComponents/GlobalButton";
const SplashScreen = ({ ...props }) => {
    const [value, setValue] = useState(false)
    const inAppUpdates = new SpInAppUpdates(
        false // isDebug
    );
    const success = () => {
        setTimeout(() => {
            getStoragePref(AsynKeys.session).then(async (res) => {
                if (res) {
                    let data = await getStoragePref(AsynKeys.defaultCamConfig)
                    if (data) {
                        data.map((item, index) => {
                            props.setByDefaultIps(index, { ...item, active: false })
                        })
                    }
                    props.setSessionData(res)
                    props.navigation.replace(ScreenNames.VehicleScan)
                }
                else {
                    props.setSessionData(null)
                    setStoragePref(AsynKeys.defaultCamConfig, defaultIps())
                    props.navigation.replace(ScreenNames.Login)
                }
            })
        }, 1500);
    }
    useEffect(() => {
        success()
        return
        inAppUpdates.checkNeedsUpdate({}).then((res) => {
            let result = res
           
            try {
                if (Platform.OS == 'ios') {
                    if (result?.other?.version&& parseInt(DeviceInfo.getVersion().replaceAll(".",""))>=parseInt(result.other.version.replaceAll(".",""))) {
                        success()
                    }
                    else if (result?.other?.version != DeviceInfo.getVersion()) {
                        setValue(true)
                    }
                    else if (result?.reason?.toLowerCase().includes("could")) {
                        showAlertWithValue(props, "No Internet Connection")
                    }
                }
                else { 
                     let playstoreVersion=parseInt(result.other.versionCode)
                     let installedVersion=parseInt(DeviceInfo.getBuildNumber())
                     playstoreVersion=playstoreVersion-(playstoreVersion%1000)
                     installedVersion=installedVersion-(installedVersion%1000)
                     console.error(playstoreVersion)
                     if(playstoreVersion>installedVersion)
                     {
                        setValue(true)
                     }
                     else{
                        setValue(false)
                        success()
                     }

                    return
                    if (result.shouldUpdate) {
                        inAppUpdates.startUpdate({
                            updateType: IAUUpdateKind.IMMEDIATE,
                          }); 
                }
                else if(result.shouldUpdate==false){
                    success()
                }
            }
            } catch (error) {

            }
        }).catch((e) => {
            setValue(true)
        })
        return


    }, [])


    return <View style={{ flex: 1, backgroundColor: '#1A1E36', }}>

        {value ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{
                fontSize: (ValueConstants.size24),
                fontFamily: Fonts.Mulish_Bold,
                paddingHorizontal: 10,
                color: 'white',
                textAlign: 'center',
            }}
            >
                Mandatory Update is available, Please update from store.

            </Text>
            <GlobalButton title="Update" onPress={() => {
                if (Platform.OS == 'android')
                    Linking.openURL("https://play.google.com/store/apps/details?id=com.viswakarma.creations")
                else Linking.openURL("https://apps.apple.com/us/app/pass2park-it-driver/id1451407397")
            }}></GlobalButton>

        </View> :
            <FastImage resizeMode='contain' source={ImagesWrapper.splash} style={{
                flex: 1,
                margin: "10%"
            }}
            >

            </FastImage>}
    </View>
}


export default withGlobalContext(SplashScreen)