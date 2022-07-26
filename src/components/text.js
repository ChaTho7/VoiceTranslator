import React, {Component} from 'react';
import {Text, TextProps} from 'react-native';
import {constants} from '../constants';

export default class AppText extends Component<TextProps> {
  render() {
    const {style, ...rest} = this.props;
    return (
      <Text style={[{fontFamily: constants.fontFamily}, style]} {...rest}>
        {this.props.children}
      </Text>
    );
  }
}
