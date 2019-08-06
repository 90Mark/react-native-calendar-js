/**
 * Created by mark on 2019/7/19
 *
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  ListView
} from 'react-native'

import * as CalendarDateUtils from '../../utils/CalendarDateUtils'
import DayItem from './DayItem'
import PlaceholderView from '../placeholder/PlaceholderView'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class MonthItem extends Component {
  shouldComponentUpdate (nextProps) {
    const { width, height, itemData, selectDay, beforeDay, markDic } = this.props

    return JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(itemData.days) !== JSON.stringify(nextProps.itemData.days) ||
      JSON.stringify(selectDay) !== JSON.stringify(nextProps.selectDay) ||
      JSON.stringify(markDic) !== JSON.stringify(nextProps.markDic) ||
      JSON.stringify(beforeDay) !== JSON.stringify(nextProps.beforeDay)
  }

  render () {
    const { width, height, itemData } = this.props
    if (itemData.days.length > 0) {
      return (
        <ListView
          style={{
            width,
            height,
            backgroundColor: '#fff'
          }}
          bounces={false}
          scrollEnabled={false}
          dataSource={ds.cloneWithRows(itemData.days)}
          renderRow={(rowData, sectionID, rowID) => {
            return this._renderListItem(rowData, sectionID, rowID, itemData.year, itemData.month)
          }}
          contentContainerStyle={styles.contentContainerStyle}
          initialListSize={42}
        />
      )
    } else {
      return (
        <PlaceholderView
          width={width}
          height={height} />
      )
    }
  }

  _renderListItem = (rowData, sectionID, rowID, year, month) => {
    const { selectDay, beforeDay, width, height, dayStyle, markDic } = this.props
    return (<DayItem
      year={year}
      month={month}
      width={width}
      height={height}
      rowData={rowData}
      selectDay={selectDay}
      beforeDay={beforeDay}
      dayStyle={dayStyle}
      onPress={this._cellClick}
      markDic={markDic}
    />)
  }

  _cellClick = (rowData) => {
    const { itemData, clickItem, changePage, selectDay } = this.props
    const { day, monthState } = rowData
    let date = CalendarDateUtils.getSelectDate(itemData.year, itemData.month, day, monthState)
    if (CalendarDateUtils.isSameDay(date, selectDay)) return
    if (monthState !== 0) {
      changePage && changePage(monthState)
    }
    clickItem && clickItem(date, monthState)
  }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
