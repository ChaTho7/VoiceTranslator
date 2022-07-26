import React, {useEffect} from 'react';
import Routes from './navigation/routes';
import {checkNotifications} from 'react-native-permissions';

export default function App() {
  useEffect(async () => {
    await checkNotifications().then(({status, settings}) => {
      if (status != 'granted') {
        requestNotifications(['alert', 'sound']);
      }
    });

    return () => {};
  }, []);
  return <Routes />;
}
