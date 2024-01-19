import React, { useState } from "react";
import { View, Text, ScrollView } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import DrawerHolder from "./DrawerHolder";
import moment from "moment-timezone";
import { getColorByMessage, getUTCStringFromTowTimeZoneToLocalString } from "../../Utils/Util";
import { StringConstants } from "../../Utils/StringConstants";
const History = ({ ...props }) => {
    const globaldata = props.getContextGlobalData().towData 
   let data= globaldata[props.route.params.plateNumber]
  
//    console.error(JSON.stringify(data),"::::::::::") // globaldata[props.route.params.plateNumber]=[{"start_time":"11/09/2023 12:00:00 AM","chk_date":"2023-11-09","camera_status":"Unauthorised scan!","is_noraml":"0","time_zone":"","utc_start_time":"2023-11-09T00:00:00.000Z","current_time":"11/22/2023 11:51:29 AM","property_id":"938","type":"permit","utc_expiry_date":"2024-02-09T00:00:00.000Z","camera_message":"Unauthorised scan!","status":"success","tow_status":"Unauthorised scan!","bgclr":"#E74C3C","Expiry_date":"02/09/2024 11:59:59 PM","utc_end_time":"2024-02-09T00:00:00.000Z","dis_message":"Parking Permit- Active!","deleted":"true","vehicle_details":{"lic_plate_no":"CLRCVR","color":"","year":"","model":"4C","vin":"","state":"11/09/2023 12:00:00 AM","make":"Alfa Romeo"},"tow_company_id":"1001","property_name":"PreRelease","api_message":"scan result","end_time":"02/09/2024 11:59:59 PM","parking_status":"Unauthorised scan!"},{"dis_message":"Do Not Tow!","is_noraml":"0","camera_status":"Unauthorised scan!","chk_date":"2023-11-22 05:48:52","property_id":"938","type":"DNT","utc_expiry_date":"2023-11-23T06:00:00.000Z","time_zone":"America/Chicago","camera_message":"Unauthorised scan!","status":"success","Expiry_date":"11/23/2023 12:00:00 AM","utc_end_time":"2023-11-23T06:00:00.000Z","bgclr":"#E74C3C","deleted":"true","current_time":"11/22/2023 05:50:45 AM","vehicle_details":{"lic_plate_no":"CLRCVR","color":"dasfdsa","year":null,"model":"4C","vin":null,"state":null,"make":"Alfa Romeo"},"tow_company_id":"1001","property_name":"PreRelease","api_message":"scan result","end_time":"11/23/2023 12:00:00 AM","parking_status":"Unauthorised scan!","tow_status":"Unauthorised scan!"},{"dis_message":"Scan Success","chk_date":"2023-11-22 05:53:44","end_time":"11/22/2023 06:52:26 AM","camera_status":"Cancelled","tow_company_id":"1001","cancal_datetime":"2023-11-22 05:53:43","is_noraml":"1","offset":"-6","time_zone":"America/Chicago","utc_start_time":"2023-11-22T11:52:26.000Z","utc_end_time":"2023-11-22T12:52:26.000Z","tow_status":"Cancelled","Expiry_date":"11/22/2023 06:52:26 AM","bgclr":"#F1C40F","utc_expiry_date":"2023-11-22T12:52:26.000Z","rent_roll_no":"1234","camera_message":"Cancelled","start_time":"11/22/2023 05:52:26 AM","status":"success","property_id":"938","type":"registration","current_time":"11/22/2023 05:53:44 AM","vehicle_details":{"lic_plate_no":"CLRCVR","color":"ikiki","year":"4654","model":"iisdfkhiik","vin":"","state":"dsakgfidsafgii","make":"fsdhgisdfkhki"},"property_name":"PreRelease","time_left":"00:58:42","api_message":"scan result","parking_status":"Cancelled"}]
  
 
    return <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{
            flexDirection: 'row',
            padding: 20,
            backgroundColor: '#1A1E36',
            alignItems: 'center', 
        }}>
              <Text
              onPress={()=>{
props.navigation.pop()
              }}
                style={{
                    color: "white",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size14)
                }}
            >
                BACK
            </Text>
            <Text
                style={{
                    flex:1,
                textAlign:'center',
                    color: "white",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size20)
                }}
            >
                {props.route.name}
            </Text>
            
        </View>
        <ScrollView style={{flex:1}}>
         
{data&&data.map?data.map((item,index)=>{
    console.error(item)
return <View style={{ margin:10,borderRadius:10,
padding:10,backgroundColor:getColorByMessage(item.camera_message.toLowerCase())}}>
   
   <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Status</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{ (item.camera_message)}</Text>
   
    </View>
    <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Type</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{ (item.type)}</Text>
   
    </View>


    <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Plate Number</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{props.route.params.plateNumber}</Text>
   
    </View>


    <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Expired At</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{getUTCStringFromTowTimeZoneToLocalString(item.Expiry_date)}</Text>
   
    </View>
   
    <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Scanned at</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{new Date().toLocaleString()}</Text>
   
    </View>
    <View style={{flexDirection:'row',marginVertical:5}}>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>Is Deleted</Text>
    <Text style={{flex:1,  color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,}}>{item.deleted?"true":"false"}</Text>
   
    </View>
</View>
}): <Text
style={{
    flex:1,
textAlign:'center',
    color: "black",
    marginVertical:20,
    fontFamily: Fonts.Mulish_SemiBold,
    fontSize: (ValueConstants.size18)
}}
>
{"No data found"}
</Text>}
        </ScrollView>
    </View>
}

export default withGlobalContext(History)
