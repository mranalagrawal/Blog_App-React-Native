import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {GoogleSocialButton} from 'react-native-social-buttons';
import auth, { firebase } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import firestore from '@react-native-firebase/firestore';



const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

     

  
  const [user, setUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "152025883006-ct2arnq5ga0t2cu2hec80iddhjip5vje.apps.googleusercontent.com",
      offlineAccess: false,
    });
  }, []);

  const signInWithGoole = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const { user } = await firebase.auth().signInWithCredential(googleCredential);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };



  const onLogin = () => {
    auth().signInWithEmailAndPassword(email, password);
  
  };
  // const onLogin = () => {
  //   firestore()
  //     .collection('Users')
  //     // Filter results
  //     .where('email', '==', email)
  //     .get()
  //     .then(quearySnapshot => {
  //       /* ... */
  //       if (quearySnapshot.docs.length === 0) {
  //         Alert.alert('Wrong Credentials');
  //       } else {
  //         console.log(quearySnapshot.docs[0]._data);
  //       }
  //       if (quearySnapshot.docs[0]._data.password === password) {
  //         saveData(
  //           quearySnapshot.docs[0]._data.name,
  //           quearySnapshot.docs[0]._data.userId,
  //         );
  //       } else {
  //         Alert.alert('User NOt Match');
  //       }
  //     })
  //     .catch(err => console.log(err));
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>
        Logged In with one of the following Options
      </Text>
      <TouchableOpacity style={styles.googleBtn}>
        <GoogleSocialButton
          textStyle={styles.googleText}
          onPress={() => signInWithGoole()}
        />
      </TouchableOpacity>
      <TextInput
        value={email}

        placeholder="Enter Your EmailId"
        style={styles.txtInput}
      
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        value={password}
        placeholder="Enter Your Password"
        secureTextEntry
        style={styles.txtInput}
        onChangeText={text => setPassword(text)}

      />
      <Text style={styles.txtForgot}>Forget Password?</Text>
      <TouchableOpacity style={styles.btnInput} onPress={() => onLogin()}>
        <Text style={styles.btnTxt}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.btnSignup}>Don't have account yet? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  txt: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: '400',
    color: 'white',
    alignSelf: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  txtInput: {
    borderRadius: 12,
    borderColor: 'white',
    borderWidth: 1,
    width: '70%',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    marginTop: 50,
    height: 70,
  },
  btnInput: {
    borderRadius: 12,
    borderColor: '#FBFAF2',
    borderWidth: 1,
    width: '55%',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    marginTop: 50,
    height: 50,
    backgroundColor: '#FBFAF2',
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 27,
    marginTop: 10,
    alignSelf: 'center',
    color: 'black',
    opacity: 0.5,
  },
  googleText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'montserrat',
  },
  googleBtn: {
    marginTop: 70,
  },
  txtForgot: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 80,
  },
  btnSignup: {
    fontSize: 15,
    marginTop: 45,
  },
});
