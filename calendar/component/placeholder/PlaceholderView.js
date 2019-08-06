/**
 * Created by mark on 2019/7/30
 *
 */

import React, { Component } from 'react'
import { View, Image } from 'react-native'
import Images from '../../res/Images'

export default class PlaceholderView extends Component {
  render () {
    const { width, height } = this.props
    return (
      <View style={{
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image
          style={{ width: 100, height: 93 }}
          resizeMode={'contain'}
          source={Images.defaultImg} />
      </View>
    )
  }
}
