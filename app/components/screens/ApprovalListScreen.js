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
const IconContainer = styled.View`
  flex:1;
  alignItems: flex-end;
`  

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading:false,
      item: []
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

  render () {
    const { item } = this.state;
    if (item.records) {
      return(
        <Container>
          <ScrollView>
            <CustomHeader
              title = 'Approval Listing'
              showBack = {true}
            />
            {
              item.records.map((content, index) => {
                const cardId = content.sales_id;
                return (
                  <View>
                    <Collapse
                      onToggle = {() => this._toggle(cardId)}
                      isCollapsed = {this.state[cardId]}
                    >
                      <CollapseHeader>
                        <Card
                          style={{borderBottomWidth: 0, marginTop:10, marginBottom: 0, paddingBottom: 0}}
                        >
                          <DetailsCol>
                            <Username>{content.customer_name}</Username>
                            <DueDateDetail>Apply Date: {content.apply_date}</DueDateDetail>
                            <DueDateDetail>Sales Amt: {content.sales}</DueDateDetail>
                          </DetailsCol>
                          <RemarksCol>
                            <Remark>{content.status}</Remark>
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
                          <DetailsCol>
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
                          </DetailsCol>
                          <RemarksCol
                            style={{justifyContent: 'flex-end'}}
                          >
                            <Button
                              title = 'View'
                              buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0}}
                              onPress = {() => Actions.CustomerDetail({salesId: content.sales_id})}
                            />
                          </RemarksCol>
                        </Card>
                      </CollapseBody>
                    </Collapse>
                  </View>
                )
              })
            }
          </ScrollView>
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