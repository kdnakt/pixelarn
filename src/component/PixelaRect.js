import React from 'react'
import {
  Rect,
} from 'react-native-svg'

const SIZE = "10"

function PixelaRect(x: number, y: number,
    fill: string, date: string) {

  return (
    <Rect
      x={x}
      y={y}
      width={SIZE}
      height={SIZE}
      fill={fill}
      key={date}
    />
  )
}

export default PixelaRect