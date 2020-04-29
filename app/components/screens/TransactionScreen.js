import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, TouchableOpacity, Text, Dimensions, Alert, View } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body } from 'native-base';
import { Button, Icon } from 'react-native-elements';
import CancelReasonModal from "../common/CancelReasonModal";

const { width, height } = Dimensions.get('window');
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
const DetailsCol = styled.TouchableOpacity`
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
  fontSize: 8px;
  fontFamily: 'Montserrat-SemiBold';
`
const Remark = styled.Text`
  color: #3F5AA6;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 14px;
  paddingVertical: 15px;
  fontFamily: 'Montserrat-Bold';
`
const ButtonContainer = styled.View`
  flexDirection: row;
`

const CancelBadge = styled.View`
  background: #B71C1C;
  padding: 1px;
`
const CancelText = styled.Text`
  color: #FFF;
  fontSize: 12px;
`
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      loading: false,
      loadPage: 1,
      filter: false,
      agentList:{},
      isEdit: false
    }
  }
  
  componentDidMount = () => {
    this._getTransList();
  }
  
  componentWillReceiveProps = () => {
    this.setState({ isEdit: false })
  }

  _getDefaultList = () => {
    this.setState({ loadPage: 1, isEdit: false, item: null, filter: false }, () => {
      this._getTransList();
    })
  }

  _getTransList = () => {
    const { loadPage } = this.state;
      const body = {
        act: 'getCustomerTransList',
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
  
  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _loadmore = () => {
    const { filter } = this.state;
    this.state.loadPage++;
    if (filter) {
      this._filter();
    } else {
      this._getTransList();
    }
  }

  _filter = () => {
    const { loadPage } = this.state;
      const body = {
        act: 'getCustomerTransList',
        page_no: loadPage,
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_trans_date_from: DataService.getSTrans(),
        filter_trans_date_to: DataService.getETrans()
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

  _longPress = (id) => {
    // this.setState({ isEdit: true, deleteId: id })
    this.setState({ showCancelReason: true, deleteId: id })
  }

  _deleteSalesRepayment = (reason) => {
    const { deleteId } = this.state;
    const body = {
      act: 'deleteSalesRepaymentTrans',
      trans_id: deleteId,
      reason
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      Alert.alert('Info', res.data.errMsg,[
        {
          text: 'OK',
          onPress:() => {
            this.setState({ 
              loadPage: 1,
              item: null
            }, ()=> {
              this._getTransList();
            });
          }
        }
      ])
    })
  }

  render() {
    const {menuOpen, item, loading, isEdit} = this.state;
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
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = 'Transaction'
              openMenu = {this.openMenu.bind(this)}
              showSearch = {true}
              showMenu = {true}
              filter = {()=> this._filter.bind(this)}
              _in = {this}
            />
            {
              item ? (
                item.records.map((content, index) => {
                  return(
                    <ItemCard 
                      // onLongPress = {() => {
                      //   if (content.can_delete) {
                      //     this._longPress(content.trans_id)
                      //   }
                      // }}
                      // onPress={()=> {
                      //   this.setState({ isEdit: false})
                      //   Actions.SalesDetail({cust_id: content.cust_id, sales_id: content.sales_id })
                      // }} 
                      key={index}
                      activeOpacity = {0.6}
                    >
                      <DetailsCol onPress={() => {
                        this.setState({ isEdit: false})
                        Actions.SalesDetail({cust_id: content.cust_id, sales_id: content.sales_id })
                      }}>
                        <Username>{content.customer_name}</Username>
                        <DueDateDetail>Sales ID: {content.repay_no}</DueDateDetail>
                        <DueDateDetail>Trans. Date: {content.trans_date}</DueDateDetail>
                        <DueDateDetail>Trans Amount: {content.trans_amount}</DueDateDetail>
                        <DueDateDetail>Agent: {content.agent}</DueDateDetail>
                      </DetailsCol>
                      <RemarksCol>
                        {
                          content.is_cancelled ? (
                            <View style = {{ position: 'absolute', top: 0 }}>
                              <CancelBadge>
                                <CancelText>Cancelled</CancelText>
                              </CancelBadge>
                            </View>
                          ) : null
                        }
                        <Remark>{content.trans_type}</Remark>
                        {
                          content.can_delete ? (
                            <View style = {{ position: 'absolute', bottom: 0 }}>
                              <Icon
                                name="trash"
                                size={15}
                                color="#B71C1C"
                                type='font-awesome'
                                onPress= {() => this._longPress(content.trans_id)}
                              />
                            </View>
                          ) : null
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
              item ? (
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
            <CancelReasonModal
              isVisible = {this.state.showCancelReason}
              closeModal = {() => this.setState({ showCancelReason: false, isEdit: false })}
              deleteSales = {(reason) => this._deleteSalesRepayment(reason)}
              _in = {this}
            />
          </ScrollView>
          {
            isEdit ? (
              <ButtonContainer>
                <View style = {{ flex: 1 }}>
                  <Button
                    title = {'CANCEL'}
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                    onPress = {() => this.setState({ isEdit: false })}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </View>
                <View style = {{ flex: 1 }}>
                  <Button
                    title = {'DELETE'}
                    buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                    onPress = {() => this.setState({ showCancelReason: true })}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </View>
              </ButtonContainer>
            ) : null
          }
        </Container>
      </Drawer>
    )
  }
}