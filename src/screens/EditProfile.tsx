import * as React from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Picker,
  Icon,
  View,
  Button,
  Text,
  DatePicker,
} from "native-base";
import * as firebase from "firebase";
import { User, TabTwoParamList } from "../types";
import Loading from "./Loading";
import Color from "../constants/Color";
import Layout from "../constants/Layout";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type EditProfileRouteProps = RouteProp<TabTwoParamList, "EditProfile">;
type EditProfileNavigationProps = StackNavigationProp<
  TabTwoParamList,
  "EditProfile"
>;

type Props = {
  route: EditProfileRouteProps;
  navigation: EditProfileNavigationProps;
};

interface EditProfileProps {}

const EditProfile = (props: Props) => {
  const user = firebase.auth().currentUser;
  const ref = firebase.database();
  const [fname, setFName] = React.useState<string | undefined>("");
  const [lname, setLName] = React.useState<string | undefined>("");
  const [email, setEmail] = React.useState<string | undefined>("");
  const [gender, setGender] = React.useState<string | undefined>("");
  const [dob, setDob] = React.useState<Date | undefined>(new Date());
  const [isLoading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    ref
      .ref("/User/" + user?.uid + "/")
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setLoading(false);
          alert("Usernot found!");
        }
        const data: User = snapshot.val();
        setFName(data.fname ? data.fname : undefined);
        setLName(data.lname ? data.lname : undefined);
        setEmail(data.email ? data.email : undefined);
        setGender(data.gender ? data.gender : undefined);
        setDob(data.dob ? new Date(data.dob) : undefined);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  const update = () => {
    setLoading(true);
    if (!validation()) {
      setLoading(false);
      return;
    }
    const newData: User = {
      fname: fname,
      lname: lname,
      gender: gender,
      dob: dob?.toString(),
    };

    ref
      .ref("/User/" + user?.uid + "/")
      .update(newData)
      .then(() => {
        setLoading(false);
        props.navigation.pop();
      })
      .catch((error) => {
        setLoading(false);
        alert(error.message);
      });
  };

  const validation = () => {
    if (!fname) {
      alert("First Name cannot be empty!");
      return false;
    }
    if (!lname) {
      alert("Last Name cannot be empty!");
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container>
      <Content>
        <Form
          style={{
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        >
          <Item stackedLabel last>
            <Label>FirstName</Label>
            <Input
              onChangeText={(txt) => {
                setFName(txt);
              }}
              value={fname}
            />
          </Item>
          <Item stackedLabel last>
            <Label>LastName</Label>
            <Input onChangeText={(txt) => setLName(txt)} value={lname} />
          </Item>
          <Item stackedLabel last disabled>
            <Label style={{ color: Color.GRAY }}> Email</Label>
            <Input
              style={{ color: Color.GRAY }}
              disabled
              onChangeText={(txt) => setEmail(txt)}
              value={email}
            />
          </Item>
          <Item style={styles.inputbox} rounded>
            <Text>Date of birth</Text>
            <DatePicker
              defaultDate={dob}
              minimumDate={new Date(1980, 1, 1)}
              maximumDate={new Date()}
              locale={"en"}
              modalTransparent={false}
              animationType={"fade"}
              placeHolderText="Select date"
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              disabled={false}
              onDateChange={(txt) => setDob(new Date(txt))}
            />
          </Item>
          <Item picker style={{ marginVertical: 10 }}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Select your Gender"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </Item>
        </Form>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Button
            rounded
            style={{ width: 200, justifyContent: "center", marginVertical: 30 }}
            onPress={() => update()}
          >
            <Text>update</Text>
          </Button>
        </View>
      </Content>
    </Container>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {},
  inputbox: {
    width: 375,
    height: 50,
    backgroundColor: Color.TRANSPARENT,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 20,
    marginVertical: 10,
  },
});
