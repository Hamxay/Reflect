/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
// import {vader} from 'vader-sentiment'
function SentimentAnalysis(): JSX.Element {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<number>();
  const [word, setWord] = useState<string>('');
  const onChangeValue = (text: string) => {
    setInput(text);
  };
  const vader = require('vader-sentiment');
  const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
  useEffect(() => {
    if (input.length > 0 && intensity.compound > 0.05) {
      setWord('Positive');
    } else if (input.length > 0 && intensity.compound < 0) {
      setWord('Negative');
    } else {
      setWord('Neutral');
    }
    let temp = intensity.compound * 100;

    temp = Math.abs(temp);
    setResult(Math.round(temp));
  }, [intensity]);
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Welcome to the Reflect</Text>
      <TextInput
        style={styles.inputFeild}
        placeholder="Enter Text"
        onChangeText={onChangeValue}
        value={input}
      />
      <Text style={styles.text}>{input}</Text>
      {input.length > 0 && (
        <Text style={styles.text}>
          {result != 0 ? result + '%' : 100 + '%'} {word}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    padding: 30,
  },
  inputFeild: {
    borderWidth: 1,
    width: '90%',
    borderRadius: 5,
    backgroundColor: 'black',
    borderColor: 'white',
    color: 'white',
    height: '15%',
  },
  text: {
    fontSize: 16,
    color: 'white',
    padding: 20,
    fontWeight: '600',
  },
});

export default SentimentAnalysis;
