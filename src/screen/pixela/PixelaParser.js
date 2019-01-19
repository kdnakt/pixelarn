
import Date from './Date'

const DOMParser = require('xmldom').DOMParser

function parseSvg(nodes, data) {
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i], attrs = node.attributes
    if (node.tagName == "rect" && attrs.getNamedItem("data-date")) {
      const date = attrs.getNamedItem("data-date").nodeValue,
        count = attrs.getNamedItem("data-count").nodeValue,
        fill = attrs.getNamedItem("fill").nodeValue
      if (!date || !count || !fill) continue
      const dateObj = new Date(date),
        week = dateObj.getWeek(),
        year = dateObj.getWeekYear()
      if (!data[year]) {
        data[year] = []
      }
      if (!data[year][week]) {
        data[year][week] = []
      }
      data[year][week][data[year][week].length] = {date: date, count: count, fill: fill}
      continue
    }
    if (node.childNodes && node.childNodes.length) {
      parseSvg(node.childNodes, data)
    }
  }
}

const PixelaParser = {
  parse: (svgXml) => {
    const parsedData = {},
      xml = new DOMParser().parseFromString(svgXml, "image/svg+xml")
    parseSvg(xml.childNodes, parsedData)
    return parsedData
  },
}

export default PixelaParser