import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Grid,
  Row,
  Text,
  Button,
} from "native-base";
import { RouteProp } from "@react-navigation/native";
import { AuthParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Colors } from "react-native/Libraries/NewAppScreen";
import color from "../constants/Color";
import * as firebase from "firebase";

type LoginRouteProps = RouteProp<AuthParamList, "Login">;
type LoginNavigationProps = StackNavigationProp<AuthParamList, "Login">;
type props = {
  route: LoginRouteProps;
  navigation: LoginNavigationProps;
};

const Login = ({ route, navigation }: props) => {
  const [email, setEmail] = React.useState("");
  const [pwd, setPWD] = React.useState("");
  const login = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pwd)
      .catch((err) => alert(err));
  };
  return (
    <Container>
      <Content>
        <Grid>
          <Row
            style={{
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.LogoText}>Chat App</Text>
          </Row>
          <Row
            style={{
              height: 200,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Item>
                <Input
                  style={styles.inputbox}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  placeholder="Email"
                  selectionColor="#fff"
                  keyboardType="email-address"
                  placeholderTextColor="#000000"
                  onChangeText={(txt) => setEmail(txt)}
                  value={email}
                />
              </Item>
              <Item>
                <Input
                  style={styles.inputbox}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  secureTextEntry={true}
                  placeholder="Password"
                  placeholderTextColor="#000000"
                  onChangeText={(txt) => setPWD(txt)}
                  value={pwd}
                />
              </Item>
            </Form>
          </Row>
          <Row
            style={{
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button primary style={styles.button} onPress={() => login()}>
              <Text style={styles.buttonText}> Sign In </Text>
            </Button>
          </Row>
          <Row
            style={{
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Don't you have an account</Text>
            <Item
              underline={false}
              bordered={false}
              onPress={() => navigation.push("Register")}
            >
              <Text style={{ color: color.BLUE }}> Register now...</Text>
            </Item>
          </Row>
        </Grid>
      </Content>
    </Container>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.WHITE,
    alignContent: "center",
    justifyContent: "center",
    paddingVertical: 40,
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
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: color.WHITE,
    textAlign: "center",
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
  LogoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: color.BLACK,
    textAlign: "center",
  },
});
