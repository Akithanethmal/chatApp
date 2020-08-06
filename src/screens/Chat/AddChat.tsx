import * as React from 'react';
import { StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import { User, Chat } from '../../types';
import { Container, Content, List, Text, View, ListItem, Thumbnail, Left, Body, Right, Button } from 'native-base';
import Color from '../../constants/Color';
import Loading from '../Loading';

interface AddChatProps {}

const AddChat = (props: AddChatProps) => {
  const user = firebase.auth().currentUser;
  const ref = firebase.database();
  const [userList, setUserList] = React.useState<Array<User>>([])
  const [isLoading, setLoading] = React.useState<boolean>(true)

React.useEffect(()=>{
  loadData()
},[])

  const loadData = () =>{
    setLoading(true);
    ref.ref('/User/').once('value')
    .then((snapshot)=>{
      setUserList([]);
      if(!snapshot.exists()){
        return;
      }
      const userData = snapshot.val()
      let friends:Array<string|undefined> = [];
      let myData:User = {};
      if(user?.uid){
        myData = userData[user?.uid]
        friends = myData.friends?myData.friends:[]
      }
      else{
        setLoading(false);
        alert('Error occured!')
        return;
      }
      if(friends.length!==0){
        friends.map((value,i)=>{
          delete userData[value?value:""]
        })
      }
      for(let key in userData){
        if(key!==user.uid){
          let tempUser:User = userData[key];
          tempUser.uid = key;
          setUserList(prevState=>[...prevState,tempUser])
          setLoading(false);
        }
      }
    })
    .catch((error)=>{
      setLoading(false);
      alert(error.message)
    })
  }

  const add = (uid:string|undefined)=>{
    setLoading(true)
    console.log(uid);
    ref.ref('/User/'+user?.uid+'/').once('value')
    .then((snapshot)=>{
      const mydata:User = snapshot.val();
      let tempFriends = mydata.friends;
      let chats = mydata.chats;
      tempFriends = tempFriends?[...tempFriends,uid]:[uid];
      const newChat:Chat = {
        users:[user?.uid,uid],
        messages:[]
      }
      const chatId = ref.ref('/Chat/').push(newChat)
      
      chats = chats?[...chats,chatId.key]:[chatId.key];

      ref.ref('/User/'+uid+'/').once('value')
      .then((snapshot)=>{
        const data:User = snapshot.val();
        const temp = data.friends?[...data.friends,user?.uid]:[user?.uid];
        const chat = data.chats?[...data.chats,chatId.key]:[chatId.key];
        data.friends = temp;
        data.chats = chat;
        ref.ref('/User/'+uid+'/').update(data)
        .then(()=>{
          ref.ref('/User/'+user?.uid+'/').update({friends:tempFriends, chats:chats})
          .then(()=>{
            loadData();
            setLoading(false)
          })
          .catch(error=>{
            setLoading(false)
            alert(error.message)
          })
        })
        .catch((error)=>{
          setLoading(false);
          alert(error.message)
        })
      })
    })
    .catch(error=>{
      setLoading(false)
      alert(error.message)
    })
  }


  if(isLoading){
    return(
      <Loading/>
    )
  }
  return (
    <Container>
      <Content>
        <List style={{flex:1}}>
          {
            userList.length === 0 ?
             <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
               <Text style={{color:Color.NAVYBLUE, fontWeight:'bold'}}>No Users Available!</Text>
             </View>
             :
             userList.map((value,i)=>{
               return(
                 <ListItem key={i} noIndent style={{borderColor:Color.NAVYBLUE, borderWidth:1, borderRadius:10, marginVertical:5, marginHorizontal:10}}>
                   <Left style={{alignItems:'center'}}>
                    <Thumbnail source={{uri:'https://randomuser.me/api/portraits/women/65.jpg'}} />
                    <Body>
                      <Text>{value.fname + " "+ value.lname}</Text>
                      <Text note>{value.email}</Text>
                    </Body>
                   </Left>
                   <Right>
                     <Button
                      bordered style={{borderRadius:10}}
                      onPress={()=>add(value.uid)}
                      >
                       <Text>Add</Text>
                     </Button>
                   </Right>
                 </ListItem>
               )
             })
          }
        </List>
      </Content>
    </Container>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {}
});
