import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import {
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import ColorConstants from "../Utils/ColorConstants";

const GlobalLoaderProvider = forwardRef(({ ...props }, ref) => {
  const [visible, setVissible] = useState(false);
  const cancellable = useRef(true);

  useImperativeHandle(ref, () => ({
    loaderRefresh(visiblity = false, cancell = false,) {
      cancellable.current = cancell;
      setVissible(visiblity);
    },
  }));
  useEffect(() => { });

  return visible ? (
    <Modal
      transparent
      style={{ backgroundColor: 'red' }}
      onRequestClose={() => {
        if (cancellable.current) setVissible(false);
      }}
    >
      <View
        key={"loader"}
        style={{
          flex: 1,
          backgroundColor: cancellable.current.whiteBg ? "white" : '#00000050',
          position: "absolute",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: 80,
            height: 80,
            backgroundColor: ColorConstants.primaryColor,
            borderRadius: 10,
          }}
        >
          <ActivityIndicator
            size={40}
            color={ColorConstants.secondaryColor}
            style={{ position: "absolute", borderRadius: 10 }}
          />
        </View>
      </View>
    </Modal>
  ) : null;


});
export default GlobalLoaderProvider;
