import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import GlobalAlertByProvider from "./GlobalAlertProvider";
import GlobalLoaderProvider from "./GlobalLoaderProvider";
import { AsynKeys, StringConstants } from "../Utils/StringConstants";
import { defaultIps, setStoragePref } from "../Utils/Util";
import NetInfo from '@react-native-community/netinfo';
import GlobalInternetProvider from "./GlobalInternetProvider";
export const AlertContext = React.createContext({});
export const AlertConsumer = AlertContext.Consumer;

export const AlertProvider = (props) => {

  const responsiveHeight = useRef(0);
  const modalRef = useRef(null);
  const alertRef = useRef(null);
  const mainModelRef=useRef(null);
  const internetAlertRef = useRef(null);
  const [globalData, setGlobalData] = useState({
    globalConstants: {},
    sessionData: null,
    towData: {
      plateKeys:[]
    },
    defaultIps: [...defaultIps()],
  });

  const loaderstate = (visible = false, obj = {}, whiteBg = false) => {
    if (modalRef && modalRef.current && modalRef.current.loaderRefresh) {
      obj.whiteBg = whiteBg
      modalRef.current.loaderRefresh(visible, obj, whiteBg);
    }
  };

  const alertState = (visible = false, cancellable = false, value = "") => {
    if (alertRef && alertRef.current && alertRef.current.alertConfig) {
      alertRef.current.alertConfig(visible, cancellable, value);
    }
  };
  const internetChange = (visible =true) => {
    if (internetAlertRef && internetAlertRef.current && internetAlertRef.current.alertConfig&&globalData.sessionData) {
         internetAlertRef.current.alertConfig(visible); 
    }
  };
  const getResponsiveHeight = () => {
    return responsiveHeight.current;
  };
  const getContextGlobalData = () => {
    return globalData;
  };

  const setSessionData = (data) => {
    if(!data)
    {
      globalData.towData.plateKeys=[]
    }
    globalData.sessionData = data
  }
  const setByDefaultIps = (index = 0, data = {}) => {
    globalData.defaultIps[index] = data
    setStoragePref(AsynKeys.defaultCamConfig, globalData.defaultIps)
  }
 

  
  const setTowData = (data = null, key = "") => {
    try {
      let towData = globalData.towData 
      if (towData && key) { 
        if (Array.isArray(towData[key]) && towData[key].length) { 
          let arrayData = towData[key]
          let found = false
          for (let i = 0; i < arrayData.length; i++) {
            let innerData = arrayData[i]
            if (innerData.type == data.type) { 
              found = true
              arrayData[i] = data
              break;
            }
          }
          if (found == false) {
            towData[key].push(data) 
          }

        }
        else { 
          towData[key] = [{ ...data }]
          towData.plateKeys.push(key)
        }
      }
      else
        globalData.towData = data
    }
    catch (e) {
      alert(e)
    }
  }

  const resetContextData = () => {
    setGlobalData({
      towData: {
        plateKeys:[]
      },
      globalConstants: {},
      sessionData: null,
      defaultIps: [...defaultIps()],
    })
  }



  return (
    <View
      style={{ flex: 1 }}
      onLayout={(e) => {
        responsiveHeight.current = e.nativeEvent.layout.height;
      }}
    >
      <AlertContext.Provider
        value={{
          responsiveHeight: getResponsiveHeight,
          alert: alertState,
          loader: loaderstate,
          setSessionData: setSessionData,
          getContextGlobalData: getContextGlobalData,
          resetContextData: resetContextData,
          setByDefaultIps: setByDefaultIps,
          setTowData: setTowData, 
          internetChange,internetChange,
          mainModelRef:mainModelRef
        }}
      >
        {props.children}
      </AlertContext.Provider>
      <GlobalLoaderProvider ref={modalRef}> </GlobalLoaderProvider>
      <GlobalAlertByProvider ref={alertRef}> </GlobalAlertByProvider>
      <GlobalInternetProvider ref={internetAlertRef}> </GlobalInternetProvider>
    </View>
  );
};
export const withGlobalContext = (ChildComponent) => (props) =>
(
  <AlertContext.Consumer>
    {(context) => (
      <ChildComponent
        {...props}
        {...context}
      />
    )}
  </AlertContext.Consumer>
);
