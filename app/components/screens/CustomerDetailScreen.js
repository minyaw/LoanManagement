import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form } from 'native-base';
import { Avatar, Button } from 'react-native-elements';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const AvatarContainer = styled.View`
  alignItems: center;
  paddingTop: 20px;
  paddingBottom: 20px;
`
const UsernameContainer = styled.View`
  paddingTop: 10px;
  alignItems: center;
`
const Username = styled.Text`
  fontSize: 20px;
  color: ${colors.primary}
`
const UserDetail = styled.Text`
  color: #999;
  paddingTop: 3px;
`
const DetailContainer = styled.View`
  flexDirection: row;
  borderTopWidth: 0.5px;
  borderColor: #eee;
  paddingVertical: 10px;
  paddingHorizontal: 25px;
  flex:1;
`
const DetailTitle = styled.Text`
  color: #acb0bb;
  fontSize: 16px;
  textAlign: left;
  flex:2
`
const DetailValue = styled.Text`
  color: ${colors.primary};
  fontSize: 16px;
  textAlign: right;
  flex:1;
`
const ButtonContainer = styled.TouchableOpacity`

`
const styles = StyleSheet.create({
  label: {
    color: '#8a8f9f',
    fontWeight: "600"
  },
  inputContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0
  },
  input : {
    borderWidth: 0.5,
    borderColor: '#ccc'
  },
  listItem: {
    borderBottomWidth: 0,
    marginLeft :0
  }
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      gender: ''
    }
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  render() {
    const { menuOpen, gender } = this.state;
    return (
      <Container>
        <ScrollView>
          <CustomHeader
            title = 'Details'
            showBack = {true}
            showMenu = {false}
          />
          <AvatarContainer>
            <Avatar
              rounded
              size = "large"
              icon = {{name: 'person'}}
              // source        = { { uri: path === '' ? avatar : path} }
            />
            <UsernameContainer>
              <TouchableOpacity>
                <Username>Lim XUAN XUAN ></Username>
              </TouchableOpacity>
              <UserDetail>690531058889</UserDetail>
              <UserDetail>2019-03-22 11:51:20</UserDetail>
            </UsernameContainer>
          </AvatarContainer>
          <Form>
            <DetailContainer>
              <DetailTitle>Total Sales Application</DetailTitle>
              <TouchableOpacity
                onPress={() => Actions.SalesDetailList()}
              >
                <DetailValue>5 ></DetailValue>
              </TouchableOpacity>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>Total Sales Amount</DetailTitle>
              <DetailValue>300,000.00</DetailValue>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>Total Outstanding Amount</DetailTitle>
              <DetailValue>233,000.00</DetailValue>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>Max Sales Amt Application</DetailTitle>
              <DetailValue>5</DetailValue>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>Gain / Loss</DetailTitle>
              <DetailValue>-117,000.00</DetailValue>
            </DetailContainer>
            <DetailContainer>
              <DetailTitle>Pending Sales Application</DetailTitle>
              <DetailValue>1</DetailValue>
            </DetailContainer>
          </Form>
        </ScrollView>
        <ButtonContainer>
          <Button
            title = 'CREATE NEW SALES'
            buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
            onPress = {() => Actions.CreateSales()}
          />
        </ButtonContainer>
      </Container>
    )
  }
}