import React, { useEffect, useRef, useState } from "react";
import { View, Text, } from "react-native";
import Fonts from "../../../Utils/Fonts";
import ValueConstants from "../../../Utils/ValueConstants";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInputItem from "./TextInputItem";
import FDropDown from "./FDropDown";

export default RadioButtonItem = (
  {
    enableUI = true,
    buttonsHeader = [],
    onSetSelected,
    multiline = false,
    placeholder = "",
    ...props
  },
  ref
) => {
  const [activeStatus, setActiveStatus] = useState(multiline ? ["", "", ""] : "")

  return (
    <View style={{ marginTop: 10 }}>

      {placeholder ? <Text
        style={{
          color: "#000000",
          fontFamily: Fonts.Mulish_Medium,
          fontSize: ValueConstants.size20,
          textAlignVertical: "center",
          flex: 1,
          marginTop: 5
        }}
      >
        {placeholder}
      </Text> : null}

      <View style={{
        flexDirection: 'row',
        marginBottom: 10,
        marginTop: placeholder ? 10 : 0
      }}>
        {buttonsHeader.map((item, index) => {
          return <View key={item} style={{
            flexDirection: 'row',
            flex: enableUI ? 0 : 1,
            alignItems: 'center', marginRight: 5,
          }}>
            <MaterialCommunityIcons
              size={30}
              color={"black"}
              onPress={() => {
                if (multiline) {
                  activeStatus[index] = activeStatus[index] ? "" : item
                  setActiveStatus([...activeStatus])
                  onSetSelected(activeStatus)
                  return
                }
                if (activeStatus == item) {
                  setActiveStatus("")
                  onSetSelected("")
                  return
                }
                setActiveStatus(item)
                onSetSelected(item)
              }}
              name={(multiline ? activeStatus.includes(item) : activeStatus == item) ? "checkbox-marked" : "checkbox-blank-outline"}
            >
            </MaterialCommunityIcons>
            <Text style={{
              marginLeft: 2,
              color: "black",
              fontFamily: Fonts.Mulish_Regular
            }}>{item}</Text>
          </View>
        })}
      </View>
      {enableUI && activeStatus == buttonsHeader[0] ?
        <FDropDown
          placeholder={activeStatus}
          selectedItem={""}
          {...props}
        /> : enableUI && activeStatus ? <TextInputItem
          trim={false}
          placeholder={activeStatus} {...props}
        ></TextInputItem> : null}

    </View>
  );
};
