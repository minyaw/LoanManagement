import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import { ScrollView, TouchableOpacity, View, Alert, Text } from 'react-native';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { CheckBox } from 'native-base';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Card = styled.View`
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
const BodyDetailsCol = styled.View`
  flex:4;
  justifyContent: flex-start;
`
const RemarksCol = styled.View`
  flex:1;
  justifyContent: center;
  alignItems: flex-end;
`
const SelectCol = styled.View`
  flex:1;
  justifyContent: center;
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
const RemarkAlert = styled.Text`
  color: #F44336;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const IconContainer = styled.View`
  flex:1;
  alignItems: flex-end;
`  
const ButtonsContainer = styled.View`
  flexDirection: row;
`

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading:false,
      item: [],
      edit: false,
      selectedList: []
    }
  }

  componentDidMount = () => {
    const body = {
      act: 'getSalesApprovalList',
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

  _toggle = (cardId) => {
    if (this.state[cardId]) {
      this.setState({[cardId]: false})
    } else {
      this.setState({[cardId]: true})
    }
  }

  _updateStatus = () => {
    if (this.state.edit) {
      this.setState({edit: false})
    } else {
      this.setState({edit: true})
    }
  }
  _select = (id) => {
    if (this.state[id]) {
      console.log('splice');
      this.setState({[id]: false})
      for (let i = 0; i < this.state.selectedList.length; i++) {
        if (this.state.selectedList[i].id === id) {
          console.log('found');
          this.state.selectedList.splice(i, 1)
        }
      }
    } else {
      this.setState({[id]: true})
      this.state.selectedList.push({id})
    }

    console.log(this.state.selectedList);
  }

  _approve = () => {
    const { selectedList, item } = this.state;
    const body = {
      act: 'processSalesApproval',
      cust_id: item.cust_id,
      records: selectedList
    }
    this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        this.setState({loading: false})
        console.log(res);
        if (res.status === 200) {
          Alert.alert('Info', res.data.errMsg,[
            {
              text: 'OK',
              onPress: () => Actions.pop({ refresh: true })
            }
          ])
        }
      })
  }

  _reject = () => {
    const { selectedList, item } = this.state;
    const body = {
      act: 'processSalesReject',
      cust_id: item.cust_id,
      records: selectedList
    }
    this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        this.setState({loading: false})
        console.log(res);
        if (res.status === 200) {
          Alert.alert('Info', res.data.errMsg,[
            {
              text: 'OK',
              onPress: () => Actions.pop({ refresh: true })
            }
          ])
        }
      })
  }

  render () {
    const { item, edit, selectedList, loading } = this.state;
    if (item.records) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView>
            <CustomHeader
              title = 'Approval Listing'
              showBack = {true}
              showEdit  ={true}
              edit = {() => this._updateStatus()}
            />
            {
              item.records.map((content, index) => {
                const cardId = `${content.sales_id}i`;
                return (
                  <View>
                    <Collapse
                      onToggle = {() => this._toggle(cardId)}
                      isCollapsed = {this.state[cardId]}
                      disabled = {edit}
                    >
                      <CollapseHeader>
                        <Card
                          style={{borderBottomWidth: 0, marginTop:10, marginBottom: 0, paddingBottom: 0}}
                        >
                          {
                            edit ?
                            <SelectCol>
                              <CheckBox 
                                checked={this.state[content.sales_id]}
                                onPress={() => this._select(content.sales_id)}
                              />
                            </SelectCol> : null
                          }
                          <DetailsCol>
                            <Username>{content.customer_name}</Username>
                            <DueDateDetail>Apply Date: {content.apply_date}</DueDateDetail>
                            <DueDateDetail>Sales Amt: {content.sales}</DueDateDetail>
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
                          <IconContainer>
                            <Icon
                              name = {this.state[cardId] ? "angle-up" : "angle-down"}
                              type = "font-awesome"
                              color = {'#000'}
                            />
                          </IconContainer>
                        </Card>
                      </CollapseHeader>
                      <CollapseBody>
                        <Card
                          style={{marginTop: 0}}
                        >
                          {
                            edit ?
                            <SelectCol>
                            </SelectCol> : null
                          }
                          <BodyDetailsCol>
                            <DueDateDetail>Credit: {content.credit}</DueDateDetail>
                            <DueDateDetail>Int: {content.int}</DueDateDetail>
                            <DueDateDetail>Dep: {content.dep}</DueDateDetail>
                            <DueDateDetail>Fees: {content.fee}</DueDateDetail>
                            <DueDateDetail>Payment: {content.payment}</DueDateDetail>
                            <DueDateDetail>Days: {content.days}</DueDateDetail>
                            <DueDateDetail>Installment: {content.installment_amount}</DueDateDetail>
                            <DueDateDetail>Bank Name: {content.bank_code}</DueDateDetail>
                            <DueDateDetail>Bank Holder Name: {content.bank_holder}</DueDateDetail>
                            <DueDateDetail>Remark: {content.remark}</DueDateDetail>
                            <DueDateDetail>Broker: {content.broker}</DueDateDetail>
                            <DueDateDetail>Agent: {content.agent}</DueDateDetail>
                            <View style={{paddingTop: 10}}>
                              <Button
                                title = 'View'
                                buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0}}
                                onPress = {() => Actions.CustomerDetail({custId: content.cust_id})}
                                titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                              />
                            </View>
                          </BodyDetailsCol>
                          {/* <RemarksCol
                            style={{justifyContent: 'flex-end'}}
                          >
                            <Button
                              title = 'View'
                              buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0}}
                              onPress = {() => Actions.CustomerDetail({custId: content.cust_id})}
                              titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                            />
                          </RemarksCol>
                          <IconContainer></IconContainer> */}
                        </Card>
                      </CollapseBody>
                    </Collapse>
                  </View>
                )
              })
            }
          </ScrollView>
          <ButtonsContainer>
            <View style={{flex:1}}>
              <Button
                title = 'REJECT'
                buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                disabled = {selectedList.length > 0 ? false: true}
                onPress = {() => this._reject()}
                titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
              />
            </View>
            <View style={{flex:1}}>
              <Button
                title = 'APPROVE'
                buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                disabled = {selectedList.length > 0 ? false: true}
                onPress = {() => this._approve()}
                titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
              />
            </View>
          </ButtonsContainer>
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