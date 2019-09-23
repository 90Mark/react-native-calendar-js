/**
 * Created by mark on 2019/7/22
 *
 */
import React, { Component } from 'react'
import { FlatList, InteractionManager } from 'react-native'

import * as CalendarDateUtils from '../../utils/CalendarDateUtils'
import MonthItem from './MonthItem'
import PlaceholderView from '../placeholder/PlaceholderView'

export default class YearCalendar extends Component {
  constructor () {
    super()
    this.state = {
      dataSource: null,
      beforeDay: null,
      selectDay: new Date(),
      selectMonth: new Date()
    }
    this._pageCount = 25
    this._page = 12
    this._currentSelect = null
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { width, height, selectDay, selectMonth, markDic } = this.props
    const { dataSource, beforeDay } = this.state
    return JSON.stringify(dataSource) !== JSON.stringify(nextState.dataSource) ||
      JSON.stringify(this.state.selectDay) !== JSON.stringify(nextState.selectDay) ||
      !CalendarDateUtils.isSameDay(beforeDay, nextState.beforeDay) ||
      JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(markDic) !== JSON.stringify(nextProps.markDic) ||
      !CalendarDateUtils.isSameDay(selectDay, nextProps.selectDay) ||
      !CalendarDateUtils.isSameDay(selectMonth, nextProps.selectMonth)
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
    let dataSource = CalendarDateUtils.initDataSource(date, this._pageCount)
    this.setState({
      dataSource
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          this.flatList && this.flatList.scrollToIndex({ viewPosition: 0, index: this._page, animated: false })
          this._callbackSelectMonth(this._page)
          const { selectDay, dataSource } = this.state
          const { index, line, inLine } = CalendarDateUtils.findGotoDay(selectDay, dataSource, this._page)
          index !== -1 && this._callbackSelectDay(selectDay, line, inLine)
        })
      })
    })
  }

  _updateData = () => {
    const { dataSource } = this.state
    const newData = CalendarDateUtils.updateDataSource(dataSource, this._page, this._pageCount)
    if (JSON.stringify(dataSource) !== JSON.stringify(newData)) {
      this.setState({
        dataSource: newData
      }, () => {
        this._currentSelect && this._selectDay(this._currentSelect.selectDay, this._currentSelect.page)
      })
    }
  }

  _keyExtractor = (item, index) => index

  render () {
    const { width, dayStyle, height } = this.props
    const { dataSource } = this.state
    if (!dataSource || dataSource.length <= 0) {
      return (
        <PlaceholderView
          width={width}
          height={height} />
      )
    } else {
      return (
        <FlatList
          ref={(r) => { this.flatList = r }}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          style={{ width: width, flex: 1, backgroundColor: dayStyle.backgroundColor }}
          data={dataSource}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          getItemLayout={(param, index) => ({ length: 25, offset: width * index, index })}
          initialNumToRender={15}
        />
      )
    }
  }

  _renderItem = ({ item }) => {
    const { width, height, dayStyle, markDic } = this.props
    const { dataSource, selectDay, beforeDay } = this.state
    return (<MonthItem
      width={width}
      height={height}
      dataSource={dataSource}
      itemData={item}
      selectDay={selectDay}
      beforeDay={beforeDay}
      dayStyle={dayStyle}
      markDic={markDic}
      clickItem={this._clickItem}
      changePage={this._changePage}
    />)
  }

  _onMomentumScrollEnd = (event) => {
    let x = event.nativeEvent.contentOffset.x
    const { width, endScroll } = this.props
    let page = parseInt(x / width + 0.5)
    if (page !== this._page) {
      this._page = page
      this._callbackSelectMonth(this._page)
      // 翻页后选中当天月的某天
      const { selectDay } = this.state
      this._selectDay(selectDay, this._page)
    }
    endScroll && endScroll()
    this._lastPageCallback()
  }

  _selectDay = (selectDay, page) => {
    const { dataSource } = this.state
    let date = CalendarDateUtils.getSelectDayWithMonth(dataSource, selectDay, page)
    if (!date) {
      this._currentSelect = { selectDay: selectDay, page: page }
      return
    }
    const { index, line, inLine } = CalendarDateUtils.findGotoDay(date, dataSource, page)
    if (index === -1) {
      this._currentSelect = { selectDay, page }
    } else {
      this._currentSelect = null
      this._callbackSelectDay(date, line, inLine)
    }
  }

  _changePage = (monthState) => {
    const { dataSource } = this.state
    let page = this._page + monthState
    if (page <= -1 || page >= dataSource.length) return
    this._page = page
    this.flatList && this.flatList.scrollToIndex({ viewPosition: 0, index: this._page, animated: true })
    this._callbackSelectMonth(this._page)
  }

  _callbackSelectMonth = (index) => {
    const { dataSource } = this.state
    let { year, month } = dataSource[index]
    let newDate = CalendarDateUtils.getSelectDate(year, month, 1, 0)
    const { onChangeMonth } = this.props
    onChangeMonth && onChangeMonth(newDate)
    this._lastPageCallback()
    // 数据源增加一下
    this._updateData()
  }

  _clickItem = (date, monthState) => {
    const { dataSource } = this.state
    const { index, line, inLine } = CalendarDateUtils.findGotoDay(date, dataSource, this._page)
    index !== -1 && this._callbackSelectDay(date, line, inLine)
  }

  _callbackSelectDay = (date, line, inLine) => {
    const { selectDay } = this.state
    let beforeDay = selectDay
    this.setState({ selectDay: date, beforeDay })
    const { clickItem } = this.props
    clickItem && clickItem(date, line, inLine)
  }

  _lastPageCallback = () => {
    const { lastPageCallback } = this.props
    if (this._page === 0 || this._page === this._pageCount - 1) {
      lastPageCallback && lastPageCallback()
    }
  }

  selectSomeMonth = (date, animated) => {
    InteractionManager.runAfterInteractions(() => {
      if (CalendarDateUtils.isSameDay(date, this.state.selectDay)) return
      const { dataSource } = this.state
      const { index, line, inLine, newData } = CalendarDateUtils.findGotoDayOrCreate(date, dataSource, 0)
      if (index !== -1) {
        if (newData && (JSON.stringify(dataSource) !== JSON.stringify(newData))) {
          this.setState({
            dataSource: newData
          }, () => {
            this._currentSelect && this._selectDay(this._currentSelect.selectDay, this._currentSelect.page)
          })
        }
        this._page = index
        this.flatList && this.flatList.scrollToIndex({ viewPosition: 0, index: this._page, animated: animated })
        this._callbackSelectDay(date, line, inLine)
        this._callbackSelectMonth(this._page)
      }
    })
  }

  selectSomeDay = (date, animated) => {
    if (CalendarDateUtils.isSameDay(date, this.state.selectDay)) return
    const { dataSource } = this.state
    const { index, line, inLine } = CalendarDateUtils.findGotoDay(date, dataSource, 0)
    if (index !== -1) {
      this._page = index
      this.flatList && this.flatList.scrollToIndex({ viewPosition: 0, index: this._page, animated: animated })
      this._callbackSelectMonth(this._page)
      this._callbackSelectDay(date, line, inLine)
    }
  }

  setNativeParams = (params) => {
    this.flatList.setNativeProps(params)
  }
}
