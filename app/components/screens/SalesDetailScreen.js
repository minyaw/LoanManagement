import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import { Button } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
`
const ButtonContainer = styled.View`
  alignItems: flex-end;
  justifyContent: flex-end;
  paddingTop: 15px;
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
const Divider = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const DividerText = styled.Text`
  color: ${colors.primary};
  fontWeight: 600;
  fontSize: 16px;
`
const HeaderList = [
  'Action',
  'No',
  'Repayment No',
  'Due Date',
  'Installment Amount',
  'Status',
  'Submit Date',
  'Trans ID',
  'Trans Date',
  'Trans Type',
  'Trans Amount',
  'Remark',
  'Action By'
]
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
      gender: '',
      contentList : [
        [
          "LIM XUAN XUAN",
          "A223",
          "J00923123",
          "2019-03-11",
          "200,000.00",
          "Approve",
          "2019-03-11",
          "I123",
          "2019-03-11",
          'Type A',
          '200,000.00',
          'Remark',
          'John'
        ],
        [
          "LIM XUAN XUAN",
          "6628A",
          "J00923123",
          "2019-03-11",
          "500,000.00",
          "Approve",
          "2019-03-11",
          "I123",
          "2019-03-11",
          'Type A',
          '120,000.00',
          'Remark',
          'Wick'
        ]
      ],
      widthArr: [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130]
    }
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  render() {
    const { menuOpen, widthArr } = this.state;
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={
        <MenuScene
          closeMenu = {() => this.setState({activeTab:'home', menuOpen: false})}
          switchTab = {() => this.setState({activeTab:'pillar', menuOpen:false})}
          switchStratecution = {() => this.setState({activeTab:'stratecution', menuOpen:false})}
          avatar = {`https://app.leadapreneur.com/storage/${this.state.userAvatar}`}
        />
      }
        styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3}}
        // open={true}
        open={menuOpen}
        openDrawerOffset={0.3}
        tapToClose={true}
        onClose={() => this.setState({menuOpen: false})}
      >
        <Container>
          <CustomHeader
            title = 'Sales Detail'
            showBack = {true}
          />
          <ScrollView>
            <FormContainer>
                <DetailContainer>
                  <DetailTitle>Sales ID</DetailTitle>
                  <DetailValue>9J027</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Agent</DetailTitle>
                  <DetailValue>Group-LBC</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Sales Amount</DetailTitle>
                  <DetailValue>233,000.00</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Credit</DetailTitle>
                  <DetailValue>4,000.00</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Outstanding Amt</DetailTitle>
                  <DetailValue>5,000.00</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Status</DetailTitle>
                  <DetailValue>Arrears</DetailValue>
                </DetailContainer>
              <ButtonContainer>
                <Button
                  title = 'Create Trans'
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0, width: 130}}
                  onPress= {() => Actions.CreateTransaction()}
                />
              </ButtonContainer>
            </FormContainer>
          </ScrollView>
        </Container>
      </Drawer>
    )
  }
}