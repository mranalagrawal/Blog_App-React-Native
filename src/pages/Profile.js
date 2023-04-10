import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {horizontalScale, verticalScale} from '../constants/constants';

const Profile = ({navigation, route}) => {
  const id = route.params?.id;
  const [blogs, setBlogs] = useState([]);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const getBlogData = () => {
    try {
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
    } catch (error) {
      console.log('unhandler fix', error);
    }
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
      <View style={{backgroundColor: 'red'}}>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{backgroundColor: '#2E2F41'}}>
      <View style={styles.container}>
      {/* Logged In User Details */}
        <Image source={{uri: user.photoURL}} style={styles.userImage} />
        <Text style={styles.userName}>{user.displayName}</Text>

        <Text style={styles.userEmail}>{user.email}</Text>

          {/* logged in users Post */}
        <View style={{height: '85%'}}>
          <View style={styles.mediaContainer}>
            <TouchableOpacity style={styles.postContainer}>
              <Text style={styles.postText}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.VideoContainer}>
              <Text style={styles.videoText}>Video</Text>
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
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    alignSelf: 'center',
    opacity: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userEmail: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 25,
  },
  blog: {
    width: '42%',
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
  userImage: {
    width: horizontalScale(100),
    height: verticalScale(100),
    margin: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 100,
    marginTop: 150,
  },
  postContainer: {
    backgroundColor: '#3D88F3',
    borderColor: '#3D88F3',
    borderRadius: 25,
    position: 'absolute',
    left: 0,
    zIndex: 1,
    padding: 15,
    paddingLeft: 55,
    paddingRight: 55,
  },
  postText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  VideoContainer: {
    backgroundColor: '#2E2F41',
    borderColor: 'black',
    borderRadius: 25,
    borderWidth: 0.8,
    padding: 15,
    width: '65%',
    height: verticalScale(40),
  },
  videoText: {
    position: 'absolute',
    right: 55,
    color: 'white',
    fontSize: 18,
    top: 10,
  },
  mediaContainer: {alignSelf: 'center', marginTop: 40, flexDirection: 'row'},
});
