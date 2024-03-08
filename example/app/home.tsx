import React from 'react';
import {makeTab, useComponentId, useNavigator} from 'rnn-router';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default makeTab(
  function Home() {
    const [componentId] = useComponentId();
    const navigator = useNavigator();

    function onPress() {
      navigator.open('/product/12345?foo=bar', {});
    }

    return (
      <View style={styles.container}>
        <Text>home</Text>
        <Text>{`componentId: ${componentId}`}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text>Push</Text>
        </TouchableOpacity>
      </View>
    );
  },
  {
    topBar: {
      visible: false,
    },
  },
  {
    text: 'Home',
  },
  0,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
