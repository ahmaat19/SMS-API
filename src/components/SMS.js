import React, {useEffect, useState} from 'react';
import {Text, View, Pressable, Linking} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import SmsListener from 'react-native-android-sms-listener';

import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

const SMS = () => {
  const [newSMS, setNewSMS] = useState(null);
  const [network, setNetwork] = useState(null);
  const [env] = useState('production');
  const [errorMessage, setErrorMessage] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const sendSMS = async message => {
    try {
      const {data} = await axios.post(
        env === 'development'
          ? 'http://10.0.2.2:3000/api/payments/script'
          : 'https://wadaag.app/api/payments/script',
        message,
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaG1lZCBJYnJhaGltIFNhbW93IiwiaWF0Ijo3MTg2NzUyMDAsImV4cCI6MzIyNzU2NzA0MDAsImF1ZCI6Ind3dy5haG1lZGlicmEuY29tIiwic3ViIjoiYWhtYWF0MTlAZ21haWwuY29tIiwiRW1haWwiOiJhaG1hYXQxOUBnbWFpbC5jb20iLCJSb2xlIjoiU3VwZXIgQWRtaW4ifQ.zh-LMRIO3NXVJW10O0oxL-CxMDRzl7XsalUXj0ABg2E`,
          },
        },
      );
      setErrorMessage(null);
      setResponseData(await data);
      return await data;
    } catch (error) {
      setResponseData(null);
      setErrorMessage(error.response.data.error || error.message);
    }
  };

  useEffect(() => {
    const subscribe = SmsListener.addListener(message => {
      if (message?.originatingAddress === '192') {
        if (message?.body?.startsWith('[-EVCPlus-] waxaad ')) {
          setNewSMS(message);
          sendSMS(message);
        }
      }
    });
    return () => subscribe.remove();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetwork(state);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider className="flex-1 justify-center items-center p-3">
      {errorMessage && (
        <View className="mt-5 text-center border border-red-600 p-2 min-w-full">
          <Text>{errorMessage}</Text>
        </View>
      )}
      <View className="mt-5 border border-blue-600 p-2 min-w-full ">
        <Text className="mb-3 uppercase">
          Messages from 192 number are being delivered to the Wadaag server
        </Text>
        <View>
          <Text className="font-bold mb-3 uppercase">
            <Icon name="wifi" size={20} /> Connection Type:
            <Text className="font-normal">
              {network?.isConnected ? (
                <Text className="text-green-600"> {network?.type} </Text>
              ) : (
                <Text className="text-red-600"> Not Available</Text>
              )}
            </Text>
          </Text>
        </View>
      </View>

      {newSMS && (
        <View className="border border-green-600 p-3 m-3 min-w-full">
          <Text className="font-bold uppercase mb-2">
            The most recent message came from 192.
          </Text>
          <Text>
            <Text className="font-bold">Sender: </Text>{' '}
            {newSMS?.originatingAddress}
          </Text>
          <Text>
            <Text className="font-bold">Body: </Text> {newSMS?.body}
          </Text>
          <Text>
            <Text className="font-bold">Date: </Text>{' '}
            {moment(newSMS?.timestamp).format('D MMM, YY - hh:mm:ss')}
          </Text>
        </View>
      )}

      {responseData && (
        <View className="mt-5 text-center border border-green-600 p-2 min-w-full">
          <Text>
            <Text className="font-bold">From:</Text> {responseData?.mobile}{' '}
          </Text>
          <Text>
            <Text className="font-bold">Amount:</Text> $
            {Number(responseData?.amount)?.toFixed(2)}
          </Text>
        </View>
      )}

      <Pressable
        className="mt-40"
        onPress={() => Linking.openURL('https://ahmedibra.com')}>
        <Text>
          <Text className="text-center">
            <Icon name="user" size={20} />{' '}
          </Text>
          Developed by:
          <Text className="font-bold underline text-blue-700">
            {' '}
            Ahmed Ibrahim
          </Text>
        </Text>
      </Pressable>
    </SafeAreaProvider>
  );
};

export default SMS;
