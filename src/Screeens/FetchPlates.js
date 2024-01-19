/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  SafeAreaView,
  Text,
  useColorScheme,
  FlatList
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import XMLParser from 'react-xml-parser';
import PlateCardItem from './PlateCardItem';
import { requestPost } from '../Network/NetworkOperations';

export function grabDateFromTextString(date) {
  if (date)
    return date.getDate() + " " + arrayofMonths[date.getMonth()] + " " + date.getFullYear()

}

const FetchPlates = (props) => {
  const [continueAPI, setontinueAPI] = useState({ status: true })
  let [data, setData] = useState([])
  const [status, setStatus] = useState("Connecting...")
  const base64 = require('base-64');
  useEffect(() => {

    continueAPI.status = true
    getTriggers()
    return () => {
      continueAPI.status = false
    }
  }, [])



  const getTriggers = async () => {

    let uri = "http://admin:Admin1234@192.168.1.153:80/ISAPI/Traffic/channels/1/vehicleDetect/plates/"
    requestPost(uri, "<AfterTime><picTime>2023-05-025T00ngffg:00:00Z</picTime></AfterTime>",
      {
        headers: {
          "Accept": 'application/xml',
          "Authorization": "Basic " + base64.encode("admin" + ":" + "Admin1234"),
        },
      }
    ).then((res) => {
      if (res && res.status == 200) {
        setStatus("Connected and fetching...")
        var xml = new XMLParser().parseFromString(res.data);

        let fetchedPlatesarray = []

        if (xml.children) {
          let updateState = false
          for (let i = 0; i < xml.children.length; i++) {
            if (xml.children[i].children) {
              let obj = {}
              obj.index = fetchedPlatesarray.length + 1
              for (let j = 0; j < xml.children[i].children.length; j++) {
                obj[xml.children[i].children[j].name] = xml.children[i].children[j].value
              }
              if (obj.plateNumber.length > 8) {
                let found = false
                for (let k = 0; k < data.length; k++) {
                  let plateObj = data[k]
                  if (plateObj.plateNumber == obj.plateNumber) {
                    found = true
                    break;
                  }
                }
                if (!found) {
                  updateState = true
                  data.push(obj)
                }
              }
            }
          }
          if (updateState)
            setData([...data])
        }
      }
      reCallApi()
    }).catch((res) => {
      setStatus("Camera is not available")
      reCallApi()
    })
  }

  const reCallApi = () => {
    if (continueAPI.status) {
      setTimeout(() => {
        getTriggers()
      }, 4000);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
      {data.length == 0 ? <Text style={{
        flex: 1, textAlignVertical: 'center',
        fontSize: 18, fontWeight: '700', color: 'black', alignSelf: 'center'
      }}>{status}</Text> :

        <FlatList style={{ flex: 1 }}
          data={data}
          renderItem={({ item, index }) => {
            return <PlateCardItem index={index} item={item} dataSet={data} {...props}></PlateCardItem>
          }}
          keyExtractor={item => item.captureTime + Math.random()}

        >

        </FlatList >
      }


    </SafeAreaView >
  );
}



export default FetchPlates;
