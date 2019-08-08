import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import { Button } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';

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
  flex:1
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
  // 'Action',
  // 'No',
  // 'Repayment No',
  'Due Date',
  // 'Installment Amount',
  // 'Status',
  // 'Submit Date',
  // 'Trans ID',
  'Trans Date',
  'Trans Type',
  'Trans Amount',
  // 'Remark',
  // 'Action By'
]
const TransactionListContainer = styled.View`
  paddingHorizontal : 15px;
  paddingVertical: 15px;
`
const TransactionListTitle = styled.Text`
  fontWeight: 600
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
  },
  header: { height: 50 },
  text: { textAlign: 'center', fontWeight: '100' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff', padding: 5 },
  cellText: { margin: 6, textAlign: 'center'}
})

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      gender: '',
      loading: false,
      item: null,
      contentList : [],
      salesIdList: [],
      widthArr: [130, 130, 130, 130]
    }
  }

  componentDidMount = () => {
    this._getSalesDetail();
  }
  
  _getSalesDetail = () => {
    const { cust_id, sales_id } = this.props;
    this.setState({cust_id});
    const body = {
      act: 'getCustomerSalesDetail',
      cust_id,
      sales_id
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({item: res.data.response.sales_detail})
      for (const content of res.data.response.sales_detail.sales_transaction) {
        this.state.contentList.push([
          // content.action,
          // content.no,
          // content.repay_no,
          content.due_date,
          // content.installment_amount,
          // content.status,
          // content.submit_date,
          // content.trans_id,
          content.trans_date,
          content.trans_type,
          content.trans_amount,
          // content.remark,
          // content.action_by
        ])
        this.state.salesIdList.push(content.sales_id);
      }
      this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList})
      console.log(res);
    });
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _getInfo = (sales_id) => {
    console.log(sales_id);
    const { cust_id } = this.state;
    const body = {
      act: 'getSalesRepaymentInfo',
      cust_id,
      sales_id,
      sel_group_id: '6'
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200) {
        Alert.alert('Error', res.data.errMsg)
      }
    });
  }

  render() {
    const { menuOpen, widthArr, loading, item } = this.state;
    const { cust_id, sales_id } = this.props;
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
            <CustomHeader
              title = 'Trans History'
              showBack = {true}
            />
            <ScrollView>
              <FormContainer>
                <DetailContainer>
                  <DetailTitle>Sales ID</DetailTitle>
                  <DetailValue>{item.sales_id}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Agent</DetailTitle>
                  <DetailValue>{item.agent}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Customer</DetailTitle>
                  <DetailValue>{item.customer_name}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Sales Date</DetailTitle>
                  <DetailValue></DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Sales Amount</DetailTitle>
                  <DetailValue>{item.sales_amount}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Credit</DetailTitle>
                  <DetailValue>{item.credit_amount}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Interest</DetailTitle>
                  <DetailValue>{item.interest}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Deposit</DetailTitle>
                  <DetailValue>{item.deposit}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Fees</DetailTitle>
                  <DetailValue>{item.fees}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Payment</DetailTitle>
                  <DetailValue>{item.payment}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Days</DetailTitle>
                  <DetailValue>{item.days}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Outstanding Amt</DetailTitle>
                  <DetailValue>{item.outstanding_amount}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Gain/Loss</DetailTitle>
                  <DetailValue>{item.gain_loss_amount}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Total Principal</DetailTitle>
                  <DetailValue>{item.total_principal}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Total Renew</DetailTitle>
                  <DetailValue>{item.total_renew}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Total Penalty</DetailTitle>
                  <DetailValue>{item.total_penalty}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Total Refund</DetailTitle>
                  <DetailValue>{item.total_refund}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Status</DetailTitle>
                  <DetailValue>{item.status}</DetailValue>
                </DetailContainer>
                <DetailContainer>
                  <DetailTitle>Remarks</DetailTitle>
                  <DetailValue></DetailValue>
                </DetailContainer>
                <ButtonContainer>
                  <Button
                    title = 'Create Trans'
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0, width: 130}}
                    onPress= {() => Actions.CreateTransaction({cust_id, sales_id, item})}
                  />
                </ButtonContainer>
              </FormContainer>
              <TransactionListContainer>
                <TransactionListTitle>Repayment List</TransactionListTitle>
              </TransactionListContainer>
              <ScrollView horizontal={true}>
                <View>
                  <Table borderStyle={{borderColor: 'transparent'}}>
                    <Row data={HeaderList} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                  </Table>
                  <ScrollView>
                      {
                        this.state.contentList.map((rowData, index) => {
                          return(
                            <TouchableOpacity
                              onPress={() => this._getInfo({sales_id: this.state.salesIdList[index]})}
                            >
                              <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                {
                                  rowData.map((cellData, cellIndex) => {
                                    return(
                                      <Cell
                                        key={cellIndex}
                                        data={cellData} textStyle={styles.cellText}
                                        style={[{width:130}, index%2 && {backgroundColor: '#FFFFFF'}]}
                                      />
                                    )
                                  })
                                }
                              </TableWrapper>
                            </TouchableOpacity>
                          )
                        })
                      }
                  </ScrollView>
                </View>
              </ScrollView>
            </ScrollView>
          </Container>
        </Drawer>
      )
    } else {
      return(
        <Container>
          <Loader loading={true}/>
        </Container>
      )
    }
  }
}