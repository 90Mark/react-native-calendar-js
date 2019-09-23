/**
 * Created by mark on 2019/7/24
 *
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  ListView
} from 'react-native'

import * as CalendarDateUtils from '../../utils/CalendarDateUtils'
import DayItem from './DayItem'
import Colors from '../../res/Colors'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

export default class MonthItem extends Component {
  shouldComponentUpdate (nextProps) {
    const { width, height, itemData, selectDay, beforeDay, markDic } = this.props
    return JSON.stringify(width) !== JSON.stringify(nextProps.width) ||
      JSON.stringify(height) !== JSON.stringify(nextProps.height) ||
      JSON.stringify(itemData) !== JSON.stringify(nextProps.itemData) ||
      JSON.stringify(selectDay) !== JSON.stringify(nextProps.selectDay) ||
      JSON.stringify(markDic) !== JSON.stringify(nextProps.markDic) ||
      JSON.stringify(beforeDay) !== JSON.stringify(nextProps.beforeDay)
  }

  render () {
    const { width, height, itemData } = this.props
    return (
      <ListView
        style={{
          width,
          height,
          backgroundColor: Colors.white
        }}
        bounces={false}
        scrollEnabled={false}
        dataSource={ds.cloneWithRows(itemData)}
        renderRow={this._renderListItem}
        contentContainerStyle={styles.contentContainerStyle}
        initialListSize={7}
      />
    )
  }

  _renderListItem = (rowData, sectionID, rowID) => {
    const { selectDay, beforeDay, dayStyle, markDic } = this.props
    return (<DayItem
      rowData={rowData}
      selectDay={selectDay}
      beforeDay={beforeDay}
      dayStyle={dayStyle}
      onPress={this._cellClick}
      markDic={markDic}
    />)
  }

  _cellClick = (rowData) => {
    const { clickItem, selectDay } = this.props
    const { year, month, day } = rowData
    let date = CalendarDateUtils.getSelectDate(year, month, day, 0)
    if (CalendarDateUtils.isSameDay(date, selectDay)) return
    clickItem && clickItem(date)
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
