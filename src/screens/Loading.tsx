import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';
import Color from '../constants/Color';

interface LoadingProps {}

const Loading = (props: LoadingProps) => {
  return (
    <View style={styles.container}>
      <Spinner color={Color.NAVYBLUE} size='large'/>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
      flex:1,
      justifyContent:'center'
  }
});
