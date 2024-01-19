import React, { useState } from "react";
import { View, Text, FlatList, Button } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import { withGlobalContext } from "../../CustomProvider/CustomProvider";
import Fonts from "../../Utils/Fonts";
import ValueConstants from "../../Utils/ValueConstants";
import DrawerHolder from "./DrawerHolder";
import moment from "moment-timezone";
import { generateRandomColor, generateRandomString } from "../../Utils/Util";
import RenderItem from "./RenderItem";
const Team = ({ ...props }) => {
    const [data, setData] = useState([1])

    return <View style={{ flex: 1, backgroundColor: 'white' }}>
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
                    color: "white",
                    fontFamily: Fonts.Mulish_SemiBold,
                    fontSize: (ValueConstants.size18)
                }}
            >
                {props.route.name}
            </Text>
            <Ionicons
                accessible={true}
                color={"#ffffff"}
                testID={"searchCancelButton"}
                accessibilityLabel={"searchCancelButton"}
                name={"settings"}
                size={30}
                style={{ alignSelf: "center", }}

            />
        </View>
        <FlatList data={data} style={{ flex: 1 }}
            renderItem={({ item, index }) => {
                return <RenderItem key={index} index={index} item ={item}></RenderItem>
            }}
        >
        </FlatList>
        <Button title="press me" onPress={() => {
            setData([...data, generateRandomString()])
        }}>
        </Button>
    </View>
}

 

export default withGlobalContext(Team)
