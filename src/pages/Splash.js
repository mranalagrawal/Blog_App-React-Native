import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {GoogleSocialButton} from 'react-native-social-buttons';
import {firebase} from '@react-native-firebase/auth';

const Splash = ({navigation}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '152025883006-hhll5bjg63qh9t327pi16tb6vc4tdfs1.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signInWithGoole = async () => {
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

  return (
    <View style={{height: '100%'}}>
      <Image
        resizeMode="contain"
        source={require('../../assets/images/splash.jpg')}
        style={styles.container}
      />

      <View style={styles.textContainer}>
        <Text style={styles.text}>All Your Blog in one place</Text>
        <Text style={styles.text1}>
          Manage Your accounts on a {'\n'}
          {'            '}single dashboard{' '}
        </Text>
        
        <TouchableOpacity onPress={()=>signInWithGoole()} style={[styles.btnInput,{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}]}>
      <Image source={require('../../assets/images/google.png')} style={styles.googleImage}/>
       <Text style={styles.googleBtnText}>Signin  with Google</Text>
      </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.signupBtn}
          onPress={() => navigation.navigate('Signup')}>
          <Image
            style={styles.signUpImg}
            source={require('../../assets/images/signup.png')}
          />
          <Text style={styles.signUpText}>Register Here</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.textLog}>Have an account? Logged in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '40%',
    backgroundColor: 'black',
  },
  textContainer: {
    width: '100%',
    height: '100%',

    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 27,
    fontWeight: '700',
    color: 'white',
    marginTop: 15,
    textShadowColor: 'white',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    fontFamily: 'montserrat',
  },
  text1: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginTop: 15,
    fontFamily: 'montserrat',
  },

  signupBtn: {
    borderRadius: 5,
    marginTop: 70,
    borderColor: 'transparent',
    borderWidth: 0.6,
    backgroundColor: 'white',
    width: '45%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },

  googleText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'montserrat',
  },
  googleBtn: {
    marginTop: 70,
  },
  textLog: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'montserrat',
  },
  signUpText: {
    fontSize: 21,
    fontWeight: '300',
    fontFamily: 'montserrat',
    textAlign: 'center',
    color: 'black',
  },
  signUpImg: {
    width: 30,
    height: 30,
  },
  googleBtnText: {
    fontSize: 20,
    fontWeight: '300',
    fontFamily: 'montserrat',
    textAlign: 'center',
    color: 'black',
    marginRight:8

  },
  googleImage: {
    width:15,
    height:15,
    marginLeft:5
    },
    btnInput: {
      borderRadius: 5,
      marginTop: 70,
      borderColor: 'transparent',
      borderWidth: 0.6,
      backgroundColor: 'white',
      width: '45%',
      height: 40,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
});
