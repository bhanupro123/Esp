import React, { useRef, useState, } from 'react';

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ColorConstants from '../../../Utils/ColorConstants';
import Fonts from '../../../Utils/Fonts';
import { getMandatoryColor } from '../../../Utils/Util';
import ValueConstants from '../../../Utils/ValueConstants';

export default TextInputItem = ({ trim = true, regX = "", header = false, onChangeText, value = "", level = 0, placeholder = "", ...props }) => {
  const [input, setValue] = useState("")
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
        {placeholder}
        {level ? <Text style={{
          fontFamily: Fonts.Mulish_Medium,
          fontSize: ValueConstants.size20,
          color: getMandatoryColor(level)
        }}>{level != 3 ? " *" : ""}</Text> : null}
      </Text> : null}

      <TextInput
        placeholder={"Enter " + placeholder}
        value={input}
        {...props}

        onChangeText={(text) => {
          text = trim ? text.trim() : text.trimStart()
          if (regX) {
            if (!regX.test(text)) {
              setValue(text)
              onChangeText(text)
            }
            return
          }
          setValue(text)
          onChangeText(text)
        }}
        style={{
          padding: 10,
          maxHeight: props.multiline ? 100 : null,
          color: ColorConstants.black,
          fontFamily: Fonts.Mulish_Regular,
          fontSize: ValueConstants.size18,
          flex: 1, flexDirection: 'row',
          borderWidth: 1,
          borderColor: ColorConstants.borderColor,
          borderRadius: 10,
        }}

      >
      </TextInput>



    </ View>
  );
}

