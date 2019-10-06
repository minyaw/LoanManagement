import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Label, Input, Item, DatePicker, ListItem, CheckBox, Body, Picker } from 'native-base';
import { Button, Icon } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import Modal from "react-native-modal";
import CancelReasonModal from "../common/CancelReasonModal";

// const img = "data:image/gif;base64,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"
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
  flex:1;
  justifyContent: center;
  alignItems: center;
  alignSelf: center;
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
  // 'No',
  // 'Repayment No',
  'Due Date',
  'Installment Amount',
  // 'Status',
  // 'Submit Date',
  // 'Trans ID',
  'Trans Date',
  'Trans Type',
  'Trans Amount',
  // 'Remark',
  // 'Action By'
]

const InfoHeaderList = [
  'Action',
  'Submit Date',
  'Receipt',
  'Remark',
  'Action By',
  'Bank Name',
  'Bank Holder',
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
  // btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#000', padding: 5, textDecorationLine:'underline' },
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
      repayIdList: [],
      widthArr: [80, 130, 130, 130, 130, 130],
      infoWidthArr: [80, 130, 130, 130, 130, 130, 130],
      isVisible: false,
      infoList: [],
      showImg: false,
      imgSource: '',
      imageList:[],
      imageIndex: null,
      bankReceipt: [{ id: 'None', value: 'None'}],
      selectedBankSlip: null,
      showReceipt: false,
      receiptUri: null,
      showCancelReason: false
    }
  }

  componentDidMount = () => {
    this._getSalesDetail();
  }

  componentWillReceiveProps = (data) => {
    console.log('data', data);
    this.setState({ contentList:[] })
    this._getSalesDetail()
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
          '',
          content.due_date,
          content.installment_amount,
          content.trans_date,
          content.trans_type,
          content.trans_amount,
          content.is_editable
        ])
        // this.state.infoList.push([
        //   content.submit_date.substring(0,10),
        //   content.receipt === '' ? null : 'View Receipt',
        //   content.remark,
        //   res.data.response.sales_detail.bank_holder
        // ])
        // this.state.imageList.push(
        //   content.receipt === '' ? 'abc' : content.receipt
        // )
        this.state.salesIdList.push(content.sales_id);
        this.state.repayIdList.push(content.repay_id);
      }
      this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, repayIdList: this.state.repayIdList})
      console.log(res);
      if (res.data.response.sales_detail.bankin_slip1) {
        this.state.bankReceipt.push({ id:'Bank In Slip 1', value: res.data.response.sales_detail.bankin_slip1});
      }
      if (res.data.response.sales_detail.bankin_slip2) {
        this.state.bankReceipt.push({ id:'Bank In Slip 2', value: res.data.response.sales_detail.bankin_slip2 });
      }
      if (res.data.response.sales_detail.bankin_slip3) {
        this.state.bankReceipt.push({ id:'Bank In Slip 3', value: res.data.response.sales_detail.bankin_slip3 });
      }
      if (res.data.response.sales_detail.bankin_slip4) {
        this.state.bankReceipt.push({ id:'Bank In Slip 4', value: res.data.response.sales_detail.bankin_slip4 });
      }
      if (res.data.response.sales_detail.bankin_slip5) {
        this.state.bankReceipt.push({ id:'Bank In Slip 5', value: res.data.response.sales_detail.bankin_slip5 });
      }
      if (res.data.response.sales_detail.bankin_slip6) {
        this.state.bankReceipt.push({ id:'Bank In Slip 6', value: res.data.response.sales_detail.bankin_slip6});
      }
      if (res.data.response.sales_detail.bankin_slip7) {
        this.state.bankReceipt.push({ id:'Bank In Slip 7', value: res.data.response.sales_detail.bankin_slip7});
      }
      if (res.data.response.sales_detail.bankin_slip8) {
        this.state.bankReceipt.push({ id:'Bank In Slip 8', value: res.data.response.sales_detail.bankin_slip8});
      }
    });
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _showExpand = (ind) => {
    const { cust_id } = this.props;
    const body = {
      act: 'getSalesRepayTransList',
      sel_group_id: DataService.getSelectedGroup(),
      cust_id,
      sales_id: this.state.salesIdList[ind],
      repay_id: this.state.repayIdList[ind]
    }
    console.log(body);
    this.setState({loading: true, infoList: []})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      for (const content of res.data.response.records) {
        this.state.infoList.push([
          '',
          content.submit_date.substring(0,10),
          content.receipt_file === '' ? null : 'View Receipt',
          content.remark,
          content.action_by,
          content.bank_name,
          content.holder_name,
          content.can_delete,
          content.trans_id
        ])
        this.state.imageList.push(
          content.receipt_file === '' ? 'none' : content.receipt_file
        )
      }

      this.setState(({infoList: this.state.infoList, imageList: this.state.imageList, isVisible: true}))
    });
  }

  _showReceipt = (index) => {
    if (this.state.imageList[index] !== 'none') {
      this.setState({showImg: true, imageIndex: index})
    }
  }

  _showBankSlip = (id) => {
    this.setState({ selectedBankSlip: id })
    if (id !== 'None') {
      this.setState({showReceipt: true})
      for (const item of this.state.bankReceipt) {
        if (id === item.id) {
          this.setState({ receiptUri: item.value })
        }
      }
    }
  }

  _deleteSalesRepayment = (id, reason) => {
    const body = {
      act: 'deleteSalesRepaymentTrans',
      trans_id: id,
      reason
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      Alert.alert('Info', res.data.errMsg,[
        {
          text: 'OK',
          onPress:() => {
            this.setState({ isVisible: false });
          }
        }
      ])
    })
  }

  render() {
    const { menuOpen, widthArr, loading, item, isVisible, showImg, imageList, imageIndex, bankReceipt, receiptId, showReceipt, selectedBankSlip, receiptUri, infoWidthArr } = this.state;
    const { cust_id, sales_id } = this.props;

    const element = (index) => (
      <TouchableOpacity onPress={() => this._showReceipt(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>{ this.state.imageList[index] !== 'none' ? 'View Receipt' : null}</Text>
        </View>
      </TouchableOpacity>
    );

    const edit = (index) => (
      <View style={{alignItems: 'center'}}>
        {
          this.state.infoList[index][7] ? (
            <TouchableOpacity
            // onPress={() => this._deleteSalesRepayment(this.state.infoList[index][8])}
            onPress = {() => this.setState({ showCancelReason: true})}
            >
              <Icon
                name = 'times'
                type = 'font-awesome'
                color = '#ad2429'
                />
            </TouchableOpacity>
          ) : null
        }
        
        <CancelReasonModal
          isVisible = {this.state.showCancelReason}
          closeModal = {() => this.setState({ showCancelReason: false })}
          id = {this.state.infoList[index][8]}
          deleteSales = {(id, reason) => this._deleteSalesRepayment(id, reason)}
        />
      </View>
    );

    const editSales = (index) => (
      <View style={{alignItems: 'center'}}>
        {
          this.state.contentList[index][6] ? (
            <TouchableOpacity
              onPress = {() => Actions.CreateSales({pgView: 'edit', repayInfo: this.state.item.sales_transaction[index], item: this.state.item, cust_id: this.props.cust_id})}
            >
              <Icon
                name = 'md-create'
                type = 'ionicon'
                color = '#3e59a6'
              />
            </TouchableOpacity>
          ) : null
        }
      </View>
    )

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
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <FormContainer>
                <DetailContainer>
                  <DetailTitle>Sales ID</DetailTitle>
                  <DetailValue>{item.sales_no}</DetailValue>
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
                <DetailContainer>
                  <DetailTitle>Bank In Slip</DetailTitle>
                  <View style={{flex:1, justifyContent: 'flex-end'}}>
                    <Picker
                      selectedValue={this.state.selectedBankSlip}
                      style={{ width: undefined}}
                      onValueChange={(value) => this._showBankSlip(value)}
                    >
                      {
                        bankReceipt.map((item,index) => {
                          return (
                            <Picker.Item label={item.id} value={item.id}/>
                          )
                        })
                      }
                    </Picker>
                  </View>
                </DetailContainer>
                <ButtonContainer>
                  <Button
                    title = 'Create Trans'
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0, width: 130}}
                    onPress= {() => Actions.CreateTransaction({cust_id, sales_id, transInfo: item})}
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
                              onPress={() => this._showExpand(index)}
                            >
                              <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                {
                                  rowData.map((cellData, cellIndex) => {
                                    return(
                                      <Cell
                                        key={cellIndex}
                                        data={cellIndex === 0 ? editSales(index) : cellData} textStyle={styles.cellText}
                                        style={[{width: cellIndex === 0 ? 80 : cellIndex > 5 ? 0 : 130}, index%2 && {backgroundColor: '#FFFFFF'}]}
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
              <View>
                <Modal
                  isVisible = {isVisible}
                  onBackdropPress = {() => showImg ? this.setState({showImg: false}) : this.setState({isVisible: false})}
                  onBackButtonPress = {() => showImg ? this.setState({showImg: false}) : this.setState({isVisible: false})}
                >
                  <View
                    style = {{ justifyContent: 'center', alignContent: 'center', alignItems:'center' }}
                  >
                    <ImageBackground
                      style = {{width: '90%', height: '90%', backgroundColor: '#EEE'}}
                    >
                      {
                        !showImg ? (
                          <ScrollView horizontal={true}>
                            <View>
                              <Table borderStyle={{borderColor: 'transparent'}}>
                                <Row data={InfoHeaderList} widthArr={infoWidthArr} style={styles.header} textStyle={styles.text}/>
                              </Table>
                              <ScrollView>
                                  {
                                    this.state.infoList.map((rowData, index) => {
                                      return(
                                        <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                          {
                                            rowData.map((cellData, cellIndex) => {
                                              return(
                                                <Cell
                                                  key={cellIndex}
                                                  data={cellIndex === 2 ? element(index) : cellIndex === 0 ? edit(index) : cellIndex > 6 ? null : cellData} textStyle={styles.cellText}
                                                  style={[{width: cellIndex === 0 ? 80 : cellIndex > 6 ? 0 : 130}, index%2 && {backgroundColor: '#FFFFFF'}]}
                                                />
                                              )
                                            })
                                          }
                                        </TableWrapper>
                                      )
                                    })
                                  }
                              </ScrollView>
                            </View>
                          </ScrollView>
                        ) : (
                          <ImageBackground
                            source = {{uri: imageList[imageIndex]}}
                            style = {{width: '100%', height: '100%', backgroundColor: '#EEE'}}
                            imageStyle = {{resizeMode: 'contain'}}
                          ></ImageBackground>
                        )
                      }
                    </ImageBackground>
                  </View>
                </Modal>
              </View>
              <View>
                <Modal
                  isVisible = {showReceipt}
                  onBackdropPress = {() => this.setState({showReceipt: false})}
                  onBackButtonPress = {() => this.setState({showReceipt: false})}
                >
                  <View
                    style = {{ justifyContent: 'center', alignContent: 'center', alignItems:'center' }}
                  >
                    <ImageBackground
                      style = {{width: '90%', height: '90%', backgroundColor: '#EEE'}}
                    >
                      <ImageBackground
                        source = {{uri: receiptUri}}
                        style = {{width: '100%', height: '100%', backgroundColor: '#EEE'}}
                        imageStyle = {{resizeMode: 'contain'}}
                      ></ImageBackground>
                    </ImageBackground>
                  </View>
                </Modal>
              </View>
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