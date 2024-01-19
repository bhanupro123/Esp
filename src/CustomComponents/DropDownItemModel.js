import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Button,
  ScrollView,
} from 'react-native';
import Fonts from '../Utils/Fonts';
import ReactNativeModal from 'react-native-modal';
import ValueConstants from '../Utils/ValueConstants';


export default DropDownItemModel = forwardRef(
  ({ arrayData = [], onChange, idKey = "damn", objKey = "damn", ...props }, ref) => {

    const [isVisible, setIsVissible] = useState(false);
    const [margin, setMargin] = useState(0);
    const [alignTop, setAlignTop] = useState(false);
    const [alignBottom, setAlignBottom] = useState(false);
    const [maxHeight, setMaxHeight] = useState(null);
    const [marginLeft, setMarginLeft] = useState(0);
    const [seletedValue, setSV] = useState({
      data: {}
    })

    useImperativeHandle(ref, () => ({
      refresh(width, height, pageX, pageY, data = {}) {

        seletedValue.data = data ? data : {}
        if (props.responsiveHeight() / 2 >= pageY) {
          setAlignTop(true);
          setAlignBottom(false);
          setMargin(height + pageY);
          setIsVissible(true);
          setMarginLeft(width);
          setMaxHeight(props.responsiveHeight() - height - pageY);
        } else {
          setMarginLeft(width);
          setAlignTop(false);
          setAlignBottom(true);
          setMargin(
            props.responsiveHeight() - pageY
              ? props.responsiveHeight() - pageY
              : 0,
          );
          setIsVissible(true);
          setMaxHeight(props.responsiveHeight());
        }
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
        onBackButtonPress={() => {
          setIsVissible(false);
        }}
        onRequestClose={() => {
          setIsVissible(false);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, alignItems: 'center' }}
          onPress={() => {
            setIsVissible(false);
          }}>
          <TouchableOpacity
            onPress={() => { }}
            activeOpacity={1}
            style={{
              width: marginLeft,
              bottom: alignBottom ? margin : 'auto',
              top: alignTop ? margin : 'auto',
              position: 'absolute',
              maxHeight: props.responsiveHeight() - margin - 100,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 10,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <ScrollView style={{
              paddingVertical: 5,
            }}>
              {arrayData.map((item, index) => {
                return <TouchableOpacity key={item[objKey] + index}
                  onPress={() => {
                    setIsVissible(false);
                    if (props.onChangeText)
                      props.onChangeText(item[objKey], item[idKey])
                    onChange(item)

                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: item[objKey] == seletedValue.data[objKey] ? ValueConstants.size20 : ValueConstants.size18,
                      fontFamily: item[objKey] == seletedValue.data[objKey] ? Fonts.Mulish_Medium : Fonts.Mulish_Light,
                      fontFamily: Fonts.Mulish_Regular,
                      fontSize: ValueConstants.size20,
                      paddingVertical: 10,
                      paddingHorizontal: 5,
                      marginVertical: 2,
                      borderBottomWidth: 1
                    }}>{item[objKey]}</Text>
                </TouchableOpacity>

              })}
            </ScrollView>

          </TouchableOpacity>
        </TouchableOpacity>
      </ReactNativeModal >
    );
  },
);

