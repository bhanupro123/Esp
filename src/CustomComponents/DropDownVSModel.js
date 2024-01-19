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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import ColorConstants from "../Utils/ColorConstants";
import Fonts from "../Utils/Fonts";
import ValueConstants from "../Utils/ValueConstants";
import { requestPost } from "../Network/NetworkOperations";
import { ServiceUrls } from "../Network/ServiceUrls";
import { StringConstants } from "../Utils/StringConstants";
import GlobalButton from "./GlobalButton";
export default DropDownVSModel = forwardRef(
  (
    {
      setErrorMsgColor,
      onPressed,
      onSelected,
      placeholder = "Username",
      showError,
      preInput = "",
      ...props
    },
    reff
  ) => {
    const [isVisible, setIsVissible] = useState(false);
    const [margin, setMargin] = useState(0);
    const [alignTop, setAlignTop] = useState(false);
    const [alignBottom, setAlignBottom] = useState(false);
    const [maxHeight, setMaxHeight] = useState(null);
    const [marginLeft, setMarginLeft] = useState(0);
    const [result, setResults] = useState([]);
    const [input, setInput] = useState(preInput);
    const enteredText = useRef("");
    const [showLoader, setShowLoader] = useState(false)
    const ref = useRef();

    useImperativeHandle(reff, () => ({
      refresh(width, height, pageX, pageY, data, show = true) {
        setAlignTop(true);
        setAlignBottom(false);
        setMargin(pageY);
        setIsVissible(show);
        setMarginLeft(width);
        setMaxHeight(height);
        setInput("")
        if (show)
          setTimeout(() => {
            ref.current.focus();
            setInput(input)
          }, 100);
      },
    }));



    return (
      <ReactNativeModal
      ref={(ref)=>{  
        if(props?.mainModelRef)
        props.mainModelRef.current=ref
    }} 
    onModalWillHide={()=>{
        setIsVissible(false) 
    }}
        transparent
        style={{ margin: 0 }}
        visible={isVisible}
        onRequestClose={() => {
          setIsVissible(false);
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : null}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: "100%",
              flex: 1,
              alignItems: "flex-start",
            }}
            accessible={true}
            testID={"onpressedbutton1"}
            accessibilityLabel={"onpressedbutton1"}
            onPress={() => {
              setIsVissible(false);
            }}
          >
            <TouchableOpacity
              accessible={true}
              testID={"onpressedbutton2"}
              accessibilityLabel={"onpressedbutton2"}
              onPress={() => {
                setIsVissible(false);
              }}
              activeOpacity={1}
              style={{
                flex: 1,
                width: "100%",
                bottom: alignBottom ? margin : "auto",
                top: alignTop ? margin : "auto",
                position: "absolute",
                maxHeight: 300,
              }}
            >
              <View
                style={{
                  backgroundColor: 'white',
                  width: marginLeft,
                  marginLeft: 21,
                  flexDirection: "row",
                  paddingHorizontal: 0,
                  alignItems: "center",
                  borderRadius: 10,
                }}
              >
                <TextInput
                  ref={(reff) => {
                    ref.current = reff;
                  }}
                  maxLength={12}
                  autoCapitalize={'characters'}
                  onChangeText={async (text) => {
                    text = text.trim().toUpperCase()
                    
                    if (!StringConstants.nonOnlyAlphaNumeric.test(text)) {
                      enteredText.current = text
                      setResults([])
                      onPressed(text)
                      setInput(text)
                      setShowLoader(text ? true : false)
                      showError("")
                      setErrorMsgColor("red")
                      if (text && text.length) {
                        const globaldata = props.getContextGlobalData().towData
                        let array = []

                        globaldata.plateKeys.map((item, index) => {

                          if (item.toLowerCase().startsWith(text.toLowerCase())) {
                            array.unshift(item)
                          }
                          else if (item.toLowerCase().includes(text.toLowerCase())) {
                            array.push(item)
                          }
                        })

                        setResults([...array])
                        if (array.length == 0 && text) {
                          showError(StringConstants.unauthorized)
                        }
                        else if (!text) {
                          showError("")
                        }
                        return
                        let payload = {
                          "autoScan": "False",
                          "plate_image": "",
                          session_id: globaldata.sessionData.session_id,
                          authentication_token: globaldata.sessionData
                            .authentication_token,
                          api_key:
                            globaldata.sessionData.api_keys
                              .get_team_members,
                          tow_company_id: globaldata.sessionData.tow_company_id,
                          lic_plateno: text,
                        }
                        console.log("AUTO SUGGESTIONS PAYLOAD", payload)
                        requestPost(ServiceUrls.scan_lic_plateno_autolist, payload).then((res) => {
                          console.log("AUTO SUGG RESPONSE", JSON.stringify(res.data))
                          setShowLoader(false)
                          if (res && res.status == 200) {
                            res = res.data
                            //console.log(text, enteredText.current)
                            if (text == enteredText.current) {
                              if (res.status == "success") {
                                showError(res.api_message == "scan result" ? "" : "")
                                if (res.api_message == "scan result") {
                                  setErrorMsgColor(res.dis_message.toLowerCase().includes("do not tow") ? "green" : res.color)
                                  //showError(res.api_message == "scan result" ? "" : "")

                                  showError(res.dis_message ? (res.dis_message == "Scan Success" ? "" : res.dis_message) : "")
                                }
                                if (res.details) {
                                  setResults([...res.details])
                                }
                              } else if (res.status == "error") {
                                showError(res.api_message)
                                setErrorMsgColor("#808080")
                              } else {
                                showError("")
                                setErrorMsgColor("red")
                              }
                            } else {
                              //showError("")
                            }
                          }
                          else {
                            showError("Network Error")
                            setErrorMsgColor("red")
                          }
                        })
                      } else if (text) {
                        showError("Please enter min 1 char")
                        setErrorMsgColor("red")
                      } else {
                        showError("")
                        setErrorMsgColor("red")
                      }
                    } 
                  }}
                  // onBlur={() => {
                  //   showError("")
                  //   setErrorMsgColor("red")
                  // }}
                  placeholderTextColor={"grey"}
                  placeholder={placeholder}
                  style={{
                    color: "#000000",
                    fontSize: (ValueConstants.size22),
                    padding: 10,
                    maxHeight: maxHeight,
                    borderRadius: 10,
                    borderWidth: 1,
                    alignSelf: "center",
                    textAlignVertical: "center",
                    fontFamily: Fonts.Mulish_Regular,
                    flex: 1,
                  }}
                  value={input}
                ></TextInput>
                {/* {showLoader ? <ActivityIndicator size={'large'} style={{ marginHorizontal: 5 }}></ActivityIndicator> : false} */}
              <GlobalButton style={{minHeight:50,marginLeft:10,marginVertical:0}}   title="Verify"
              
              onPress={()=>{ 
                ref.current.blur();
                setIsVissible(false);
                onPressed(input)
                onSelected(input)
              }}
              ></GlobalButton>
              </View>
              {result.length ? (
                <ScrollView
                  keyboardShouldPersistTaps={"handled"}
                  style={{ 
                    borderWidth: 1,
                    width: marginLeft,
                    marginLeft: 20,
                    borderRadius: 5,
                    borderColor: ColorConstants.placeHolderColor,
                   
                  }}
                >
                  {result.map((item, index, key) => {

                    return <TouchableOpacity
                      key={index}

                      onPress={() => {
                        setInput(item)
                        ref.current.blur();
                        setIsVissible(false);
                        onPressed(item)
                        onSelected(item)
                      }}
                      style={{
                        paddingHorizontal: 10,
                        backgroundColor: index % 2 == 0 ? "#fff" : "#eee"
                      }}
                    >

                      <Text
                        style={{
                          paddingVertical: 10,
                          color: "black",
                          flex: 1,
                          textAlignVertical: "center",
                          fontSize: (ValueConstants.size20),
                          fontFamily: Fonts.Mulish_Regular,
                        }}
                      >
                        {item}
                      </Text>

                    </TouchableOpacity>

                    return

                    if (item?.vehicle_details?.lic_plate_no)
                      return (
                        <TouchableOpacity
                          key={index}

                          onPress={() => {
                            setInput(item.vehicle_details.lic_plate_no)
                            ref.current.blur();
                            setIsVissible(false);
                            onPressed(item.vehicle_details.lic_plate_no)
                            onSelected(item)
                          }}
                        >
                          <View
                            style={{ flexDirection: "row", alignItems: "center" }}
                          >

                            {/* <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 99,
                            margin: 10,
                            backgroundColor: item.parking_status == "cancelled" ? "orange" : (item.parking_status == "active" || item.parking_status == "DNT Active") ? "green" : 'red'
                          }}></View> */}
                            <Text
                              style={{
                                paddingVertical: 10,
                                color: "black",
                                flex: 1,
                                textAlignVertical: "center",
                                fontSize: (ValueConstants.size20),
                                fontFamily: Fonts.Mulish_Regular,
                              }}
                            >
                              {item.vehicle_details.lic_plate_no}
                            </Text>
                            {/* <Text
                            style={{
                              paddingVertical: 10,
                              color: item.parking_status == "cancelled" ? "orange" : (item.parking_status == "active" || item.parking_status == "DNT Active") ? "green" : 'red',
                              marginHorizontal: 10,
                              textAlignVertical: "center",
                              fontSize: (ValueConstants.size18),
                              fontFamily: Fonts.Mulish_SemiBold,
                            }}
                          >
                            {item.parking_status}
                          </Text> */}

                          </View>

                          {/* <View
                          style={{
                            height: 2,
                            width: "100%",
                            backgroundColor: 1
                          }}
                        ></View> */}
                        </TouchableOpacity>
                      );
                    return <Text style={{ color: 'red' }} key={index}>{JSON.stringify(item)}</Text>
                  })}
                </ScrollView>
              ) : null}
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ReactNativeModal>
    );
  }
);
