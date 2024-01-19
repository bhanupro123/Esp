import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    PermissionsAndroid,
    Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CameraCaptureItem from "./CameraCaptureItem";
import CameraCapture from "./CameraCapture";
import { getAndroidPermissions, getiOSPermissions } from "../../../Utils/Util";
import CaptureAndBrowse from "./CaptureAndBrowse";
import { launchImageLibrary } from "react-native-image-picker";

export default ImagesArrayItem = ({ source = [], onChangedText, crop, ...props }) => {


    const [imagesArray, setImagesArray] = useState([])
    const [showCamera, setShowCamera] = useState(false)
    const [showModel, setShowModel] = useState(false)

    const checkPermission = async () => {
        let granted = false;
        if (Platform.OS == "android")
            granted = await getAndroidPermissions(props)
        else
            granted = await getiOSPermissions(props)
        setShowModel(granted ? true : false)
    };
    return <View style={{ marginTop: 10 }}>
        {showModel ? <CaptureAndBrowse
            onClosed={(value) => {
                setShowModel(false)
                if (value)
                    setTimeout(() => {
                        if (value == 1)
                            setShowCamera(true)
                        else {
                            props.loader(true)
                            launchImageLibrary({
                                selectionLimit: 10,
                                mediaType: 'photo', quality: 0.2, includeBase64: true
                            }, async (res) => {
                                if (res?.assets?.map) {
                                    if (res.assets.map) {
                                        res.assets.map((item) => {
                                            if (imagesArray.length < 10)
                                                imagesArray.push({ ...item })
                                        })
                                        setImagesArray([...imagesArray])
                                        onChangedText(imagesArray)
                                    }
                                }
                                props.loader(false)
                            }, (res) => {
                                props.loader(false)
                            })
                        }
                    }, 1000)
            }}
            {...props}
        >
        </CaptureAndBrowse> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            {imagesArray.map((item, index) => {
                return <CameraCaptureItem
                    url={item}
                    key={item + index}
                    onCapturePath={(path) => {
                        imagesArray[index] = path
                        let filteredData = imagesArray.filter((item) => {
                            return item ? true : false
                        })
                        setImagesArray(filteredData)
                        onChangedText(filteredData)
                    }}>

                </CameraCaptureItem>
            })}
            {imagesArray.length < 10 ? <MaterialCommunityIcons
                onPress={checkPermission}
                color={ColorConstants.black}
                name={"camera-plus-outline"}
                size={80}
                style={{ margin: 10, }}
            /> : null}
        </View>

        {showCamera ? <CameraCapture
            onCapturePath={(path) => {
                if (path) {
                    imagesArray.push(path)
                    setImagesArray([...imagesArray])
                    onChangedText(imagesArray)
                }
                setShowCamera(false)
            }}
        >
        </CameraCapture> : null}
    </View>
}; 