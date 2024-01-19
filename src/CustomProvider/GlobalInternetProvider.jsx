import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import ReactNativeModal from "react-native-modal";
import ValueConstants from "../Utils/ValueConstants";
import Fonts from "../Utils/Fonts";
import ColorConstants from "../Utils/ColorConstants";

 export default GlobalInternetProvider = forwardRef(({ ...props }, ref) => {
  const [visible, setVissible] = useState(false);
  const [value, setValue] = useState("You are offline. Please connect to internet");
  

  useImperativeHandle(ref, () => ({
    alertConfig(visiblity = false) {
          setVissible(visiblity)
    },
    setValueOfAlert(value = "") {
          setValue(value)
    },
  }));
  return visible?  <View
      style={{
        position:'absolute',
        flex: 1,
         width:'100%',
         height:"100%",
         alignItems:'center',
         backgroundColor:'white'
      }} 
      backdropOpacity={0.9}
       
    >
      <View
        style={{
         flex:1, 
         alignItems:'center',
         justifyContent:'center',
          borderRadius: 10,
        }}
      >
        <Text  style={{
              fontSize: ValueConstants.size20,
              color: ColorConstants.primaryColor,
              alignSelf: "center",
              paddingBottom: 10, 
              fontFamily: Fonts.Mulish_Bold,
            }}
          >{value}</Text>
          <ActivityIndicator size={'large'} color={ColorConstants.primaryColor}></ActivityIndicator>
      </View>
    </View>:null
 
});
 
