import React, {
    useEffect,
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
import DeviceInfo from "react-native-device-info";
import IconEntypo from "react-native-vector-icons/Entypo";
import { getFontSize } from "../Utils/Util";
import Fonts from "../Utils/Fonts";
const SearchableDropDownModel = forwardRef(
    (
        {
            dataSetKey = "loginSuggestions",
            editable = true,
            preInput = "",
            placeholder = "Property Search...",
            fromWhere = "LoginScreens",
            displayError,
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
        const [data, setData] = useState([]);
        const [result, setResults] = useState([]);
        const [input, setInput] = useState(preInput);
        const [selection, setSelection] = useState(undefined);
        const [isPreferredNameEnabled, setIsPreferredNameEnabled] = useState("0");

        const ref = useRef();
        useEffect(() => {
            // getStoragePrefObjectValue(dataSetKey).then((val) => {
            //     if (val) {
            //         setData([...val]);
            //     }
            // });
        }, []);
        useImperativeHandle(reff, () => ({
            refresh(width, height, pageX, pageY, data, show = true) {
                if (!editable) return;
                // setSelection({ start: data.length, end: data.length });
                setAlignTop(true);
                setAlignBottom(false);
                setMargin(pageY);
                setIsVissible(show);
                setMarginLeft(width);
                setMaxHeight(300);
                if (show)
                    setTimeout(() => {
                        ref.current.focus();
                        setInput(data);
                        // setSelection({ start: data.length + 3, end: data.length + 3 });
                        // setTimeout(() => {
                        //   setSelection(undefined);
                        // }, 1000);
                    }, 20);
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
                            width: '100%',
                            flex: 1,
                            alignItems: "flex-start",
                        }}
                        accessible={true}
                        testID={"onpressedbuttonfs"}
                        accessibilityLabel={"onpressedbuttonfs"}
                        onPress={() => {
                            setIsVissible(false);
                        }}
                    >
                        <TouchableOpacity
                            accessible={true}
                            testID={"onpressedbuttonmodel"}
                            accessibilityLabel={"onpressedbuttonmodel"}
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
                                borderRadius: 5,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <View
                                style={{
                                    flex: 1,
                                    width: DeviceInfo.isTablet() ? "60%" : "75%",
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    borderRadius: 3,
                                    marginBottom: 10,
                                    minHeight: 40,
                                    padding: 0,
                                    fontSize: getFontSize(15),
                                    fontFamily: Fonts.Mulish_Black,
                                    backgroundColor: "#faf9fe",
                                    paddingHorizontal: 10,
                                    color: '#445C92',
                                    borderColor: '#d3d6d9',
                                    width: DeviceInfo.isTablet() ? "50%" : "75%",
                                    paddingHorizontal: 0,
                                    marginBottom: 0,
                                    marginRight: fromWhere == "LoginPackageScreen" ? 75 : 0,
                                }}
                            >
                                <TextInput
                                    ref={(reff) => {
                                        ref.current = reff;
                                    }}
                                    accessible={true}
                                    testID={"userNameTextInput"}
                                    accessibilityLabel={"userNameTextInput"}
                                    selection={selection}
                                    onFocus={() => {
                                        displayError(false);
                                    }}
                                    autoCapitalize={"none"}
                                    onChangeText={(value) => {
                                        //setSelection({ start: value.length, end: value.length });
                                        props.onPressed(value);
                                        setInput(value);
                                        if (value.length >= 2) {
                                            if (fromWhere == "LoginPackageScreen") {
                                                let recipientList = [];
                                                value = value.replace("(", "").replace(")", "");
                                                for (var i = 0; i < data.length; i++) {
                                                    //if (
                                                    //       isRecipientSearchSuccessful(
                                                    //         value,
                                                    //         data[i].first_name,
                                                    //         data[i].last_name,
                                                    //         data[i].preferred_first_name,
                                                    //         data[i].address1,
                                                    //         true,
                                                    //         isPreferredNameEnabled
                                                    //       )
                                                    //     ) {
                                                    //       let recipientName = provideFormattedRecipientName(
                                                    //         data[i].first_name,
                                                    //         data[i].last_name,
                                                    //         data[i].preferred_first_name,
                                                    //         isPreferredNameEnabled
                                                    //       );
                                                    //       recipientList.push({
                                                    //         username: recipientName,
                                                    //         address: data[i].address1,
                                                    //         recipientId: data[i].recipient_id,
                                                    //       });
                                                    //     }
                                                }
                                                //   setResults([...recipientList]);
                                                if (recipientList.length == 0) {
                                                    displayError(true);
                                                }
                                                return;
                                            }
                                            let filteredData = data.filter((a) => {
                                                return a.username
                                                    .toLowerCase()
                                                    .includes(value.toLowerCase());
                                            });
                                            setResults([...filteredData]);
                                        } else {
                                            setResults([]);
                                            displayError(false);
                                        }

                                    }}
                                    editable={editable}
                                    onSubmitEditing={() => {
                                        props.onPressed(input);
                                        setIsVissible(false);
                                    }}
                                    placeholderTextColor={"#707070"}
                                    placeholder={placeholder}
                                    style={{
                                        color: '#445C92',
                                        height: 40,
                                        fontSize: getFontSize(15),
                                        fontFamily: Fonts.Mulish_Black,
                                        paddingHorizontal: 10,
                                        textAlignVertical: "center",
                                        textAlign: "left",
                                    }}
                                    value={input}
                                ></TextInput>
                                {input.length >= 2 && fromWhere == "LoginPackageScreen" ? (
                                    <IconEntypo
                                        name={"circle-with-cross"}
                                        size={15}
                                        style={{ marginRight: 10 }}
                                        accessible={true}
                                        testID={"onpressedbuttonlop"}
                                        accessibilityLabel={"onpressedbuttonlop"}
                                        onPress={() => {
                                            setInput("");
                                            displayError(false);
                                            // props.onValueChange("");
                                            // setError(false);
                                        }}
                                    />
                                ) : null}
                            </View>
                            {result.length ? (
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"handled"}
                                    style={{
                                        alignSelf: "center",
                                        width:
                                            fromWhere == "LoginPackageScreen"
                                                ? DeviceInfo.isTablet()
                                                    ? "60%"
                                                    : "75%"
                                                : DeviceInfo.isTablet()
                                                    ? "50%"
                                                    : "75%",
                                        borderWidth: 2,
                                        borderRadius: 0.8,

                                        backgroundColor: "green",
                                    }}
                                >
                                    {result.map((item, index, key) => {
                                        return (
                                            <>
                                                <View
                                                    style={{
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderRadius: 3,
                                                        marginBottom: 10,
                                                        minHeight: 40,
                                                        padding: 0,
                                                        fontSize: getFontSize(15),
                                                        fontFamily: Fonts.Mulish_Black,
                                                        backgroundColor: "#faf9fe",
                                                        paddingHorizontal: 10,
                                                        color: '#445C92',
                                                        borderColor: '#d3d6d9',
                                                        borderWidth: 0,
                                                        marginBottom: 0,
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                    }}>
                                                    <Text
                                                        accessible={true}
                                                        testID={"onpressedbuttonlps"}
                                                        accessibilityLabel={"onpressedbuttonlps"}
                                                        onPress={() => {
                                                            setInput(item.username);
                                                            setSelection({ start: item.username.length, end: item.username.length });
                                                            props.onPressed(item.username);
                                                            setResults([]);
                                                            setIsVissible(false);
                                                            ref.current.blur();
                                                        }}
                                                        style={{
                                                            color: '#445C92',
                                                            textAlignVertical: "center",
                                                            fontSize: getFontSize(15),
                                                            fontFamily: Fonts.Mulish_Black,
                                                        }}>
                                                        {item.username}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{
                                                        height: result.length - 1 == index ? 0 : 2,
                                                        width: "100%",
                                                        backgroundColor:
                                                            result.length - 1 == index
                                                                ? null
                                                                : '#d3d6d9',
                                                    }}
                                                >
                                                </View>
                                            </>
                                        );
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
export default SearchableDropDownModel;
