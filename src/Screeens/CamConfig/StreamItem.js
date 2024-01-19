import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import { VLCPlayer, } from 'react-native-vlc-media-player';
import ColorConstants from "../../Utils/ColorConstants";
import StreamItemConfig from "./StreamItemConfig";
import { ServiceUrls } from "../../Network/ServiceUrls";
export default StreamItem = ({ id = 0, name = "", uri = ServiceUrls.rtspUri, ...props }) => {

    const globaldata = props.getContextGlobalData()
    const [showConfig, setShowConfig] = useState(false)
    const [data, setdata] = useState(globaldata.defaultIps[id])
    const [error, setError] = useState("")
    const [loader, setLoadered] = useState(true)
    return <View
        style={{
            flex: 1,
            margin: 10,
            backgroundColor: 'white',
            borderWidth: 1,
            overflow: 'hidden',
            borderRadius: 10,
            borderColor: ColorConstants.primaryColor,
            justifyContent: 'center'
        }}>

        {data.rtspUri ? <VLCPlayer
            style={{ flex: 1, width: "100%", height: "100%", }}
            source={{ uri: data.rtspUri }}
            onPlaying={() => {
                props.setByDefaultIps(id, { ...data, active: true })
                setLoadered(false)
            }}
            onError={(e) => {

                props.setByDefaultIps(id, { ...data, active: false })
                setLoadered(false)
                data.rtspUri = ""
                setError("Unable to Connect, Try again")
            }}
        /> :
            <TouchableOpacity
                onPress={() => {
                    setError("Please Configure")
                    setShowConfig(true)
                }}
                style={{
                    alignSelf: 'center',
                }}
            >
                <Text
                    style={{
                        color: ColorConstants.primaryColor,
                        alignSelf: 'center',
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: ValueConstants.size16
                    }}>
                    {error}</Text>
            </TouchableOpacity>

        }
        {data.rtspUri ? null : <Ionicons
            onPress={() => {
                setShowConfig(true)
            }}
            color={ColorConstants.primaryColor}
            name={"settings"}
            size={30}
            style={{ right: 10, top: 10, position: 'absolute' }}
        />}
        <Text
            style={{
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                fontFamily: Fonts.Mulish_Bold,
                fontSize: ValueConstants.size16,
                color: ColorConstants.secondaryColor, left: 0, top: 0, position: 'absolute'
            }}
        >{data.camname}</Text>

        {showConfig ? <StreamItemConfig
            {...props}
            id={id}
            configData={{ ...data }}
            onOk={(value) => {
                if (value) {
                    setError("")
                    let newObj = { ...data, ...value }
                    setdata({ ...newObj })
                    props.setByDefaultIps(id, { ...newObj, active: Platform.OS=='ios' })
                    setLoadered(true)
                }
                setShowConfig(false)
            }}>
        </StreamItemConfig> : null}
        {loader ? <ActivityIndicator size={'large'}
            style={{
                position: 'absolute', alignSelf: 'center',
                justifyContent: 'center', alignItems: 'center'
            }}
        ></ActivityIndicator> : null}
    </View>
}


