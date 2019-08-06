/**
 * Created by mark on 2019/7/19
 *
 */
import React, { Component } from 'react'
import {
  View,
  ScrollView,
  PanResponder
} from 'react-native'

import WeekTitleView from './component/title/WeekTitleView'
import * as CalendarDateUtils from './utils/CalendarDateUtils'
import YearCalendar from './component/month/YearCalendar'
import WeekCalendar from './component/week/WeekCalendar'
import FooterView from './component/footer/FooterView'

const footerViewHeight = 40

export default class CalendarList extends Component {
  constructor () {
    super()
    this.state = {
      isOpen: true,
      currentHeight: 0 // 设置初始值
    }

    this._line = -1
    this._inLine = -1
    this._scrollY = -1
    this._otherResponse = false
    this._scrollHeight = -1

    this._selectDay = null

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._returnFalse,
      onStartShouldSetPanResponderCapture: this._returnFalse,
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture: this._onMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._beginTouch,
      onPanResponderMove: this._moveTouch,
      onPanResponderTerminationRequest: this._returnTrue,
      onPanResponderRelease: this._endTouch,
      onPanResponderTerminate: this._endTouch
    })
  }

  _returnTrue = () => {
    return true
  }

  _returnFalse = () => {
    return false
  }

  _onMoveShouldSetPanResponder = ((evt, gestureState) => {
    let isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10
    let isOther = Math.abs(gestureState.dy) < Math.abs(gestureState.dx) && Math.abs(gestureState.dx) > 10
    if (isOther) {
      this._otherResponse = true
    }
    if (isVertical && !this._otherResponse) {
      const { isOpen } = this.state
      if (isOpen && gestureState.dy < 0) {
        this.scroll.setNativeProps({ scrollEnable: false })
        return true
      } else if (!isOpen && gestureState.dy > 0) {
        this.scroll.setNativeProps({ scrollEnable: false })
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })

  _onMoveShouldSetPanResponderCapture = ((evt, gestureState) => {
    let isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 10
    let isOther = Math.abs(gestureState.dy) < Math.abs(gestureState.dx) && Math.abs(gestureState.dx) > 10
    if (isOther) {
      this._otherResponse = true
    }
    if (isVertical && !this._otherResponse) {
      const { isOpen } = this.state
      if (isOpen && gestureState.dy < 0) {
        this.scroll.setNativeProps({ scrollEnable: false })
        return true
      } else if (!isOpen && gestureState.dy > 0) {
        this.scroll.setNativeProps({ scrollEnable: false })
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })

  shouldComponentUpdate (nextProps, nextState) {
    const { width, height, selectDay, selectMonth, markDic } = this.props
    const { isOpen, currentHeight } = this.state
    return JSON.stringify(isOpen) !== JSON.stringify(nextState.isOpen) ||
      JSON.stringify(currentHeight) !== JSON.stringify(nextState.currentHeight) ||
      JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(markDic) !== JSON.stringify(nextProps.markDic) ||
      !CalendarDateUtils.isSameDay(selectDay, nextProps.selectDay) ||
      !CalendarDateUtils.isSameDay(selectMonth, nextProps.selectMonth)
  }

  componentWillMount () {
    const { height, isOpen } = this.props
    this.setState({
      currentHeight: height,
      isOpen: isOpen
    })
    if (!isOpen) {
      const MinHeight = height / 6
      this.setState({ currentHeight: MinHeight })
    }
  }

  componentDidMount () {

  }

  render () {
    const { width, height, selectMonth, selectDay, calendarStyle, markDic } = this.props
    const { currentHeight, isOpen } = this.state
    return (
      <View style={{ width, backgroundColor: calendarStyle.backgroundColor }}>
        <WeekTitleView
          width={width}
          height={30}
          titleStyle={calendarStyle.titleStyle || {}}
        />
        <View
          ref={(r) => { this.scrollControl = r }}
          style={{ width, backgroundColor: calendarStyle.backgroundColor, height: currentHeight + footerViewHeight }}
          {...this._panResponder.panHandlers}>
          <ScrollView
            ref={(r) => { this.scroll = r }}
            style={{ width, backgroundColor: calendarStyle.backgroundColor }}
            scrollEnabled={false}>
            <YearCalendar
              ref={(r) => { this.yearCalendar = r }}
              width={width}
              height={height}
              selectDay={selectDay}
              selectMonth={selectMonth}
              onChangeMonth={this._onChangeMonth}
              clickItem={this._monthClickItem}
              endScroll={this._yearEndScroll}
              lastPageCallback={this._lastPageCallback}
              dayStyle={calendarStyle.dayStyle || {}}
              markDic={markDic}
            />
          </ScrollView>
          <WeekCalendar
            ref={(r) => { this.weekCalendar = r }}
            width={width}
            height={height / 6}
            selectDay={selectDay}
            clickItem={this._weekClickItem}
            clickUndefined={this._clickUndefined}
            endScroll={this._yearEndScroll}
            lastPageCallback={this._lastPageCallback}
            dayStyle={calendarStyle.dayStyle || {}}
            markDic={markDic}
            isOpen={this.props.isOpen}
          />
          <FooterView
            width={width}
            footerClick={this._footerClick}
            isOpen={isOpen}
          />
        </View>
      </View>
    )
  }

  selectSomeDay = (date) => {
    if (this.state.isOpen) {
      this.yearCalendar && this.yearCalendar.selectSomeDay(date, true)
    } else {
      this.weekCalendar && this.weekCalendar.selectSomeDay(date)
    }
  }

  selectSomeMonth = (date) => {
    this.yearCalendar && this.yearCalendar.selectSomeMonth(date, true)
    if (!this.state.isOpen) {
      this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '1' })
      const { height } = this.props
      const MaxHeight = height
      this.setState({
        isOpen: true,
        currentHeight: MaxHeight
      })
    }
  }

  _lastPageCallback = () => {
    const { lastPageCallback } = this.props
    lastPageCallback && lastPageCallback()
  }

  _yearEndScroll = () => {
    this._otherResponse = false
  }

  _onChangeMonth = (date) => {
    const { onChangeMonth } = this.props
    onChangeMonth && onChangeMonth(date)
  }

  _monthClickItem = (day, line, inLine) => {
    this._line = line
    this._inLine = inLine
    if (!CalendarDateUtils.isSameDay(this._selectDay, day)) {
      this._selectDay = day
      const { clickItem } = this.props
      clickItem && clickItem(day)
    }
  }

  _weekClickItem = (day, index) => {
    if (!CalendarDateUtils.isSameDay(this._selectDay, day)) {
      this._selectDay = day
      const { clickItem } = this.props
      clickItem && clickItem(day)
    }
  }

  _clickUndefined = (isClick) => {
    const { clickUndefined } = this.props
    clickUndefined && clickUndefined(isClick)
  }

  _startAnimation = (h, animate, callback) => {
    const { height } = this.props
    const MaxHeight = height
    const MinHeight = height / 6
    const topHeight = height / this._line * this._inLine + (height / this._line - height / 6) / 2
    if (animate) {
      if (h > this._scrollHeight) {
        let indexY = this._scrollHeight
        this.timer = setInterval(() => {
          let num = h - indexY > 20 ? 20 : 5
          indexY = (indexY + num > h) ? h : (indexY + num)
          this.scrollControl && this.scrollControl.setNativeProps({ style: { height: indexY + footerViewHeight } })
          const scrollOffSetY = topHeight - (indexY - MinHeight) / (MaxHeight - MinHeight) * topHeight
          this.scroll && this.scroll.scrollTo({ x: 0, y: scrollOffSetY, animated: false })
          if (indexY === h) {
            this._scrollHeight = h
            this.timer && clearInterval(this.timer)
            this.setState({
              currentHeight: this._scrollHeight
            })
            callback && callback()
          }
        }, 1)
      } else {
        let indexY = this._scrollHeight
        this.timer = setInterval(() => {
          let num = indexY - h > 15 ? 15 : 5
          indexY = (indexY - num < h) ? h : (indexY - num)
          this.scrollControl && this.scrollControl.setNativeProps({ style: { height: indexY + footerViewHeight } })
          const scrollOffSetY = topHeight - (indexY - MinHeight) / (MaxHeight - MinHeight) * topHeight
          this.scroll && this.scroll.scrollTo({ x: 0, y: scrollOffSetY, animated: false })
          if (indexY === h) {
            this._scrollHeight = h
            this.timer && clearInterval(this.timer)
            this.setState({
              currentHeight: this._scrollHeight
            })
            callback && callback()
          }
        }, 1)
      }
    } else {
      this.scrollControl && this.scrollControl.setNativeProps({ style: { height: h + footerViewHeight } })
      this._scrollHeight = h
      const scrollOffSetY = topHeight - (h - MinHeight) / (MaxHeight - MinHeight) * topHeight
      this.scroll && this.scroll.scrollTo({ x: 0, y: scrollOffSetY, animated: false })
    }
  }

  _beginTouch = () => {
    const { isOpen } = this.state
    this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '1' })
    if (isOpen) {
      // this.weekCalendar && this.weekCalendar.selectSomeDay(this._selectDay)
    } else {
      this.yearCalendar && this.yearCalendar.selectSomeDay(this._selectDay, false)
    }
  }

  _moveTouch = (evt, gestureState) => {
    let parseIntDy = parseInt(gestureState.dy)
    if (parseIntDy !== this._scrollY) {
      this._scrollY = parseIntDy
      const { height } = this.props
      const { isOpen } = this.state
      const MaxHeight = height
      const MinHeight = height / 6

      let toHeight = isOpen ? MaxHeight + parseIntDy : MinHeight + parseIntDy
      toHeight = toHeight < MinHeight ? MinHeight : toHeight > MaxHeight ? MaxHeight : toHeight
      this._startAnimation(toHeight)
    }
  }

  _endTouch = () => {
    this._scrollY = 0
    const { height } = this.props
    const { isOpen } = this.state
    const MaxHeight = height
    const MinHeight = height / 6
    if (isOpen) {
      if (MaxHeight - this._scrollHeight > 25) {
        this.setState({ isOpen: false })
        this._startAnimation(MinHeight, true, () => {
          this.weekCalendar && this.weekCalendar.selectSomeDay(this._selectDay)
          this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '0' })
        })
      } else {
        this._startAnimation(MaxHeight, true)
      }
    } else if (!isOpen) {
      if (this._scrollHeight - MinHeight > 25) {
        this.setState({ isOpen: true })
        this._startAnimation(MaxHeight, true)
      } else {
        this._startAnimation(MinHeight, true, () => {
          this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '0' })
        })
      }
    }
    this.scroll.setNativeProps({ scrollEnable: true })
  }

  _footerClick = () => {
    this.scroll.setNativeProps({ scrollEnable: false })
    this._scrollY = 0
    const { height } = this.props
    const { isOpen } = this.state
    const MaxHeight = height
    const MinHeight = height / 6
    if (isOpen) {
      // this._startAnimation(MinHeight, true, () => {
      this.setState({ isOpen: false, currentHeight: MinHeight })
      this.weekCalendar && this.weekCalendar.selectSomeDay(this._selectDay)
      this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '0' })
      this.scroll.setNativeProps({ scrollEnable: true })
      // })
    } else {
      this.weekCalendar && this.weekCalendar.setNativeParams({ hidden: '1' })
      this.yearCalendar && this.yearCalendar.selectSomeDay(this._selectDay, false)
      // this._startAnimation(MaxHeight, true, () => {
      this.setState({ isOpen: true, currentHeight: MaxHeight })
      this.scroll.setNativeProps({ scrollEnable: true })
      // })
    }
  }
}
