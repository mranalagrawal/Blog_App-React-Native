import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect, memo} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore, {firebase} from '@react-native-firebase/firestore';
import DATA from '../utils/Static';
import auth from '@react-native-firebase/auth';
import {SliderBox} from 'react-native-image-slider-box';

const Home = ({route, navigation}) => {
  var id = route.params?.id;

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState();
 
  const category = blogs.map(e => {
    return e.category;
  });


  const getBlogData = async () => {

    try {
      setLoading(true);

      firestore().collectionGroup('blogs').onSnapshot((data)=>{
        // console.log(data.docs.)
        const value = data.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(value);
        setBlogs(value);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
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
        <View
          style={{backgroundColor: '#2E2F41', width: '100%', height: '12%'}}>
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

            <View
              style={{
                borderRadius: 5,
                width: '70%',
                height: 40,
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 15,
                marginBottom: 15,
                borderWidth: 0.5,
                borderColor: 'white',
                backgroundColor: '#2E2F41',
              }}>
              <Icon
                name="search"
                size={24}
                color="white"
                style={{marginRight: 15}}
              />
              <TouchableOpacity onPress={() => {}}>
                <TextInput
                  style={{fontSize: 15, fontWeight: '400'}}
                  placeholder="serach Categories"
                 
             
                />
              </TouchableOpacity>

              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/images/filter.png')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 30,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 20,
                  borderBottomColor: 'tomato',
                  borderBottomWidth: 5,

                  paddingBottom: 10,
                  fontWeight: '600',
                  color: 'white',
                }}>
                Categories
              </Text>
              <Text
                style={{fontSize: 18, position: 'absolute', left: 130, top: 1}}>
                Recommended
              </Text>

              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: 'white',
                  marginRight: 15,
                  position: 'absolute',
                  top: -14,
                  right: 0,
                }}>
                . . .
              </Text>
            </View>
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
                      style={{height: 50, marginBottom: 15, marginTop: 15}}>
                      <Text
                        style={{
                          fontSize: 15,
                          borderRadius: 8,
                          borderWidth: 0.5,
                          borderColor: 'white',
                          fontWeight: '500',
                          color: 'white',
                          marginHorizontal: 15,
                          padding: 5,
                        }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginBottom: 5,
              flexWrap: 'wrap',
            }}>
            {loading ? (
              <ActivityIndicator size="large" style={{justifyContent:"center", alignItems:"center", alignSelf:"center"}} color="#0000ff" />
            ) : (
              <FlatList
                data={blogs}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(`Details`, {blog: item})
                      }
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
                          <Text style={styles.categoryText}>
                            {item.category}
                          </Text>
                          <Text numberOfLines={1} style={styles.titleTxt}>
                            {item.title}
                          </Text>
                          {/* <Text numberOfLines={1} style={styles.time}>
                            CreatedAt:
                            {item.createdAt.toDate().toLocaleDateString()}
                          </Text> */}
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    marginTop: 5,
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
    width: 300,
    height: 250,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
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

  blog: {
    width: '75%',
    height: 360,
    backgroundColor: 'white',
    marginTop: 25,
    marginHorizontal: 10,
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
});
