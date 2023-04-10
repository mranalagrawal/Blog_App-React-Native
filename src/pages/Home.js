import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, memo} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import DATA from '../utils/categories';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '../constants/constants';

const Home = ({route, navigation}) => {
  var id = route.params?.id;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState();

  // get all blogs
  const getBlogData = async () => {
    try {
      setLoading(true);

      firestore()
        .collectionGroup('blogs')
        .onSnapshot(data => {
          const value = data.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          setBlogs(value);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogData();
  }, []);

  return (
    <ScrollView>
      <StatusBar backgroundColor="#2E2F41" />
      <View style={{height: '100%', width: '100%'}}>
        <View style={styles.topContainer}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Icon
                name="menu"
                size={30}
                color="white"
                style={{marginLeft: 15}}
              />
              <Text style={styles.headingTxt}>Discover</Text>
              <Icon
                name="notifications"
                size={30}
                color="white"
                style={{marginRight: 15}}
              />
            </View>

            <View style={styles.searchBar}>
              <Icon
                name="search"
                size={24}
                color="white"
                style={{marginRight: 15}}
              />
              <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
                <TextInput
                  style={{fontSize: 15, fontWeight: '400'}}
                  placeholder="serach Categories"
                />
              </TouchableOpacity>

              <Image
                style={{width: 20, height: 20}}
                source={require('../../assets/images/filter.png')}
              />
            </View>
            <View style={styles.ctgryHeader}>
              <Text style={styles.ctgry}>Categories</Text>
              <Text style={styles.recomnded}>Recommended</Text>

              <Text style={styles.dot}>. . .</Text>
            </View>
            {/* get all the blog categories */}

            <View>
              <FlatList
                style={{marginTop: 15}}
                data={DATA}
                keyExtractor={item => item.id}
                horizontal={true}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('CategoryDetails', {
                          item: item.name,
                        });
                      }}
                      style={styles.nameContainer}>
                      <Text style={styles.name}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </View>
        {/* showing All The Blogs */}

        <View style={styles.loadercontainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              style={styles.activity}
              color="#0000ff"
            />
          ) : (
            <FlatList
              data={blogs}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate(`Details`, {blog: item})}
                    activeOpacity={0.9}
                    key={item.id}>
                    <View style={styles.blog}>
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
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    width: '100%',
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: verticalScale(5),
  },
  headingTxt: {
    fontSize: 18,

    color: 'white',
    fontWeight: 'bold',
  },
  headingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '300',
    alignSelf: 'center',
  },
  item: {
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
  },
  categoryTxt: {
    color: 'white',
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: 'white',
    padding: 5,
    textAlign: 'center',
    margin: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  image: {
    width: horizontalScale(250),
    height: verticalScale(250),
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
  },
  content: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    marginHorizontal: verticalScale(19),
    flex: 1,
    flexWrap: 'wrap',
    marginTop: horizontalScale(12),
    color: 'black',
  },

  blog: {
    width: '75%',
    paddingBottom: 15,
    backgroundColor: 'white',
    marginTop: verticalScale(25),
    marginHorizontal: horizontalScale(10),
    borderRadius: 15,
    alignSelf: 'center',
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
  time: {
    fontSize: 15,
    fontWeight: '700',
    position: 'absolute',
    top: -20,
    left: 22,
    color: 'white',
  },
  searchBar: {
    borderRadius: 5,
    width: '70%',
    height: verticalScale(40),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 0.5,
    borderColor: 'white',
    backgroundColor: '#2E2F41',
  },
  ctgry: {
    fontSize: 18,
    marginLeft: 20,
    borderBottomColor: 'tomato',
    borderBottomWidth: 5,

    paddingBottom: 10,
    fontWeight: '600',
    color: 'white',
  },
  dot: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 15,
    position: 'absolute',
    top: -14,
    right: 0,
  },
  name: {
    fontSize: 15,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'white',
    fontWeight: '500',
    color: 'white',
    marginHorizontal: 15,
    padding: 5,
  },
  activity: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  recomnded: {fontSize: 18, position: 'absolute', left: 130, top: 1},
  nameContainer: {height: verticalScale(50), marginBottom: 15, marginTop: 15},
  ctgryHeader: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadercontainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  topContainer: {backgroundColor: '#2E2F41', width: '100%', height: '3%'},
});
