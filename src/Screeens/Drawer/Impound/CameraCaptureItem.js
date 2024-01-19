import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Image,
    TextInput,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ColorConstants from "../../../Utils/ColorConstants";

export default CameraCaptureItem = ({ url, crop, ...props }) => {


    const size = 100
    return <View style={{
        width: size,
        height: size,
        marginTop: 10,
        marginRight: 10,
        elevation: 2,
    }}>
        <Image style={{ width: size, height: size, borderRadius: 10 }}
            source={url}>
        </Image>
        <MaterialCommunityIcons
            onPress={() => {
                props.onCapturePath("")
            }}
            color={ColorConstants.black}
            name={"close"}
            size={20}
            style={{
                position: 'absolute', backgroundColor: 'white',
                borderRadius: 99, padding: 2, right: 5, top: 5
            }}
        />

    </View>
}; 