import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, TextInput, Text } from "react-native";
import SearchableDropDownModel from "./SearchableDropDownModel";
import { getFontSize } from "../Utils/Util";
import Fonts from "../Utils/Fonts";
export default SearchableDropDown = (
  {
    placeholder = "Property Search...",
    isItError = false,
    errorText = "Something went wrong",
    onSelected,
    initialValue = "",
    index = 1,
    fromWhere = "LoginScreens",
    errorPressed,
    ...props
  },
  ref
) => {
  const containerRef = React.useRef(null);
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(isItError);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const handleDisplayError = (boolean) => {
    setError(boolean);
  };
  return (
    <View style={{  }}>
      <TouchableOpacity
        ref={(ref) => {
          containerRef.current = ref;
        }}
        activeOpacity={1}
        disabled={
          fromWhere == "LoginPackageScreen" && value != "" ? true : false
        }
        accessible={true}
        testID={"onpressedbutton"}
        accessibilityLabel={"onpressedbutton"}
        onPress={() => {
          containerRef.current.measure((x, y, width, height, pageX, pageY) => {
            if (modalRef.current) {
              modalRef.current.refresh(width, height, pageX, pageY, value);
            }
          });
        }}
        style={{
           
          flexDirection: "row",
          borderRadius: 10,
          borderWidth: 1,
          borderRadius: 3,
          marginBottom: 10,
          marginTop : 20,
          minHeight: 40,
          
          padding: 0,
          fontSize: getFontSize(15),
          fontFamily: Fonts.Mulish_Black,
          backgroundColor: "#faf9fe",
          paddingHorizontal: 10,
          color: '#445C92',
          borderColor: '#d3d6d9',
          paddingHorizontal: 0,
          backgroundColor: '#faf9fe',
        }}
      >
        <Text
          style={{
            marginLeft: 20,
            textAlign: "left",
            color: value ? '#445C92' : "#707070",
            height: 40,
            paddingVertical: 9,
            paddingHorizontal: 10,

            flex: 1,
            fontSize: getFontSize(15),
            fontFamily: Fonts.Mulish_Black,
            textAlignVertical: "center",
          }}
        >
          {value ? value : placeholder}
        </Text>
      </TouchableOpacity>

      <SearchableDropDownModel
        placeholder={placeholder}
        preInput={value}
        fromWhere={fromWhere}
        displayError={handleDisplayError}
        onPressed={async (value) => {
          setValue(value);
          props.onValueChange(value);
        }}
        ref={modalRef}
        {...props}
      ></SearchableDropDownModel>
    </View>
  );
};
