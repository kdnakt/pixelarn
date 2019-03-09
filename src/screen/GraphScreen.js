import React, {
  Component
} from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Card,
  Button,
  Icon,
  Input,
} from 'react-native-elements'
import {
  HeaderBackButton,
} from 'react-navigation'
import DatePicker from 'react-native-datepicker'
import Pixela from './pixela/Pixela'
import LoginStore from '../store/LoginStore'
import PixelaParser from './pixela/PixelaParser'
import {
  commitGraph,
  getGraph,
} from '../PixelaApi'

getDateStr = (today) => {
  return today.getFullYear()
      + "-"
      + (today.getMonth() + 1)
      + "-"
      + today.getDate()
}

export default class GraphScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const id = navigation.getParam('graphId'),
      graph = LoginStore.getGraph(id)
    return {
        headerLeft: (
          <HeaderBackButton
            title='GRAPH LIST'
            onPress={() => navigation.navigate('GraphList', LoginStore.getGraphs())}
          />
        ),
        headerRight: (
          <Icon
            name="cog"
            type="font-awesome"
            iconStyle={{borderRightWidth: 8}}
            onPress={() => navigation.navigate('GraphConfig', {graphId: id})}
          />
        ),
    }
  }

  constructor(props) {
    super(props)
    const today = new Date(),
      todayDate = getDateStr(today)
    today.setFullYear(today.getFullYear() - 1)
    const minDate = getDateStr(today)
    this.state = {
        svgXmlData: null,
        isSuccessful: true,
        targetValue: 0,
        targetDate: todayDate,
        today: todayDate,
        minDate: minDate,
    }
  }

  componentDidMount() {
    this.load()
  }

  load() {
    const { navigation } = this.props,
      id = navigation.getParam('graphId')
    getGraph(id).then(res => {
      this.setState({
        svgXmlData: res.ok ? PixelaParser.parse(res._bodyText) : JSON.parse(res._bodyText),
        isSuccessful: res.ok,
      })
    })
    navigation.setParams({needReload: false})
  }

  _getNewQuantity() {
    const svgData = this.state.svgXmlData
    for (const year in svgData) {
      for (let week = svgData[year].length - 1; 0 < week; week--) {
        for (const i in svgData[year][week]) {
          const data = svgData[year][week][i]
          if (data.date == this.state.targetDate) {
            return data.count -(-1)// string結合よけ
          }
        }
      }
    }
    return 1//とりあえず1
  }

  _getTargetDate() {
    const date = new Date(this.state.targetDate),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate()
    return "" + y
        + (m < 10 ? "0" + m : m)
        + (d < 10 ? "0" + d : d)
  }

  _commit() {
    const { navigation } = this.props,
      id = navigation.getParam('graphId'),
      date = this._getTargetDate()
    const body = {
      quantity: `${this._getNewQuantity()}`
    }
    commitGraph(id, date, this._getNewQuantity()).then(res => {
      if (res.isSuccess) {
        this.load()
      }
    })
  }

  renderPixela() {
    const {navigation} = this.props,
      graph = LoginStore.getGraph(navigation.getParam('graphId'))
    return this.state.svgXmlData ? (
      <Card
        title={graph.name}
      >
        <Pixela
          data={this.state.svgXmlData}
          onPressRect={(date, count) => {
            this.setState({
              targetDate: date,
              targetValue: count,
            })
          }}
        />
        <DatePicker
          format={"YYYY-MM-DD"}
          mode="date"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          style={styles.datepicker}
          date={this.state.targetDate}
          maxDate={this.state.today}
          minDate={this.state.minDate}
          onDateChange={(dateStr) => this.setState({targetDate: dateStr})}
        />
        <Input
          keyboardType={"numeric"}
          containerStyle={styles.count}
          value={`${this.state.targetValue}`}
        />
        <Button
          title="Commit"
          large
          style={styles.button}
          backgroundColor={'#00aced'}
          onPress={() => this._commit()}
        />
      </Card>
    ) : (
      <Text style={styles.text}>
        {"Loading ..."}
      </Text>
    )
  }

  render() {
    const {navigation} = this.props
    if (navigation.getParam('needReload')) this.load()
    return (
      <View>
        {!this.state.isSuccessful ? (
          <Text>{this.state.svgXmlData.message}</Text>
        ) : this.renderPixela()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datepicker: {
    top: -160,
    left: 60,
  },
  button: {
    top: -150,
  },
  text: {
    textAlign: 'center',
    margin: 24,
  },
  count: {
    top: -200,
    left: 210,
    width: '10%',
  }
});
