import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Input, Button } from 'react-native-elements';
import { ScrollView, TouchableOpacity, View, Alert, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import CustomHeader from '../common/CustomHeader';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body } from 'native-base';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const ItemCard = styled.TouchableOpacity`
  marginHorizontal: 15px;
  marginVertical: 10px;
  paddingBottom: 10px;
  flexDirection: row;
  borderBottomWidth: 1px;
  borderBottomColor: #eee;
`
const DetailsCol = styled.View`
  flex:2;
  justifyContent: flex-start;
`
const RemarksCol = styled.View`
  flex:1;
  justifyContent: center;
  alignItems: flex-end;
`
const Username = styled.Text`
  color: #3F5AA6;
  fontSize: 14px;
  fontFamily: 'Montserrat-Bold';
`
const DueDateDetail = styled.Text`
  color: #192A59;
  lineHeight: 20px;
  fontSize: 9px;
  fontFamily: 'Montserrat-SemiBold';
`
const SalesAmt = styled.Text`
  color: #192A59;
  lineHeight: 20px;
  fontSize: 9px;
  fontFamily: 'Montserrat-Bold';
`
const Remark = styled.Text`
  color: #3F5AA6;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const RemarkAlert = styled.Text`
  color: #F44336;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const ButtonContainer = styled.View`
  paddingRight: 15;
  paddingBottom: 15;
  position: absolute;
  bottom:0;
  right:0;
`
const AddButton = styled.TouchableOpacity`
  width: 80;
  height: 80;
  borderRadius: 40;
  backgroundColor: #192a58;
  justifyContent: center;
  alignItems: center;
`
const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 14px;
  paddingVertical: 15px;
  fontFamily: 'Montserrat-Bold';
`

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      loadPage: 1,
      item: null,
      filter: false,
      agentList:{},
      brokerList:{},
      addCustAccess: false
    }
  }

  componentDidMount = () => {
    this._getCustomerList();
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'register_customer') {
        this.setState({ addCustAccess: item.can_access })
      }
    }
  }

  componentWillReceiveProps = () => {
    this.setState({
      item:null,
      loadPage:1
    })
    this._getCustomerList();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _getCustomerList = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getCustomerList',
      page_no: loadPage
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        this.setState({ agentList: res.data.response.agent_list, brokerList: res.data.response.broker_list})
        if (this.state.item) {
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({item: this.state.item})
        } else {
          this.setState({item: res.data.response});
        }
      } else {
        Alert.alert('Error', res.data.errMsg)
      }
      console.log(res);
    })
  }

  _redirect = () => {
    Actions.CreateCustomer({pgView: 'add'});
  }

  _loadmore = () => {
    const { filter } = this.state;
    this.setState({loadPage: this.state.loadPage++})
    if (filter) {
      this._filter();
    } else {
      this._getCustomerList();
    }
  }

  _filter = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getCustomerList',
      page_no: loadPage,
      filter_agent: DataService.getAgent(),
      filter_broker: DataService.getBroker(),
      filter_nric_no: DataService.getNric(),
      filter_phone: DataService.getPhone(),
      filter_cust_name: DataService.getCustName()
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        if (loadPage !== 1) {
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({item: this.state.item})
        } else {
          this.setState({item: res.data.response});
        }
      } else {
        Alert.alert('Error', res.data.errMsg)
      }
      console.log(res);
    })
  }

  render() {
    const {menuOpen, loading, item} = this.state;
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
        <Loader loading={loading}/>
        <ScrollView>
          <CustomHeader
            title = 'Customer'
            openMenu  = {this.openMenu.bind(this)}
            showSearch = {true}
            showMenu = {true}
            filter = {()=> this._filter.bind(this)}
            _in = {this}
          />
          {
            item ? (
              item.records.map((content, index) => {
                return(
                  // this._renderList(content, index)
                  <ItemCard onPress={()=> Actions.CustomerDetail({custId: content.cust_id})} key={index}>
                    <DetailsCol>
                      <Username>{content.customer_name}</Username>
                      <DueDateDetail>NRIC/Passport: {content.ic_no}</DueDateDetail>
                      <DueDateDetail>Reg. Date: {content.register_date}</DueDateDetail>
                      <SalesAmt>Sales Amt: {content.total_sales_amount} ({content.total_cases})</SalesAmt>
                    </DetailsCol>
                    <RemarksCol>
                      {
                        content.status === 'Bad Debt' || content.status === 'Arrears' ? (
                          <RemarkAlert>{content.status}</RemarkAlert>
                        ) : (
                          <Remark>{content.status}</Remark>
                        )
                      }
                    </RemarksCol>
                  </ItemCard>
                )
              })
            ) : (
              <Content>
                <Card>
                  <CardItem>
                    <Body style={{alignItems: 'center'}}>
                      <Text>
                        Empty
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </Content>
            )
          }
          {
            item ? 
            (
              item.records.length < item.total_count ? (
                <TouchableOpacity
                  onPress={() => this._loadmore()}
                >
                  <Loadmore>View More ({item.records.length}/{item.total_count}) ...</Loadmore>
                </TouchableOpacity>
              ) : (
                null
              )
            ) : null
          }
          </ScrollView>
          {
            this.state.addCustAccess ? (
              <ButtonContainer>
                <AddButton onPress={() => this._redirect()}>
                  {/* <Text style={{color: '#FFF', fontSize:42}}>+</Text> */}
                  <Icon
                    name = 'plus'
                    type = 'font-awesome'
                    color = '#FFF'
                  />
                </AddButton>
              </ButtonContainer>
            ) : null
          }
        </Container>
      </Drawer>
    )
  }
}