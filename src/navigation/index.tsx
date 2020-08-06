import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './bottomTabNavigator';
import * as firebase from 'firebase';
import Loading from '../screens/Loading';


export default  function Navigation(){
    const [authToken,setToken] = React.useState('')
    const [isLoading, setLoading] = React.useState(true)

    React.useEffect(()=>{
        setLoading(true);
        firebase.auth().onAuthStateChanged((user)=>{
            setToken(user?.uid?user.uid:'')
            setLoading(false)
        })
    },[])

    if(isLoading){
        return(
            <Loading/>
        )
    }
    return(
        <NavigationContainer>
            {authToken?
                <BottomTabNavigator/>
                :
                <AuthNavigator/>
            }
        </NavigationContainer>
    );
}