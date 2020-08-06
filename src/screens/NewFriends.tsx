import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'native-base';
import * as firebase from 'firebase';

interface NewFriendsProps {}

const NewFriends = (props: NewFriendsProps) => {
  return (
    <View style={styles.container}>
      <Text>NewFriends</Text>
      <Button onPress={()=>firebase.auth().signOut()}>
        <Text>Log out</Text>
      </Button>
    </View>
  );
};

export default NewFriends;

const styles = StyleSheet.create({
  container: {}
});
