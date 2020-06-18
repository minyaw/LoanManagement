import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert, ImageBackground, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, ListItem, CheckBox, Body } from 'native-base';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import { Actions } from 'react-native-router-flux';
import SecurityModal from "../common/SecurityModal";
import DataService from '../common/DataService';
import ActionSheet from 'react-native-action-sheet';
import ImagePicker from 'react-native-image-picker';
import Modal from "react-native-modal";
import DatePicker from 'react-native-datepicker'

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
      bank_acct_id: null,
      sVisible: false,
      isVisible: false,
      attachment: null,
      source: null,
      id: null
    },
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getBank();
    this._getCurrency();
    this._getExpensesType();
    if (this.props.content) {
      const { content } = this.props;
      content.trans_amount = content.trans_amount.replace(/\,/g,'')
      console.log(content);
      this.setState({
        trans_amount: content.trans_amount,
        trans_date: content.trans_date,
        bank_acct_id: content.bank_acct_id,
        expense_type: content.expenses_type,
        id: content.expenses_id,
        remark: content.remark,
        attachment: content.receipt_file,
        ref_no: content.ref_no,
        currency: content.currency
      })
    }
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
          bank_acct_id: res.data.response.records[0].id
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
      console.log(res);
      if (res.status === 200) {
        this.setState({
          expensesOptions: res.data.response.records,
          expense_type: res.data.response.records[0].id
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
          currency: res.data.response.records[0].id
        })
      }
    })
  }

  _submit = () => {
    let { expensesOptions, currencyOptions, bankOptions, trans_date, trans_amount, expense_type, currency, bank_acct_id, ref_no, remark, attachment, id } = this.state;
    const { pgView } = this.props;

    if (expense_type === null) {
      expense_type = expensesOptions[0].id;
    }
    if (currency === null) {
      currency = currencyOptions[0].id;
    }
    if (bank_acct_id === null || bank_acct_id === undefined) {
      bank_acct_id = bankOptions[0].id;
    }

    let body;

    if (pgView === 'edit') {
      body = {
        act: 'updateExpenses',
        sec_pass: DataService.getPassword(),
        bank_acct_id,
        trans_date,
        trans_amount,
        currency,
        expense_type,
        ref_no,
        remark,
        attachment,
        id
      }
    } else {
      body = {
        act: 'createExpenses',
        sec_pass: DataService.getPassword(),
        bank_acct_id,
        trans_date,
        trans_amount,
        currency,
        expense_type,
        ref_no,
        remark,
        attachment
      }
    }
    this.setState({ loading: true })
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false })
      console.log(res);
      if (res.status === 200) {
        setTimeout(() => {
          Alert.alert('Info', res.data.errMsg,[
            {
              text: 'OK',
              onPress:() => Actions.pop({refresh: true})
            }
          ])
        }, 510)
      }
    })
  }

  setDate(newDate) {
    this.setState({ trans_date: newDate });
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

  _checkRequiredField = () => {
    const { trans_date, trans_amount } = this.state;
    if (trans_date === null) {
      let month = '' + (new Date().getMonth() + 1)
      let day = '' + new Date().getDate()
      let year = new Date().getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.setState({ trans_date: [year, month, day].join('-') });
    }
    if (trans_amount === null) {
      Alert.alert('Error', 'Please fill in Trans Amount.');
      return;
    }
    this.setState({ sVisible: true })
  }

  render() {
    const { expensesOptions, currencyOptions, bankOptions, loading, sVisible, isVisible, source, attachment, trans_amount, remark, ref_no } = this.state;
    const { pgView, content } = this.props;

    if (expensesOptions.length > 0 && currencyOptions.length > 0 && bankOptions.length > 0) {
      return(
        <KeyboardAvoidingView
          style = {{ flex: 1, backgroundColor: `${colors.defaultBackground}` }}
          behavior = 'padding'
        >
          <Loader loading={loading}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = { pgView === 'edit' ? 'Edit Expenses' : 'Create Expenses'}
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
                <DividerText>{ pgView === 'edit' ? 'Edit Expenses' : 'New Expenses'}</DividerText>
                {/* <Pagination>
                  <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                  <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                </Pagination> */}
              </Divider>
              <Section>
                {/* <SectionName>Personal Details</SectionName> */}
                <Form>
                  {
                    pgView === 'edit' ? (
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Submit Date</Label>
                        <Input style={[styles.input, {backgroundColor: '#eee'}]}
                          value = {content.submit_date}
                          disabled = {true}
                          style = {{textAlign: 'right'}}
                        />
                      </Item>
                    ) : null
                  }
                  {
                    pgView !== 'edit' ? (
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Transaction Date*</Label>
                        <DatePicker
                          maxDate={new Date()}
                          date={this.state.trans_date}
                          androidMode={"default"}
                          // placeHolderText="Select date"
                          textStyle={{ color: "#000" }}
                          placeHolderTextStyle={{ color: "#d3d3d3" }}
                          onDateChange={(date) => this.setState({ trans_date: date })}
                          disabled={false}
                          confirmBtnText="OK"
                          cancelBtnText="Cancel"
                        />
                      </Item>
                    ) : null
                  }
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Expenses Type*</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
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
                    <Label style={styles.label}>Trans Amount*</Label>
                    <Input style={styles.input}
                      onChangeText = {(trans_amount) => this.setState({trans_amount: trans_amount})}
                      keyboardType = 'number-pad'
                      value = {trans_amount}
                      returnKeyType={"done"}
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
                      value = {ref_no}
                      returnKeyType={"done"}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Upload Receipt</Label>
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
                        titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                      />
                    </View>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Bank Account*</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                      style={{ width: width*0.65 }}
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
                      value = {remark}
                      returnKeyType={"done"}
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
        </KeyboardAvoidingView>
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