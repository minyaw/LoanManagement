import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import { Actions } from 'react-native-router-flux';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Divider = styled.View`
  paddingHorizontal: 15px;
  backgroundColor: #ebeef7;
  paddingVertical: 10px;
  flexDirection: row;
`
const DividerText = styled.Text`
  color: #192a58;
  fontWeight: 600;
  fontSize: 16px;
  flex:1;
`
const Pagination = styled.View`
  flex:1;
  flexDirection:row;
  justifyContent: flex-end;
`
const PageNumber = styled.Text`
  fontSize: 18px
`
const Section = styled.View`
  paddingHorizontal: 15px;
  paddingTop: 10px;
`
const SectionName = styled.Text`
  fontSize: 16px;
  color: #9fa4b1;
  lineHeight: 24;
  paddingBottom: 10px;
`
const ImageContainer = styled.TouchableOpacity`
  borderWidth: 0.5;
  borderColor: #eee;
  height: 80px;
  paddingVertical: 15px;
  justifyContent: center;
  marginBottom: 10px;
`
const ImageLabel = styled.Text`
  color: #000;
  textAlign: center;
  fontSize: 16px;
  fontWeight: 600;
`
const ButtonContainer = styled.View`

`
const ButtonsContainer = styled.View`
  flexDirection: row
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
      transTypeOptions: [],
      currencyOptions: [],
      bankOptions: [],
      loading: false,
      repayment_no: null,
      currency: null,
      currency_rate: null,
      trans_date: null,
      trans_type: null,
      trans_amount: null,
      bank_acct_id: null,

    },
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getBank();
    this._getCurrency();
    this._getTransactionType();
  }

  _getBank = () => {
    const body = {
      act: "getMasterDataList",
      type: "Bank"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          bankOptions: res.data.response.records,
        })
      }
    })
  }
  _getTransactionType = () => {
    const body = {
      act: "getMasterDataList",
      type: "TransactionType"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          transTypeOptions: res.data.response.records,
        })
      }
    })
  }
  _getCurrency = () => {
    const body = {
      act: "getMasterDataList",
      type: "Currency"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          currencyOptions: res.data.response.records,
        })
      }
    })
  }

  setDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ trans_date: [year, month, day].join('-') });
  }

  _submit = () => {
    const { cust_id, sales_id, item } = this.props;
    let { repayment_no, currency, currency_rate, trans_date, trans_type, trans_amount, bank_acct_id, currencyOptions, bankOptions, transTypeOptions} = this.state;

    if (currency === null) {
      currency = currencyOptions[0].id
    }
    if (repayment_no === null) {
      Alert.alert('Error', 'Please fill in Repayment No.')
      return;
    }
    if (currency_rate === null) {
      Alert.alert('Error', 'Please fill in Currency Rate.')
      return;
    }
    if (trans_date === null) {
      Alert.alert('Error', 'Please select Trans Date.')
      return;
    }
    if (trans_type === null) {
      trans_type = transTypeOptions[0].id
    }
    if (trans_amount === null) {
      Alert.alert('Error', 'Please fill in Trans Amount.')
      return;
    }
    if (bank_acct_id === null) {
      bank_acct_id = bankOptions[0].id
    }

    const body = {
      act: 'createTransaction',
      sec_pass: 'v123456',
      cust_id,
      sales_id,
      repayment_no,
      currency,
      currency_rate,
      trans_date,
      trans_type,
      trans_amount,
      bank_acct_id,
      deposit_amount: item.deposit,
      fee_amount: item.fees,
      payment: item.payment,
      days: item.days
    }
    console.log(body);
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress:() => Actions.pop()
          }
        ])
      }
    })
  }

  render() {
    const { currencyOptions, transTypeOptions, bankOptions, loading } = this.state;
    if (currencyOptions.length > 0 && transTypeOptions.length > 0 && bankOptions.length > 0) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView>
            <CustomHeader
              title = 'Create Transaction'
              showBack = {true}
              showMenu = {false}
            />
              <View>
                <Divider>
                  <DividerText>Customer Transaction</DividerText>
                  {/* <Pagination>
                    <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                    <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                  </Pagination> */}
                </Divider>
                <Section>
                  {/* <SectionName>Personal Details</SectionName> */}
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Customer Name</Label>
                      <Input style={styles.input}
                        onChangeText = {(salutation) => this.setState({fullname: salutation})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={styles.input}
                        onChangeText = {(cusName) => this.setState({nricno: cusName})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo) => this.setState({phoneno: phoneNo})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Repayment No.*</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo) => this.setState({repayment_no: phoneNo})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Repayment Value</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo) => this.setState({repayment_val: phoneNo})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Repay Currency*</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.currency}
                        onValueChange={(value) => this.setState({currency: value})}
                        placeholder="Select Currency"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                      >
                        {
                          currencyOptions.map((item, index) => {
                            return(
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Currency Rate*</Label>
                      <Input style={styles.input}
                        onChangeText = {(currency_rate) => this.setState({currency_rate: currency_rate})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Trans Date*</Label>
                      <DatePicker
                        defaultDate={new Date()}
                        // minimumDate={new Date(2018, 1, 1)}
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText="Select date"
                        textStyle={{ color: "#000" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.setDate}
                        disabled={false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Trans Type*</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.trans_type}
                        onValueChange={(value) => this.setState({trans_type: value})}
                      >
                        {
                          transTypeOptions.map((item, index) => {
                            return(
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Trans Amount*</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo2) => this.setState({trans_amount: phoneNo2})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Bank Account*</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.bank_acct_id}
                        onValueChange={(value) => this.setState({bank_acct_id: value})}
                      >
                        {
                          bankOptions.map((item, index) => {
                            return(
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Receipt No</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({email: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Payment Receipt</Label>
                      {/* <Input style={styles.input}
                        onChangeText = {(email) => this.setState({email: email})}
                        keyboardType = 'number-pad'
                      /> */}
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Remark</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({remark: email})}
                      />
                    </Item>
                  </Form>
                </Section>
              </View>
          </ScrollView>
            <ButtonContainer>
              <Button
                title = 'NEXT'
                buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                onPress = {() => this._submit()}
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