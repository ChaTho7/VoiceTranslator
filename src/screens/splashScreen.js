import React from 'react';
import {SafeAreaView} from 'react-native';
import AppText from '../components/text';
import LottieView from 'lottie-react-native';
import {constants} from '../constants';
import {useEffect} from 'react';

export default function SplashScren({navigation}) {
  var copyright_text = '© 2022 - ChaTho\nAll Rıghts Reserved';

  useEffect(() => {
    async function getCache() {
      if ((await constants.cache.get('isFirstRun')) === undefined) {
        await constants.cache.set('isFirstRun', 'true');
      }
    }
    getCache();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: constants.darkIceColor,
      }}>
      <LottieView
        style={{
          flex: 1,
        }}
        source={require('../../assets/animations/splash_screen2.json')}
        autoPlay
        loop={false}
        onAnimationFinish={() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'CardsScreen'}],
          });
        }}
      />
      <AppText
        style={{
          flex: 1,
          textAlign: 'center',
          alignSelf: 'flex-end',
          marginBottom: 30,
          fontSize: 12,
        }}>
        {copyright_text}
      </AppText>
    </SafeAreaView>
  );
}
