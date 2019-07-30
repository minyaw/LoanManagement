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
  fontSize: 14px;
  paddingTop: 20px;
`
const styles = StyleSheet.create({
  content: {
    paddingBottom:20
  },
  button: {
    color: `${colors.primary}`,
  }
})
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'admin',
      password: 'v123456',
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
    }, 2000)
    ApiService.post(ApiService.getUrl(), body, true);
  }

  render() {
    const {loading, username, password} = this.state;
    return (
      <Container>
        <Loader loading={loading}/>
        <Content>
          <Form style={styles.content}>
            <Item stackedLabel>
              <Label>Username</Label>
              <Input
                value = {username}
                onChangeText = {(username) => this.setState({username})}
              />
            </Item>
            <Item stackedLabel last>
              <Label>Password</Label>
              <Input 
                value = {password}
                onChangeText = {(password) => this.setState({password})}
              />
            </Item>
          </Form>
          <Button full style={styles.button} onPress={() => this._login()}>
            <Text>Login</Text>
          </Button>
          <VersionNo>v1.0.5</VersionNo>
        </Content>  
      </Container>
    )
  }
}