import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconSLI from 'react-native-vector-icons/SimpleLineIcons';
import React from 'react';
import {constants} from './constants';

export const micIcon = (
  <IconMCI
    key="micIcon"
    name="microphone"
    size={30}
    color={constants.darkCyanColor}
  />
);

export const trashBinIcon = (
  <IconI
    key="trashBinIcon"
    name="trash-bin-outline"
    size={20}
    color={constants.cyanColor}
  />
);

export const soundIcon = (
  <IconAD
    key="soundIcon"
    name="sound"
    size={18}
    color={constants.darkCyanColor}
    style={{paddingRight: 5, paddingTop: 2}}
  />
);

export const languageIcon = (
  <IconMI
    key="languageIcon"
    name="language"
    size={22}
    color={constants.darkPurpleColor}
  />
);

export const helpIcon = (
  <IconMCI
    key="helpIcon"
    name="help-rhombus-outline"
    size={32}
    color={constants.darkCyanColor}
  />
);

export const settingsIcon = (
  <IconMI
    key="settingsIcon"
    name="clear-all"
    size={32}
    color={constants.darkCyanColor}
  />
);

export const sendIcon = (
  <IconFA
    key="sendIcon"
    name="send-o"
    size={22}
    color={constants.darkCyanColor}
    style={{right: 5}}
  />
);

export const trashCanIcon = (
  <IconSLI
    key="trashCanIcon"
    name="trash"
    size={20}
    color={constants.cyanColor}
  />
);
