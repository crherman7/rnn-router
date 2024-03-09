import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {makeScreen, useComponentId, useNavigator, useURL} from 'rnn-router';

export default makeScreen(
  function ProductSlug() {
    const [url] = useURL();
    const navigator = useNavigator();
    const [componentId] = useComponentId();

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
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
