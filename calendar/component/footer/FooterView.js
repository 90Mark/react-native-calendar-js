/**
 * Created by mark on 2019/7/29
 *
 */

import React, { Component } from 'react'
import {
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  Image
} from 'react-native'
import Images from '../../res/Images'

export default class FooterView extends Component {
  constructor () {
    super()
    this.state = {}
  }

  shouldComponentUpdate (nextProps) {
    const { isOpen } = this.props
    return isOpen !== nextProps.isOpen
  }

  render () {
    const { width, footerClick, isOpen } = this.props
    return (
      <View
        style={{ width: width, height: 40, backgroundColor: 'transparent', justifyContent: 'flex-start' }}>
        <ImageBackground
          source={Images.line}
          style={{ width: width, height: 25, justifyContent: 'flex-start', alignItems: 'center' }}>

          <TouchableWithoutFeedback
            onPress={footerClick && footerClick}>
            <Image
              style={{ width: 40, height: 40 }}
              source={isOpen ? Images.up : Images.down} />
          </TouchableWithoutFeedback>
        </ImageBackground>
      </View>
    )
  }
}