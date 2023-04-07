import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';


const CategoryDetails = ({route, navigation}) => {
  const [blogs, setBlogs] = useState([]);
  var category = route.params.item;
  const getBlogData = () => {
    firestore()
      .collectionGroup('blogs')
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
  };
  
  useEffect(() => {
    getBlogData();
  }, []);
  
  const filteredData = [];
  
  blogs.forEach(e => {
    let a = e.category.trim();
    let b = category.trim();
  
    if (a == b) {
      filteredData.push({
        id: e.id,
        userId: e.userId,
        coverImage: e.coverImage,
        category: e.category,
        title: e.title,
        content: e.content,
      });
    }
  });
  
  const handleBlogPress = (blogId) => {
    const selectedBlog = blogs.find(blog => blog.id === blogId);
    navigation.navigate('Details', { blog: selectedBlog });
  };
  
  return (
    <View style={{ flex: 1 }}>
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBlogPress(item.id)}
              key={item.id}>
              <View style={styles.blog}>
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={{ uri: item.coverImage }}
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
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{ fontSize: 25, color: 'black', fontWeight: '700' }}>
            No Blogs Found For Particular category
          </Text>
        </View>
      )}
    </View>
  );
  
};


export default CategoryDetails;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  blog: {
    width: '75%',
    height: 360,
    backgroundColor: 'white',
    marginTop: 25,
    marginHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'center',
  },
  image: {
    width: 300,
    height: 250,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
  },
  categoryText: {
    color: 'black',
    width: '30%',
    borderRadius: 3,
    borderWidth: 0.2,
    borderColor: 'black',
    padding: 4,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 16,
  },
  titleTxt: {
    fontSize: 18,
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  content: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: 19,
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 12,
    color: 'black',
  },
});
