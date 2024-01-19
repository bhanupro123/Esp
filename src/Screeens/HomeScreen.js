import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from 'react-native'
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import ColorConstants from "../Utils/ColorConstants";
import DropDownVS from "../CustomComponents/DropDownVS";
import { handleResponse, requestPost } from "../Network/NetworkOperations";
import { ServiceUrls } from "../Network/ServiceUrls";
import moment from "moment-timezone";
const HomeScreen = ({ ...props }) => {
    const globaldata = props.getContextGlobalData()

    const [apiResponse, setApiResponse] = useState({
        localTimeZone: moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('z'),
        res: null
    })
    const [showTimeZoneError, setShowTimeZoneError] = useState(true)
    useEffect(() => {
        try {
            requestPost(ServiceUrls.towTZ, {
                session_id: globaldata.sessionData.session_id,
                authentication_token: globaldata.sessionData.authentication_token,
                api_key: globaldata.sessionData.api_keys.get_team_members,
                tow_company_id: globaldata.sessionData.tow_company_id,
            }).then((res) => {
                res = handleResponse(props, res)
                if (res) {
                    apiResponse.res = res
                    apiResponse.matched = res.timezone_details.short_name.includes(apiResponse.localTimeZone)
                    setApiResponse({ ...apiResponse })
                    setShowTimeZoneError(!apiResponse.matched) //toggele to swap
                }
            })
        } catch (error) {

        }
    }, [])


    return <View style={{ flex: 1, backgroundColor: 'white' }}>

        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={'handled'}>
            <Text
                style={{
                    color: showTimeZoneError ? "red" : "green",
                    flex: 1,
                    marginTop: 10,
                    textAlign: 'right',
                    marginHorizontal: 20,
                    fontFamily: Fonts.Mulish_Bold,
                    fontSize: (ValueConstants.size20)
                }}
            >
                Timezone : {apiResponse.localTimeZone}

            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text
                    style={{
                        color: ColorConstants.primaryColor,
                        paddingBottom: 10,
                        textAlign: 'center',
                        marginVertical: 20,
                        fontFamily: Fonts.Mulish_Bold,
                        fontSize: (ValueConstants.size30)
                    }}
                >
                    Vehicle Scan
                </Text>

            </View>

            <DropDownVS showTimeZoneError={showTimeZoneError}
                key={"damn"}
                onSetSelected={() => {

                }} {...props}>

            </DropDownVS>
            {showTimeZoneError && apiResponse.res ? <Text
                style={{
                    color: "red",
                    flex: 1,
                    paddingBottom: 10,
                    margin: 20,
                    fontFamily: Fonts.Mulish_Bold,
                    fontSize: ValueConstants.size20
                }} >
                Your timezone is {apiResponse.localTimeZone}. Tow company's timezone is {apiResponse.res.timezone_details.short_name[0]}. Make sure your timezone is same as tow company's timezone.
            </Text> : null}
        </ScrollView>
    </View>
}

export default withGlobalContext(HomeScreen)
