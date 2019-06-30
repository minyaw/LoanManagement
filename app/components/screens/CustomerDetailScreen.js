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
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';

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
  justifyContent: center;
`
const Username = styled.Text`
  fontSize: 20px;
  color: ${colors.primary};
  textAlign: center;
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

  componentDidMount = () => {
    const { custId } = this.props;
    const body = {
      act: 'getCustomerProfile',
      cust_id: `${custId}`
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        this.setState({item: res.data.response})
      } else {
        Alert.alert('Error', res.data.errMsg)
      }
      console.log(res);
    })
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  render() {
    const { menuOpen, gender, item } = this.state;
    if (item) {
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
                source        = { { uri: item.user_profile_image} }
              />
              <UsernameContainer>
                <TouchableOpacity>
                  <Username>{item.customer_name} ></Username>
                </TouchableOpacity>
                <UserDetail>{item.ic_no}</UserDetail>
                <UserDetail>{item.register_date}</UserDetail>
              </UsernameContainer>
            </AvatarContainer>
            <Form>
              <DetailContainer>
                <DetailTitle>Total Sales Application</DetailTitle>
                <TouchableOpacity
                  // onPress={() => Actions.SalesDetailList()}
                >
                  <DetailValue>{item.total_sales_application} ></DetailValue>
                </TouchableOpacity>
              </DetailContainer>
              <DetailContainer>
                <DetailTitle>Total Sales Amount</DetailTitle>
                <DetailValue>{item.total_sales_amount}</DetailValue>
              </DetailContainer>
              <DetailContainer>
                <DetailTitle>Total Outstanding Amount</DetailTitle>
                <DetailValue>{item.total_outstanding_amount}</DetailValue>
              </DetailContainer>
              <DetailContainer>
                <DetailTitle>Max Sales Amt Application</DetailTitle>
                <DetailValue>{item.total_sales_application}</DetailValue>
              </DetailContainer>
              <DetailContainer>
                <DetailTitle>Gain / Loss</DetailTitle>
                <DetailValue>{item.gain_loss_amount}</DetailValue>
              </DetailContainer>
              <DetailContainer>
                <DetailTitle>Pending Sales Application</DetailTitle>
                <DetailValue>{item.total_loan_count_pending}</DetailValue>
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
    } else {
      return (
        <Container>
          <Loader loading={true}/>
        </Container>
      )
    }
  }
}