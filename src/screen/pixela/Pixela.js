import React, {
  Component,
} from 'react'
import Svg, {
  Rect,
  Text,
} from 'react-native-svg'
import Date from './Date'

const SIZE = "10"

class Pixela extends Component {
  constructor(props) {
    super(props)
  }

  buildPixela(orgData) {
    const x = 15, l = 20, ret = [],
      today = new Date(),
      thisYear = today.getWeekYear(true),
      dataArray = this.buildDataArray(orgData, thisYear, l)
    for (let i = 0; i < l; i++) {
      const col = this.buildColumn(x+12*i, dataArray[dataArray.length - (i + 1)])
      if (!col) {
        ret.push(this.buildYear(x+12*i, dataArray[dataArray.length - (i + 2)]))
      } else {
        ret.push(col)
      }
    }
    ret.push(this.buildYear(x, dataArray[dataArray.length - 1]))
    return ret
  }

  buildYear(x, yearArr) {
    return (
      <Text x={x} y={10} key={x + ".10"}>
        {new Date(yearArr[yearArr.length - 1].date).getFullYear()}
      </Text>
    )
  }

  buildDataArray(orgData, year, l) {
    const ret = []
    if (!orgData) return ret
    if (!orgData[year]) year--
    let thisYearCount = 0;
    for (let i = 0; i < l; i++) {
      if (orgData[year].length - i > 0) {
        ret[i] = orgData[year][orgData[year].length - (i + 1)]
        thisYearCount++
      } else {
        ret[i] = orgData[year - 1][orgData[year - 1].length - (i - thisYearCount + 1)]
      }
    }
    return ret
  }

  buildMonth(x, month) {
    return (
      <Text x={x} y={10} key={x + ".10"}>
        {month}
      </Text>
    )
  }

  buildColumn(x, colData) {
    if (!colData) return undefined
    const y = 15, l = colData.length, ret = []
    for (let i = 0; i < l; i++) {
      ret.push(this.buildRect(x,y+12*i, colData[i]))
    }
    const lastDateOfWeek = new Date(colData[colData.length - 1].date),
        month = lastDateOfWeek.getMonth()
    lastDateOfWeek.setDate(lastDateOfWeek.getDate() - 7)
    const lastWeekMonth = lastDateOfWeek.getMonth()
    if (month > 0 && month != lastWeekMonth && x > 15+12*4) {
      ret.push(this.buildMonth(x, month + 1))
    }
    return ret
  }

  buildRect(x, y, data) {
    return (
      <Rect
        x={x}
        y={y}
        width={SIZE}
        height={SIZE}
        fill={data ? data.fill : "#eeeeee"}
        key={data ? data.date : 10000 * x + y}
      />
    )
  }

  render() {
    return (
      <Svg height={300} width={300} viewBox="0 0 300 300">
        {this.buildPixela(this.props.data)}
      </Svg>
    )
  }
}


export default Pixela