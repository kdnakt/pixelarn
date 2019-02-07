import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class TermsScreen extends Component {

  render() {
    const { navigation } = this.props,
        uri = navigation.getParam('uri')
    return (
      <WebView
        source={{uri: uri}}
      />
    );
  }
}