import { withGlobalContext } from "../../CustomProvider/CustomProvider"
import { View, Text, ScrollView } from 'react-native'
import Fonts from "../../Utils/Fonts"
import ValueConstants from "../../Utils/ValueConstants"
import FastImage from "react-native-fast-image";
import ColorConstants from "../../Utils/ColorConstants";
import { useEffect, useState } from "react";
import Header from "../../CustomComponents/Header";
import { handleResponse, requestPost } from "../../Network/NetworkOperations";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { ServiceUrls } from "../../Network/ServiceUrls";
import { getFontSize } from "../../Utils/Util";
const DetailsProperty = ({ ...props }) => {
  const [input, setInput] = useState([])
  const globaldata = props.getContextGlobalData()
  const [rules, setRules] = useState(null)

  const [acstatus, setacstatus] = useState("")
  useEffect(() => {
    props.loader(true)
    requestPost(ServiceUrls.get_property_search_data, {
      session_id: globaldata.sessionData.session_id,
      authentication_token: globaldata.sessionData
        .authentication_token,
      api_key:
        globaldata.sessionData.api_keys
          .get_team_members,
      tow_company_id: globaldata.sessionData.tow_company_id,
      property_id: props.route.params.prop_id
    }).then((res) => {
      props.loader(false)
      res = handleResponse(props, res)
      if (res) {
        console.log(res)
        setRules(res)

      }
    })


  }, [])
  const renderGrid = (marix = 2) => {
    return rules.parking_rules.map((item, index) => {
      // return <Text>{JSON.stringify(item)}</Text>
      if (index % marix == 0) {
        return <View key={index + item} style={{
          margin: 10,
          //shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          // shadowRadius: 5,
          elevation: 10,
          flexDirection: index % marix == 0 ? "row" : "column"
        }}>
          {Array.from(Array(marix).keys()).map((item, indexx) => {
            item = rules.parking_rules[index + indexx]
            if (index % marix == 0 && rules.parking_rules[index + indexx]) {
              return <View key={index + indexx}
                style={{
                  flex: 1,
                  elevation: 4,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  margin: 3,
                }}>
                <FastImage
                  resizeMode="contain"
                  style={{
                    width: '100%',
                    height: 150
                  }} source={{ uri: item.Rule_icon }}></FastImage>
                <Text style={{
                  alignSelf: 'center',
                  marginVertical: 10,
                  color: ColorConstants.secondaryColor,
                  fontFamily: Fonts.Mulish_Bold,
                  fontSize: getFontSize(ValueConstants.size20)
                }}>{item.Rule_label}</Text>
              </View>
            }

          })
          }
        </View>
      }
    })
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{

        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#1A1E36',
        alignItems: 'center',
      }}>
        <DrawerHolder {...props} back ></DrawerHolder>
        <Text
          style={{
            flex: 1,
            color: "white",
            fontFamily: Fonts.Mulish_SemiBold,
            fontSize: getFontSize(ValueConstants.size24),
            textAlign: 'center',
            marginRight: 30
          }}>
          Property Details
        </Text>

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
          fontSize: getFontSize(ValueConstants.size20)
        }}
      >
        Logged in as {globaldata?.sessionData?.driver_name}
      </Text>

      <ScrollView style={{ flex: 1, }}>


        <View style={{
          backgroundColor: '#FFFFFF',
          margin: 10
        }}>
          <View style={{
            flexDirection: 'row',
            marginTop: 5,
           
          }}>
            <MaterialIcons name='apartment' size={30} color={'#FFAC1C'} />

            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              Property
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.property_data[0]?.Prop_name}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'

          }}>
            <MaterialCommunityIcons name='briefcase-account' size={30} color={'#FFAC1C'}>
            </MaterialCommunityIcons>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              Account Type
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.property_data[0]?.account_type?rules.property_data[0].account_type : '-'}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            marginTop: 20,
           
          }}>
            <Entypo name='location-pin' size={30} color={'#FFAC1C'}>
            </Entypo>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black",
              
            }}>
              Address
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.paid_parking_info?.address}
            </Text>
          </View>


          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'

          }}>
            <Entypo name='users' size={30} color={'#FFAC1C'}>
            </Entypo>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              Rent Rolls
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.rentrolls_count}
            </Text>
          </View>


          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'

          }}>
            <MaterialCommunityIcons name='counter' size={30} color={'#FFAC1C'}>
            </MaterialCommunityIcons>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              Spaces
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.property_data[0]?.total_no_of_spcaes}
            </Text>
          </View>


          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'

          }}>
            <MaterialIcons name='do-not-touch' size={30} color={'#FFAC1C'}>
            </MaterialIcons>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              DNT Limit
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.property_data[0]?.dnt_limit}
            </Text>
          </View>


          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'

          }}>
            <MaterialIcons name='money-off' size={30} color={'#FFAC1C'}>
            </MaterialIcons>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black"
            }}>
              NCR Limit
            </Text>
            <Text style={{
              flex: 1,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "black"
            }}>
              {rules?.property_data[0]?.ncr_limit}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row',
            marginTop: 20,
            alignItems: 'center'
          }}>
            <MaterialCommunityIcons name='account-check' size={30} color={'#FFAC1C'}>
            </MaterialCommunityIcons>
            <Text style={{
              marginHorizontal: 10,
              flex: 0.5,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size22),
              color: "black",
              
            }}>
              Status
            </Text>

            <View style = {{ 
              flex : 1
            }}>
            <Text style={{
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size20),
              color: "#fff",
              paddingHorizontal : 10,
              alignSelf : 'flex-start',
              backgroundColor: rules && rules.property_data[0] && rules.property_data[0].account_status && rules.property_data[0].account_status == '1' ? 'green' : 'red',
            }}>
              {
               rules && rules.property_data[0] && rules.property_data[0].account_status && rules.property_data[0].account_status == '1' ? 'ACTIVE' : 'INACTIVE'
              }
            </Text>
            </View>
          </View>

        </View>

        <Text style={{
          margin: 10,
          color: ColorConstants.secondaryColor,
          fontFamily: Fonts.Mulish_Bold,
          fontSize: ValueConstants.size22
        }}>Parking Rules</Text>

        {rules?.parking_rules && renderGrid()}


        {rules?.extra_notes?.extra_parking_rules_notes ?
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{
              marginVertical: 5,
              color: ColorConstants.secondaryColor,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size20)
            }}>Extra Notes</Text>
            <Text style={{
              marginVertical: 2,
              color: ColorConstants.primaryColor,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20)
            }}>{rules.extra_notes.extra_parking_rules_notes}</Text>
          </View> : null}
        {rules?.driver_private_notes?.driver_private_notes ?
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <Text style={{
              marginVertical: 5,
              color: ColorConstants.secondaryColor,
              fontFamily: Fonts.Mulish_Bold,
              fontSize: getFontSize(ValueConstants.size20)
            }}>Driver Private Notes</Text>
            <Text style={{
              marginVertical: 2,
              color: ColorConstants.primaryColor,
              fontFamily: Fonts.Mulish_SemiBold,
              fontSize: getFontSize(ValueConstants.size20)
            }}>{rules.driver_private_notes.driver_private_notes}</Text>
          </View> : null}
        <View style={{ padding: 30 }}></View>
      </ScrollView>


    </View>
  )
}

export default withGlobalContext(DetailsProperty)
