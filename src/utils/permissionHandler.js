import {PermissionsAndroid} from 'react-native';

export const checkPermission = async permission => {
  const check = await PermissionsAndroid.check(permission).catch(error => {
    console.log('Error =>', error);
  });

  return check;
};

export const requestPermission = async permission => {
  await PermissionsAndroid.request(permission, {
    title: 'Permission Request',
    buttonPositive: 'Allow',
    buttonNegative: 'Never',
    buttonNeutral: 'Later',
    message: permission,
  }).catch(error => {
    console.log('Error =>', error);
  });
};
