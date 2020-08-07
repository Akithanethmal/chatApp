import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { GiftedChat, Message, IMessage } from "react-native-gifted-chat";
import { RouteProp } from "@react-navigation/native";
import { TabOneParamList, Chat } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import * as firebase from "firebase";

type ChatViewRouteProps = RouteProp<TabOneParamList, "ChatView">;
type ChatViewNavigationProps = StackNavigationProp<TabOneParamList, "ChatView">;

type Props = {
  route: ChatViewRouteProps;
  navigation: ChatViewNavigationProps;
};
interface ChatViewProps {}

const ChatView = (props: Props) => {
  const user = firebase.auth().currentUser;
  const ref = firebase.database();
  let chatId = props.route.params.chatId;
  const [myImage, setMyImage] = React.useState("");
  const [message, setMessage] = React.useState<Array<IMessage>>([]);
  React.useEffect(() => {
    console.log(chatId);
    loadMessages();
  }, []);
  const loadMessages = () => {
    ref
      .ref("/User/" + user?.uid + "/photoUrl")
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setMyImage(" ");
        } else {
          setMyImage(snapshot.val());
        }
      });
    ref.ref("/Chat/" + chatId + "/").on("value", (snapshot) => {
      const chat: Chat = snapshot.val();
      setMessage([...(chat.messages ? chat.messages : [])]);
    });
  };

  const onSend = React.useCallback((messages = []) => {
    setMessage((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    ref
      .ref("/Chat/" + chatId + "/")
      .once("value")
      .then((snapshot) => {
        const chat: Chat = snapshot.val();
        chat.messages = [...messages, ...(chat.messages ? chat.messages : [])];
        ref.ref("/Chat/" + chatId + "/").update(chat);
      });
  }, []);
  return (
    <GiftedChat
      messages={message}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user?.uid ? user.uid : "1",
        name: user?.displayName ? user?.displayName : "",
        avatar: myImage,
      }}
    />
  );
};

export default ChatView;

const styles = StyleSheet.create({
  container: {},
});
