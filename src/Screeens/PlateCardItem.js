/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { ServiceUrls } from '../Network/ServiceUrls';
import Fonts from '../Utils/Fonts';
import ValueConstants from '../Utils/ValueConstants';
import FastImage from 'react-native-fast-image';
import { handleResponse, requestPost } from '../Network/NetworkOperations';
import ReactNativeModal from 'react-native-modal';
import PlateCardManualModel from './PlateCardManualModel';
import Clipboard from '@react-native-clipboard/clipboard';
import { StringConstants } from '../Utils/StringConstants';
import moment from 'moment';
import { checkMisslleneousData, dropAlogintoDB, generateRandomString, getColorByMessage, getUTCStringFromTowTimeZoneToLocalString, renderUIByPlateNumber } from '../Utils/Util';
import DeviceInfo from 'react-native-device-info';
const PlateCardItem = ({ item, uuid, dataSet, ...props }) => {


  let [verificationStatus, setVerificationStatus] = useState({ ...item })
  const [showManualModel, setShowManualModel] = useState(false)
  const imageUri = "http://" + verificationStatus.netInfo.ip + "/doc/ui/images/plate/" + item["picName"] + ".jpg"
   
  const globaldata = props.getContextGlobalData()
  const sessionData=globaldata.sessionData
  const towData = globaldata.towData 

  let plateNumber = dataSet[uuid]["plateNumber"]
  let res = renderUIByPlateNumber(towData, plateNumber,false)
  if(!res)
  { 
    res=checkMisslleneousData(towData,plateNumber)
  } 
  dataSet[uuid]["camera_message"] = res.camera_message
  if (res) {
    verificationStatus = { ...verificationStatus, ...res }
  }
  let isItActive = verificationStatus?.camera_message?.toLowerCase().includes("active") || verificationStatus.camera_message == StringConstants.dNT

  let color = getColorByMessage(verificationStatus.camera_message)
    
  if(!dataSet[uuid]["apistarted"])
  {
    dataSet[uuid]["apistarted"] = true
    console.log("Started.......",plateNumber,res.camera_message)
   
    fetch(imageUri, {
      headers: {
        Authorization: item?.netInfo?.auth
      }
    })
      .then(response => response.blob())
      .then(blob => {
        var reader = new FileReader();
        reader.onload = function () {
          let imagedata = this.result
          imagedata = imagedata.replace("data:application/octet-stream", "data:image/png")
          

          dropAlogintoDB(sessionData,res,plateNumber,imagedata)
          // requestPost(ServiceUrls.updateDriverScanLogs,
          //   {
          //     session_id: sessionData.session_id,
          //         authentication_token:sessionData.authentication_token,
          //         api_key:  sessionData.api_keys.get_team_members, 
          //     "driverScanLogs": [
          //       { 
          //         "driver_id": sessionData.session_id,
          //         "tow_company_id": res?.tow_company_id?res.tow_company_id:sessionData.tow_company_id,
          //         "property_id":res.property_id?res.property_id:0, 
          //         "auto_scan": "True" ,
          //         "lic_plate_no": plateNumber,
          //         "scan_timezone":res?.time_zone?res?.time_zone: sessionData.timezone,
          //         "scan_time":moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          //         "scan_status": res.camera_message,
          //         "license_plate_image": imagedata,
          //         "app_version":Platform.OS=='ios'?DeviceInfo.getVersion():DeviceInfo.getVersion()+"--"+DeviceInfo.getBuildNumber(),
          //         "device_type":Platform.OS,
          //         "device_version":DeviceInfo.getSystemVersion(),
          //         "device_model":DeviceInfo.getModel(),
          //         "device_name":DeviceInfo.getDeviceNameSync(),
          //         "meta_data": JSON.stringify({
          //           "unique_id":DeviceInfo.getUniqueIdSync(),
          //           "driver_name": sessionData.driver_name,
          //           "email": sessionData.email,
          //           "fcm_device_token": sessionData.fcm_device_token,
          //           "phoneno": sessionData.phoneno,
          //         })
          //       }
          //     ]
          //   }
          //   ).then((res)=>{
          //     console.error(res.status,plateNumber,res.camera_message)
          //     if( res?.status==200)
          //     {
          //       dataSet[uuid]["apistarted"] = true
          //     }
          //     else{
          //       dataSet[uuid]["apistarted"] = false
          //     }
               
          // })
        }; // <--- `this.result` contains a base64 data URI
        reader.readAsDataURL(blob);

      });
   
  }
 


  return (
    <TouchableOpacity
      style={{
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: color,
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 2,//uiq//mpd4cc//162023
        elevation: Platform.OS == 'android' ? 3 : 1,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <View style={{ flex: 1, }}>
          <Text style={{
            flexShrink: 1,
            marginTop: 5,
            color: "black",
            fontSize: ValueConstants.size18,
            fontFamily: Fonts.Mulish_ExtraBold
          }}>{verificationStatus.netInfo.camname}</Text>
          <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Text
               style={ styleSheet.header}>{("Plate Number : ")}</Text>
            <Text  style={{... styleSheet.value}}>{item["plateNumber"]}</Text>
          </View>

          {dataSet[uuid]["camera_message"] ?
            <View style={{ flexDirection: 'row', marginTop: 5, }}>
              <Text style={styleSheet.header}>{("Status : ")}</Text>
              <Text style={{ ...styleSheet.value, color: color, }}>{verificationStatus.camera_message ? verificationStatus.camera_message : (verificationStatus.api_message ? verificationStatus.api_message : "Something went wrong")}</Text>
            </View>
            : <ActivityIndicator
              style={{ alignSelf: 'flex-start' }} size={'large'}
              color={"black"}></ActivityIndicator>}

          {verificationStatus.type ?
            <View style={{ flexDirection: 'row', marginTop: 5, }}>
              <Text style={styleSheet.header}>{("Type : ")}</Text>
              <Text style={styleSheet.value}>{verificationStatus.type}</Text>
            </View>
            : null}
          <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Text style={styleSheet.header}>{("Scanned at : ")}</Text>
            <Text style={styleSheet.value}>{new Date(verificationStatus.capturedAt).toLocaleString()}</Text>
          </View>
          {/* <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Text
              style={styleSheet.header}>{("IsApiCalled : ")}</Text>
            <Text style={styleSheet.value}>{item["isAPIHitted"] ? "true" : "false"}</Text>
          </View> */}
        </View>

        <FastImage resizeMode={'contain'} style={{
          shadowColor: color,
          backgroundColor: 'white',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 2,//uiq//mpd4cc//162023
          elevation: Platform.OS == 'android' ? 3 : 1, minWidth: 100, minHeight: 100, marginHorizontal: 5
        }}
          source={{ uri: imageUri }}
        >
        </FastImage>
      </View>
      {isItActive ? <View style={{ flexDirection: 'row', }}>
        <Text
          style={styleSheet.header}>{"Expired at : "}</Text>
        <Text style={{ ...styleSheet.value, color: color }}>{getUTCStringFromTowTimeZoneToLocalString(verificationStatus.Expiry_date)}</Text>
      </View> : null}
      {verificationStatus.details ?
        <TouchableOpacity onPress={() => {

        }}>
          <Text style={styleSheet.header}>View Property Details</Text>
        </TouchableOpacity> : null}
      {/* {verificationStatus.camera_message || verificationStatus.api_message ?
            <TouchableOpacity style={{ marginTop: 5, }}
              onPress={() => {
                console.log(towData[plateNumber])
                return
                setShowManualModel(true)
              }}
            >
              <Text style={{
                textDecorationLine: 'underline',
                fontFamily: Fonts.Mulish_Bold,
                fontSize: ValueConstants.size20,
                color: ColorConstants.secondaryColor
              }}>
                {"Re-check Manually"}
              </Text>
            </TouchableOpacity> : null} */}
      {showManualModel ? <PlateCardManualModel
        onClosed={() => {
          setShowManualModel(false)
        }}
        item={item} {...props}>

      </PlateCardManualModel> : null}


    </TouchableOpacity>






  );
}

const styleSheet = StyleSheet.create({
  header: {
    flexShrink: 1,
    fontSize: ValueConstants.size16,
    color: '#00000090',
    fontFamily: Fonts.Mulish_Bold
  },
  value: {
    flexShrink: 1,
    fontSize: ValueConstants.size18,
    color: 'black',
    fontFamily: Fonts.Mulish_Bold
  }
})

export default PlateCardItem
