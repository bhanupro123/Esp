/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import StackContainer from './StackContainer'; 
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { requestPost } from './src/Network/NetworkOperations';
import { ServiceUrls } from './src/Network/ServiceUrls';
import { generateUpdateFCMTokenObject, getStoragePref } from './src/Utils/Util';
import { AsynKeys } from './src/Utils/StringConstants';
messaging().setBackgroundMessageHandler(async remoteMessage => {
    let message=remoteMessage 
    if(message?.data?.is_logout=="yes")
    {
        let sessionData=await getStoragePref(AsynKeys.session)
            if(sessionData)
       {
        requestPost(ServiceUrls.checkAndUpdateDriverFCMToken,generateUpdateFCMTokenObject("", sessionData,true)).then((res)=>{
           if(res.status==200)
            {
                AsyncStorage.clear().then(()=>{
                    Toast.show("Your Account is logged in with another device.")
                    messaging().deleteToken().catch(()=>{

                    }).then(()=>{

                    })
                 })
            }
            else{
                Clipboard.setString(JSON.stringify(res))
            }
        })
        
       }
         
       
    }
    else{ 
    }
     
    });
 
AppRegistry.registerComponent(appName, () => StackContainer);
