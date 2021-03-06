export type AuthParamList = {
  Login: undefined;
  Register: undefined;
};
export type BottomTabParamList = {
  Chat: undefined;
  Profile: undefined;
  Home: undefined;
};
export type TabOneParamList = {
  ChatList: undefined;
  ChatView: { chatId?: string | null; title: string };
  AddChat: undefined;
};
export type TabTwoParamList = {
  Profile: undefined;
  EditProfile: undefined;
  ProfileSetting: undefined;
};
export type TabThreeParamList = {
  Home: undefined;
};

export type User = {
  uid?: string;
  email?: string;
  fname?: string;
  lname?: string;
  gender?: string;
  dob?: string;
  chats?: Array<string | null>;
  friends?: Array<string | undefined>;
  photoUrl?: string;
  coverPhotoUrl?: string;
};

export type Chat = {
  id?: string | null;
  users?: Array<string | undefined>;
  messages: Array<Message>;
};
export type ChatUser = {
  _id: string;
  name: string;
  avatar: string;
};
export type Message = {
  _id: string;
  text: string;
  createdAt: Date;
  user: ChatUser;
};
