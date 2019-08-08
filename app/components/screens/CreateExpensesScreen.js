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
      expensesOptions: [],
      currencyOptions: [],
      bankOptions: [],
      loading: false,
      trans_date: null,
      trans_amount: null,
      currency: null,
      expense_type: null,
      ref_no: null,
      remark: null,
      bank_acct_id: null
    },
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getBank();
    this._getCurrency();
    this._getExpensesType();
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
  _getExpensesType = () => {
    const body = {
      act: "getMasterDataList",
      type: "ExpensesType"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          expensesOptions: res.data.response.records,
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

  _submit = () => {
    let { expensesOptions, currencyOptions, bankOptions, trans_date, trans_amount, expense_type, currency, bank_acct_id, ref_no, remark } = this.state;

    if (trans_date === null) {
      Alert.alert('Error', 'Please select Trans Date.');
      return;
    }
    if (trans_amount === null) {
      Alert.alert('Error', 'Please fill in Trans Amount.');
      return;
    }
    if (expense_type === null) {
      expense_type = expensesOptions[0].id;
    }
    if (currency === null) {
      currency = currencyOptions[0].id;
    }
    if (bank_acct_id === null) {
      bank_acct_id = bankOptions[0].id;
    }

    const body = {
      act: 'createExpenses',
      sec_pass: 'v123456',
      bank_acct_id,
      trans_date,
      trans_amount,
      currency,
      expense_type,
      ref_no,
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

  setDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ trans_date: [year, month, day].join('-') });
  }
  render() {
    const { expensesOptions, currencyOptions, bankOptions, loading } = this.state;
    if (expensesOptions.length > 0 && currencyOptions.length > 0 && bankOptions.length > 0) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView>
            <CustomHeader
              title = 'Create Expenses'
              showBack = {true}
              showMenu = {false}
            />
            <View>
              <Divider>
                <DividerText>New Expenses</DividerText>
                {/* <Pagination>
                  <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                  <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                </Pagination> */}
              </Divider>
              <Section>
                {/* <SectionName>Personal Details</SectionName> */}
                <Form>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Transaction Date*</Label>
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
                    <Label style={styles.label}>Customer Name</Label>
                    <Input style={styles.input}
                      onChangeText = {(salutation) => this.setState({fullname: salutation})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Expenses Type*</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={this.state.expense_type}
                      onValueChange={(value) => this.setState({expense_type: value})}
                    >
                      {
                        expensesOptions.map((item, index) => {
                          return(
                            <Picker.Item label={item.value} value={item.id}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Transaction Amt*</Label>
                    <Input style={styles.input}
                      onChangeText = {(trans_amount) => this.setState({trans_amount: trans_amount})}
                      keyboardType = 'number-pad'
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
                            <Picker.Item label={item.value} value={item.id}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Reference No.</Label>
                    <Input style={styles.input}
                      onChangeText = {(ref_no) => this.setState({ref_no: ref_no})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Upload Receipt</Label>
                    {/* <Input style={styles.input}
                      onChangeText = {(email) => this.setState({email: email})}
                      keyboardType = 'number-pad'
                    /> */}
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