/**
 * Created by mark on 2019/7/24
 *
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'

import * as CalendarDateUtils from '../../utils/CalendarDateUtils'
import Colors from '../../res/Colors'

const { width } = Dimensions.get('window')
let cellWidth = parseInt(width / 7)

export default class DayItem extends Component {
  constructor () {
    super()
    this.state = {}
    this._currentDay = null
  }

  shouldComponentUpdate (nextProps) {
    const { width, height, rowData, markDic } = this.props

    let change = (this._currentDay && CalendarDateUtils.isSameDay(this._currentDay, nextProps.beforeDay)) ||
      (this._currentDay && CalendarDateUtils.isSameDay(this._currentDay, nextProps.selectDay))
    let dayKey = CalendarDateUtils.getKeyWhthDay(this._currentDay)
    let markChange = JSON.stringify(markDic[dayKey]) !== JSON.stringify(nextProps.markDic[dayKey])
    return JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(rowData) !== JSON.stringify(nextProps.rowData) || change || markChange
  }

  render () {
    const { rowData, onPress, selectDay, dayStyle } = this.props
    const { year, month, day } = rowData

    cellWidth = parseInt(width / 7)
    let cellHeight = cellWidth
    let currentItemDate = CalendarDateUtils.getSelectDate(year, month, day, 0)
    let isToday = currentItemDate && CalendarDateUtils.isSameDay(currentItemDate, new Date())
    let isSelectDay = currentItemDate && CalendarDateUtils.isSameDay(currentItemDate, selectDay)
    this._currentDay = currentItemDate

    let dayText = day
    let isMark = this._isMark()
    let markText = isMark ? dayStyle.markText : ''
    let bgStyle = dayStyle.bgStyle || {}
    let textBgStyle = dayStyle.textDefStyle || {}
    let textStyle = dayStyle.textDefStyle || {}
    let markTextStyle = dayStyle.markTextStyle || {}
    let markBgStyle = dayStyle.markBgStyle || {}
    let markPointStyle = dayStyle.markPointStyle || {}

    let markStyle = dayStyle.markStyle || 'point'
    if (isSelectDay) {
      textBgStyle = dayStyle.bgSelStyle || { backgroundColor: Colors.grey_ccebff }
      textStyle = dayStyle.textSelStyle || { color: Colors.grey_0c364b, fontSize: 16 }
      markTextStyle = dayStyle.markTextStyle || { color: Colors.grey_85898f, fontSize: 12 }
    }

    if (isToday) {
      if (isSelectDay) {
        textBgStyle = dayStyle.bgTodayStyle || { backgroundColor: Colors.defaultColor }
        textStyle = dayStyle.textTodayStyle || { color: Colors.white, fontSize: 16, fontWeight: 'bold' }
      } else {
        textBgStyle = dayStyle.bgTodayUnSelStyle || { backgroundColor: Colors.white }
        textStyle = dayStyle.textTodayUnSelStyle || { color: Colors.defaultColor, fontSize: 16, fontWeight: 'bold' }
      }
      dayText = '今'
      markTextStyle = dayStyle.markTextTodayStyle || { color: Colors.defaultColor, fontSize: 12 }
      markPointStyle = dayStyle.markPointTodayStyle || {
        width: 6,
        height: 6,
        backgroundColor: Colors.defaultColor,
        borderRadius: 3
      }
    }
    return (
      <View
        style={{
          width: cellWidth,
          height: cellHeight,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <TouchableWithoutFeedback
          onPress={() => { onPress && onPress(rowData) }}>
          <View
            style={{
              width: cellWidth - 1,
              height: cellWidth,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.white,
              ...bgStyle
            }}>
            <View
              style={{
                width: cellWidth / 2,
                height: cellWidth / 2,
                borderRadius: cellWidth / 4,
                justifyContent: 'center',
                alignItems: 'center',
                ...textBgStyle
              }}>
              <Text
                style={{ color: Colors.grey_0c364b, fontSize: 16, ...textStyle }}>{dayText}</Text>
            </View>
            {this._renderMarkView(markText, markTextStyle, markBgStyle, markStyle, markPointStyle, isMark)}
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderMarkView = (markText, markTextStyle, markBgStyle, markStyle, markPointStyle, isMark) => {
    if (!isMark) {
      return (<View
        style={{
          ...styles.markBgStyle,
          ...markBgStyle,
          height: markTextStyle.fontSize || styles.markTextStyle.fontSize
        }} />)
    }
    if (markStyle === 'text') {
      return (
        <View
          style={{
            ...styles.markBgStyle,
            ...markBgStyle,
            height: markTextStyle.fontSize || styles.markTextStyle.fontSize
          }}>
          <Text
            style={{ ...styles.markTextStyle, ...markTextStyle }}>{markText}</Text>
        </View>
      )
    } else {
      return (
        <View
          style={{
            ...styles.markBgStyle,
            ...markBgStyle,
            height: markTextStyle.fontSize || styles.markTextStyle.fontSize
          }}>
          <View
            style={{ ...styles.markPointStyle, ...markPointStyle }} />
        </View>
      )
    }
  }

  _isMark = () => {
    const { markDic } = this.props
    if (this._currentDay) {
      let markResult = markDic[CalendarDateUtils.getKeyWhthDay(this._currentDay)]
      return markResult && markResult.isMark && markResult.isMark === 1
    }
    return false
  }
}

const styles = StyleSheet.create({
  markBgStyle: {
    backgroundColor: Colors.white,
    height: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  markTextStyle: {
    color: Colors.grey_85898f,
    fontSize: 12
  },
  markPointStyle: {
    width: 6,
    height: 6,
    backgroundColor: Colors.grey_85898f,
    borderRadius: 3
  }
})
