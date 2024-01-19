import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ColorConstants from "../Utils/ColorConstants";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getColorByMessage, getUTCStringFromTowTimeZoneToLocalString, renderUIByPlateNumber } from "../Utils/Util";
import { StringConstants } from "../Utils/StringConstants";
import { TouchableOpacity } from "react-native";
import ScreenNames from "../Utils/ScreenNames";

export default DropDownVSItem = (
  {
    selected,
    status,
    ...props
    
  },
  ref
) => {
  if(!selected||!status)
  {
return null
  }

  
  let color = getColorByMessage(status.camera_message) 
  if (!status.camera_message.toLowerCase().includes("authorized"))
    return  <View style={{  padding:10, margin: 20, }}>
 
{status?.type?.toLowerCase().includes("dnt")&&status?.camera_message?.toLowerCase()?.includes("active")?
         <View style={{ marginBottom: 20,alignItems:'center'}}> 
         <Text style={{...styles.value,fontFamily:Fonts.Mulish_Bold,fontSize:ValueConstants.size28,color:'red'}}>{"DO NOT TOW!"}</Text>
         </View>:null}
 
     
<View style={{ paddingVertical:10,  backgroundColor: color, borderRadius: 10 }}>




        <View style={{ marginVertical: 5, flexDirection: 'row' }}>
        <Text style={styles.header}>{"Status: "}</Text>
        <Text style={styles.value}>{status.camera_message}</Text>
        </View>
        <View style={{ marginVertical: 5, flexDirection: 'row' }}>
        <Text style={styles.header}>{"Type: "}</Text>
        <Text style={styles.value}>{status?.type?.toUpperCase()}</Text>
        </View>


        <View style={{ marginVertical: 5, flexDirection: 'row' }}>
          <Text style={styles.header}>{"Plate No: "}</Text>
          <Text style={styles.value}>{selected}</Text>
        </View>

        {status.camera_message.toLowerCase().includes("expired") ? <View style={{ marginVertical: 5, flex: 1 }}>
          <Text style={styles.header}> {"Expired at: "}</Text>
          <Text style={styles.value}>{getUTCStringFromTowTimeZoneToLocalString(status.Expiry_date)}</Text>
        </View>
          : ""}
          
        {status.camera_message.toLowerCase().includes("active") ? <View style={{ marginVertical: 5, flex: 1, }}>
          <Text style={styles.header}>{"Active Till: "}</Text>
          <Text style={styles.value}>{getUTCStringFromTowTimeZoneToLocalString(status.Expiry_date)}</Text>
        </View>
          : ""}
 <View style={{ marginVertical: 5, flex: 1 }}>
          <Text style={styles.header}>{"Scanned at: "}</Text>
          <Text style={styles.value}>{new Date().toLocaleString()}</Text>
        </View>
</View>
        {/* <TouchableOpacity 
        onPress={()=>{
          props.navigation.push(ScreenNames.History,{plateNumber:selected})
        }}
        style={{ marginVertical: 5}}>
          <Text style={{...styles.header,textDecorationLine:'underline'}}>{"Show History: "}</Text> 

        </TouchableOpacity> */}
        
    </View>

  return <View style={{marginVertical:20}}>
   
      <Text style={{
    color: 'red',
    alignSelf:'center',
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_Bold,
    paddingHorizontal: 10,
    marginVertical: 5,
    textAlign:'center',
  }}>{StringConstants.unauthorized}</Text>
   <Text style={{
    color: 'red',
    alignSelf:'center',
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_Bold,
    paddingHorizontal: 10, 
    marginVertical: 5,
    textAlign:'center',
  }}>{"Scanned at: "}{new Date().toLocaleString()}</Text>

{/* <TouchableOpacity 
        onPress={()=>{
          props.navigation.push(ScreenNames.History,{plateNumber:selected})
        }}
        style={{ marginVertical: 5}}>
          <Text style={{ textAlign:'center',textDecorationLine:'underline'}}>{"Show History: "}</Text> 

        </TouchableOpacity> */}
  </View>




}

const styles = StyleSheet.create({
  header: {
    color: 'white', 
    flex:1,
    fontSize: (ValueConstants.size18),
    fontFamily: Fonts.Mulish_ExtraBold,
    paddingHorizontal: 10,
  },
  value: {
    color: 'white',
    flexShrink: 1,
    flex:1,
    fontSize: (ValueConstants.size20),
    fontFamily: Fonts.Mulish_Bold,
    paddingHorizontal: 10,
  }
})



