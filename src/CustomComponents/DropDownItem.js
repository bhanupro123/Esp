import React, { useRef, useState, } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import ColorConstants from '../Utils/ColorConstants';
import DropDownItemModel from './DropDownItemModel';
import Fonts from '../Utils/Fonts';
import ValueConstants from '../Utils/ValueConstants';
import { getMandatoryColor } from '../Utils/Util';

export default DropDownItem =
  ({ header = false,level=1, placeholder = "", ...props }, ref) => {
    const containerRef = React.useRef(null);
    const modalRef = useRef(null);
    const [value, setValue] = useState({})
    return (
      <View style={{}}>
        {header ? <Text
          style={{
            color: "#000000",
            fontFamily: Fonts.Mulish_Medium,
            fontSize: ValueConstants.size20,
            paddingVertical: 10,
            textAlignVertical: "center",
            flex: 1,
          }}
        >
          {placeholder} <Text style={{color:getMandatoryColor(level)}}>*</Text>
        </Text> : null}
        <TouchableOpacity
          ref={ref => {
            containerRef.current = ref;
          }}
          onPress={() => {
            containerRef.current.measure(
              (x, y, width, height, pageX, pageY) => {
                if (modalRef.current) {
                  modalRef.current.refresh(width, height, pageX, pageY, value);
                }
              },
            );
          }}
          style={{
            flex: 1, flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: ColorConstants.borderColor,
            borderRadius: 10,
          }}>
          <Text style={{
            flex: 1, padding: 10, color: value[props.objKey] ? ColorConstants.black : ColorConstants.placeHolderColor,
            fontFamily: Fonts.Mulish_Regular,
            fontSize: ValueConstants.size20
          }}>
            {value[props.objKey] ? value[props.objKey] : "Select " + placeholder}  </Text>
          <Icon
            name="downcircleo"
            size={20}
            color={ColorConstants.placeHolderColor}
            style={{ marginHorizontal: 10 }}
          />
        </TouchableOpacity>

        <DropDownItemModel ref={modalRef}
          onChange={(data) => {
            setValue(data)
          }}
          {...props}></DropDownItemModel>
      </ View>
    );
  }

