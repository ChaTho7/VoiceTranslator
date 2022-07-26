import {Cache} from 'react-native-cache';
import AsyncStorage from '@react-native-community/async-storage';

export const constants = {
  redColor: '#ff0a14',
  darkGreenColor: '#3A7F56',
  renaissanceGreenColor: '#002832',
  darkPurpleColor: '#3A1056',
  darkGreyColor: '#3a4256',
  darkIceColor: '#005D6D',
  darkCyanColor: '#2b6a6a',
  cyanColor: '#00DBF3',
  fontFamily: 'BebasNeue-Regular',
  cache: new Cache({
    namespace: 'myapp',
    policy: {
      maxEntries: 50000,
    },
    backend: AsyncStorage,
  }),
};
