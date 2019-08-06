/**
 * Created by mark on 2019/7/16
 *
 */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default class CalendarView extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: []
    }
  }

  render () {
    return this._titleView()
  }

  _titleView = () => {
    const { width, height } = this.props
    let weekTitleArr = '日一二三四五六'.split('')
    return (
      <View style={{
        width: width,
        height: height,
        ...styles.bgView
      }}>
        {this._renderTitleCell(weekTitleArr)}
      </View>
    )
  }

  _renderTitleCell = (weekTitleArr) => {
    const { width, height, titleStyle } = this.props
    let cellWidth = width / 7
    let textWeekTitle = titleStyle.textWeekTitle || {}
    let bgWeekTitle = titleStyle.bgWeekTitle || {}

    return weekTitleArr.map((key) => {
      return (
        <View
          style={{
            width: cellWidth,
            height: height,
            ...styles.bgWeekTitle,
            ...bgWeekTitle
          }}
          key={key}>
          <Text style={{ ...styles.textWeekTitle, ...textWeekTitle }}>{key}</Text>
        </View>
      )
    })
  }
}

const styles = StyleSheet.create({
  bgView: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  bgWeekTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  textWeekTitle: {
    fontSize: 16,
    color: '#000'
  }
})
