import * as React from "react";
import { Avatar, colors } from "react-native-elements";

import {
  Container,
  Content,
  Grid,
  Row,
  Text,
  List,
  ListItem,
  Left,
  Button,
  Icon,
  Body,
  Right,
  Switch,
} from "native-base";
import Layout from "../constants/Layout";
import Color from "../constants/Color";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { ImageBackground, StyleSheet, View } from "react-native";
import * as firebase from "firebase";
import { AuthParamList, TabTwoParamList, User } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import Loading from "./Loading";

type ProfileRouteProps = RouteProp<TabTwoParamList, "Profile">;
type ProfileNavigationProps = StackNavigationProp<TabTwoParamList, "Profile">;

type Props = {
  route: ProfileRouteProps;
  navigation: ProfileNavigationProps;
};

const image = {
  uri:
    "https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg",
};

interface ProfileProps {}

const Profile = (props: Props) => {
  const User = firebase.auth().currentUser;
  const [image, setImage] = React.useState(" ");
  const [isLoading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<User>({});

  React.useEffect(() => {
    getPermissionAsync();
    getUserData();
  }, []);
  const getUserData = async () => {
    setLoading(true);
    setUser({});
    firebase
      .database()
      .ref(`User/${User?.uid}`)
      .once("value", function (snapshot) {
        console.log(snapshot.val());
        let temp: User = snapshot.val();
        setUser(temp);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  const getPermissionAsync = async () => {
    if (Constants.platform?.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  const uploadImageAsync = async () => {
    setLoading(true);
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
        setLoading(false);
        props.navigation.pop();
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    const uid = User?.uid;
    const ref = firebase
      .storage()
      .ref("/Shop/" + uid)
      .child(new Date().getTime().toString() + ".jpg");
    const uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = snapshot.bytesTransferred / snapshot.totalBytes;
        // this.setState({ progress: progress });
        console.log("Upload is " + progress + "% done");
      },
      function (error) {
        setLoading(false);
        alert(error.message);
        props.navigation.pop();
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
        });
      }
    );
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container>
      <Content>
        <Grid>
          <Row style={{ height: Layout.window.height * 0.3 }}>
            <ImageBackground source={{ uri: image }} style={styles.image}>
              <Avatar
                rounded
                size="xlarge"
                showAccessory
                onAccessoryPress={() => _pickImage()}
                containerStyle={{
                  marginTop: 60,
                  borderWidth: 4,
                  borderColor: Color.WHITE,
                }}
                source={{
                  uri: "https://randomuser.me/api/portraits/women/65.jpg",
                }}
              />
            </ImageBackground>
          </Row>
          <Row
            style={{
              height: Layout.window.height * 0.05,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              User.FirstName
            </Text>
          </Row>
          <Row
            style={{
              height: Layout.window.height * 0.05,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text note>Freelance Developer</Text>
          </Row>
          <Row style={{ height: Layout.window.height * 0.4 }}>
            <List>
              <ListItem
                icon
                noBorder
                style={{ width: Layout.window.height }}
                noIndent
              >
                <Left>
                  <Icon
                    active
                    style={{ color: Color.GRAY }}
                    name="ios-person"
                  />
                </Left>
                <Body>
          <Text style={{ color: Color.BLACK }}>{user.fname}</Text>
                </Body>
              </ListItem>
              <ListItem
                icon
                noBorder
                style={{ width: Layout.window.height }}
                noIndent
              >
                <Left>
                  <Icon
                    active
                    style={{ color: Color.GRAY }}
                    name="ios-person"
                  />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>{user.lname}</Text>
                </Body>
              </ListItem>
              <ListItem
                icon
                noBorder
                style={{ width: Layout.window.height }}
                noIndent
              >
                <Left>
                  <Icon active style={{ color: Color.GRAY }} name="ios-mail" />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>
                    {user.email}
                  </Text>
                </Body>
              </ListItem>
              <ListItem
                icon
                noBorder
                style={{ width: Layout.window.height }}
                noIndent
              >
                <Left>
                  <Icon active style={{ color: Color.GRAY }} name="ios-call" />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>
                    {user.gender}
                  </Text>
                </Body>
              </ListItem>
              <ListItem
                icon
                noBorder
                style={{ width: Layout.window.height }}
                noIndent
              >
                <Left>
                  <Icon active style={{ color: Color.GRAY }} name="ios-call" />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>
                    {user.dob}
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Row>
          <Row style={{ height: Layout.window.height * 0.2 }}></Row>
        </Grid>
      </Content>
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {},
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});
