import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import useCachedResources from './src/hooks/useCachedResources';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if(!isLoadingComplete){
    return null;
  }
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor='#eee'/>
      <Navigation/>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
