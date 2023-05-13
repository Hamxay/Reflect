// import React, { useEffect, useState } from 'react';
// import { View, Text, Button } from 'react-native';
// import { NativeModules, NativeEventEmitter } from 'react-native';

// const { BackgroundRecordingService } = NativeModules;
// const backgroundRecordingEventEmitter = new NativeEventEmitter(BackgroundRecordingService);

// const App = () => {
//   const [isRecording, setIsRecording] = useState(false);
// console.log({NativeModules, BackgroundRecordingService});

//   useEffect(() => {
//     const subscription = backgroundRecordingEventEmitter.addListener(
//       'BackgroundRecordingEvent',
//       event => {
//         setIsRecording(event.isRecording);
//       }
//     );

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const startRecording = () => {
//     BackgroundRecordingService.startRecording();
//   };

//   const stopRecording = () => {
//     BackgroundRecordingService.stopRecording();
//   };

//   return (
//     <View>
//       <Text>Background Recording Example</Text>
//       <Text>Status: {isRecording ? 'Recording' : 'Not Recording'}</Text>
//       <Button title="Start Recording" onPress={startRecording} />
//       <Button title="Stop Recording" onPress={stopRecording} disabled={!isRecording} />
//     </View>
//   );
// };

// export default App;



import React from 'react'
import { Text } from 'react-native'
import BackgroundTask from 'react-native-background-task'
 
BackgroundTask.define(() => {
  console.log('Hello from a background task')
  BackgroundTask.finish()
})
 
class MyApp extends React.Component {
  componentDidMount() {
    BackgroundTask.schedule()
  }
  
  render() {
    return <Text style={{color:'white'}}>Hello world</Text>
  }
}
export default MyApp