/**
 * Created by mark on 2019/7/16
 *
 */

export {
  initDataSource,
  updateDataSource,
  initWeekDataSource,
  getMonthCount,
  getWeek,
  getFirstWeekdayInMonth,
  getSelectDate,
  getSelectDateStr,
  isSameDay,
  findDayInMonth,
  createDate,
  findGotoDay,
  findWeekClick,
  findGotoDayOrCreate,
  findWeekGotoDay,
  getYesterdayWhithNum,
  getSelectDayWithMonth,
  getSelectDayWithWeek,
  findDayInWeekArray,
  getScreeningList,
  getKeyWhthDay
}

// 缓存一下数据
let monthDate = null
let screeningList = null
let monthDataSource = []

/**
 * 造数据 月历
 * */
function initDataSource (date, pageCount = 25) {
  if (isSameDay(date, monthDate)) {
    return monthDataSource
  }

  let _page = pageCount

  let currentDate = date || new Date()
  let dataSource = []
  let screeningDataSource = [{ name: '———  ———' }]

  for (let i = 0; i < _page; i++) {
    let difference = i - parseInt(_page / 2)
    let year = currentDate.getFullYear() // 当前年份
    let month = currentDate.getMonth() + 1

    let newMonth = month + difference
    let newYear = year
    if (newMonth <= 0) {
      newMonth = 12 + newMonth
      newYear -= 1
    } else if (newMonth > 12) {
      newMonth = newMonth - 12
      newYear += 1
    }

    let daysArray = []
    let lineNumber = 0
    let dayLength = 0

    if (difference === 0) {
      const { days, line, dayCount } = getMonthList(newYear, newMonth)
      daysArray = days
      lineNumber = line
      dayLength = dayCount
    }

    let dic = {
      year: newYear,
      month: newMonth,
      line: lineNumber,
      days: daysArray,
      dayCount: dayLength
    }
    dataSource.push(dic)
    screeningDataSource.push({ year: newYear, month: newMonth, name: `${newYear}年${newMonth}月` })
  }
  screeningList = screeningDataSource
  monthDataSource = dataSource
  return dataSource
}

/**
 * 更新数据源
 * @param dataSource
 * @param page
 */
function updateDataSource (dataSource, page, pageCount) {
  let newData = dataSource.concat()
  for (let i = 0; i < 3; i++) {
    let newPage = page - 1 + i
    if (newPage >= 0 && newPage <= pageCount - 1) {
      let monthData = { ...newData[newPage] }
      if (monthData.days.length <= 0) {
        const { days, line, dayCount } = getMonthList(monthData.year, monthData.month)
        monthData.days = days
        monthData.line = line
        monthData.dayCount = dayCount
        newData[newPage] = monthData
      }
    }
  }
  return newData
}

/**
 * 月数据返回
 * @param newYear
 * @param newMonth
 * @returns {Array}
 */
function getMonthList (newYear, newMonth) {
  let _pastMleft = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }

  let firstWeek = getFirstWeekdayInMonth(newYear, newMonth)
  let line = (newMonth !== 2 && firstWeek === 6) ? 6 : 5

  let pastMD = _pastMleft[firstWeek]
  let thisMD = getMonthCount(newYear, newMonth) // 当月天数
  let nextMD = line * 7 - pastMD - thisMD

  let pastM = newMonth - 1
  pastM = pastM <= 0 ? pastM + 12 : pastM // 上个月对应的月份
  let pastY = pastM <= 0 ? newYear - 1 : newYear
  let pastMDDays = getMonthCount(pastY, pastM)

  let days = []
  for (let j = 1; j < pastMD + 1; j++) {
    let day = pastMDDays - pastMD + j
    let inLine = 0
    let obj = {
      day,
      monthState: -1,
      line,
      inLine
    }
    days.push(obj)
  }

  for (let j = 1; j < thisMD + 1; j++) {
    let theInteger = (pastMD + j) % 7 === 0 ? -1 : 0
    let inLine = parseInt((pastMD + j) / 7) + theInteger
    let obj = {
      day: j,
      monthState: 0,
      line,
      inLine
    }
    days.push(obj)
  }

  for (let j = 1; j < nextMD + 1; j++) {
    let theInteger = (pastMD + thisMD + j) / 7 === 0 ? -1 : 0
    let inLine = parseInt((pastMD + thisMD + j) / 7) + theInteger
    let obj = {
      day: j,
      monthState: 1,
      line,
      inLine
    }
    days.push(obj)
  }
  return { days, line, dayCount: thisMD }
}

/**
 * 造数据 周历
 * */
function initWeekDataSource (date, pageCount = 11) {
  let _page = pageCount

  let currentDate = date || new Date()
  let dataSource = []
  let todayWeek = date.getDay()
  let currentWeekSun = getYesterdayWhithNum(currentDate, -todayWeek)

  for (let i = 0; i < _page; i++) {
    let difference = i - parseInt(_page / 2)
    let newDate = getYesterdayWhithNum(currentWeekSun, difference * 7)
    let weekArray = []
    for (let j = 0; j < 7; j++) {
      let today = getYesterdayWhithNum(newDate, j)
      let obj = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      }
      weekArray.push(obj)
    }
    dataSource.push(weekArray)
  }
  return dataSource
}

/**
 * 获取加减几天后的时间
 */

function getYesterdayWhithNum (date, num) {
  let newT = date.getTime() + 1000 * 60 * 60 * 24 * num
  return new Date(newT)
}

/**
 * 获取当月天数  (某月)
 */
function getMonthCount (year, month) {
  let d = new Date(year, month, 0)
  return d.getDate()
}

function getWeek (y, m, d) {
  const startWeek = 1
  if (m < 3) {
    m += 12
    --y
  }
  return (d + startWeek + 2 * m + Math.floor(3 * (m + 1) / 5) + y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)) % 7
}

/**
 * 获得当前月份第一天星期几  (某月)
 */
function getFirstWeekdayInMonth (year, month) {
  // let firstDW = createDate(year, month, 1).getDay()//本月第一天是星期几，返回0-6，对应周日-周六
  return getWeek(year, month, 1)
}

/**
 * 根据当前选中的年月日，返回此年月日对应的日期Date()
 */
function getSelectDate (year, month, day, monthState) {
  let newMonth = (month + monthState <= 0) ? 12 : (month + monthState > 12) ? 1 : month + monthState
  let newYear = (month + monthState <= 0) ? year - 1 : month + monthState > 12 ? year + 1 : year
  return createDate(newYear, newMonth, day)
}

/**
 * 根据当前选中的日期，返回此年月日(字符串格式)
 */
function getSelectDateStr (year, month, day, monthState) {
  let newMonth = month + monthState <= 0 ? 12 : month + monthState > 12 ? 1 : month + monthState
  let newYear = month + monthState <= 0 ? year + 1 : month + monthState > 12 ? year + 1 : year
  return `${newYear}-${newMonth}-${day}`
}

/**
 * 比较日期是否是同一天
 */

function isSameDay (date, datet) {
  let dateStr = date ? `${date.getFullYear()}${date.getMonth()}${date.getDate()}` : null
  let datetStr = datet ? `${datet.getFullYear()}${datet.getMonth()}${datet.getDate()}` : null
  return dateStr === datetStr
}

/**
 * 找某天的对象
 */
function findDayInMonth (day, array) {
  for (let i = 0; i < array.days.length; i++) {
    let dic = array.days[i]
    if (dic.monthState === 0 && dic.day === day.getDate()) {
      return dic
    }
  }
  return null
}

/**
 * 创建日期，str返回date
 */
function createDate (year, month, day) {
  let date = new Date(year, month - 1, day)
  // date.setFullYear(year)
  // date.setDate(day)
  // date.setMonth(month - 1)
  // date.setDate(day)
  // 设置 Date 对象中月份 (0 ~ 11)
  return date
}

/**
 * 找某一天的 index，line，inLine
 */
function findGotoDay (date, dataSource, defaultIndex = 0) {
  let defaultResult = { index: -1 }
  if (defaultIndex >= dataSource.length) return defaultResult
  if (defaultIndex <= -1) return defaultResult

  for (let i = defaultIndex; i < dataSource.length; i++) {
    let monthData = dataSource[i]
    const { year, month } = monthData
    if (year === date.getFullYear() && month === date.getMonth() + 1) {
      for (let j = 0; j < monthData.days.length; j++) {
        let dayDic = monthData.days[j]
        const { monthState, day, line, inLine } = dayDic
        if (monthState === 0) {
          let dayDate = createDate(year, month, day)
          if (isSameDay(date, dayDate)) {
            return { index: i, line, inLine }
          }
        }
      }
    }
  }
  return defaultResult
}

/**
 * 找某一天的 index，line，inLine,，
 * days 为空就创建
 */
function findGotoDayOrCreate (date, dataSource, defaultIndex = 0) {
  let newData = dataSource.concat()
  let defaultResult = { index: -1 }

  if (defaultIndex >= newData.length) return defaultResult
  if (defaultIndex <= -1) return defaultResult

  for (let i = defaultIndex; i < newData.length; i++) {
    let monthData = { ...newData[i] }
    const { year, month } = monthData
    if (year === date.getFullYear() && month === date.getMonth() + 1) {
      if (monthData.days <= 0) {
        const { days, line, dayCount } = getMonthList(year, month)
        monthData.days = days
        monthData.line = line
        monthData.dayCount = dayCount
        newData[i] = monthData
      }
      for (let j = 0; j < monthData.days.length; j++) {
        let dayDic = monthData.days[j]
        const { monthState, day, line, inLine } = dayDic
        if (monthState === 0) {
          let dayDate = createDate(year, month, day)
          if (isSameDay(date, dayDate)) {
            return { index: i, line, inLine, newData: newData }
          }
        }
      }
    }
  }
  return defaultResult
}

/**
 * 找某一天的 index，
 */
function findWeekGotoDay (date, dataSource, defaultIndex = 0) {
  let defaultResult = { index: -1 }

  if (defaultIndex >= dataSource.length) return defaultResult
  if (defaultIndex <= -1) return defaultResult

  for (let i = defaultIndex; i < dataSource.length; i++) {
    let monthData = dataSource[i]
    for (let j = 0; j < monthData.length; j++) {
      let dayDic = monthData[j]
      const { year, month, day } = dayDic
      let dayDate = createDate(year, month, day)
      if (isSameDay(date, dayDate)) {
        return { index: i }
      }
    }
  }
  return defaultResult
}

/**
 * 找某一天的是否可以点击
 */
function findWeekClick (date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  for (let i = 0; i < monthDataSource.length; i++) {
    let monthData = monthDataSource[i]
    if (monthData.year === year && monthData.month === month) {
      return true
    }
  }
  return false
}

/**
 * 翻页后选中月的某天
 * 数据源，已选中的天，数据源页数
 */
function getSelectDayWithMonth (dataSource, selectDay, page) {
  let { month, dayCount, year } = dataSource[page]
  if (dayCount <= 0) {
    return null
  }
  let day = dayCount >= selectDay.getDate() ? selectDay.getDate() : dayCount
  let date = createDate(year, month, day)
  return date
}

/**
 * 翻页后选中周的某天
 * 数据源，已选中的天，数据源页数
 */
function getSelectDayWithWeek (dataSource, selectDay, page) {
  let weekArray = dataSource[page]
  let weekDay = selectDay.getDay()
  const { year, month, day } = weekArray[weekDay]
  let date = createDate(year, month, day)
  return date
}

/**
 * 翻页后选中周的某天
 * 数据源，已选中的天，数据源页数
 */
function findDayInWeekArray (date, weekArray) {
  for (let j = 0; j < weekArray.length; j++) {
    let dayDic = weekArray[j]
    const { year, month, day } = dayDic
    let dayDate = createDate(year, month, day)
    if (isSameDay(date, dayDate)) {
      return true
    }
  }
  return false
}

/**
 * 获取筛选数据
 */
function getScreeningList () {
  if (screeningList) {
    return screeningList
  }
}

/**
 * 获取 某天的key
 * */

function getKeyWhthDay (date) {
  if (date) {
    let year = date.getFullYear()
    let month = ('0' + (date.getMonth() + 1)).slice(-2)
    let day = ('0' + (date.getDate())).slice(-2)
    return `${year}${month}${day}`
  }
  return ''
}
