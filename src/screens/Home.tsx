import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Color from "../constants/Color";
import Layout from "../constants/Layout";

interface HomeProps {}

const NewFriends = (props: HomeProps) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: Layout.window.height * 0.4,
      }}
    >
      <Text style={{ fontSize: 25, fontWeight: "bold", color: Color.BLACK }}>
        17001171
      </Text>
      <Text style={{ fontSize: 25, fontWeight: "bold", color: Color.BLACK }}>
        L.G.A.Nethmal
      </Text>
    </View>
  );
};

export default NewFriends;

const styles = StyleSheet.create({
  container: {},
});
