import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppNavigator from './src/component/Navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
