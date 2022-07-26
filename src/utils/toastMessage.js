import Toast, {BaseToast} from 'react-native-toast-message';
import React from 'react';
import {constants} from '../constants';
import {windowDimensions} from '../utils/windowListener';

export const showToast = ({
  type = 'info',
  text1 = null,
  text2 = null,
  visibilityTime = 1500,
  position = 'bottom',
  onShow = () => {},
  onHide = () => {},
  onpress = () => {},
}) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,
    visibilityTime: visibilityTime,
    position: position,
    onShow: onShow,
    onHide: onHide,
    onPress: onpress,
  });
};

export const toastComponent = ({config = toastConfig}) => {
  return <Toast config={toastConfig} />;
};

const toastConfig = {
  info: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'cyan',
        width: windowDimensions.width * 0.5,
      }}
      text1Style={{
        fontFamily: constants.fontFamily,
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'normal',
      }}
      text2Style={{
        fontFamily: constants.fontFamily,
        fontSize: 19,
        textAlign: 'center',
      }}
    />
  ),
  error: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'red',
        width: windowDimensions.width * 0.5,
      }}
      text1Style={{
        fontFamily: constants.fontFamily,
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
      }}
      text2Style={{
        fontFamily: constants.fontFamily,
        fontSize: 10,
        textAlign: 'center',
      }}
    />
  ),
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        width: windowDimensions.width * 0.5,
      }}
      text1Style={{
        fontFamily: constants.fontFamily,
        fontSize: 15,
        fontWeight: 'normal',
        textAlign: 'center',
      }}
      text2Style={{
        fontFamily: constants.fontFamily,
        fontSize: 10,
        textAlign: 'center',
      }}
    />
  ),
  special: props => (
    <BaseToast
      {...props}
      style={{
        borderBottomColor: constants.darkPurpleColor,
        borderBottomWidth: 5,
        borderLeftColor: constants.darkPurpleColor,
        width: windowDimensions.width * 0.5,
      }}
      text1Style={{
        fontFamily: constants.fontFamily,
        fontSize: 22,
        fontWeight: 'normal',
        textAlign: 'center',
        color: constants.darkPurpleColor,
        borderBottomWidth: 0.5,
        borderBottomColor: constants.darkGreyColor,
      }}
      text2Style={{
        fontFamily: constants.fontFamily,
        fontSize: 18,
        textAlign: 'center',
        color: constants.darkPurpleColor,
      }}
    />
  ),
};
