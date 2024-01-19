import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text, } from "react-native";
import Fonts from "../../../Utils/Fonts";
import { getMandatoryColor } from "../../../Utils/Util";
import ValueConstants from "../../../Utils/ValueConstants";
import Icon from 'react-native-vector-icons/AntDesign';
import FDropDownModel from "./FDropDownModel";
import ColorConstants from "../../../Utils/ColorConstants";
import FDropDownVehicleType from "./FDropDownVehicleType";
import { handleResponse, requestPost } from "../../../Network/NetworkOperations";
import { ServiceUrls } from "../../../Network/ServiceUrls";
import TextInputItem from "./TextInputItem";
import { StringConstants } from "../../../Utils/StringConstants";

export default FDropDown = (
  {
    enteredObject = {},
    haveChild = false,
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
  const [showInner, setShowInner] = useState(0)

  return (
    <View style={{}}>

      {header ? <Text
        style={{
          color: "#000000",
          fontFamily: Fonts.Mulish_Medium,
          fontSize: ValueConstants.size20,
          paddingVertical: 10,
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
          if (modalRef.current) {
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

      <FDropDownModel
        showError={(status) => {
          setError(status)
        }}
        objKey={objKey}
        placeholder={placeholder}
        preInput={value[objKey]}
        onSelected={(item = {}) => {
          setShowInner(0)
          setValue(item);
          if (props.onChangeInnerText)
            props.onChangeInnerText("")
          if (haveChild) {
            requestPost(ServiceUrls.get_veh_models, {
              veh_make: item[objKey]
            }).then((res) => {
              if (res && res.status == 200 && res.data && Array.isArray(res.data)) {

                enteredObject.modelList = res.data
                setShowInner(1)
              }
              else {
                setShowInner(2)
              }
            })
          }
          setValue(item);
        }}
        ref={modalRef}
        {...props}
      />


      {showInner == 1 ? <FDropDownVehicleType
        header
        level={1}
        objKey={"Model"}
        placeholder="Model"
        selectedItem={""}
        {...props}
        onChangeText={(text) => {
          if (props.onChangeInnerText)
            props.onChangeInnerText(text)
        }}
        arrayData={enteredObject.modelList}
      /> : (showInner == 2 ? <TextInputItem
        header
        level={1}
        regX={StringConstants.nonOnlyAlphaNumeric}
        placeholder="Model"
        onChangeText={(text) => {
          if (props.onChangeInnerText)
            props.onChangeInnerText(text)
        }}
      /> : (haveChild ? <FDropDownVehicleType
        header
        editable={false}
        level={1}
        objKey={"Model"}
        placeholder="Model"
        selectedItem={""}
        {...props}
        onChangeText={(text) => {
          if (props.onChangeInnerText)
            props.onChangeInnerText(text)
        }}
        arrayData={enteredObject.modelList}
      /> : null))}


    </View>
  );
};
