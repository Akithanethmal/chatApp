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
import { FloatingAction } from "react-native-floating-action";

type ProfileRouteProps = RouteProp<TabTwoParamList, "Profile">;
type ProfileNavigationProps = StackNavigationProp<TabTwoParamList, "Profile">;

type Props = {
  route: ProfileRouteProps;
  navigation: ProfileNavigationProps;
};

interface ProfileProps {}

const Profile = (props: Props) => {
  const User = firebase.auth().currentUser;
  const dbRef = firebase.database();
  const [image, setImage] = React.useState(" ");
  const [coverImage, setCoverImage] = React.useState(" ");
  const [isLoading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<User>({});

  const actions = [
    {
      text: "setting",
      icon: (
        <Icon name="settings" type="Ionicons" style={{ color: Color.WHITE }} />
      ),
      name: "bt_1",
      position: 1,
      buttonSize: 55,
      color: Color.NAVYBLUE,
    },
    {
      text: "edit",
      icon: (
        <Icon name="md-create" type="Ionicons" style={{ color: Color.WHITE }} />
      ),
      name: "bt_2",
      position: 2,
      buttonSize: 55,
      color: Color.NAVYBLUE,
    },
  ];

  React.useEffect(() => {
    getPermissionAsync();
    const unsubscribe = props.navigation.addListener("focus", () => {
      getUserData();
    });
    return unsubscribe;
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
        setImage(temp.photoUrl ? temp.photoUrl : " ");
        setCoverImage(temp.coverPhotoUrl ? temp.coverPhotoUrl : " ");
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
        uploadImageAsync(result.uri);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  const _pickCoverImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setCoverImage(result.uri);
        uploadCoverImageAsync(result.uri);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  const uploadImageAsync = async (img: string) => {
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
      xhr.open("GET", img, true);
      xhr.send(null);
    });
    const uid = User?.uid;
    const ref = firebase
      .storage()
      .ref("/User/" + uid)
      .child("dp.jpg");
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
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImage(downloadURL);
          dbRef
            .ref("/User/" + User?.uid + "/")
            .update({ photoUrl: downloadURL })
            .then(() => {
              setLoading(false);
              return;
            })
            .catch((error) => {
              alert(error.message);
              setLoading(false);
              return;
            });
        });
      }
    );
  };
  const uploadCoverImageAsync = async (coverImg: string) => {
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
      xhr.open("GET", coverImg, true);
      xhr.send(null);
    });
    const uid = User?.uid;
    const ref = firebase
      .storage()
      .ref("/User/" + uid)
      .child("cover.jpg");
    const uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log("Upload is " + progress + "% done");
      },
      function (error) {
        setLoading(false);
        alert(error.message);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          setCoverImage(downloadURL);
          dbRef
            .ref("/User/" + User?.uid + "/")
            .update({ coverPhotoUrl: downloadURL })
            .then(() => {
              setLoading(false);
              return;
            })
            .catch((error) => {
              alert(error.message);
              setLoading(false);
              return;
            });
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
            <ImageBackground source={{ uri: coverImage }} style={styles.image}>
              <Avatar
                rounded
                title={user.fname?.charAt(0)}
                size="xlarge"
                showAccessory
                onAccessoryPress={() => _pickImage()}
                containerStyle={{
                  top: 50,
                  borderWidth: 4,
                  borderColor: Color.WHITE,
                  position: "absolute",
                  zIndex: 1,
                }}
                source={{
                  uri: image,
                }}
              />
              <View
                style={{
                  width: Layout.window.width,
                  backgroundColor: Color.TRANSPARENT,
                  height: Layout.window.height * 0.3,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  light
                  onPress={() => _pickCoverImage()}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    height: 50,
                    margin: 10,
                  }}
                >
                  <Icon
                    name="md-camera"
                    type="Ionicons"
                    style={{ color: Color.WHITE }}
                  />
                </Button>
              </View>
            </ImageBackground>
          </Row>
          <Row
            style={{
              height: Layout.window.height * 0.05,
              flex: 1,
              justifyContent: "center",
              marginTop: 45,
              marginBottom: 10,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              {user.fname} {user.lname}
            </Text>
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
                  <Icon active style={{ color: Color.GRAY }} name="ios-mail" />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>{user.email}</Text>
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
                  <Text style={{ color: Color.BLACK }}>{user.gender}</Text>
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
                    type="MaterialCommunityIcons"
                    active
                    style={{ color: Color.GRAY }}
                    name="cake-variant"
                  />
                </Left>
                <Body>
                  <Text style={{ color: Color.BLACK }}>
                    {new Date(user.dob ? user.dob : "")
                      .toDateString()
                      .substr(4, 12)}
                  </Text>
                </Body>
              </ListItem>
            </List>
          </Row>
          <Row style={{ height: Layout.window.height * 0.2 }}></Row>
        </Grid>
      </Content>
      <FloatingAction
        actions={actions}
        color={Color.NAVYBLUE}
        onPressItem={(name) => {
          if (name === "bt_1") {
            props.navigation.push("ProfileSetting");
          } else {
            props.navigation.push("EditProfile");
          }
        }}
      />
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {},
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
