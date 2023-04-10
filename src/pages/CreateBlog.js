import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  LogBox,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


let oldCoverImageURL;

const CreateBlog = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImg, setCoverImg] = useState(null);
  const [category, setCategory] = useState('');

  let id = route.params?.id;

  const uid = auth().currentUser.uid;
  LogBox.ignoreLogs(['ReactImageView: Image source']);


  const onUploadImage = async () => {
    try {
      const result = await launchImageLibrary({
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
  
  const getBlogData = async (id) => {
    try {
      const snapshot = await firestore()
        .collection(userBlogs)
        .doc(id)
        .collection('blogs')
        .doc()
        .get();
  
      const data = snapshot.data();
      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setCoverImg(data.coverImage);
      oldCoverImageURL = data.coverImage;
    } catch (error) {
      console.log(error);
      // Handle error here
    }
  };
  
  useEffect(() => {
    if (id) {
      getBlogData(id);
    }
  }, [id]);

  async function upladCoverImg(uid) {
    const splitPath = coverImg.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const reference = storage().ref(`/${uid}/images/${imageName}`);
    const data = await reference.putFile(coverImg);
    return await storage().ref(data.metadata.fullPath).getDownloadURL();
  }
  
  const onCreate = async () => {
    if (!title && !content) {
      return false;
    }
    navigation.navigate('Home');

    try {
      const downloadURL = await upladCoverImg(uid);

      firestore().collection('userBlogs').doc(uid).collection('blogs').add({
        title,
        content,
        category,
        coverImage: downloadURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.header} keyboardShouldPersistTaps={'always'}>
      <Text style={styles.headingText}>Create Your Blog</Text>

      <View>
        <TextInput
          style={styles.input}
          multiline={true}
          placeholder="Title"
          numberOfLines={2}
          value={title}
          onChangeText={text => setTitle(text)}
        />
      </View>
      <View>
        <TextInput
          style={[styles.input, {padding: 10, height: 200}]}
          multiline={true}
          placeholder="Content"
          numberOfLines={10}
          value={content}
          onChangeText={text => setContent(text)}
          underlineColorAndroid="transparent"
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          value={category}
          placeholder="Category"
          onChangeText={text => setCategory(text)}
        />
        
      </View>

      <View>
        <View style={{margin: 20}}>
          <TouchableOpacity style={styles.touchabelBtn} onPress={onUploadImage}>
            <Text style={styles.btnText}>Upload Cover Image</Text>
          </TouchableOpacity>
          <Image
            style={styles.image}
            source={{uri: coverImg}}
            resizeMode="cover"
            onError={(error)=>{console.log(error)}}
          />
        </View>
      </View>
      <FontAwesome
        name="check-circle"
        color="white"
        size={44}
        onPress={() => {
          onCreate();
        }}
        style={styles.uploadBtn}
      />
    </ScrollView>
  );
};

export default CreateBlog;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.9,
  },

  input: {
    borderWidth: 0.7,
    borderColor: 'white',
    alignSelf: 'center',
    borderRadius: 5,
    height: 40,
    textAlignVertical: 'top',
    fontSize: 16,
    width: '70%',
    marginTop: 60,
  },

  touchabelBtn: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    shadowColor: 'white',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    elevation: 5,

    width: 200,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginTop: 25,
  },
  uploadBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.5,
    elevation: 10,
  },
  headingText: {
    fontSize: 30,
    fontFamily: 'Montserrat-Black',
    color: 'white',

    marginTop: 10,
    marginLeft: 25,
  },
  btnText: {
    fontFamily: 'Voyage-Bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});
