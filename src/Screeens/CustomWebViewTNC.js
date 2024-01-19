import React, { Component, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Image, NativeModules, } from 'react-native';
import { WebView } from 'react-native-webview';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorConstants from '../Utils/ColorConstants';

// Pass a "uri" prop as the webpage to be rendered



export default CustomWebViewTNC = (props) => {
  const [visible, setVisible] = useState(true)
  return <SafeAreaView style={{ flex: 1 }}>

    <WebView
      onLoadStart={() => setVisible(true)}
      onLoadEnd={() => setVisible(false)}
      source={{ uri: props.route.params.webLink }}
    />
    {visible ? (
      <ActivityIndicator
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          jusityContent: 'space-around',
          flexWrap: 'wrap',
          alignContent: 'center',
        }}
        size={50}
        color={ColorConstants.secondaryColor}
      />
    ) : null}
    <View
      style={{
        backgroundColor: '#00000060',
        borderRadius: 99,
        width: 40,
        top: 20,
        position: 'absolute',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
      }}>
      <IconAnt
        onPress={() => {
          props.navigation.pop();
        }}
        name="arrowleft"
        size={25}
        color={'white'}
      />
    </View>
  </SafeAreaView>
}

