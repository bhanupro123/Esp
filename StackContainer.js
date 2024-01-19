/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { AlertConsumer, AlertProvider } from './src/CustomProvider/CustomProvider';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import ScreenNames from './src/Utils/ScreenNames';
import SplashScreen from './src/Screeens/SplashScreen';
import Login from './src/Screeens/Login';
import Verify from './src/Screeens/Verify';
import HomeScreen from './src/Screeens/HomeScreen';
import Impound from './src/Screeens/Drawer/Impound/Impound';
import CheckIn from './src/Screeens/Drawer/CheckIn';
import Dispatching from './src/Screeens/Drawer/Dispatching';
import ResidenceCheck from './src/Screeens/Drawer/ResidenceCheck';
import Team from './src/Screeens/Drawer/Team';
import History from './src/Screeens/Drawer/History';
import ViewPropertyDetails from './src/Screeens/Drawer/ViewPropertyDetails';
import CamConfig from './src/Screeens/CamConfig/CamConfig';
import TopTabs from './src/Screeens/TopTabs'; 
import CustomWebViewTNC from './src/Screeens/CustomWebViewTNC';
import DetailsProperty from './src/Screeens/Drawer/DetailsProperty';


const Stack = createNativeStackNavigator();

const StackContainer = ({ ...props }) => {

const containerRef=useRef(null)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorConstants.primaryColor }}>
 
      <NavigationContainer ref={containerRef}
        independent
      >
        <Stack.Navigator
        
          screenOptions={{ headerShown: false }}
          initialRouteName={ScreenNames.Splash}>
          <Stack.Screen
            name={ScreenNames.Splash}
            component={SplashScreen}
          />


          <Stack.Screen
            name={ScreenNames.CustomWebViewTNC}
            component={CustomWebViewTNC}
          />

          <Stack.Screen
            name={ScreenNames.VehicleScan}
            component={TopTabs}
            initialParams={{
              containerRef:containerRef
            }}
          />
          <Stack.Screen
            name={ScreenNames.Login}
            component={Login}
          />
          <Stack.Screen
            name={ScreenNames.Verify}
            component={Verify}
          />
          <Stack.Screen
            name={ScreenNames.CheckIn}
            component={CheckIn}
          />
          <Stack.Screen
            name={ScreenNames.Dispatching}
            component={Dispatching}
          />
          <Stack.Screen
            name={ScreenNames.ResidenceCheck}
            component={ResidenceCheck}
          />
          <Stack.Screen
            name={ScreenNames.Impound}
            component={Impound}
          />
          <Stack.Screen
            name={ScreenNames.Team}
            component={Team}
          />
          <Stack.Screen
            name={ScreenNames.History}
            component={History}
          />
          <Stack.Screen
            name={ScreenNames.ViewPropertyDetails}
            component={ViewPropertyDetails}
          />

          <Stack.Screen
            name={ScreenNames.DetailsProperty}
            component={DetailsProperty}
          />
          <Stack.Screen
            name={ScreenNames.CamConfig}
            component={CamConfig}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default MainApp = () => {
  return <AlertProvider>
    <AlertConsumer>{({ ...props }) => <StackContainer {...props} />}</AlertConsumer>
  </AlertProvider>
}

