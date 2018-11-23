import React, {
  Component
} from 'react'
import Svg, {
  Rect,
} from 'react-native-svg'
import Date from './Date'

const DOMParser = require('xmldom').DOMParser;

let parsedData = {};

class Pixela extends Component {
  constructor(props) {
    super(props)

    if (props.svgXmlData) {
      const xml = new DOMParser().parseFromString(props.svgXmlData, "image/svg+xml");
      this.parseSvg(xml.childNodes)
    }
  }

  hasDateAttribute(node) {
    const attrs = node.attributes
    for (let l = attrs.length; 0 < l; l--) {
      if (attrs[l - 1].name == "data-date") {
        return true
      }
    }
    return false;
  }

  parseSvg(nodes) {
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = nodes[i]
      if (node.tagName == "rect" && this.hasDateAttribute(node)) {
        const date = node.attributes[7].nodeValue,
          count = node.attributes[6].nodeValue,
          fill = node.attributes[5].nodeValue
        const dateObj = new Date(date),
          week = dateObj.getWeek(),
          year = dateObj.getWeekYear()
        if (!this.parsedData[year]) {
          this.parsedData[year] = []
        }
        if (!this.parsedData[year][week]) {
          this.parsedData[year][week] = []
        }
        this.parsedData[year][week][this.parsedData[year][week].length] = {date: date, count: count, fill: fill}
        continue
      }
      if (node.childNodes) {
        this.parseSvg(node.childNodes)
      }
    }
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
    //console.log(colData)
    const y = 15, l = 7, ret = []
    for (let i = 0; i < l; i++) {
      ret.push(this.buildRect(x,y+12*i,colData ? colData[i] : undefined))
    }
    return ret
  }

  buildRect(x, y, data) {
    //console.log(data)
    return (
      <Rect x={x} y={y}
        width="10"
        height="10"
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