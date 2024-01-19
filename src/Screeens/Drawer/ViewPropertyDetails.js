import React, { useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import DrawerHolder from "./DrawerHolder";
import { getFontSize, getStoragePref, showAlertWithValue } from "../../Utils/Util";
import SearchableDropDown from "../../CustomComponents/SearchableDropDown";
import { AsynKeys } from "../../Utils/StringConstants";
import { handleResponse, requestPost } from "../../Network/NetworkOperations";
import { ServiceUrls } from "../../Network/ServiceUrls";
import ScreenNames from "../../Utils/ScreenNames";
const ViewPropertyDetails = ({ ...props }) => {
  const [searchValue, setSearchValue] = useState("")
  const temp = useRef("")
  const globaldata = props.getContextGlobalData()
  const [data, setData] = useState([])


  const handleRowPress = async (Prop_id) => {
    props.navigation.push(ScreenNames.DetailsProperty ,{prop_id : Prop_id} )
  }



  const onSearch = async (text) => {
    let payload = {
      session_id: globaldata.sessionData.session_id,
      authentication_token: globaldata.sessionData.authentication_token,
      api_key: globaldata.sessionData.api_keys.verify_otp,
      tow_company_id: globaldata.sessionData.tow_company_id,
      search_term: text
    }
    console.log(payload)
    console.log("----------" + ServiceUrls.search_property)
    if(text.length && text.length % 2 == 0 ){
    

    requestPost(ServiceUrls.search_property, payload).then((response) => {
     
      response = handleResponse(props, response)

      console.warn("text: "+ text + "  dvhdvh  " + temp.current)
      if (response && text == temp.current) {

        if (response.status == 'warning'){
          showAlertWithValue(props, response.message)
          setData([])
        }else{
          setData(response.properties)
        }

        console.log(JSON.stringify(response) + "fgbfgnjkn")

         
      }
    }
   
    )
 
  } 
  }

  const Item = (item) => {
    return (
      <TouchableOpacity onPress={() => handleRowPress(item.Prop_id)}>
        <View style={{
          borderColor: 'gray',
          borderBottomWidth: 1.5,
          borderLeftWidth: 1.5,
          borderRightWidth: 1.5,
          padding: 13,
          marginHorizontal : 20,
        }}>
          <Text style={{
             fontSize: getFontSize(ValueConstants.size20),
            color: '#000',
            fontFamily : Fonts.Mulish_Medium
          }}>{item.Prop_name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, }}>
      
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
            flex : 1,
            color: "white",
            fontFamily: Fonts.Mulish_SemiBold,
            fontSize: getFontSize(ValueConstants.size24),
            textAlign: 'center',
            marginRight: 30
          }}>
          Property Search
        </Text>
        {/* <Ionicons
          accessible={true}
          color={"#ffffff"}
          testID={"searchCancelButton"}
          accessibilityLabel={"searchCancelButton"}
          name={"settings"}
          size={30}
          style={{ alignSelf: "center", }} /> */}
      </View>
      <Text
            style={{
                backgroundColor: 'white',
                color: ColorConstants.secondaryColor,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
                textAlign: 'center',
                 marginTop : 10,
                fontFamily: Fonts.Mulish_Bold,
                fontSize: getFontSize(ValueConstants.size18)
            }}
        >
            Logged in as {globaldata?.sessionData?.driver_name}
        </Text>
      <View style={{
        width: "100%",
        flex: 1,
         
        backgroundColor: '#fff'
      }}>
        <View style={{
           marginHorizontal : 20,
          marginTop: 10,
          alignSelf: 'center',
          borderRadius: 5,
          borderColor: 'gray',
          borderWidth: 2,
          flexDirection: 'row',
        }}>
          <TextInput style={{
            flex: 1,
            height: 50,
            marginHorizontal: 13,
            borderRadius: 5,
            borderBlockColor: 'gray',
            fontSize: getFontSize(ValueConstants.size20),
            fontFamily: Fonts.Mulish_Medium
          }}
            value={searchValue}
            color='black'
            placeholderTextColor={'gray'}
            placeholder="Property Search..."
            onChangeText={(text) => {
              temp.current = text
              setSearchValue(text)
              onSearch(text)
              if(text.length == 0){
                setData([])
              }
            }
          }
          >
          </TextInput>
          <TouchableOpacity style={{
            backgroundColor: '#1A1E36',
            justifyContent: 'center',
            width: 35,
            
          }} 
          onPress={()=>onSearch(searchValue)}
          
          >
            <FontAwesome style={{
              alignSelf: 'center',
            }} name="search" size={20} color={'#fff'}>
            </FontAwesome>
          </TouchableOpacity>
        </View>

 
          <FlatList
            style={{
             flex : 1,

            }}
            data={data}
            renderItem={({ item }) => <Item   {...item} />}
            
            keyExtractor={item => item.Prop_id}
          />
      
      </View>
    </View>
  )
}

export default withGlobalContext(ViewPropertyDetails)
