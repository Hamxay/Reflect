import React, { useEffect } from 'react';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import SentimentAnalysis from './src/sentimentAnalysis';
import {request, PERMISSIONS, checkMultiple} from 'react-native-permissions';
import VoiceTest from './src/recordAudtio';
import Service from './src/service';
import FinalScreen from './src/finalScreen';
function App() {
  const IOSPermissions = async() =>{
    await checkMultiple([PERMISSIONS.IOS.MICROPHONE]).then((statuses) => {
      console.log('MICROPHONE', statuses[PERMISSIONS.IOS.MICROPHONE]);

    }).catch((err) =>{
      console.log({err});
    })
  }
  useEffect(()=>{
    if(Platform.OS === 'ios'){
      IOSPermissions()
    }
  },[])
  return (
    <SafeAreaView style={{  backgroundColor: 'black', flex:1, justifyContent:'center'}}>
      <StatusBar
        backgroundColor={'black'}
        barStyle={'light-content'}
      />
    {/* <SafeAreaView style={{  backgroundColor: 'black', flex:1, justifyContent:'center'}}> */}
      {/* <SentimentAnalysis /> */}
      {/* <VoiceTest/> */}
      <FinalScreen/>
    </SafeAreaView>
  );
}

export default App;
