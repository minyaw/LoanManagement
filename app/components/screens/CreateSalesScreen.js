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
import SecurityModal from "../common/SecurityModal";
import DataService from '../common/DataService';

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
      loading: false,
      currency: null,
      bank_acct_id: null,
      bank_acct_id2: null,
      bank_acct_id3: null,
      currencyOptions: [],
      bankOptions: [],
      apply_date: null,
      days: null,
      deposit_amount: null,
      fee_amount: null,
      interest_amount: null,
      payment: null,
      remark: null,
      sales_amount: null,
      sVisible: false
    }
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getCurrency();
    this._getBank();
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

  _getBank = () => {
    const body = {
      act: "getMasterDataList",
      type: "BankAccount"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        console.log(res);
        let options = [];
        options.push({id: "0", value: "None"});
        for (const item of res.data.response.records) {
          options.push(item);
        }
        this.setState({
          bankOptions: options
        })
      }
    })
  }

  _copyAddr = () => {
    const { copyAddr } = this.state;
    this.setState({copyAddr: !copyAddr})
  }

  setDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ apply_date: [year, month, day].join('-') });
  }

  _submit = () => {
    let { apply_date, sales_amount, currency, interest_amount, deposit_amount, fee_amount, payment, days, bank_acct_id, bank_acct_id2, bank_acct_id3, remark, currencyOptions, bankOptions } = this.state;
    const { item } = this.props;

    if (currency === null) {
      currency = currencyOptions[0].id
    }

    if (bank_acct_id === "0") {
      Alert.alert('Error', 'Please select bank account')
    }
    if (bank_acct_id2 === null) {
      bank_acct_id2 = 0;
    }
    if (bank_acct_id3 === null) {
      bank_acct_id3 = 0;
    }
    if (apply_date === null) {
      Alert.alert('Error', 'Please select Apply Date.')
      return;
    }
    if (sales_amount === null) {
      Alert.alert('Error', 'Please fill in Sales Amount.')
      return;
    }
    if (interest_amount === null) {
      Alert.alert('Error', 'Please fill in Interest Amount.')
      return;
    }
    if (deposit_amount === null) {
      Alert.alert('Error', 'Please fill in Deposit Amount.')
      return;
    }
    if (fee_amount === null) {
      Alert.alert('Error', 'Please fill in Fee Amount.')
      return;
    }
    if (payment === null) {
      Alert.alert('Error', 'Please fill in Payment.')
      return;
    }
    if (days === null) {
      Alert.alert('Error', 'Please fill in Days.')
      return;
    }

    const body = {
      act: 'createSales',
      sec_pass: DataService.getPassword(),
      cust_id: item.cust_id,
      apply_date,
      sales_amount,
      currency,
      interest_amount,
      deposit_amount,
      fee_amount,
      payment,
      days,
      bank_acct_id,
      bank_acct_id2,
      bank_acct_id3,
      remark
    }
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
    const { currentPage, gender, race, nationality, country, state, copyAddr, currencyOptions, bankOptions, loading, sales_amount, deposit_amount, fee_amount, interest_amount, payment, sVisible } = this.state;
    const { item } = this.props;
    if (currencyOptions.length > 0 && bankOptions.length > 0) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = 'Create Sales'
              showBack = {true}
              showMenu = {false}
            />
              <View>
                <SecurityModal
                  isVisible = {sVisible}
                  closeModal = {() => this.setState({sVisible: false})}
                  submit = {() => this._submit()}
                />
                <Divider>
                  <DividerText>New Sales Application</DividerText>
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
                        onChangeText = {(cusName) => this.setState({fullname: cusName})}
                        defaultValue = {item ? item.customer_name : null}
                        editable = {false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={styles.input}
                        onChangeText = {(nric) => this.setState({nricno: nric})}
                        defaultValue = {item ? item.ic_no : null}
                        editable = {false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Apply Date*</Label>
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
                      <Label style={styles.label}>Currency*</Label>
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
                              <Picker.Item label={item.value} value={item.value}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Sales Amount*</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo2) => this.setState({sales_amount: phoneNo2})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Interest*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({interest_amount: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Deposit*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({deposit_amount: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Fee*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({fee_amount: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Payment*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({payment: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Days*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({days: email})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Loan Final Amt</Label>
                      <Input style={styles.input}
                        editable = {false}
                        value = {sales_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Credit</Label>
                      <Input style={styles.input}
                        value= { (sales_amount - interest_amount - deposit_amount - fee_amount).toString()}
                        editable = {false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Installment Amt</Label>
                      <Input style={styles.input}
                        value= {(sales_amount / payment).toString()}
                        editable = {false}
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
                          bankOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Bank Account 2</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.bank_acct_id2}
                        onValueChange={(value) => this.setState({bank_acct_id2: value})}
                      >
                        {
                          bankOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Bank Account 3</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.bank_acct_id3}
                        onValueChange={(value) => this.setState({bank_acct_id3: value})}
                      >
                        {
                          bankOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Remark</Label>
                      <Input style={styles.input}
                        onChangeText = {(remark) => this.setState({remark: remark})}
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
              onPress = {() => this.setState({ sVisible: true })}
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