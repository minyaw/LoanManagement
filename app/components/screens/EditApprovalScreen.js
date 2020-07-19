import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import { Actions } from 'react-native-router-flux';
import SecurityModal from "../common/SecurityModal";
import DataService from '../common/DataService';

const { width, height } = Dimensions.get('window');
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
  fontSize: 14px;
  flex:1;
  fontFamily: 'AvenirLTStd-Black'
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
  fontSize: 14px;
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
  fontSize: 14px;
  fontWeight: 600;
`
const ButtonContainer = styled.View`

`
const ButtonsContainer = styled.View`
  flexDirection: row
`
const styles = StyleSheet.create({
  label: {
    color: '#828899',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12
  },
  inputContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0
  },
  input : {
    borderWidth: 0.5,
    borderColor: '#ccc',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#192a59'
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
      deposit_amount: "0",
      fee_amount: "0",
      interest_amount: "0",
      payment: null,
      remark: null,
      sales_amount: null,
      sVisible: false,
      due_date: null,
      installment_amount: null,
      custName: '',
    }
    this.setDate = this.setDate.bind(this),
    this.setDueDate = this.setDueDate.bind(this)
  }

  componentDidMount = () => {
    const { salesDetail } = this.props;
    this._getCurrency();
    this._getBank();
    this.setDate(new Date());
    console.log(this.props.salesDetail);
    this.setState({
      custName: salesDetail.customer_name,
      apply_date: salesDetail.apply_date,
      currency: salesDetail.currency,
      sales_amount: salesDetail.sales ? salesDetail.sales : salesDetail.sales_amount,
      interest_amount: salesDetail.int,
      deposit_amount: salesDetail.dep,
      fee_amount: salesDetail.fee,
      payment: salesDetail.payment,
      days: salesDetail.days,
      installment_amount: salesDetail.installment_amount,
      bank_acct_id: salesDetail.bank_acct_id,
      bank_acct_id2: salesDetail.bank_acct_id2,
      remark: salesDetail.remark
    });
  }

  _getCurrency = () => {
    const body = {
      act: "getMasterDataList",
      type: "Currency"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      if (res.status === 200 && res.data.errCode === 200) {
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
      if (res.status === 200 && res.data.errCode === 200) {
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

  setDueDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ due_date: [year, month, day].join('-') });
  }

  _submit = () => {
    let { apply_date, sales_amount, currency, interest_amount, deposit_amount, fee_amount, payment, days, bank_acct_id, bank_acct_id2, bank_acct_id3, remark, currencyOptions, bankOptions, due_date, installment_amount } = this.state;
    const { item, pgView, salesDetail } = this.props;
    const  body = {
      act: 'updateSales',
      sec_pass: DataService.getPassword(),
      cust_id: salesDetail.cust_id,
      sales_id: salesDetail.sales_id,
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
      if (res.status === 200 && res.data.errCode === 200) {
        setTimeout(() => {
          Alert.alert('Info', res.data.errMsg,[
            {
              text: 'OK',
              onPress:() => {
                Actions.pop({ refresh:true });
              }
            }
          ])
        }, 501)
      } else {
        if (res.data.errCode === 905) {
          setTimeout(() => {
            Alert.alert('Error', res.data.errMsg, [
              {
                text: 'OK',
                onPress: () => Actions.Login()
              }
            ])
          }, 501);
        } else {
          Alert.alert('Error', res.data.errMsg);
        }
      }
    })
  }

  _checkRequiredField = () => {
    let { apply_date, sales_amount, currency, interest_amount, deposit_amount, fee_amount, payment, days, bank_acct_id, bank_acct_id2, bank_acct_id3, remark, currencyOptions, bankOptions } = this.state;
    const { item, pgView } = this.props;

    if (currency === null) {
      this.setState({currency: currencyOptions[0].id});
    }

    if (bank_acct_id2 === null) {
      bank_acct_id2 = 0;
    }
    if (bank_acct_id3 === null) {
      bank_acct_id3 = 0;
    }
    if (apply_date === null) {
      let month = '' + (newDate.getMonth() + 1)
      let day = '' + newDate.getDate()
      let year = newDate.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.setState({ apply_date: [year, month, day].join('-') });
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

    if (bank_acct_id === null) {
      Alert.alert('Error', 'Please select bank account');
      return;
    }
    this.setState({ sVisible: true })
  }
  render() {
    const { currentPage, gender, race, nationality, country, state, copyAddr, currencyOptions, bankOptions, loading, sales_amount, deposit_amount, fee_amount, interest_amount, payment, sVisible, apply_date, salesDetail, custName, days, remark } = this.state;
    const { item, pgView, repayInfo } = this.props;
    if (currencyOptions.length > 0 && bankOptions.length > 0 && apply_date) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = {'Edit Sales'}
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
                  <DividerText>Edit Sales - Pending For Approval</DividerText>
                </Divider>
                <Section>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Customer Name</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        onChangeText = {(cusName) => this.setState({custName: cusName})}
                        defaultValue = {custName}
                        editable = {false}
                      />
                    </Item>
                    {/* <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        onChangeText = {(nric) => this.setState({nricno: nric})}
                        defaultValue = {item ? item.ic_no : null}
                        editable = {false}
                      />
                    </Item> */}
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Apply Date*</Label>
                      <DatePicker
                        defaultDate={new Date(new Date(parseInt(apply_date.substring(0,4))), new Date(parseInt(apply_date.substring(5,7)) -1), new Date(parseInt(apply_date.substring(8,10))))}
                        // minimumDate={new Date(2018, 1, 1)}
                        maximumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        // placeHolderText={apply_date ? apply_date : 'Select Date'}
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
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
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
                        returnKeyType={"done"}
                        value = {sales_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Interest*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({interest_amount: email})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        value = {interest_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Deposit*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({deposit_amount: email})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        value = {deposit_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Fee*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({fee_amount: email})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        value = {fee_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Payment*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({payment: email})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        value = {payment}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Days*</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({days: email})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        value = {days}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Loan Final Amt</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        editable = {false}
                        value = {sales_amount}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Credit</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        value= { (sales_amount - interest_amount - deposit_amount - fee_amount).toString()}
                        editable = {false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Installment Amt</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        value= {(sales_amount === null || payment === null) ? "0" : (sales_amount / payment).toString()}
                        editable = {false}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Bank Account*</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: Platform.OS === 'ios' ? width*0.65 : undefined }}
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
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: Platform.OS === 'ios' ? width*0.65 : undefined }}
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
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: Platform.OS === 'ios' ? width*0.65 : undefined }}
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
                        value = {remark}
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
              onPress = {() => this._checkRequiredField()}
              titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
            />
          </ButtonContainer>
        </Container>
      )
    } else {
      return (
        <Container>
          {/* <Loader loading={true}/> */}
        </Container>
      )
    }
  }
}