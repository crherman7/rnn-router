import React from 'react';
import {makeScreen, useComponentId, useNavigator, useURL} from 'rnn-router';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default makeScreen(
  function ProductSlug() {
    const [componentId] = useComponentId();
    const [url] = useURL();
    const navigator = useNavigator();

    function onPress() {
      navigator.open('/settings', {});
    }

    return (
      <View style={styles.container}>
        <Text>product slug</Text>
        <Text>{`componentId: ${componentId}`}</Text>
        <Text>{`url: ${JSON.stringify(url)}`}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text>Open</Text>
        </TouchableOpacity>
      </View>
    );
  },
  {
    topBar: {
      visible: false,
    },
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
