import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import DrawerHolder from "./DrawerHolder";
import moment from "moment-timezone";
const CheckIn = ({ ...props }) => {
    const globaldata = props.getContextGlobalData()

    const [apiResponse, setApiResponse] = useState({
        localTimeZone: moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('z'),
        res: null
    })
    const [showTimeZoneError, setShowTimeZoneError] = useState(true)
    useEffect(() => {

    }, [])


    return <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: '#1A1E36',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <DrawerHolder {...props} ></DrawerHolder>
            <Text
                style={{
                    color: "white",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size18)
                }}
            >
                {props.route.name}
            </Text>
            <Ionicons
                accessible={true}
                color={"#ffffff"}
                testID={"searchCancelButton"}
                accessibilityLabel={"searchCancelButton"}
                name={"settings"}
                size={30}
                style={{ alignSelf: "center", }}

            />
        </View>
    </View>
}

export default withGlobalContext(CheckIn)
