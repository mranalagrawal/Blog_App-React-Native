import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {} from 'react-native-gesture-handler';

const Category = ({navigation}) => {
  return (
    <ScrollView style={{backgroundColor: 'black'}}>
      <Text style={styles.headingTxt}>
        What You Want To Read Just Tap Below ⬇
      </Text>

      <View style={styles.container}>
        <FlatList
          data={DATA}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('CategoryDetails', {item: item.name});
                }}>
                <Text
                  style={[
                    styles.txt,
                    {
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </ScrollView>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 30,
  },
  txt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    borderRadius: 15,
    borderWidth: 0.9,
    padding: 10,
    borderColor: 'white',
    marginTop: 25,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  headingTxt: {
    marginTop: 35,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});
