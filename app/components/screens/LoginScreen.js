import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import { Form, Item, Input, Label, Text, Button } from 'native-base';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';

const { width, height } = Dimensions.get('window');
const Container = styled.View`
  flex:1;
  backgroundColor: ${colors.defaultBackground}
  justifyContent: center;
`
const Content = styled.View`
  paddingHorizontal: 20px;
`
const VersionNo = styled.Text`
  textAlign: center;
  fontSize: 12px;
  paddingTop: 20px;
  fontFamily: Montserrat-Bold;
`
const styles = StyleSheet.create({
  content: {
    paddingBottom:20
  },
  button: {
    color: `${colors.primary}`,
    paddingHorizontal: 20
  },
  loginText: {
    fontFamily: 'AvenirLTStd-Roman'
  },
  input : {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#192a59'
  },
  label: {
    color: '#828899',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12
  }
})
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
    }
  }
  
  _login = () => {
    const {username, password} = this.state;
    const body = {
      act: 'login',
      username,
      pass: password
    };
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false})
    }, 1000)
    ApiService.post(ApiService.getUrl(), body, true);
  }

  render() {
    const {loading, username, password} = this.state;
    return (
      <Container>
        <Loader loading={loading}/>
        <Content>
          <Form style={styles.content}>
            <Item stackedLabel last>
              <Label style={styles.label}>Username</Label>
              <Input
                style={styles.input}
                value = {username}
                onChangeText = {(username) => this.setState({username})}
                autoCapitalize = "none"
              />
            </Item>
            <Item stackedLabel last>
              <Label style={styles.label}>Password</Label>
              <Input
                style={styles.input} 
                value = {password}
                onChangeText = {(password) => this.setState({password})}
                autoCapitalize = "none"
                secureTextEntry = {true}
              />
            </Item>
          </Form>
          <Button full style={styles.button} onPress={() => this._login()}>
          <Text style={{ color: '#FFF', fontFamily: 'AvenirLTStd-Black', fontSize: 14}}>LOGIN</Text>
          </Button>
          <VersionNo>v1.0.31</VersionNo>
        </Content>  
      </Container>
    )
  }
}