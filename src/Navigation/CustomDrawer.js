import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import auth, {firebase} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const CustomDrawer = props => {

  async function Signout() {
    try {
      // Display an alert asking the user if they're sure they want to log out
      Alert.alert('Log out', 'Are you sure you want to log out?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log out',
          onPress: async () => {
            // Sign out of Firebase
            await auth().signOut();

            // Sign out of Google Sign-In
            await GoogleSignin.signOut();
          },
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteAccount = async () => {
    const currentUser = firebase.auth().currentUser;

    // Check if the user signed in with Google
    const providerData = currentUser.providerData;
    const isGoogleUser = providerData.some(
      provider =>
        provider.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    );

    // If the user signed in with Google, unlink their account before deleting it
    if (isGoogleUser) {
      try {
        await currentUser.unlink(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
        await GoogleSignin.signOut();

        console.log('Google account unlinked successfully.');
      } catch (error) {
        console.log('Error unlinking Google account:', error);
        return;
      }
    }

    // Get a reference to the user's posts collection
    const userPostsRef = firebase
      .firestore()
      .collection('posts')
      .where('userId', '==', currentUser.uid);

    // Show an alert to confirm the deletion
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Delete the user's posts
            userPostsRef
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                  doc.ref
                    .delete()
                    .then(() => {
                      console.log(
                        `Post with ID ${doc.id} deleted successfully.`,
                      );
                    })
                    .catch(error => {
                      console.error(
                        `Error deleting post with ID ${doc.id}:`,
                        error,
                      );
                    });
                });
              })
              .catch(error => {
                console.error('Error getting user posts:', error);
              });

            // Delete the user account
            currentUser
              .delete()
              .then(() => {
                console.log('User account deleted successfully.');
              })
              .catch(error => {
                console.log('Error deleting user account:', error);
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => Signout()}
          style={styles.signoutContainer}>
          <Text style={styles.signoutText}>
            
            Sign Out
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteAccount()}
          style={styles.deleteContainer}>
          <Text style={styles.deleteText}>
       
            Delete User
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container:{flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  signoutContainer:{
    backgroundColor: '#2E2F41',
    padding: 15,
    paddingLeft: 45,
    marginTop: 50,
    paddingRight: 45,
  },
signoutText:{color: 'white', fontSize: 14, fontWeight: '700'},
deleteContainer:{
  backgroundColor: 'red',
  marginTop: 50,
  padding: 15,
  paddingLeft: 45,
  paddingRight: 45,
  marginLeft: 15,
},
deleteText:{color: 'white', fontSize: 14, fontWeight: '700'},
});
