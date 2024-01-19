import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import DrawerHolder from "./DrawerHolder";
import moment from "moment-timezone";
import { generateRandomColor, generateRandomString } from "../../Utils/Util";
const RenderItem = ({ index,item}) => { 
 useEffect(()=>{
console.log(item,index)
 },[])
    return <View style={{
        width: '100%',
        height: 40,
        marginBottom: 10,
        backgroundColor: generateRandomColor()
             }}>
                <Text style={{color:'white',backgroundColor:'black'}}>{item}</Text>
          </View>
}

export default  RenderItem
