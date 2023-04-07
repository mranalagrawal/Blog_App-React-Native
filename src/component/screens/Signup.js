import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {GoogleSocialButton} from 'react-native-social-buttons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [displayName, setDisplayName] = useState();
  const [displayPicture, setDisplayPicture] = useState();

  // display picture
  const onClickPicture = () => {
    launchCamera(
      {
        mediaType: 'photo',
      },
      data => {
        setDisplayPicture(data.assets[0].uri);
      },
    );
  };

  const onPickPicture = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      data => {
        setDisplayPicture(data.assets[0].uri);
      },
    );
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
        console.log('That email address is invalid!');
      }

      console.error(error);
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
          if (displayName !== '' && email !== '' && password !== '') {
            onRegister();
          } else {
            Alert.alert('Please Fill all The Required Fileds');
          }
        }}>
        <Text style={styles.btnTxt}>Register YourSelf</Text>
      </TouchableOpacity>
      <Text style={{fontSize: 20, marginTop: 30}}>Or</Text>
      <TouchableOpacity style={styles.googleBtn}>
        <GoogleSocialButton
          textStyle={styles.googleText}
          onPress={() => alert('Hello')}
        />
      </TouchableOpacity>
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
    width: 50,
    height: 50,
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
  googleText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'montserrat',
  },
  googleBtn: {
    marginTop: 30,
  },
  btnSignup: {
    fontSize: 15,
    marginTop: 45,
  },
});
