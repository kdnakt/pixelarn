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
} from 'react-native-elements'
import {
  HeaderBackButton,
} from 'react-navigation'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition'
import DatePicker from 'react-native-datepicker'
import Pixela from './pixela/Pixela'
import LoginStore from '../store/LoginStore'
import PixelaParser from './pixela/PixelaParser'

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphScreen extends Component<Prop> {
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
        )
    }
  }

  constructor(props) {
    super(props)
    const today = new Date()
    this.state = {
        svgXmlData: null,
        isSuccessful: true,
        targetDate: today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate()
    }
  }

  componentDidMount() {
    this.load()
  }

  load() {
    const { navigation } = this.props,
      id = navigation.getParam('graphId')
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs/` + id)
        .then(res => {
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
      quantity: String(this._getNewQuantity())
    }
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs/${id}/${date}`, {
      method: 'PUT',
      headers: {
        'X-USER-TOKEN': `${LoginStore.getUserToken()}`
      },
      body: JSON.stringify(body),
    }).then(res => {
      if (JSON.parse(res._bodyText).isSuccess) {
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
        />
        <DatePicker
          format={"YYYY-MM-DD"}
          mode="date"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          style={styles.datepicker}
          date={this.state.targetDate}
          onDateChange={(dateStr) => this.setState({targetDate: dateStr})}
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
    top: -180,
    left: 80,
  },
  button: {
    top: -150,
  },
});
