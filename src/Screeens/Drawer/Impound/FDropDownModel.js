import React, {
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  SafeAreaView
} from "react-native";
import ReactNativeModal from "react-native-modal";
import ColorConstants from "../../../Utils/ColorConstants";
import Fonts from "../../../Utils/Fonts";
import { generateRandomString, } from "../../../Utils/Util";
import ValueConstants from "../../../Utils/ValueConstants";
import AntDesign from "react-native-vector-icons/AntDesign";
export default FDropDownModel = forwardRef(
  (
    {
      onSelected,
      objKey = "damn",
      idKey = "damn",
      arrayData = [],
      placeholder = "Username",
      showError,
      preInput = "",
      ...props
    },
    reff
  ) => {
    const [isVisible, setIsVissible] = useState(false);
    const [result, setResults] = useState(arrayData ? arrayData : []);
    const [input, setInput] = useState(preInput);
    const [selectedInput, setSelectedInput] = useState({ data: "" })
    const ref = useRef();
    useImperativeHandle(reff, () => ({
      refresh(data = "") {
        selectedInput.data = data
        setInput("")
        setIsVissible(true)
        setResults(arrayData)
        setTimeout(() => {
          ref.current.focus();
        }, 400);
      },
    }));


    return (
      <ReactNativeModal
      ref={(ref)=>{  
        if(props?.mainModelRef)
        props.mainModelRef.current=ref
    }} 
    onModalWillHide={()=>{
      setIsVissible(false);
    }}
        transparent
        style={{ margin: 0, backgroundColor: 'white' }}
        visible={isVisible}
        onRequestClose={() => {
          setIsVissible(false);
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: "row",
              borderColor: '#cce',
              marginVertical: 10,
              padding: 10,
              borderBottomWidth: 1,
              paddingBottom: 10,
              alignItems: "center",
            }}
          >
            <AntDesign
              onPress={() => {
                setIsVissible(false)
              }}
              accessible={true}
              color={"#000000"}
              testID={"searchCancelButton"}
              accessibilityLabel={"searchCancelButton"}
              name={"arrowleft"}
              size={30}
              style={{ alignSelf: "center", marginRight: 10, }}
            />
            <TextInput
              ref={ref}
              maxLength={12}
              autoCapitalize={'characters'}
              onChangeText={(text) => {
                setInput(text)
                if (text) {
                  let filterData = arrayData.filter((item) => {
                    return item[objKey].toLowerCase().includes(text.toLowerCase())
                  })
                  setResults(filterData)
                }
                else {
                  setResults(arrayData)
                }
              }}

              placeholderTextColor={"grey"}
              placeholder={"Search " + placeholder}
              style={{
                borderWidth: 1,
                marginRight: 5,
                paddingVertical: 10,
                borderRadius: 10,
                color: "#000000",
                borderColor: '#cce',
                fontSize: (ValueConstants.size18),
                paddingHorizontal: 10,
                alignSelf: "center",
                textAlignVertical: "center",
                fontFamily: Fonts.Mulish_Regular,
                flex: 1,
              }}
              value={input}
            ></TextInput>

            <AntDesign
              onPress={() => {
                setInput("")
              }}
              accessible={true}
              color={"#000000"}
              testID={"searchCancelButton"}
              accessibilityLabel={"searchCancelButton"}
              name={"close"}
              size={25}
            />
          </View>
          {result.length ? (
            <ScrollView
              keyboardShouldPersistTaps={"handled"}
              style={{
                borderRadius: 5,
                borderColor: ColorConstants.primaryColor,
                backgroundColor: "white",
              }}
            >
              {result.map((item, index, key) => {
                return (
                  <TouchableOpacity
                    key={generateRandomString()}
                    accessible={true}
                    testID={"onpressedbutton"}
                    accessibilityLabel={"onpressedbutton"}
                    onPress={() => {
                      setInput(item[objKey])
                      ref.current.blur();
                      setIsVissible(false);
                      onSelected(item)
                      if (props.onChangeText)
                        props.onChangeText(item[objKey], item[idKey])
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          marginHorizontal: 8,
                          paddingVertical: 10,
                          color: "black",
                          textAlignVertical: "center",
                          fontSize: item[objKey] == selectedInput.data ? ValueConstants.size20 : ValueConstants.size18,
                          fontFamily: item[objKey] == selectedInput.data ? Fonts.Mulish_Medium : Fonts.Mulish_Light,
                        }}
                      >
                        {item[objKey]}
                      </Text>

                    </View>

                    <View
                      style={{
                        height: 2,
                        width: "100%",
                        backgroundColor: "#ccc"
                      }}
                    ></View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : null}

        </SafeAreaView>
      </ReactNativeModal>
    );
  }
);
