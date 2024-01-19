
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';
import { ServiceUrls } from '../Network/ServiceUrls';
import Fonts from '../Utils/Fonts';
import ValueConstants from '../Utils/ValueConstants';
import FastImage from 'react-native-fast-image';
import { requestPost } from '../Network/NetworkOperations';
import ReactNativeModal from 'react-native-modal';
import GlobalButton from '../CustomComponents/GlobalButton';
import ImagesWrapper from '../Utils/ImagesWrapper';
import ColorConstants from '../Utils/ColorConstants';
import { StringConstants } from '../Utils/StringConstants';
export default PlateCardManualModel = ({ onClosed, item, ...props }) => {

  const globaldata = props.getContextGlobalData()
  const [imageUri, setImageUri] = useState("")
  const [plateNumber, setPlateNumber] = useState(item.plateNumber)
  const snapShot = "http://" + item.netInfo.userName + ":" + item.netInfo.userPassword + "@" + item.netInfo.ip + ServiceUrls.takeSnapShot
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false)
  const [message, setApimsg] = useState("")



  const captureImage = () => {
    fetch(snapShot, {
      headers: {
        Authorization: item.netInfo.auth
      }
    })
      .then(response => response.blob())
      .then(blob => {
        var reader = new FileReader();
        reader.onload = function () {
          let imagedata = this.result
          imagedata = imagedata.replace("data:application/octet-stream", "data:image/png")
          setImageUri(imagedata)
        }; // <--- `this.result` contains a base64 data URI
        reader.readAsDataURL(blob);
      });
  }
  return <ReactNativeModal
    onBackButtonPress={() => {
      onClosed()
    }}
    onBackdropPress={() => {
      onClosed()
    }}
    style={{ padding: 0, margin: 0 }}
    isVisible>
    <View style={{
      borderRadius: 10,
      margin: 20, padding: 20,
      backgroundColor: 'white'
    }} >


      <View style={{ flexDirection: 'row' }}>
        <Text style={{
          marginTop: 10,
          flex: 1,
          color: "black", fontFamily: Fonts.Mulish_Bold,
          fontSize: ValueConstants.size18,
        }}>
          Recheck Manually
          {/* {JSON.stringify(item)} */}
        </Text>
        <Text
          onPress={() => {
            onClosed()
          }}
          style={{
            marginTop: 10,
            textDecorationLine: 'underline',
            color: "black", fontFamily: Fonts.Mulish_Bold,
            fontSize: ValueConstants.size18,
          }}>
          Close
          {/* {JSON.stringify(item)} */}
        </Text>
      </View>
      <TextInput
        onChangeText={(e) => {
          setPlateNumber(e.trim().toUpperCase())
        }}
        value={plateNumber}
        placeholder='Please enter Plate Number'
        style={{
          color: "black",
          margin: 0,
          marginTop: 10,
          paddingHorizontal: 10,
          padding: 10,
          fontFamily: Fonts.Mulish_Regular,
          fontSize: ValueConstants.size18,
          borderWidth: 1, borderRadius: 10,
          borderColor: ColorConstants.borderColor
        }}>

      </TextInput>

      {/* <TouchableOpacity
        onPress={() => {
          if (!imageUri) {
            captureImage()
          }
          else {
            setImageUri("")
          }
        }}
        style={{
          padding: imageUri ? 0 : 20,
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
          height: Dimensions.get('window').height * 0.3,
          borderStyle: 'dashed',
          borderWidth: imageUri ? 0 : 1, borderRadius: 10,
          borderColor: ColorConstants.borderColor
        }}>
        {imageUri ?
          <FastImage
            resizeMode='cover'
            style={{
              borderRadius: 10,
              height: Dimensions.get('window').height * 0.3, width: "100%", alignItems: 'center', justifyContent: 'center'
            }}
            source={{
              uri: imageUri
            }}
          >
          </FastImage>

          : <Text style={{
            color: 'black',
            fontFamily: Fonts.Mulish_Bold,
            fontSize: ValueConstants.size18,
          }}>Capture Image</Text>}
      </TouchableOpacity> */}
      {message ? <Text style={{
        alignSelf: 'center',
        marginVertical: 10,
        color: message.toLowerCase().includes("active") || message == StringConstants.dNT ? "green" : "red",
        fontFamily: Fonts.Mulish_Bold,
        fontSize: ValueConstants.size20,
      }}>
        Status: {message}
      </Text> : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {imageUri ? <GlobalButton
          disabled={imageUri ? false : true}
          style={{ backgroundColor: !imageUri ? ColorConstants.primaryColor : ColorConstants.secondaryColor }}
          title='Recapture'
          onPress={async () => {
            captureImage()
          }}
        >
        </GlobalButton> : null}

       
      </View>
    </View>

  </ReactNativeModal >
}


