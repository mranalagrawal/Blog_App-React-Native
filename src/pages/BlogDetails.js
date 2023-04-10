import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import { verticalScale } from '../constants/constants';

const Details = ({route}) => {
  const {blog} = route.params;

  return (
    <ScrollView>
      {/* Blog Image and Title */}

      <View style={{flex: 1}}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{uri: blog.coverImage}}
        />

        <View style={styles.staticData}>
          <Text style={styles.ctgory}>Category: {blog.category}</Text>
          <Text style={styles.titleHeading}>
            TITLE : <Text style={styles.title}>{blog.title}</Text>
          </Text>
        </View>

        {/* Blog ContentDetails */}

        <View style={styles.ContentIconContainer}>
          <Text style={styles.ContentIcon}>
            Content <Text style={{fontSize: 20, fontWeight: 'bold'}}> ⤵</Text>
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.time, {fontWeight: 'bold', marginRight: 3}]}>
            CreatedAt:{' '}
            <Text style={styles.time}>
              {blog.createdAt.toDate().toLocaleDateString()}{' '}
            </Text>
          </Text>
        </View>
        <Text style={styles.paraTxt}>{blog.content}</Text>
      </View>
    </ScrollView>
  );
};
export default Details;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  blog: {
    width: '100%',

    marginTop: 25,
    marginHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'center',
  },
  image: {
    width: '90%',
    height: verticalScale(400),
    marginTop: 35,
    marginHorizontal: 15,
    alignSelf: 'center',
    borderRadius: 20,
  },
  paraTxt: {
    color: 'black',
    fontSize: 20,
    margin: 15,
  },
  ctgory: {
    fontSize: 15,
    fontWeight: '700',
    color: 'black',
    margin: 15,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: '300',
    margin: 15,
  },
  time: {
    fontSize: 15,
    fontWeight: '400',
    color: 'black',
    marginRight: 7,
  },
  staticData: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  titleHeading: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8,
    color: 'black',
  },
  ContentIconContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  ContentIcon: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 8,
    marginLeft: 15,
    color: 'black',
  },
});
