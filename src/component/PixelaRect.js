import React, {
  Component
} from 'react'
import {
  Rect,
} from 'react-native-svg'

const SIZE = "10"

type Props = {
  x: number,
  y: number,
  fill: string,
  date: string
}

class PixelaRect extends Component<Props> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={SIZE}
        height={SIZE}
        fill={this.props.fill}
        key={this.props.date}
      />
    )
  }
}

export default PixelaRect