import React, {
  Component
} from 'react'
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  Card,
} from 'react-native-elements'
import {
  type NavigationScreenProp,
} from 'react-navigation/src/TypeDefinition'
import DatePicker from 'react-native-datepicker'
import Pixela from './Pixela'
import LoginStore from './LoginStore'

type Prop = {
  navigation: NavigationScreenProp<*>,
}

export default class GraphScreen extends Component<Prop> {
  static navigationOptions = ({navigation}) => {
    const { name } = navigation.state.params;
    return {
        headerRight: (
          <Button
            title="Delete"
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
    this.state = {
        svgXmlData: null,
        isSuccessful: true,
    }
  }

  componentDidMount() {
    const { navigation } = this.props,
      id = navigation.getParam('graphId')
    fetch(`https://pixe.la/v1/users/${LoginStore.getUserId()}/graphs/` + id)
        .then(res => {
          this.setState({
              svgXmlData: res._bodyText,
              isSuccessful: res.ok,
          })
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
          style={styles.datepicker}
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
          <Text>{JSON.parse(this.state.svgXmlData).message}</Text>
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
  