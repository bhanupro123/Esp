import React, { } from "react";
import { View, Text, Platform } from 'react-native'
import ColorConstants from "../Utils/ColorConstants";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import DrawerHolder from "../Screeens/Drawer/DrawerHolder";
import DeviceInfo from "react-native-device-info";
export default Header = ({ title = "Next", globaldata, style = {}, ...props }) => {

    return <View style={{ backgroundColor: 'white' }}>
        <View style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: '#1A1E36',
            alignItems: 'center',
        }}>
            <DrawerHolder {...props} ></DrawerHolder>
            <Text
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginRight: 40,
                    color: "white",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: ValueConstants.size22
                }}
            >
                Pass2ParkIT  <Text style={{
                    marginRight: 40,
                    color: ColorConstants.secondaryColor,
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: ValueConstants.size16
                }}>v{Platform.OS=='ios'? DeviceInfo.getVersion():DeviceInfo.getVersion()+"."+parseInt(DeviceInfo.getBuildNumber()/1000)}</Text>
            </Text>
            {/* <Ionicons
                accessible={true}
                color={"#ffffff"}
                testID={"searchCancelButton"}
                accessibilityLabel={"searchCancelButton"}
                name={"settings"}
                size={30}
                style={{ alignSelf: "center", }}

            /> */}
        </View>
        <Text
            style={{
                backgroundColor: 'white',
                color: ColorConstants.secondaryColor,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                textAlign: 'center',
                marginTop: 10,
                fontFamily: Fonts.Mulish_Bold,
                fontSize: ValueConstants.size18
            }}
        >
            Logged in as {globaldata?.sessionData?.driver_name}
           
        </Text>
    </View >

}
