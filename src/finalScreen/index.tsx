import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import ForegroundService from '@supersami/rn-foreground-service';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Voice, {

  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
const FinalScreen = () => {


    const [input, setInput] = useState<boolean>(false);

  const [end, setEnd] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  const [result, setResult] = useState<number>();
  const [word, setWord] = useState<string>('');

  const vader = require('vader-sentiment');
  let intensity:any;
   intensity = vader.SentimentIntensityAnalyzer.polarity_scores(partialResults.length>0 === true ? partialResults[0]: '');
   console.log({result,word});
   
  if(partialResults && partialResults.length>0){
    intensity = vader.SentimentIntensityAnalyzer.polarity_scores(partialResults[0]);
  }
  else {
  }
  useEffect(() => {
    // console.log(partialResults.length>0);
    
    if (partialResults?.length > 0 && intensity.compound > 0.05) {
      setWord('Positive');
    } else if (partialResults?.length > 0 && intensity.compound < 0) {
      setWord('Negative');
    } else {
      setWord('Neutral');
    }
    let temp = intensity.compound * 100;

    temp = Math.abs(temp);
    setResult(Math.round(temp));
  }, [intensity, partialResults]);


  useEffect(() => {
    
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(()=>{
    if(input){
      Voice.start('en-US');
      console.log("@@@@@");
      setInput(false)
    }
  },[input])

  const onSpeechStart = (e: any) => {
    console.log('onSpeechStart: ', e);

  };

  const onSpeechEnd = (e: any) => {
    console.log('onSpeechEnd: ', e);
    setInput(true)

    setEnd('√');
  };

  const onSpeechResults = (e: any) => {
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e: any) => {
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };

 

  const _startRecognizing = async () => {
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
      console.log("stop recognizing");
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };




  const startService = async () => {
    await ReactNativeForegroundService.start({
      id: 144,
      title: "Foreground Service",
      message: "you are online!",
    });

    await _startRecognizing()
    
  };

  const stopService = async () => {
    await ReactNativeForegroundService.stop() 
    await _stopRecognizing()
  };

  return (
    <>
     <View style={styles.sectionContainer}>
      
         <Text style={styles.text}>Recorded Text</Text>
        {partialResults.map((result, index) => {
          return (
            <Text key={`partial-result-${index}`} style={styles.text}>
              {result}
            </Text>
          );
        })}
        <Text style={styles.text}>{`End: ${end}`}</Text>
        <View>
        {word.length > 0 && (
        <Text style={styles.text}>
          {result != 0 ? result + '%' : 100 + '%'} {word}
        </Text>
      )}
        
        </View>
        <TouchableOpacity onPress={startService}  style={styles.button}>
            <Text style={styles.text}>{"Start Service"}</Text>
            </TouchableOpacity>
        
        <TouchableOpacity onPress={stopService}  style={styles.button}>
            <Text style={styles.text}>{"Stop Service"}</Text>
            </TouchableOpacity>
       
       
      </View>
     
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    color: 'white',
    width: '80%',
    cursor: 'pointer',
    borderRadius: 6,
    borderWidth:2,backgroundColor:'gray'
  },

  sectionContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
  text: {
    fontSize: 16,
    color: 'white',
    padding: 20,
    fontWeight: '600',
  },
});

export default FinalScreen;