/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme, View, StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TailwindProvider} from 'tailwindcss-react-native';
import SMS from './src/components/SMS';

<style type="text/css">{`
   @font-face {
     font-family: 'MaterialIcons';
     src: url(${require('react-native-vector-icons/Fonts/MaterialIcons.ttf')}) format('truetype');
   }
 
   @font-face {
     font-family: 'FontAwesome';
     src: url(${require('react-native-vector-icons/Fonts/FontAwesome.ttf')}) format('truetype');
   }
 `}</style>;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <TailwindProvider>
        <View style={styles.container}>
          <SMS />
        </View>
      </TailwindProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});
