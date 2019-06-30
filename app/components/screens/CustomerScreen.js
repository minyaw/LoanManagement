import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Input, Button } from 'react-native-elements';
import { ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Card = styled.TouchableOpacity`
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
  color: #3e59a6;
  fontSize: 18px;
  fontWeight: 600;
`
const DueDateDetail = styled.Text`
  color: #888fa8;
  lineHeight: 20px;
`
const Remark = styled.Text`
  color: #576eb1;
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
  fontSize: 16px;
  paddingVertical: 15px;
`

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      loadPage: 1,
      item: null
    }
  }

  componentDidMount = () => {
    this._getCustomerList();
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
    Actions.CreateCustomer();
  }

  _loadmore = () => {
    this.setState({loadPage: this.state.loadPage++})
    this._getCustomerList();
  }
  render() {
    const {menuOpen, loading, item} = this.state;
    if (item) {
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
              <Header
                leftComponent        = {
                  <Icon
                    name = 'bars'
                    type = 'font-awesome'
                    color = '#000'
                    containerStyle = {{paddingLeft: 15}}
                    onPress = { () => this.setState({menuOpen: true})}
                  />
                }
                centerComponent = {{ text: 'Customer', style: { color: '#192a58', fontWeight: "600", fontSize: 20} }}
                rightComponent = {
                  <Icon
                    name = 'search'
                    type = 'font-awesome'
                    color = '#3e59a6'
                    containerStyle = {{paddingRight: 15}}
                  />
                }
                backgroundColor = '#FFF'
                containerStyle  = {{paddingBottom:20, borderBottomColor: '#eee', borderBottomWidth: 1}}
              />
              {
                item.records.map((content, index) => {
                  return(
                    // this._renderList(content, index)
                    <Card onPress={()=> Actions.CustomerDetail({custId: content.cust_id})} key={index}>
                      <DetailsCol>
                        <Username>{content.customer_name}</Username>
                        <DueDateDetail>NRIC/Passport: {content.ic_no}</DueDateDetail>
                        <DueDateDetail>Reg. Date: {content.register_date}</DueDateDetail>
                        <DueDateDetail>Sales Amt: {content.total_sales_amount} ({content.total_cases})</DueDateDetail>
                      </DetailsCol>
                      <RemarksCol>
                        <Remark>{content.status}</Remark>
                      </RemarksCol>
                    </Card>
                  )
                })
              }
              {
                item.records.length < item.total_count ? (
                  <TouchableOpacity
                    onPress={() => this._loadmore()}
                  >
                    <Loadmore>View More ({item.total_count - item.records.length}) ...</Loadmore>
                  </TouchableOpacity>
                ) : (
                  null
                )
              }
            </ScrollView>
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
          </Container>
        </Drawer>
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