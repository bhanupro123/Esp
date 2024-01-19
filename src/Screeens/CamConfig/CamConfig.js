import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from 'react-native'
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Entypo from "react-native-vector-icons/Entypo";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import StreamItem from "./StreamItem";
import ColorConstants from "../../Utils/ColorConstants";
const CamConfig = ({ ...props }) => {
    const [gridType, setGridType] = useState(true)

    return <View style={{ flex: 1, backgroundColor: 'white' }}>

        <View style={{
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
        }}>
            {/* {cameraConfigured ? null : <Ionicons
                onPress={() => {
                    props.navigation.pop()
                }}
                color={"#ffffff"}
                name={"arrow-back-outline"}
                size={30}
                style={{ alignSelf: "center", }}

            />} */}


            <Text
                style={{
                    flex: 1,
                    marginRight: 30,
                    color: ColorConstants.primaryColor,
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size20)
                }}
            >
                Configure Cameras
            </Text>
            <Entypo
                onPress={() => {
                    setGridType(!gridType)
                }}
                color={ColorConstants.primaryColor}
                name={gridType ? "grid" : "list"}
                size={30}
                style={{ alignSelf: "center", }}
            />
        </View>

        <View style={{
            flex: 1,
            flexDirection: gridType ? "row" : 'column',
            backgroundColor: '#ffffff',
        }}>

            <StreamItem {...props} name={"Front Left"} id={0}>

            </StreamItem>
            <StreamItem  {...props} name={"Front Right"} id={1}  >

            </StreamItem>
        </View>

        <View style={{
            flex: 1,
            flexDirection: gridType ? "row" : 'column',
            backgroundColor: '#ffffff',
        }}>

            <StreamItem name={"Back Left"} id={2} {...props} >

            </StreamItem>
            <StreamItem name={"Back Right"} id={3} {...props} >

            </StreamItem>

        </View>


    </View>
}

export default withGlobalContext(CamConfig)
