import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { RNCamera } from "react-native-camera";
import ReactNativeModal from "react-native-modal";
import Fonts from "../../../Utils/Fonts";
import ValueConstants from "../../../Utils/ValueConstants";
import IconAnt from 'react-native-vector-icons/AntDesign';
import { Platform } from "react-native";
export default CameraCapture = ({ path = {}, onCapturePath, crop, ...props }) => {

    const cam = useRef(null)
    const size = 80
    const [data, setData] = useState(path)
    const [showCamera, setShowCamera] = useState(false)


    return <ReactNativeModal
        isVisible
        ref={(ref)=>{  
            if(props?.mainModelRef)
            props.mainModelRef.current=ref
        }} 
        onModalWillHide={()=>{
            onCapturePath()
        }}
        style={{
            flex: 1,
            margin: 0,
            backgroundColor: 'white'
        }}

        onBackButtonPress={() => {
            onCapturePath()
        }}
    >
        {data.uri && !showCamera ? <View style={{ flex: 1, position: 'relative' }}>

            <Image style={{ flex: 1 }} source={data}>
            </Image>


            <View style={{
                width: "100%",
                position: 'absolute',
                bottom: 0,
                backgroundColor: '#00000060',
                paddingVertical: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}>

                <Text
                    onPress={() => {
                        setShowCamera(true)
                    }}
                    style={{
                        elevation: 2,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: ValueConstants.size24,
                        color: 'white',
                        padding: 5
                    }}>Retake</Text>
                <Text
                    onPress={() => {
                        onCapturePath(data)
                    }}
                    style={{
                        elevation: 2,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: ValueConstants.size24,
                        color: 'white',
                        padding: 5
                    }}>Use Photo</Text>

                <Text
                    onPress={() => {
                        onCapturePath()
                    }}
                    style={{
                        elevation: 2,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: ValueConstants.size24,
                        color: 'white',
                        padding: 5
                    }}>Cancel</Text>
            </View>

        </View > : <View style={{ flex: 1, position: 'relative', backgroundColor: Platform.OS == 'android' ? "black" : "white" }}>


            <RNCamera
                ref={cam}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                androidCameraPermissionOptions={{
                    title: "Permission to use camera",
                    message: "We need your permission to use your camera",
                    buttonPositive: "Ok",
                    buttonNegative: "Cancel",
                }}
                androidRecordAudioPermissionOptions={{
                    title: "Permission to use audio recording",
                    message: "We need your permission to use your audio",
                    buttonPositive: "Ok",
                    buttonNegative: "Cancel",
                }}

            />
            <View
                style={{
                    backgroundColor: '#00000060',
                    borderRadius: 99,
                    marginHorizontal: 10,
                    marginVertical: 30,
                    padding: 5,
                    flexDirection: 'row',
                    position: 'absolute'
                }}
            >
                <IconAnt
                    onPress={() => {
                        onCapturePath()
                    }}
                    name="arrowleft"
                    size={35}
                    color={'white'}
                />
            </View>

            <View style={{
                position: 'absolute',
                bottom: 30,
                width: "100%",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    accessible={true}
                    testID={"cam2"}
                    accessibilityLabel={"cam2"}
                    onPress={() => {
                        try {
                            if (cam && cam.current)
                                cam.current.takePictureAsync({ quality: 0.2, base64: true, imageType: "jpeg" }).then((image) => {
                                    if (image) {
                                        setData({ uri: image.uri, base64: image.base64 })
                                        setShowCamera(false)
                                    }

                                }).catch(error => {
                                    alert(error + " check camera permissions")
                                })
                        } catch (error) {
                            alert(error + " check camera permissions")
                        }
                    }}
                    style={{
                        width: size, height: size,
                        backgroundColor: '#00000000',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 999,
                        borderWidth: 4,
                        borderColor: "white"
                    }}>
                    <View style={{
                        width: "90%", height: "90%",
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        borderRadius: 999
                    }}>

                    </View>

                </TouchableOpacity>
                <Text
                    accessible={true}
                    testID={"camc1cancel"}
                    accessibilityLabel={"cam1cancel"}
                    onPress={() => {
                        onCapturePath()
                    }}
                    style={{
                        position: 'absolute',
                        color: 'white',
                        right: 20,
                        padding: 5
                    }}>Cancel</Text>
            </View>

        </View >}
    </ReactNativeModal>
}; 