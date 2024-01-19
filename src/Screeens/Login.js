import React, { useEffect, useState } from "react";
import { TouchableOpacity, ScrollView, View, Text, SafeAreaView, StatusBar, TextInput } from 'react-native'
import FastImage from 'react-native-fast-image';
import ImagesWrapper from '../Utils/ImagesWrapper';
import ColorConstants from "../Utils/ColorConstants";
import LoginForm from "./LoginForm";
import { withGlobalContext } from "../CustomProvider/CustomProvider";
import useWebSocket from "react-native-use-websocket";
import ValueConstants from "../Utils/ValueConstants";
import Fonts from "../Utils/Fonts";
import Toast from "react-native-simple-toast"
import GlobalButton from "../CustomComponents/GlobalButton";
const Login = ({ ...props }) => {

  const socketUrl = ("ws://192.168.4.1:80/");
const [input,setInput]=useState("")
   const [motorStatus,setMotorStatus]=useState()
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
    onOpen:()=>{
       Toast.show("opened")
    },
    onError:(e)=>{
      console.error(e)
      Toast.show("error")
    },
    onMessage:(msg)=>{
      console.warn(msg)
        
        if(msg.data=="on")
        {
         setMotorStatus("on")
      }
     else if(msg.data=="off")
        {
          setMotorStatus("off")
      }
      Toast.show("onmessage")
    },
    onClose:()=>{
      Toast.show("onClose")
    },
    onReconnectStop:()=>{
      Toast.show("onReconnectStop")
    },reconnectInterval:3000,
    reconnectAttempts:1000,
  });
  const sendM = (msg) => {
    try {
      sendMessage(msg.toLowerCase())
    } catch (error) {
      alert(error.message)
    }
  };

  return <SafeAreaView style={{flex:1}}> 
  <StatusBar  barStyle={'light-content'}></StatusBar>
   < View style={{
    flex: 1,
    padding:10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: ColorConstants.primaryColor,
  }}  
  >
   

<GlobalButton style={{
  minWidth:100,
  minHeight:100,
  borderRadius:999, 
  backgroundColor:motorStatus=="on"?"green":"red"}}
title="status" 
onPress={()=>{
    
    sendM(motorStatus=="on"?"off":"on")
    
}}
>

</GlobalButton>


  </View>
  </SafeAreaView>
}

export default withGlobalContext(Login)