import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import ForegroundService from '@supersami/rn-foreground-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Voice, {

  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
const Service = () => {


  const [recognized, setRecognized] = useState('');
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    setStarted(true)
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    console.log('onSpeechRecognized: ', e);
    setRecognized('√');
  };

  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    setEnd('√');
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    setError(JSON.stringify(e.error));
  };

  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e: any) => {
    // setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e: any) => {
    setPitch(e.value);
  };

  const _startRecognizing = async () => {
    setRecognized('');
    setPitch('');
    setError('');
    setResults([]);
    setPartialResults([]);
    setEnd('');

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

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    setRecognized('');
    setPitch('');
    setError('');
    setResults([]);
    setPartialResults([]);
    setEnd('');
  };







  useEffect(() =>{
    if(started){
      ReactNativeForegroundService.add_task(() => _startRecognizing(), {
        delay: 100,
        onLoop: true,
        taskId: "taskid",
        onError: (e) => console.log(`Error logging:`, e),
      });
    }
   
  },[started])
  const startService = () => {
    ReactNativeForegroundService.start({
      id: 144,
      title: "Foreground Service",
      message: "you are online!",
    });
    
  };

  const stopService = () => {
    ReactNativeForegroundService.stop()
    _stopRecognizing()
  };

  return (
    <>
     <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native Voice!</Text>
        <Text style={styles.instructions}>
          Press the button and start speaking.
        </Text>
        <Text style={styles.stat}>{`Recognized: ${
          recognized
        }`}</Text>
        <Text style={styles.stat}>{`Pitch: ${pitch}`}</Text>
        <Text style={styles.stat}>{`Error: ${error}`}</Text>
        <Text style={styles.stat}>Results</Text>
        {results.map((result, index) => {
          return (
            <Text key={`result-${index}`} style={styles.stat}>
              {result}
            </Text>
          );
        })}
      
        <Text style={styles.stat}>{`End: ${end}`}</Text>
        <Button onPress={startService} title="Start Service" />

        
        <Button onPress={stopService} title="Stop Service" />
       
        <TouchableHighlight onPress={_cancelRecognizing}>
          <Text style={styles.action}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={_destroyRecognizer}>
          <Text style={styles.action}>Destroy</Text>
        </TouchableHighlight>
      </View>
     
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
});

export default Service;