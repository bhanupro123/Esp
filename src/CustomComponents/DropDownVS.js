import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, TextInput, Platform } from "react-native";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import DropDownVSModel from "./DropDownVSModel";
import DropDownVSItem from "./DropDownVSItem";
import GlobalButton from "./GlobalButton";
import { checkMisslleneousData, dropAlogintoDB, generateRandomString, renderUIByPlateNumber } from "../Utils/Util";
import { useIsFocused } from "@react-navigation/native";
import { StringConstants } from "../Utils/StringConstants";
import { handleResponse, requestPost } from "../Network/NetworkOperations";
import { ServiceUrls } from "../Network/ServiceUrls";
import DeviceInfo from "react-native-device-info";
import moment from "moment";
import Clipboard from "@react-native-clipboard/clipboard";
import ColorConstants from "../Utils/ColorConstants";

export default DropDownVS = (
  {
    showTimeZoneError,
    onSetSelected,
    placeholder = "Enter number plate",
    ...props
  },
  ref
) => {
  const globaldata = props.getContextGlobalData()
  const sessionData = globaldata.sessionData
  const towData = globaldata.towData
  const isFocused = useIsFocused()
  const containerRef = React.useRef(null);
  const modalRef = useRef(null);
  const [value, setValue] = useState("");
  const selectedValue = useRef("")
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const [showTimeZone, setshowTimeZone] = useState(showTimeZoneError)
  const [loader, setLoader] = useState(false)
  const [status, setStatus] = useState({})
  const [refresh, setRefresh] = useState(generateRandomString())
  const intervel = useRef()
  useEffect(() => { 
    setshowTimeZone(showTimeZoneError)
    if (isFocused) {
      intervel.current = setInterval(() => {
        if (selectedValue.current) {
          setRefresh(generateRandomString())
        }
      }, 2000)
    }
    else {
      if (intervel.current)
        clearInterval(intervel.current)
    }
  }, [showTimeZoneError, isFocused])
 



  const onVerifyClicked=()=>{
    let innerValue = value.toUpperCase()
    setStatus(null)
    setValue(innerValue)
    if (innerValue && innerValue.length >= 5) { 
      let statusData = renderUIByPlateNumber(towData, innerValue, false)
       if (!statusData) {
        statusData = checkMisslleneousData(towData, innerValue)
      } 
      if(!statusData.camera_message.toLowerCase().includes('active'))
      {
          setLoader(true)
          requestPost(ServiceUrls.scan_lic_plateno_by_backend,{
            session_id: sessionData.session_id,
            authentication_token: sessionData.authentication_token,
            api_key: sessionData.api_keys.get_team_members,
            "tow_company_id": sessionData.tow_company_id,
            "lic_plateno": innerValue, 
            "autoScan": "False",
            "plate_image": "",
            "app_version": Platform.OS == 'ios' ? DeviceInfo.getVersion() : DeviceInfo.getVersion() + "--" + DeviceInfo.getBuildNumber(),
            "device_type": Platform.OS,
            "device_version": DeviceInfo.getSystemVersion(),
            "device_model": DeviceInfo.getModel(),
            "device_name": DeviceInfo.getDeviceNameSync(),
            "license_plate_image": "",
            "meta_data": JSON.stringify({
                "unique_id": DeviceInfo.getUniqueIdSync(),
                "driver_name": sessionData.driver_name,
                "email": sessionData.email,
                "fcm_device_token": sessionData.fcm_device_token,
                "phoneno": sessionData.phoneno,
                "offlineData":towData[innerValue]
            })
          }).then((res)=>{
            setLoader(false) 
            if (res.status == 200) { 
              if (res.data.api_status == "success" || res.data.status == "success" || res.data.status == "warning") 
              {
                setStatus(res.data) 
                setRefresh(generateRandomString())
                // dropAlogintoDB(sessionData,res.data,innerValue)
               
              }
              else if(res.data.status=="error"){
                setStatus({camera_message:StringConstants.unauthorized})
                // dropAlogintoDB(sessionData,{
                //   camera_message:StringConstants.unauthorized
                // },innerValue)
              }
            } 
              else{
                setStatus({camera_message:StringConstants.unauthorized})
                // dropAlogintoDB(sessionData,{
                //   camera_message:StringConstants.unauthorized
                // },innerValue)
              }
                setSelected(innerValue) 
          })
      }
      else{
        setStatus(statusData)
        setSelected(innerValue)
        setRefresh(generateRandomString()) 
        dropAlogintoDB(sessionData,statusData,innerValue)
         
      }
      console.warn(status)
     
    }
    else {
      setSelected("")
      alert("Please enter min 5 char Plate number")
    }
 
  }

  return (
    <View style={{}}>
      <TouchableOpacity
        ref={(ref) => {
          containerRef.current = ref;
        }}
        activeOpacity={1}
        disabled={showTimeZoneError}

        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          borderColor: "#ccc",
          borderRadius: 10,
          backgroundColor: "white"
        }}
      >
        {/* <Text
          onPress={() => {
            if(!showTimeZoneError)
            containerRef.current.measure((x, y, width, height, pageX, pageY) => {
              if (modalRef.current) {
                modalRef.current.refresh(width, height, pageX, pageY, value);
              }
            });
          }}
          numberOfLines={1}
          style={{
            color: "#000000",
            fontSize: (ValueConstants.size22),
            padding: 10,
            borderWidth: 1,
            borderColor: "grey",
            borderRadius: 10,

            fontFamily: Fonts.Mulish_Regular,
            flex: 1,
          }}
        >
          {value ? value : placeholder}
        </Text> */}

        <TextInput
          editable={!showTimeZoneError&&!loader}
          placeholder={placeholder}
          placeholderTextColor={"grey"}
          value={value}
          autoCapitalize={'characters'}
          onChangeText={async (text) => {
            text = text.trim()
            if (!StringConstants.nonOnlyAlphaNumeric.test(text)) {
              setValue(text)
              setSelected("")
            }
          }}
          style={{
            color: "#000000",
            fontSize: (ValueConstants.size22),
            padding: 10,
            borderWidth: 1,
            borderColor: "grey",
            borderRadius: 10,
            margin: 0, minHeight: 45,
            flex: 1,
          }}
        >

        </TextInput>
         
         {loader?<ActivityIndicator style={{marginHorizontal:10}} color={ColorConstants.secondaryColor} size={'large'}></ActivityIndicator>: <GlobalButton
          timeout={100}
          onPress={() => { onVerifyClicked()}}
          style={{ minHeight: 50, marginLeft: 10, marginVertical: 0 }} minHeight={40} title="Verify"
        ></GlobalButton>}

       
      </TouchableOpacity>
      {/* {error ? <Text style={{
        color:   "red",
        fontSize: (ValueConstants.size18),
        paddingHorizontal: 10,
        alignSelf: "center", 
        textAlignVertical: "center",
        fontFamily: Fonts.Mulish_Bold,
        flex: 1,
      }}>{error}</Text> : null} */}




      <DropDownVSItem
        status={status}
        selected={selected}


        {...props}></DropDownVSItem>
      {/* <DropDownVSModel
        setErrorMsgColor={
          (status) => {
            setErrorMsgColor(status)
          }
        }
        showError={(status) => {
          setError(status)
        }}
        placeholder={placeholder}
        preInput={value}
        onSelected={(item = "") => { 
          selectedValue.current=item
          setSelected(item)
          onSetSelected(item)
        }}
        onPressed={async (value) => { 
selectedValue.current=value
           setSelected(value)
          setValue(value);
        }}
        ref={modalRef}
        {...props}
      /> */}
    </View>
  );
};
