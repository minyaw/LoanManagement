import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert, ImageBackground, Dimensions } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import { Actions } from 'react-native-router-flux';
import DataService from '../common/DataService';
import ActionSheet from 'react-native-action-sheet';
import ImagePicker from 'react-native-image-picker';
import Modal from "react-native-modal";
import SecurityModal from "../common/SecurityModal";

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
    borderColor: '#ccc',
  },
  listItem: {
    borderBottomWidth: 0,
    marginLeft :0
  }
})

const today = new Date();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transTypeOptions: [],
      currencyOptions: [],
      bankOptions: [],
      loading: false,
      repayment_no: null,
      currency: "MYR",
      currency_rate: "1",
      trans_date: null,
      trans_type: 'Repayment',
      trans_amount: null,
      bank_acct_id: null,
      attachment: null,
      isVisible: false,
      sVisible: false,
      source: null,
      next_due_date: null,
      refund_amount: "0",
      showNextDue: false,
      next_default_date: null,
      display_trans_date: null,
      display_next_due_date: null,
      ref_no: null
    },
    this.setDate = this.setDate.bind(this),
    this.setNexyPayDate = this.setNexyPayDate.bind(this)
  }

  componentDidMount = () => {
    const next_default_date = new Date().setDate(new Date().getDate() + parseInt(this.props.transInfo.days))

    this.setState({ next_default_date: new Date().setDate(new Date().getDate() + parseInt(this.props.transInfo.days))})

    this._displayNextDue(new Date(next_default_date))
    this.setDate(new Date());
    this._getBank();
    this._getCurrency();
    this._getTransactionType();
    this._getSalesRepaymentInfo();
  }

  _getBank = () => {
    const body = {
      act: "getMasterDataList",
      type: "BankAccount"
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

    const display_month = month;
    const display_day = day;

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ trans_date: [year, month, day].join('-'), display_trans_date: [display_day, display_month, year].join('/') });
  }

  setNexyPayDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ next_due_date: [year, month, day].join('-') });
  }

  _displayNextDue(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ next_due_date: [day, month, year].join('-') });
  }

  _submit = () => {
    const { cust_id, sales_id } = this.props;
    let { repayment_no, currency, currency_rate, trans_date, trans_type, trans_amount, bank_acct_id, currencyOptions, bankOptions, transTypeOptions, attachment, next_due_date, refund_amount, repayOptions, ref_no } = this.state;

    const body = {
      act: 'createTransaction',
      sec_pass: DataService.getPassword(),
      cust_id,
      sales_id,
      repayment_no,
      currency,
      currency_rate,
      trans_date,
      trans_type,
      trans_amount,
      bank_acct_id,
      attachment,
      next_due_date,
      refund_amount,
      ref_no
    }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress:() => Actions.pop({refresh: true, cust_id, sales_id})
          }
        ])
      }
    })
  }

  _upload = (path) => {
    if (this.state[path] !== null) {
      ActionSheet.showActionSheetWithOptions({
        options: ['View Image', 'Upload Image', 'Cancel'],
        tintColor: 'blue',
        cancelButtonIndex: 2
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.setState({isVisible: true, source: this.state[path]})
        } else if (buttonIndex === 1) {
          const options = {
            quality                     : 0.72,
            maxWidth                    : 480,
            title                       : null,
            chooseFromLibraryButtonTitle: 'Choose From Library...',
            takePhotoButtonTitle: 'Take Photo...',
            cancelButtonTitle: 'Cancel',
            storageOptions              : {
              skipBackup: true
            }
          };
          ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel){
              console.log('user cancelled');
            } else {
              let source = 'data:image/jpeg;base64,' + response.data ;
              this.setState({
                [path]: source,
              });
      
              // formdata.append('avatar', response)
              
            }
          });
        }
      })
    } else {
      const options = {
        quality                     : 0.72,
        maxWidth                    : 480,
        title                       : null,
        chooseFromLibraryButtonTitle: 'Choose From Library...',
        takePhotoButtonTitle: 'Take Photo...',
        cancelButtonTitle: 'Cancel',
        storageOptions              : {
          skipBackup: true
        }
      };
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel){
          console.log('user cancelled');
        } else {
          let source = 'data:image/jpeg;base64,' + response.data ;
          this.setState({
            [path]: source,
          });
  
          // formdata.append('avatar', response)
          
        }
      });
    }
  }

  _getSalesRepaymentInfo = () => {
    const { cust_id, sales_id } = this.props;
    const body = {
      act: 'getSalesRepaymentInfo',
      cust_id,
      sales_id
    }
    this.setState({ loading: true });
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false});
      if (res.status === 200) {
        console.log('res', res);
        if (res.data.response.records.length < 1) {
          this.setState({ item: res.data.response.records })
          Alert.alert('Error', res.data.errMsg, [
            {
              text: 'OK',
              onPress: () => Actions.pop()
            }
          ])
        } else {
          this.setState({ item: res.data.response.records, repayOptions: res.data.response.records.repayment_list })
        }
      } 
    })
  }

  _checkRequiredField = () => {
    let { repayment_no, currency, currency_rate, trans_date, trans_type, trans_amount, bank_acct_id, currencyOptions, bankOptions, transTypeOptions, attachment, next_due_date, refund_amount, repayOptions, showNextDue } = this.state;

    if (trans_type === 'Settle' && refund_amount === null) {
      Alert.alert('Error', 'Please fill in Refund Amount.')
      return;
    }
    if (trans_type === 'Renew' && next_due_date === null) {
      Alert.alert('Error', 'Please select Next Due Date')
      return;
    }
    if ((trans_type == 'Renew' || showNextDue) && next_due_date === null ) {
      Alert.alert('Error', 'Please select Next Due Date')
      return;
    }
    if (repayment_no === null) {
      this.setState ({ repayment_no: repayOptions[0].id})
    }
    if (currency !== "MYR" && currency_rate === null ) {
      Alert.alert('Error', 'Please fill in Currency Rate.')
      return;
    }
    if (trans_date === null) {
      Alert.alert('Error', 'Please select Trans Date.')
      return;
    }
    if (trans_type === null) {
      this.setState({ trans_type: transTypeOptions[0].id })
    }
    if (trans_amount === null) {
      Alert.alert('Error', 'Please fill in Trans Amount.')
      return;
    }
    if (bank_acct_id === null) {
      this.setState({ bank_acct_id: bankOptions[0].id })
    }

    this.setState({ sVisible: true })
  }

  _checkTransAmount = (value) => {
    const { item } = this.state;
    if (parseInt(value) < item.installment_amount) {
      this.setState({ showNextDue: true, trans_amount: value })
    } else {
      this.setState({ showNextDue: false, trans_amount: value})
    }
  }

  render() {
    const { currencyOptions, transTypeOptions, bankOptions, loading, isVisible, sVisible, source, attachment, item, repayOptions, repayment_no, trans_type, currency_rate, showNextDue, next_default_date, display_trans_date, display_next_due_date, trans_amount } = this.state;
    const { transInfo } = this.props;
    if (currencyOptions.length > 0 && transTypeOptions.length > 0 && bankOptions.length > 0 && item && repayOptions) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = 'Create Transaction'
              showBack = {true}
              showMenu = {false}
            />
              <View>
                <View>
                  <Modal
                    isVisible = {isVisible}
                    onBackdropPress = {() => this.setState({isVisible: false})}
                    onBackButtonPress = {() => this.setState({isVisible: false})}
                  >
                    <View
                      style = {{ justifyContent: 'center', alignContent: 'center', alignItems:'center' }}
                    >
                      <ImageBackground
                        source = {{uri: source}}
                        style = {{width: width, height: '90%'}}
                      >
                      </ImageBackground>
                    </View>
                  </Modal>
                </View>
                <SecurityModal
                  isVisible = {sVisible}
                  closeModal = {() => this.setState({sVisible: false})}
                  submit = {() => this._submit()}
                />
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
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        // onChangeText = {(salutation) => this.setState({fullname: salutation})}
                        value = {item.customer}
                        disabled = {true}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        onChangeText = {(cusName) => this.setState({nricno: cusName})}
                        value = {item.ic_no}
                        disabled = {true}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        value = {item.pheno_no}
                        disabled = {true}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Outstanding Amount</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        value = {item.outstanding_amount}
                        disabled = {true}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Repayment No.*</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={repayment_no}
                        onValueChange={(value) => this.setState({filter_agent: value})}
                      >
                      {
                        repayOptions.map((item, index) => {
                          return (
                            <Picker.Item label={item.value} value={item.id} />
                          )
                        })
                      }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Repayment Value</Label>
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        placeholder = "0"
                        // value = {trans_amount === null ? "0" : (parseInt(this.props.transInfo.outstanding_amount) - parseInt(trans_amount)).toString()}
                        value = {item.installment_amount}
                        disabled = {true}
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
                      <Input style={[styles.input, this.state.currency === 'MYR' ? { backgroundColor: '#eee'} : null]}
                        defaultValue = {currency_rate}
                        disabled = {this.state.currency === "MYR"}
                        onChangeText = {(value) => this.setState({ currency_rate: value })}
                        keyboardType = "number-pad"
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Trans Date*</Label>
                      {/* <DatePicker
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
                      /> */}
                      <Input style={[styles.input, {backgroundColor: '#eee'}]}
                        value = {display_trans_date}
                        disabled = {true}
                        style = {{textAlign: 'right'}}
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
                        onChangeText = {(value) => this._checkTransAmount(value) }
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    {
                      trans_type === 'Renew' ? (
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Next Pay Amount</Label>
                          <Input style={[styles.input, {backgroundColor: '#eee'}]}
                            value = {trans_amount ? (parseInt(this.props.transInfo.outstanding_amount) - parseInt(trans_amount)).toString() : '0'}
                            disabled = {true}
                          />
                        </Item>
                      ) : null
                    }
                    {
                      trans_type === 'Renew' || showNextDue ? (
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Next Due Date*</Label>
                          <DatePicker
                            defaultDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + parseInt(this.props.transInfo.days))}
                            // minimumDate={new Date(2018, 1, 1)}
                            locale={"en"}
                            timeZoneOffsetInMinutes={undefined}
                            modalTransparent={false}
                            animationType={"fade"}
                            androidMode={"default"}
                            textStyle={{ color: "#000" }}
                            placeHolderTextStyle={{ color: "#d3d3d3" }}
                            onDateChange={this.setNexyPayDate}
                            disabled={false}
                          />
                        </Item>
                      ) : null
                    }
                    {
                      trans_type === 'Settle' ? (
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Refund Amount*</Label>
                          <Input style={styles.input}
                            onChangeText = {(phoneNo2) => this.setState({refund_amount: phoneNo2})}
                            keyboardType = 'number-pad'
                          />
                        </Item>
                      ) : null
                    }
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
                        onChangeText = {(value) => this.setState({ref_no: value})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Payment Receipt</Label>
                      <View style={{ justifyContent: 'center' }}>
                        <Button
                          title = 'Select file to upload'
                          buttonStyle = {{ backgroundColor: colors.primary, alignContent: 'center' }}
                          onPress = {()=> this._upload('attachment')}
                          icon={
                            attachment ? (
                              <Icon
                                name="check-circle"
                                size={15}
                                color="#4eff4e"
                                style={{paddingLeft: 5}}
                              />
                            ) : null
                          }
                          iconRight
                        />
                      </View>
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
                onPress = {() => this._checkRequiredField()}
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