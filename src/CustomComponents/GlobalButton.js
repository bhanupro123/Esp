import React, { useState } from "react";
import { TouchableOpacity, Text } from 'react-native'
import ColorConstants from "../Utils/ColorConstants";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
export default GlobalButton = ({timeout=2000, onPress, title = "Next", style = {}, ...props }) => {

    const [disabled, setDisabled] = useState(false)

    return <TouchableOpacity
        onPress={() => {
            onPress()
            setDisabled(true)
            setTimeout(() => {
                setDisabled(false)
            }, timeout)
        }}
        disabled={disabled}
        style={{
            minWidth: "25%",
            alignItems: 'center',
            marginVertical: 20,
            alignSelf: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            minHeight: 60,
            backgroundColor: ColorConstants.secondaryColor, ...style
        }}
        {...props}
    >
        <Text style={{
            fontFamily: Fonts.Mulish_Bold,
            fontSize: (ValueConstants.size20),
            color: 'white',
            paddingHorizontal: 20
        }}>
            {title}
        </Text>

    </TouchableOpacity>
}
