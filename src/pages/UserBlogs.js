import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { horizontalScale, verticalScale } from '../constants/constants';

const UserBlogs = ({navigation, route}) => {

  const [blogs, setBlogs] = useState([]);

  const id = route.params?.id;

  // getUserBLog
  const getBlogData = () => {
    try {
      firestore()
        .collection('userBlogs')
        .doc(auth().currentUser.uid)
        .collection('blogs')
        .onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach(documentSnapshot => {
            data.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setBlogs(data);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getBlogData();
  }, []);


  return (
    <ScrollView style={{backgroundColor: '#2E2F41'}}>
      <FlatList
        data={blogs}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.blog}
              activeOpacity={0.9}
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
    </ScrollView>
  );
};

export default UserBlogs;

const styles = StyleSheet.create({
  image: {
    width: horizontalScale(250),
    height: verticalScale (250),
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

  blog: {
    width: '75%',
   paddingBottom:5,
    backgroundColor: 'white',
    marginTop: 25,
    marginHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'center',
  },
  categoryText: {
    color: 'black',
    width: '30%',
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
});
