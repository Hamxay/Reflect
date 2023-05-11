import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Voice, {

  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
const Service = () => {
  const [results, setResults] = useState([]);
  const [pitch, setPitch] = useState('');
  const [start, setStart] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;


    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    setStart(true)
  }, []);
  const onSpeechVolumeChanged = (e: any) => {
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };

  
  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
  };

  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
  };

  const _startRecognizing = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };


  useEffect(() =>{
  if(start){
    ReactNativeForegroundService.add_task(() =>_startRecognizing, {
      delay: 100,
      onLoop: true,
      taskId: "taskid",
      onError: (e) => console.log(`Error logging:`, e),
    });
  }
  },[start])
  const startService = () => {
    ReactNativeForegroundService.start({
      id: 144,
      title: "Foreground Service",
      message: "you are online!",
    });
    
  };

  const stopService = () => {
    _stopRecognizing()
    ReactNativeForegroundService.stop()
  };

  return (
    <View>
    
    <Text style={{color:'white'}}>Results</Text>
    <Text style={{color:'white'}}>{`Pitch: ${pitch}`}</Text>

        {results.map((result, index) => {
          return (
            <Text style={{color:'white'}}key={`result-${index}`} >
              {result}
            </Text>
          );
        })}
      <Button onPress={startService} title="Start Service" />
      <Button onPress={stopService} title="Stop Service" />
    </View>
  );
};

export default Service;