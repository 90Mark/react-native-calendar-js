/**
 * Created by mark on 2019/7/24
 *
 */

import React, { Component } from 'react'
import {
  FlatList, InteractionManager
} from 'react-native'
import * as CalendarDateUtils from '../../utils/CalendarDateUtils'
import MonthItem from './MonthItem'

export default class WeekCalendar extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: [],
      beforeDay: null,
      selectDay: new Date()
    }
    this._pageCount = 11
    this._page = 5
    this._currentSelect = null
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { width, height, selectDay, markDic } = this.props
    const { dataSource, beforeDay } = this.state
    return JSON.stringify(dataSource) !== JSON.stringify(nextState.dataSource) ||
      !CalendarDateUtils.isSameDay(this.state.selectDay, nextState.selectDay) ||
      !CalendarDateUtils.isSameDay(beforeDay, nextState.beforeDay) ||
      JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(markDic) !== JSON.stringify(nextProps.markDic) ||
      !CalendarDateUtils.isSameDay(selectDay, nextProps.selectDay)
  }

  componentWillMount () {
    const { selectDay } = this.props
    this.setState({
      selectDay: selectDay || new Date()
    })
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => {
      const { selectMonth } = this.props
      this._initData(selectMonth || new Date())
    })
  }

  _initData = (date) => {
    let dataSource = CalendarDateUtils.initWeekDataSource(date, this._pageCount)
    this.setState({
      dataSource
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          this.flatList && this.flatList.scrollToIndex({ viewPosition: 0, index: this._page, animated: false })
          const { selectDay, dataSource } = this.state
          const { index } = CalendarDateUtils.findWeekGotoDay(selectDay, dataSource, this._page)
          index !== -1 && this._callbackSelectDay(selectDay, index, false, true)
          this._currentSelect && this._selectDay()
        })
      })
    })
  }

  _keyExtractor = (item, index) => index

  render () {
    const { width, dayStyle, isOpen, height } = this.props
    const { dataSource } = this.state
    if (!dataSource || dataSource.length <= 0) return null
    return (
      <FlatList
        ref={(r) => { this.flatList = r }}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        style={{
          width: width,
          height: isOpen ? 0 : height,
          position: 'absolute',
          top: 0,
          backgroundColor: dayStyle.backgroundColor
        }}
        data={dataSource}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        getItemLayout={(param, index) => ({ length: 11, offset: width * index, index })}
        initialNumToRender={6}
      />
    )
  }

  _renderItem = ({ item }) => {
    const { width, height, dayStyle, markDic } = this.props
    const { selectDay, beforeDay } = this.state
    return (<MonthItem
      width={width}
      height={height}
      itemData={item}
      selectDay={selectDay}
      beforeDay={beforeDay}
      dayStyle={dayStyle}
      markDic={markDic}
      clickItem={this._clickItem}
    />)
  }

  _onMomentumScrollEnd = (event) => {
    let x = event.nativeEvent.contentOffset.x
    const { width, endScroll, lastPageCallback } = this.props
    let page = parseInt(x / width)
    if (page !== this._page) {
      this._page = page
      this._selectDay()
    }
    endScroll && endScroll()
    if (this._page === 0 || this._page === this._pageCount - 1) {
      lastPageCallback && lastPageCallback()
    }
  }

  _selectDay = () => {
    this._currentSelect = null
    const { dataSource, selectDay } = this.state
    let date = CalendarDateUtils.getSelectDayWithWeek(dataSource, selectDay, this._page)
    const { index } = CalendarDateUtils.findWeekGotoDay(date, dataSource, this._page)
    index !== -1 && this._callbackSelectDay(date, index, false, false)
  }

  _clickItem = (date) => {
    this._callbackSelectDay(date, this._page, true, false)
  }

  _callbackSelectDay = (date, index, isClick, isFrist) => {
    const { clickItem, clickUndefined } = this.props
    if (isFrist || CalendarDateUtils.findWeekClick(date)) {
      let beforeDay = this.state.selectDay
      this.setState({ selectDay: date, beforeDay })
      clickItem && clickItem(date, index)
    } else {
      clickUndefined && clickUndefined(isClick)
    }
  }

  selectSomeDay = (date) => {
    if (CalendarDateUtils.isSameDay(date, this.state.selectDay)) return
    const { dataSource } = this.state
    if (CalendarDateUtils.findDayInWeekArray(date, dataSource[this._page])) {
      let beforeDay = this.state.selectDay
      this.setState({ selectDay: date, beforeDay },
        () => {
          InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
              this._selectDay()
            })
          })
        }
      )
    } else {
      let beforeDay = this.state.selectDay
      this.setState({ selectDay: date, beforeDay })
      this._page = 5
      this._currentSelect = { date }
      this._initData(date)
    }
  }

  setNativeParams = (params) => {
    if (params.hidden) {
      const { width, height } = this.props
      if (params.hidden === '1') {
        this.flatList.setNativeProps({
          style: {
            width: width,
            height: 0,
            position: 'absolute',
            top: 0
          }
        })
      } else {
        this.flatList.setNativeProps({
          style: {
            width: width,
            height: height,
            position: 'absolute',
            top: 0
          }
        })
      }
    } else {
      this.flatList.setNativeProps(params)
    }
  }
}
