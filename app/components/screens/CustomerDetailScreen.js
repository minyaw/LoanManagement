import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Button, Content } from 'native-base';
import { Avatar } from 'react-native-elements';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';

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
  fontFamily: 'Montserrat-Bold';
`
const UserDetail = styled.Text`
  color: #828899;
  paddingTop: 3px;
  fontFamily: 'Montserrat-Regular';
  fontSize: 10px;
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
  color: #828899;
  fontSize: 10px;
  textAlign: left;
  flex:1;
  justifyContent: center;
  alignItems: center;
  alignSelf: center;
  fontFamily: 'Montserrat-SemiBold';
`
const DetailValue = styled.Text`
  color: ${colors.primary};
  fontFamily: 'Montserrat-SemiBold';
  fontSize: 14px;
  textAlign: right;
  flex:1;
`
const ButtonContainer = styled.TouchableOpacity`

`
const styles = StyleSheet.create({
  label: {
    color: '#828899',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12
  },
  inputContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0
  },
  input : {
    borderWidth: 0.5,
    borderColor: '#ccc',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#192a59'
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
      role: null,
      newSalesAccess: false,
      salesListAccess: false,
      profileAccess: false
    }
  }

  componentDidMount = () => {
    this._getCustomerProfile();
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'customer_new_sales') {
        this.setState({ newSalesAccess: item.can_access })
      }
      if (item.screen_key === 'customer_sales_listing') {
        this.setState({ salesListAccess: item.can_access })
      }
      if (item.screen_key === 'customer_profile') {
        this.setState({ profileAccess: item.can_access })
      }
      
    }
  }

  componentWillReceiveProps = () => {
    this.setState({ role: ApiService.getRole()})

    const body = {
      act: 'getCustomerProfile',
      cust_id: DataService.getCustId()
    }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({item: res.data.response})
      } else {
        if (res.data.errCode === 905) {
          setTimeout(() => {
            Alert.alert('Error', res.data.errMsg, [
              {
                text: 'OK',
                onPress: () => Actions.Login()
              }
            ])
          }, 501);
        } else {
          Alert.alert('Error', res.data.errMsg);
        }
      }
      console.log(res);
    })
  }

  _getCustomerProfile = () => {
    this.setState({ role: ApiService.getRole()})
    const { custId } = this.props;
    DataService.setCustId(custId);

    const body = {
      act: 'getCustomerProfile',
      cust_id: custId
    }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({item: res.data.response})
      } else {
        if (res.data.errCode === 905) {
          setTimeout(() => {
            Alert.alert('Error', res.data.errMsg, [
              {
                text: 'OK',
                onPress: () => Actions.Login()
              }
            ])
          }, 501);
        } else {
          Alert.alert('Error', res.data.errMsg);
        }
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
    const { menuOpen, gender, item, role } = this.state;
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
                <TouchableOpacity
                  onPress = {() => this.state.profileAccess ? Actions.CreateCustomer({pgView: 'edit', item: item}) : null}
                >
                  <Username>{item.customer_name} ></Username>
                </TouchableOpacity>
                <UserDetail>{item.ic_no}</UserDetail>
                <UserDetail>{item.register_date}</UserDetail>
              </UsernameContainer>
            </AvatarContainer>
            {
              role === 'Admin' ? (
                <Form>
                  <DetailContainer>
                    <DetailTitle>Total Sales Application</DetailTitle>
                    <TouchableOpacity
                      onPress={() => Actions.SalesDetailList({cust_id: item.cust_id})}
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
              ) : (
                <Content style={{ paddingHorizontal: 20 }}>
                  {
                    this.state.salesListAccess ? (
                      <Button
                        block
                        style={{backgroundColor: colors.primary}}
                        onPress={() => Actions.SalesDetailList({cust_id: item.cust_id})}
                      >
                        <Text style={{ color: '#FFF', fontFamily: 'AvenirLTStd-Black', fontSize: 14}}>VIEW SALES DETAILS</Text>
                      </Button>
                    ) : null
                  }
                  {
                    this.state.newSalesAccess ? (
                      <Button 
                        block
                        style={{backgroundColor: colors.primary, marginTop: 20}}
                        onPress = {() => Actions.CreateSales({item: item})}
                      >
                        <Text style={{ color: '#FFF', fontFamily: 'AvenirLTStd-Black', fontSize: 14}}>CREATE NEW SALES</Text>
                      </Button>
                    ) : null
                  }
                </Content>
              )
            }
          </ScrollView>
          {
            role === 'item' ? (
              <Button
                block
                onPress = {() => Actions.CreateSales({item: item})}
                style={{backgroundColor: colors.primary}}
              >
                <Text style={{color: '#FFF', fontWeight:'bold'}}>CREATE NEW SALES</Text>
              </Button>
            ) : null
          }
        </Container>
      )
    } else {
      return (
        <Container>
          {/* <Loader loading={true}/> */}
        </Container>
      )
    }
  }
}