import React from 'react';
import {View} from 'react-native';
import SentimentAnalysis from './src/sentimentAnalysis';

function App() {
  return (
    <View style={{  backgroundColor: 'black', flex:1, justifyContent:'center'}}>
      <SentimentAnalysis />
    </View>
  );
}

export default App;
