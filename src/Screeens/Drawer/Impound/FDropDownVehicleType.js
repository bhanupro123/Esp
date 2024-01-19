import React, {  useRef, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Fonts from "../../../Utils/Fonts";
import { getMandatoryColor } from "../../../Utils/Util";
import ValueConstants from "../../../Utils/ValueConstants";
import Icon from 'react-native-vector-icons/AntDesign';
import ColorConstants from "../../../Utils/ColorConstants";
import FDropDownVehicleModel from "./FDropDownVehicleModel";

export default FDropDownVehicleType = (
  {
    editable = true,
    level = 0,
    header = false,
    showTimeZoneError,
    objKey = "",
    placeholder = "",
    ...props
  },
  ref
) => {
  const containerRef = React.useRef(null);
  const modalRef = useRef(null);
  const [value, setValue] = useState({});
  const [error, setError] = useState("");


  return (
    <View style={{}}>

      {header ? <Text
        style={{
          color: "#000000",
          fontFamily: Fonts.Mulish_Medium,
          fontSize: ValueConstants.size20,
          paddingVertical:10,
          textAlignVertical: "center",
          flex: 1,
        }}
      >
        {placeholder}
        {level ? <Text style={{
          fontFamily: Fonts.Mulish_Medium,
          fontSize: ValueConstants.size20,
          color: getMandatoryColor(level)
        }}>{level != 3 ? " *" : ""}</Text> : null}
      </Text> : null}

      <TouchableOpacity
        ref={(ref) => {
          containerRef.current = ref;
        }}
        activeOpacity={1}
        onPress={() => {
          if (modalRef.current && editable) {
            modalRef.current.refresh(value[objKey]);
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: ColorConstants.borderColor,
          borderRadius: 10,
          backgroundColor: "white"
        }}
      >
        <Text
          style={{
            color: value[objKey] ? "#000000" : ColorConstants.placeHolderColor,
            fontFamily: Fonts.Mulish_Regular,
            fontSize: ValueConstants.size18,
            padding: 10,
            alignSelf: "center", 
            textAlignVertical: "center",
            flex: 1,
          }}
        >
          {value[objKey] ? value[objKey] : "Select " + placeholder}
        </Text>
        <Icon
          name="rightcircleo"
          size={20}
          color={ColorConstants.placeHolderColor}
          style={{ marginHorizontal: 10 }}
        />

      </TouchableOpacity>

      <FDropDownVehicleModel
        showError={(status) => {
          setError(status)
        }}
        {...props}
        objKey={objKey}
        placeholder={placeholder}
        preInput={value[objKey]}
        onSelected={(item = {}) => {
          setValue(item);
        }}
        ref={modalRef}

      />





    </View>
  );
};
