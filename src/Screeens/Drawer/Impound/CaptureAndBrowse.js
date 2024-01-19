import React from "react";
import { View, Text, TouchableOpacity } from 'react-native'
import ReactNativeModal from "react-native-modal";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Fonts from "../../../Utils/Fonts";
import ValueConstants from "../../../Utils/ValueConstants";
import ColorConstants from "../../../Utils/ColorConstants";
export default CaptureAndBrowse = ({ onClosed, ...props }) => {






    return (
        <ReactNativeModal
            isVisible={true}
            ref={(ref)=>{
                if(props?.mainModelRef)  
                props.mainModelRef.current=ref
            }} 
            onModalWillHide={()=>{
              onClosed(false);
            }}
            transparent
            style={{ margin: 0, flex: 1, justifyContent: 'flex-end' }}
            onBackButtonPress={() => {
                onClosed();
            }}
            onBackdropPress={() => {
                onClosed();
            }}
            onRequestClose={() => {
                onClosed();
            }}>
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 30,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}>

                <View
                    style={{
                        flexDirection: 'row',

                    }}>
                    <TouchableOpacity
                        onPress={async () => {
                            onClosed(1)
                        }}
                        style={{ alignItems: 'center', marginHorizontal: 10 }}>
                        <Entypo
                            name={'camera'}
                            size={30}
                            color={ColorConstants.secondaryColor}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.Mulish_Bold,
                                color: 'black',
                                paddingVertical: 5,
                                fontSize: ValueConstants.size20
                            }}>
                            {"Camera"}
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={async () => {
                            onClosed(2)
                        }}
                        style={{ alignItems: 'center', marginHorizontal: 15 }}>
                        <FontAwesome
                            name={'file-photo-o'}
                            size={30}
                            color={ColorConstants.secondaryColor}
                        />
                        <Text
                            style={{
                                fontFamily: Fonts.Mulish_Bold,
                                color: 'black',
                                paddingVertical: 5,
                                fontSize: ValueConstants.size20
                            }}>
                            Gallery
                        </Text>
                    </TouchableOpacity>



                </View>
            </View>
        </ReactNativeModal>
    );
}
