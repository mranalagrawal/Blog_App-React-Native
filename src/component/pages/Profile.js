import { StyleSheet, Text,Image, View,Alert,ScrollView,TouchableOpacity, FlatList } from 'react-native'
import React,{useState, useEffect} from 'react'
import auth,{firebase} from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';



const Profile = ({navigation, route}) => {
  const id = route.params?.id;
  const [blogs, setBlogs] = useState([]);
    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
  
  const getBlogData = () => {
    firestore()
      .collection('userBlogs')
      .doc(auth().currentUser.uid)
      .collection('blogs')

      .onSnapshot(quearySnapshot => {
        const data = [];
        quearySnapshot.forEach(documentSnapshot => {
          data.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setBlogs(data);
      });
  };
  useEffect(() => {
    getBlogData();
  }, []);
  


  
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }

    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;
  
    if (!user) {
      return (
        <View style={{backgroundColor:"red"}}>
          <Text>Login</Text>
        </View>
      );
    }


    async function Signout() {
      try {
        // Display an alert asking the user if they're sure they want to log out
        Alert.alert(
          'Log out',
          'Are you sure you want to log out?',
          [
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
          ],
        );
      } catch (error) {
        console.error(error);
      }
    }



 

    const handleDeleteAccount = async () => {
      const currentUser = firebase.auth().currentUser;
    
      // Check if the user signed in with Google
      const providerData = currentUser.providerData;
      const isGoogleUser = providerData.some(
        (provider) => provider.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
      );
    
      // If the user signed in with Google, unlink their account before deleting it
      if (isGoogleUser) {
        try {
          await currentUser.unlink(firebase.auth.GoogleAuthProvider.PROVIDER_ID);
          await GoogleSignin.signOut();
    
          console.log('Google account unlinked successfully.');
        } catch (error) {
          console.error('Error unlinking Google account:', error);
          return;
        }
      }
    
      // Get a reference to the user's posts collection
      const userPostsRef = firebase.firestore().collection('posts').where('userId', '==', currentUser.uid);
    
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
              userPostsRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.delete().then(() => {
                    console.log(`Post with ID ${doc.id} deleted successfully.`);
                  }).catch((error) => {
                    console.error(`Error deleting post with ID ${doc.id}:`, error);
                  });
                });
              }).catch((error) => {
                console.error('Error getting user posts:', error);
              });
    
              // Delete the user account
              currentUser.delete()
                .then(() => {
                  console.log('User account deleted successfully.');
                })
                .catch((error) => {
                  console.error('Error deleting user account:', error);
                });
            },
          },
        ],
        { cancelable: false }
      );
    };
  



  return (
    <ScrollView style={{backgroundColor:"#2E2F41"}}>
    
     
        <View style={{width:"100%", justifyContent:"center", alignItems:"center"}}>
          <Image source={{uri:user.photoURL}} style={{width:100, height:100, margin:50,marginBottom:15,borderWidth:3,borderColor:"white", borderRadius:100,}}/>
          <Text  style={{color:"white",alignSelf:"center" ,opacity:1 ,fontSize:20, fontWeight:"bold", marginBottom:10}}> {user.displayName}</Text>
          
      <Text  style={{color:"wnite", fontSize:9, fontWeight:"600", marginBottom:25}}>{user.email}</Text> 
       


      


      
      <View style={{height:"85%"}}>
      <View style={{alignSelf:"center",marginTop:40, flexDirection:"row" }}>
       <TouchableOpacity style={{ backgroundColor:"#3D88F3", borderColor:"#3D88F3", borderRadius:25, position:"absolute", left:0,zIndex:1, padding:15,paddingLeft:55, paddingRight:55}}>
      <Text style={{color:"white", fontSize:14, fontWeight:"700"}}> Posts </Text>

    </TouchableOpacity>
    <TouchableOpacity style={{ backgroundColor:"#2E2F41", borderColor:"black", borderRadius:25, borderWidth:0.8, padding:15,width:"65%", height:48}}>
    <Text style={{position:"absolute", right:55,color:"white",fontSize:18, top:10}}>Video</Text>

    </TouchableOpacity>

       </View>
      <FlatList
        data={blogs}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.blog}
              onPress={() => navigation.navigate(`Details`, {blog: item})}
  key={item.id}>
              <Image
                resizeMode="cover"
                style={styles.image}
                source={{uri: item.coverImage}}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text numberOfLines={1} style={styles.titleTxt}>
                  {item.title}
                </Text>
              </View>
              <Text numberOfLines={1} style={styles.content}>
                {item.content}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      </View>
        </View>
  
       
     
    </ScrollView>
  );
};




 
  


export default Profile

const styles = StyleSheet.create({
  blog: {
    width: '40%',
    height: 200,
    backgroundColor: 'white',
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'center',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
  },
  content: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 5,
    color: 'black',
  },
  categoryText: {
    color: 'black',
    width: '50%',
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: 'black',
    padding: 4,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
  titleTxt: {
    fontSize: 18,
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },
})