import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  LogBox
} from 'react-native';
import React, {useState,useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { horizontalScale, verticalScale } from '../constants/constants';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [displayName, setDisplayName] = useState();
  const [displayPicture, setDisplayPicture] = useState();
  const [user, setUser] = useState(null);
  LogBox.ignoreLogs(['ReactImageView: Image source']);

  // signup with google
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '152025883006-hhll5bjg63qh9t327pi16tb6vc4tdfs1.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signUpWithGoole = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential =
        firebase.auth.GoogleAuthProvider.credential(idToken);
      const {user} = await firebase
        .auth()
        .signInWithCredential(googleCredential);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  };

  // display picture
  const onClickPicture = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
      });
  
      if (!result.cancelled) {
        setCoverImg(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      // Handle error here
    }
  };
  
  const onPickPicture = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
  
      if (!result.cancelled) {
        setDisplayPicture(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      // Handle error here
    }
  };

  const onRegister = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCredential.user.uid;
      console.log('User account created & signed in!');

      let downloadUrl = null;

      if (displayPicture) {
        const splitPath = displayPicture.split('/');
        const imageName = splitPath[splitPath.length - 1];
        const reference = storage().ref(`${uid}/images/${imageName}`);
        const data = await reference.putFile(displayPicture);
        downloadUrl = await storage()
          .ref(data.metadata.fullPath)
          .getDownloadURL();
      }

      await firestore().collection('users').doc(uid).set({
        email,
        name,
        displayPicture: downloadUrl,
      });
      console.log('User data saved to Firestore!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('User Already Exists');
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Email address is invalid')
        console.log('That email address is invalid!');
      }
     
      console.log(error)
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={{uri: !displayPicture ? null : displayPicture}}
        style={styles.displayPicture}
      />

      <View style={styles.touchableContainer}>
        <TouchableOpacity onPress={onPickPicture}>
          <Text>Pick Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClickPicture}>
          <Text>Click Picture</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={displayName}
        placeholder="Name"
        onChangeText={text => setDisplayName(text)}
        style={styles.txtInput}
      />
      <TextInput
        value={email}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        style={styles.txtInput}
      />
      <TextInput
        value={password}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        style={styles.txtInput}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.btnInput}
        onPress={() => {
          console.log(displayName,email,password)
          if (!displayName || !email || !password) {
            Alert.alert('Please Fill all The Required Fileds');
          } else {
            onRegister();
          }
        }}>

        <Text style={styles.btnTxt}>Register YourSelf</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 20, marginTop: 30}}>Or</Text>

      {/* Google auth */}
      <TouchableOpacity onPress={()=>signUpWithGoole()} style={[styles.btnInput,{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}]}>
      <Image source={require('../../assets/images/google.png')} style={styles.googleImage}/>
       <Text style={styles.googleBtnText}>Signup with Google</Text>
      </TouchableOpacity>
      
      {/* logged in */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.btnSignup}>
          Joined Us Before ! <Text style={{color: '#00308F'}}> Login </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
  touchableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  displayPicture: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: 25,
    backgroundColor: 'gray',
    marginTop: 80,
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
    borderRadius: 10,
    borderColor: '#FBFAF2',
    borderWidth: 1,
    width: '50%',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    marginTop: 50,
    height: 42,
    backgroundColor: '#FBFAF2',
    padding: 9,
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 20,

    alignSelf: 'center',
    color: 'black',
    opacity: 0.5,
  },
  googleBtnText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'montserrat',
    opacity:0.5
  },
  googleImage: {
  width:horizontalScale(20),
  height:verticalScale(20)
  },
  btnSignup: {
    fontSize: 15,
    marginTop: 45,
  },
});
