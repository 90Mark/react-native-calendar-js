# react-native-calendar-js
日历_纯js





效果：




calendarStyle  支持的外部设置样式

本月文字：  textDefStyle:{color:'#',fontSize:11}
灰色文字：  textAshStyle:{color:'#',fontSize:11}
选中文字：  textSelStyle:{color:'#',fontSize:11}
今天文字：  textTodayStyle:{color:'#',fontSize:11}

选中的圈圈  bgSelStyle:{backgroundColor:'#'}
今天的圈圈  bgTodayStyle:{backgroundColor:'#'}

没有选中的今天的背景   bgTodayUnSelStyle   
没有选中的今天的文字   textTodayUnSelStyle  

日背景色 bgUnSelStyle:  {backgroundColor:'#'}

周头文字    textWeekTitle:{color:'#',fontSize:8}
周头背景      bgWeekTitle:{backgroundColor:'#'}

标记的样式： markStyle={'point','text'}  小圆点 / 文字

标记的style:  markPointTodayStyle={width:8,height:8, backgroundColor:'#',borderRadius:4}
markPointTodayStyle={width:8,height:8, backgroundColor:'#',borderRadius:4}

背景色，文字大小，文字颜色
标记的style:   markTextTodayStyle={ color:'#',fontSize:8}
标记的style:   markTextStyle={ color:'#',fontSize:8}

isOpen={false}  是否展开日历



markDic   想标记的数据，支持格式：markDic = {
                            20190201: { isMark: 1 },
                            20190216: { isMark: 1 },
                            20190705: { isMark: 1 },
                            20190720: { isMark: 1 },
                            20190730: { isMark: 1 }
                          }




export  function：
selectSomeMonth  选中某月
selectSomeDay   跳转至某天




使用方法

```
/**
 * Created by mark on 2019/8/6
 *
 */

import React, { Component } from 'react'
import {
  TouchableWithoutFeedback,
  View,
  Dimensions,
  Text
} from 'react-native'

import { CalendarList } from 'react-native-calendar-js'

const { width } = Dimensions.get('window')
let cellWidth = parseInt(width / 7)
let viewHeight = cellWidth * 6

export default class TestIndex extends Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    let markDic = {
      20190201: { isMark: 1 },
      20190216: { isMark: 1 },
      20190705: { isMark: 1 },
      20190720: { isMark: 1 },
      20190730: { isMark: 1 }
    }
    return (
      <View style={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <View style={{ width: '100%', height: 80, backgroundColor: '#eee', paddingTop: 30, flexDirection: 'row' }}>
          <TouchableWithoutFeedback
            onPress={this._gotoDay}>
            <Text style={{ marginLeft: 20, width: 60, height: 40, backgroundColor: '#f00' }}>返回今天</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={this._gotoMonth}>
            <Text style={{ marginLeft: 20, width: 80, height: 40, backgroundColor: '#f00' }}>跳转至2月</Text>
          </TouchableWithoutFeedback>
        </View>
        <CalendarList
          ref={(r) => { this.calendarList = r }}
          selectMonth={new Date()}
          selectDay={new Date()}
          width={width}
          height={viewHeight}
          isOpen={false}
          onChangeMonth={this._onChangeMonth}
          clickItem={this._clickItem}
          clickUndefined={this._clickUndefined}
          lastPageCallback={this._lastPageCallback}
          calendarStyle={{
            backgroundColor: '#fff',
            dayStyle: {
              backgroundColor: '#fff',
              markStyle: 'point'
            }
          }}
          markDic={markDic}
        />
        <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
          <Text>{'hello world'}</Text>
          <Text>{this.state.month}+++{this.state.day}</Text>
        </View>
      </View>
    )
  }

  _onChangeMonth = (date) => {
    console.log('test 当前月', date)
    this.setState({
      month: `${date.getFullYear()}/${date.getMonth() + 1}`
    })
  }

  _clickItem = (date) => {
    console.log('test 选中某天', date)
    this.setState({
      day: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    })
  }

  _clickUndefined = (isClick) => {
    if (isClick) {
      console.log('test 日期超出，选不了' + isClick)
    }
  }

  _lastPageCallback = () => {
    console.log('test 第一页/最后一页，翻不动了')
  }

  // 选中某月
  _gotoMonth = () => {
    let date = new Date()
    date.setFullYear(2019)
    date.setMonth(1) // 设置 Date 对象中月份 (0 ~ 11)
    date.setDate(1)
    this.calendarList && this.calendarList.selectSomeMonth(date)
  }

  // 跳转至某天
  _gotoDay = () => {
    this.calendarList && this.calendarList.selectSomeDay(new Date())
  }
}



```
