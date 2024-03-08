import React from 'react';
import {makeTab} from 'rnn-router';
import {View, Text, StyleSheet} from 'react-native';

export default makeTab(
  function Settings() {
    return (
      <View style={styles.container}>
        <Text>settings</Text>
      </View>
    );
  },
  {},
  {
    text: 'Settings',
  },
  1,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
