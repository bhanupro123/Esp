import React, { useState } from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from "react-native-modal";
import Fonts from '../../Utils/Fonts';
import ValueConstants from '../../Utils/ValueConstants';
import Clipboard from '@react-native-clipboard/clipboard';
import ColorConstants from '../../Utils/ColorConstants';
import { ServiceUrls } from '../../Network/ServiceUrls';
import Ionicons from "react-native-vector-icons/Ionicons";
export default StreamItemConfig = ({ id, onOk, configData, ...props }) => {
    const globaldata = props.getContextGlobalData()
    const [ip, onChangeText] = useState(configData.ip);
    const [port, onChangeNumber] = useState(configData.port ? configData.port.toString() : "");
    const [userName, setUserName] = useState(configData.userName);
    const [userPassword, setUserPassword] = useState(configData.userPassword);

    return <ReactNativeModal
    ref={(ref)=>{  
        if(props?.mainModelRef)
        props.mainModelRef.current=ref
    }} 
    onModalWillHide={()=>{
        onOk() 
    }}
        isVisible
        onBackButtonPress={() => {
            onOk()
        }}
        style={{
            flex: 1, padding: 0,
            margin: 0, backgroundColor: 'white'
        }}>
        <SafeAreaView style={{ flex: 1, }}>
<StatusBar  barStyle={'dark-content'}></StatusBar>
            <View style={{
                flexDirection: 'row',
                padding: 20,
                backgroundColor: '#1A1E36',
                alignItems: 'center',
            }}>
                <Ionicons
                    onPress={() => {
                        onOk()
                    }}
                    accessible={true}
                    color={"#ffffff"}
                    name={"arrow-back-outline"}
                    size={30}
                    style={{}}

                />
                <Text
                    style={{
                        marginHorizontal: 10,
                        color: "white",
                        fontFamily: Fonts.Mulish_SemiBold,
                        fontSize: ValueConstants.size22
                    }}
                >
                    Configure {configData.camname} Camera
                </Text>

            </View>

            <View style={{ flex: 1, margin: 10 }}>
                <View style={{
                    borderWidth: 0.5,
                    borderColor: '#000000',
                    borderRadius: 10,
                    margin: 10,
                }}>
                    <TextInput
                        style={{
                            padding: 10,
                            color: "#000000",
                            fontFamily: Fonts.Mulish_Regular,
                            fontSize: ValueConstants.size20
                        }}
                        placeholder={"Enter User Name  "}
                        placeholderTextColor='grey'
                        onChangeText={text => setUserName(text)}
                        value={userName}
                        autoCapitalize="none"
                    />
                </View>

                <View style={{
                    borderWidth: 0.5,
                    borderColor: '#000000',
                    borderRadius: 10,
                    margin: 10,
                }}>
                    <TextInput
                        style={{
                            padding: 10,
                            paddingHorizontal: 10,
                            color: "#000000",
                            fontFamily: Fonts.Mulish_Regular,
                            fontSize: ValueConstants.size20
                        }}
                        placeholder={"Enter User Password"}
                        placeholderTextColor='grey'
                        onChangeText={text => setUserPassword(text)}
                        value={userPassword}
                        autoCapitalize="none"
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <View style={{
                        borderWidth: 0.5,
                        borderColor: '#000000',
                        borderRadius: 10,
                        flex: 1,
                        alignItems: 'center',
                        margin: 10,
                    }}>
                        <TextInput
                            style={{
                                padding: 10,
                                flex: 1,
                                width: '100%',
                                color: "#000000",
                                fontFamily: Fonts.Mulish_Regular,
                                fontSize: ValueConstants.size20
                            }}
                            placeholder="Enter your IP address"
                            placeholderTextColor='grey'
                            onChangeText={text => onChangeText(text)}
                            value={ip}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={{
                        minWidth: '15%',
                        borderWidth: 0.5,
                        borderColor: '#000000',
                        borderRadius: 10,
                        margin: 10,
                        alignItems: 'center'
                    }}>
                        <TextInput
                            style={{
                                padding: 10,
                                textAlign: 'center',
                                minWidth: 100,
                                color: "#000000",
                                fontFamily: Fonts.Mulish_Regular,
                                fontSize: ValueConstants.size20
                            }}
                            placeholder="Port"
                            placeholderTextColor='grey'
                            onChangeText={text => onChangeNumber(text)}
                            value={port}
                            autoCapitalize="none"
                            keyboardType="numeric"
                            maxLength={4}
                        />
                    </View>
                </View>


                <View style={{
                    flexDirection: 'row',
                    marginTop: 30,
                    justifyContent: 'space-evenly'
                }}>
                    {/* <TouchableOpacity
                        style={{
                            minWidth: 100,
                            backgroundColor: ColorConstants.primaryColor,
                            borderRadius: 10,
                            padding: 10,
                            paddingHorizontal: 10,
                            alignItems: "center",
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            onOk({})
                        }}
                    >
                        <Text style={{
                            color: 'white', fontFamily: Fonts.Mulish_Regular,
                            fontSize: ValueConstants.size20
                        }}>
                            {"Back"}
                        </Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={{
                            backgroundColor: ColorConstants.secondaryColor,
                            borderRadius: 10,
                            padding: 10,
                            paddingHorizontal: 10,
                            alignItems: "center",
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            if (!userName) {
                                alert("Please enter username")
                                return
                            }
                            if (!userPassword) {
                                alert("Please enter password")
                                return
                            }
                            if (!ip) {
                                alert("Please enter Host Address")
                                return
                            } if (!port) {
                                alert("Please enter port")
                                return
                            }

                            let found = globaldata.defaultIps.some((item, index) => {

                                if (item.ip == ip && item.camname != configData.camname) {
                                    alert(ip + " is already configured")
                                    return true
                                }
                                return false
                            })
                            if (found) return;
                            const base64 = require('base-64');
                            let uri = "http://" + userName + ":" + userPassword + "@" + ip + ":" + port + ServiceUrls.getPlates
                            onOk({
                                uri: uri,
                                userName: userName,
                                userPassword: userPassword,
                                ip: ip,
                                port: port,
                                auth: "Basic " + base64.encode(userName + ":" + userPassword),
                                rtspUri: "rtsp://" + userName + ":" + userPassword + "@" + ip
                            })
                            return
                            fetch('http://' + ip)
                                .then((response) => {

                                    if (response.status === 200) {
                                        let uri = "http://" + userName + ":" + userPassword + "@" + ip + ":" + port + "/ISAPI/Traffic/channels/1/vehicleDetect/plates/"

                                        //props.navigation.navigate('FetchPlates', { uri: uri, auth: "Basic " + base64.encode(userName + ":" + userPassword) })
                                        onOk({
                                            uri: uri,
                                            userName: userName,
                                            userPassword: userPassword,
                                            ip: ip,
                                            port: port,
                                            auth: "Basic " + base64.encode(userName + ":" + userPassword),
                                            rtsp: "rtsp://" + userName + ":" + userPassword + "@" + ip
                                        })
                                    } else {
                                        alert('Device not found at ' + ip + ":" + port);
                                    }
                                })
                                .catch((error) => {
                                    alert('Error while pinging ' + error);
                                })

                        }}
                    >
                        <Text style={{
                            color: 'white', fontFamily: Fonts.Mulish_Regular,
                            fontSize: ValueConstants.size20
                        }}>
                            Connect
                        </Text>
                    </TouchableOpacity>


                </View>

            </View>



        </SafeAreaView>

    </ReactNativeModal>
}


