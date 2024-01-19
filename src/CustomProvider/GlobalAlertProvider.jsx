import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ReactNativeModal from "react-native-modal";
import ValueConstants from "../Utils/ValueConstants";
import Fonts from "../Utils/Fonts";
import ColorConstants from "../Utils/ColorConstants";

const GlobalAlertByProvider = forwardRef(({ ...props }, ref) => {
  const [visible, setVissible] = useState(false);
  const [value, setValue] = useState("");
  const optionsObject = useRef({
    cancel: true,
    type: "Info",
    value: "",
    navigation: null,
    apiStatus: null,
    buttons: ["OK"],
    callBacks: null,
  });

  useImperativeHandle(ref, () => ({
    alertConfig(visiblity = false, obj) {
      if (obj) {
        optionsObject.current.cancel = true
        optionsObject.current = { ...optionsObject.current, ...obj };
        setValue(value);
        setVissible(visiblity);
      }
    },
  }));
  return visible ? (
    <ReactNativeModal
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        margin: 0,
      }}
      onBackButtonPress={() => {
        if (optionsObject.current.cancel) {
          setVissible(false)
        }
      }}
      onBackdropPress={() => {
        if (optionsObject.current.cancel) {
          setVissible(false)
        }
      }}
      backdropOpacity={0.5}
      isVisible
    >
      <View
        style={{
          width: "80%",
          backgroundColor: ColorConstants.white,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ padding: 30 }}
          onPress={() => {
            if (optionsObject.current.cancel) {
              setVissible(false);
            }
          }}
        >

          <Text
            style={{
              fontSize: ValueConstants.size20,
              color: ColorConstants.primaryColor,
              alignSelf: "center",
              paddingBottom: 10,
              color:
                ColorConstants.primaryColor,
              fontFamily: Fonts.Mulish_Bold,
            }}
          >
            {optionsObject.current.type}
          </Text>
          <Text
            style={{
              fontSize: ValueConstants.size22,
              fontFamily: Fonts.Mulish_SemiBold,
              color: "black",
              paddingHorizontal: 20,
              justifyContent: "center",
              alignSelf: "center",
              textAlign: "center",
            }}
          >
            {optionsObject.current.value}
          </Text>
        </TouchableOpacity>
        {optionsObject.current.buttons &&
          optionsObject.current.buttons.length > 0 ? (

          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              justifyContent: "space-evenly"
            }}
          >
            {optionsObject.current.buttons.map((option, index) => {
              return (
                <TouchableOpacity key={index}
                  activeOpacity={1}
                  style={{
                    alignSelf: "center",
                    backgroundColor: ColorConstants.secondaryColor,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    setVissible(false);
                    try {
                      let callBack = optionsObject.current.callBacks[index];
                      if (callBack) {
                        callBack();
                      } else {
                        setVissible(false);
                      }
                    } catch (e) { }
                  }}
                >
                  <Text
                    style={{
                      fontSize: ValueConstants.size18,
                      fontFamily: Fonts.Mulish_Black,
                      color: "white",
                      padding: 10,
                      minWidth: 100,
                      justifyContent: "center",
                      alignSelf: "center",
                      textAlign: "center",
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>

              );
            })}
          </View>

        ) : null}
      </View>
    </ReactNativeModal>
  ) : null;
});
export default GlobalAlertByProvider;
