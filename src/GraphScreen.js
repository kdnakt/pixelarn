import React, {
  Component
} from 'react'
import {
  Alert,
  Button as Btn,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Card,
  Button
} from 'react-native-elements'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition'
import DatePicker from 'react-native-datepicker'
import Pixela from './Pixela'
import LoginStore from './LoginStore'
import PixelaParser from './PixelaParser'

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    const { name } = navigation.state.params;
    return {
        headerRight: (
          <Btn
            title="Delete Graph"
            style={{color:"red"}}
            onPress={() => {
              Alert.alert(
                "Delete",
                `Are you sure to delete this graph: ${name}?`,
                [
                  {text: "Delete", onPress: () => {
                    const id = navigation.getParam("graphId")
                    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs/${id}`, {
                      method: 'DELETE',
                      headers: {
                        'X-USER-TOKEN': `${LoginStore.getUserToken()}`
                      },
                    }).then(res => {
                      if (res.ok) {
                        Alert.alert(JSON.parse(res._bodyText).message)
                        LoginStore.removeGraph(id)
                        navigation.goBack()
                      }
                    })
                  }},
                  {text: "Cancel", onPress: () => Alert.alert("cancelled")}
                ]
              )
            }}
          />
        )
    }
  }

  constructor(props) {
    super(props)
    today = new Date()
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
    return this.state.svgXmlData ? (
      <Card
        title={this.props.navigation.getParam('name')}
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
    return (
      <View style={styles.container}>
        {!this.state.isSuccessful ? (
          <Text>{this.state.svgXmlData.message}</Text>
        ) : this.renderPixela()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  datepicker: {
    top: -100
  },
  text: {
    margin: 100,
    alignItems: 'center',
  }
});
