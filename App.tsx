import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import SentimentAnalysis from './src/sentimentAnalysis';

function App() {
  return (
    <SafeAreaView style={{  backgroundColor: 'black', flex:1, justifyContent:'center'}}>
      <StatusBar
        backgroundColor={'black'}
        barStyle={'light-content'}
      />
    {/* <SafeAreaView style={{  backgroundColor: 'black', flex:1, justifyContent:'center'}}> */}
      <SentimentAnalysis />
    </SafeAreaView>
  );
}

export default App;
