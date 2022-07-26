import {Dimensions} from 'react-native';

export let windowDimensions = {
  height: Dimensions.get('window').height,
  width: Dimensions.get('window').width,
};
const windowDimensionsListener = Dimensions.addEventListener('change', e => {
  windowDimensions['height'] = e.window.height;
  windowDimensions['width'] = e.window.width;
});
