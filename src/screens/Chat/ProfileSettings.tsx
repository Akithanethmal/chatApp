import * as React from "react";
import { StyleSheet } from "react-native";
import { Container, Content, Button, Text, View } from "native-base";
import Layout from "../../constants/Layout";
import * as firebase from "firebase";

interface ProfileSettingProps {}

const ProfileSetting = (props: ProfileSettingProps) => {
  return (
    <Container>
      <Content>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: Layout.window.height * 0.8,
          }}
        >
          <Button
            rounded
            style={{ width: 200, justifyContent: "center" }}
            onPress={() => firebase.auth().signOut()}
          >
            <Text>Logout</Text>
          </Button>
        </View>
      </Content>
    </Container>
  );
};

export default ProfileSetting;

const styles = StyleSheet.create({
  container: {},
});
