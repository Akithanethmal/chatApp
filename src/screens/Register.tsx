import * as React from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Grid,
  Row,
  Text,
  Button,
  DatePicker,
  Picker,
  Icon,
} from "native-base";
import color from "../constants/Color";
import Layout from "../constants/Layout";
import * as firebase from "firebase";

interface RegisterProps {}

const Register = (props: RegisterProps) => {
  const [fname, setfname] = React.useState("");
  const [lname, setlname] = React.useState("");
  const [email, setemail] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [cpassword, setcpassword] = React.useState("");
  const [dob, setdob] = React.useState<Date>(new Date());
  const [gender, setgender] = React.useState("female");

  const register = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        const token = user?.uid;
        user?.updateProfile({
          displayName: fname + " " + lname,
          photoURL: "",
        });
        const ref = firebase.database();
        ref
          .ref("User/" + token + "/")
          .set({
            fname: fname,
            lname: lname,
            dob: dob.toString(),
            gender: gender,
          })
          .catch((err) => alert(err));
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };
  return (
    <Container>
      <Content>
        <Grid>
          <Row
            style={{
              height: Layout.window.height * 0.1,
              //backgroundColor: color.GREEN,
            }}
          ></Row>
          <Row
            style={{
              height: Layout.window.height * 0.8,
              // backgroundColor: color.INDIGO,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form
              style={{
                // paddingHorizontal: 30,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Item rounded style={styles.inputbox}>
                <Input
                  underlineColorAndroid="rgba(0,0,0,0)"
                  selectionColor="#fff"
                  placeholderTextColor="#000000"
                  placeholder="First Name"
                  onChangeText={(txt) => {
                    setfname(txt);
                  }}
                  value={fname}
                />
              </Item>
              <Item rounded style={styles.inputbox}>
                <Input
                  underlineColorAndroid="rgba(0,0,0,0)"
                  selectionColor="#fff"
                  placeholderTextColor="#000000"
                  placeholder="Last Name"
                  onChangeText={(txt) => setlname(txt)}
                  value={lname}
                />
              </Item>
              <Item rounded style={styles.inputbox}>
                <Input
                  underlineColorAndroid="rgba(0,0,0,0)"
                  selectionColor="#fff"
                  placeholderTextColor="#000000"
                  placeholder="Email"
                  keyboardType="email-address"
                  onChangeText={(txt) => setemail(txt)}
                  value={email}
                />
              </Item>

              <Item rounded style={styles.inputbox}>
                <Input
                  underlineColorAndroid="rgba(0,0,0,0)"
                  selectionColor="#fff"
                  placeholderTextColor="#000000"
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(txt) => setpassword(txt)}
                  value={password}
                />
              </Item>
              <Item rounded style={styles.inputbox}>
                <Input
                  underlineColorAndroid="rgba(0,0,0,0)"
                  selectionColor="#fff"
                  placeholderTextColor="#000000"
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  onChangeText={(txt) => setcpassword(txt)}
                  value={cpassword}
                />
              </Item>
              <Item style={styles.inputbox} rounded>
                <Text>Date of birth</Text>
                <DatePicker
                  defaultDate={new Date(dob)}
                  minimumDate={new Date(1980, 1, 1)}
                  maximumDate={new Date()}
                  locale={"en"}
                  modalTransparent={false}
                  animationType={"fade"}
                  placeHolderText="Select date"
                  textStyle={{ color: "green" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  disabled={false}
                  onDateChange={(txt) => setdob(new Date(txt))}
                />
              </Item>
              <Item rounded style={styles.inputbox}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  headerStyle={{ backgroundColor: "#b95dd3" }}
                  headerBackButtonTextStyle={{ color: "#fff" }}
                  headerTitleStyle={{ color: "#fff" }}
                  selectedValue={gender}
                  onValueChange={(value) => setgender(value)}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </Item>
            </Form>
          </Row>
          <Row>
            <Button primary style={styles.button} onPress={() => register()}>
              <Text style={styles.buttonText}> Sign Up </Text>
            </Button>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputbox: {
    width: 375,
    height: 50,
    backgroundColor: color.TRANSPARENT,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 20,
    marginVertical: 10,
  },
  button: {
    //backgroundColor: "#2626FF",
    width: 100,
    // height: 50,
    borderRadius: 25,
    // marginVertical: 10,
    // paddingVertical: 16,
    justifyContent: "center",
    marginHorizontal: 150,
    alignContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: color.WHITE,
    textAlign: "center",
  },
});
