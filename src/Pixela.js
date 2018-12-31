import React, {
  Component,
} from 'react'
import Svg, {
  Rect,
} from 'react-native-svg'
import Date from './Date'

const DOMParser = require('xmldom').DOMParser;

const SIZE = "10"

class Pixela extends Component {
  constructor(props) {
    super(props)
  }

  buildPixela(orgData) {
    const x = 15, l = 20, ret = [],
      today = new Date(),
      thisYear = today.getWeekYear(true)
    dataArray = this.buildDataArray(orgData, thisYear, l)
    for (let i = 0; i < l; i++) {
      ret.push(this.buildColumn(x+12*i, dataArray[dataArray.length - (i + 1)]))
    }
    return ret
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

  buildColumn(x, colData) {
    const y = 15, l = 7, ret = []
    for (let i = 0; i < l; i++) {
      ret.push(this.buildRect(x,y+12*i,colData ? colData[i] : undefined))
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