import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';

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
  flexDirection: row;
`
const CustomerTab = styled.TouchableOpacity`
  flex:1;
  justifyContent: center;
  paddingVertical: 10px;
  borderColor: #ccc;
`
const GuarantorTab = styled.TouchableOpacity`
  paddingVertical: 10px;
  flex:1;
  justifyContent: center;
  borderColor: #ccc;
`
const Tab = styled.View`
  flexDirection: row;
  flex:1;
`
const Customer = styled.Text`
  fontSize: 16px;
  textAlign: center;
  fontWeight: 500;
`
const Guarantor = styled.Text`
  fontSize: 16px;
  textAlign: center;
  fontWeight: 500;
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
      currentPage: 1,
      copyAddr: false,
      loading: false,
      genderOptions: [],
      raceOptions: [],
      nationalityOptions: [],
      stateOptions:[],
      countryOptions: [],
      salutationOptions: [],
      bankOptions: [],
      brokerOptions: [],
      customer_name: null,
      ic_no: null,
      phoneno: null,
      phoneno2: null,
      email: null,
      gender: null,
      dob: null,
      salutation: null,
      nationality: null,
      address: null,
      address2: null,
      city: null,
      postcode: null,
      state: null,
      country: null,
      mail_address: null,
      mail_address2: null,
      mail_city: null,
      mail_postcode: null,
      mail_state: null,
      mail_country: null,
      bankid: null,
      bank_holder_name: null,
      bank_accountno: null,
      company_name: null,
      jobtitle: null,
      company_phoneno: null,
      company_address: null,
      company_address2: null,
      company_city: null,
      company_postcode: null,
      company_state: null,
      company_country: null,
      beneficiary_fullname: null,
      beneficiary_phoneno: null,
      beneficiary_nricno: null,
      beneficiary_relationship: null,
      beneficiary_address: null,
      beneficiary_address2: null,
      beneficiary_city: null,
      beneficiary_postcode: null,
      beneficiary_state: null,
      beneficiary_country: null
    }
  }

  componentDidMount = () => {
    this._getGender();
    this._getRace();
    this._getNationality();
    this._getState();
    this._getCountry();
    this._getBank();
    this._getBroker();
    this._getSalutation();
  }

  _getGender = () => {
    const body = {
      act: "getMasterDataList",
      type: "Gender"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          genderOptions: res.data.response.records,
        })
      }
    })
  }
  _getNationality = () => {
    const body = {
      act: "getMasterDataList",
      type: "Nationality"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          nationalityOptions: res.data.response.records,
        })
      }
    })
  }
  _getRace = () => {
    const body = {
      act: "getMasterDataList",
      type: "Race"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          raceOptions: res.data.response.records,
        })
      }
    })
  }
  _getState = () => {
    const body = {
      act: "getMasterDataList",
      type: "State"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          stateOptions: res.data.response.records,
        })
      }
    })
  }
  _getCountry = () => {
    const body = {
      act: "getMasterDataList",
      type: "Country"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          countryOptions: res.data.response.records,
        })
      }
    })
  }
  _getSalutation = () => {
    const body = {
      act: "getMasterDataList",
      type: "Salutation"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          salutationOptions: res.data.response.records,
        })
      }
    })
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
  _getBroker = () => {
    const body = {
      act: "getMasterDataList",
      type: "Broker"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          brokerOptions: res.data.response.records,
        })
      }
    })
  }

  _copyAddr = () => {
    const { copyAddr } = this.state;
    this.setState({copyAddr: !copyAddr})
  }

  _submit = () => {
    let { customer_name, ic_no, phoneno, phoneno2, email, gender, dob, salutation, nationality, address, address2, city, postcode, state, country, mail_address, mail_address2, mail_city, mail_country, mail_postcode, mail_state, bankid, bank_holder_name, bank_accountno, company_name, jobtitle, company_phoneno, company_address, company_address2, company_city, company_postcode, company_state, company_country, beneficiary_address, beneficiary_address2, beneficiary_city, beneficiary_country, beneficiary_fullname, beneficiary_phoneno, beneficiary_postcode, beneficiary_relationship, beneficiary_nricno, beneficiary_state, genderOptions, salutationOptions } = this.state;

    if (customer_name === null) {
      Alert.alert('Error', 'Please fill in Customer Name.')
      return;
    }
    if (ic_no === null) {
      Alert.alert('Error', 'Please fill in NRIC/Passport.')
      return;
    }
    if (phoneno === null) {
      Alert.alert('Error', 'Please fill in Phone No.')
      return;
    }
    if (gender === null) {
      gender = genderOptions[0].id
    }
    if (salutation === null) {
      salutation = salutationOptions[0].id
    }

    const body = {
      act: 'createCustomer',
      sec_pass: 'v123456',
      fullname: customer_name,
      nricno: ic_no,
      phoneno,
      phoneno2,
      email,
      gender,
      dob,
      salutation,
      nationality,
      address,
      address2,
      city,
      postcode,
      state,
      country,
      mail_address,
      mail_address2,
      mail_city,
      mail_postcode,
      mail_state,
      mail_country,
      bankid,
      bank_holder_name,
      bank_accountno,
      jobtitle,
      company_phoneno,
      company_address,
      company_address2,
      company_city,
      company_postcode,
      company_state,
      company_country,
      beneficiary_address,
      beneficiary_address2,
      beneficiary_city,
      beneficiary_country,
      beneficiary_fullname,
      beneficiary_nricno,
      beneficiary_phoneno,
      beneficiary_postcode,
      beneficiary_relationship,
      beneficiary_state
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress: () => Actions.CreateSales({item: this.state})
          }
        ])
      }
    })
  }

  render() {
    const { currentPage, gender, race, nationality, country, state, copyAddr, genderOptions, raceOptions, countryOptions, nationalityOptions, stateOptions, bankOptions, brokerOptions, salutationOptions, loading } = this.state;
    const { pgView, item } = this.props;
    if (genderOptions.length > 0 && raceOptions.length > 0 && countryOptions.length > 0 && nationalityOptions.length > 0 && stateOptions.length > 0 && bankOptions.length > 0 && brokerOptions.length > 0 && salutationOptions.length > 0) {
      return(
        <Container>
          <Loader loading={loading}/>
          <ScrollView>
            <CustomHeader
              title = {pgView === 'add' ? 'Create Customer' : 'Edit'}
              showBack = {currentPage === 1 && pgView === 'add' ? true : currentPage === 2 && pgView === 'add' ? false : true}
              showMenu = {false}
            />
            {
              pgView === 'add' ? 
                currentPage === 1 ?
                <Divider>
                  <DividerText>Customer Details</DividerText>
                  <Pagination>
                    <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                    <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                  </Pagination>
                </Divider> : 
                <Divider>
                  <DividerText>Guarantor Details</DividerText>
                  <Pagination>
                    <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                    <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                  </Pagination>
                </Divider>
                : 
                <Tab>
                  <CustomerTab
                    style = {{borderBottomColor: currentPage === 1 ? '#999' : '#CCC', borderBottomWidth: currentPage === 1 ? 2 : 1}}
                    onPress = {() => this.setState({currentPage: 1})}
                  >
                    <Customer>Customer</Customer>
                  </CustomerTab>
                  <GuarantorTab
                    style = {{borderBottomColor: currentPage === 2 ? '#999' : '#CCC', borderBottomWidth: currentPage === 2 ? 2 : 1}}
                    onPress = {() => this.setState({currentPage: 2})}
                  >
                    <Guarantor>Guarantor</Guarantor>
                  </GuarantorTab>
                </Tab>
  
            }
            {
              currentPage === 1 ? 
              <View>
                <Section>
                  <SectionName>Personal Details</SectionName>
                  <Form>
                    {
                      pgView === 'edit' ?
                      <Form>
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Register Date</Label>
                          <Input style={styles.input}
                            value = {item.register_date.substring(0,10)}
                            editable = {false}
                          />
                        </Item>
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Customer ID</Label>
                          <Input style={styles.input}
                            value = {item.customer_code}
                            editable = {false}
                          />
                        </Item>
                      </Form> : null
                    }
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'Salutation' : 'Salutation*'}</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.salutation}
                        onValueChange={(value) => this.setState({salutation: value})}
                      >
                        {
                          salutationOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.value}/>
                            )
                          })
                        }
                    </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'Customer Name' : 'Customer Name*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(cusName) => this.setState({customer_name: cusName})}
                        value = {pgView === 'add' ? null : item.customer_name}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'NRIC/Passport' : 'NRIC/Passport*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(nric) => this.setState({ic_no: nric})}
                        value = {pgView === 'add' ? null: item.ic_no}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'Phone No' : 'Phone No*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo) => this.setState({phoneno: phoneNo})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No.2</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo2) => this.setState({phoneno2: phoneNo2})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Email</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({email: email})}
                        keyboardType = 'email-address'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Gender</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined, borderWidth:0.5, borderColor: '#000' }}
                        selectedValue={this.state.gender}
                        onValueChange={(value) => this.setState({gender: value})}
                      >
                        {
                          genderOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Race</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.race}
                        onValueChange={(value) => this.setState({race: value})}
                      >
                        {
                          raceOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Nationality</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.nationality}
                        onValueChange={(value) => this.setState({nationality: value})}
                      >
                        {
                          nationalityOptions.map((item,index) => {
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
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Broker</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={race}
                        onValueChange={(value) => this.setState({broker: value})}
                      >
                        {
                          brokerOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Permanent Address</SectionName>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 1</Label>
                      <Input style={styles.input}
                        onChangeText = {(addr1) => this.setState({address: addr1})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 2</Label>
                      <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({address2: addr2})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Country</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.country}
                        onValueChange={(value) => this.setState({country: value})}
                      >
                        {
                          countryOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.value}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>State</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.state}
                        onValueChange={(value) => this.setState({state: value})}
                      >
                        {
                          stateOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.value}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>City</Label>
                      <Input style={styles.input}
                          onChangeText = {(city) => this.setState({city: city})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Postcode</Label>
                      <Input style={styles.input}
                        onChangeText = {(postcode) => this.setState({postcode: postcode})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Mailing Address</SectionName>
                  <Form>
                  <ListItem style={styles.listItem}>
                    <CheckBox 
                      checked={copyAddr}
                      onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Same as above address</Text>
                    </Body>
                  </ListItem>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 1</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr1) => this.setState({mail_address: addr1})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 2</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({mail_address2: addr2})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Country</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={this.state.mail_country}
                      onValueChange={(value) => this.setState({mail_country: value})}
                    >
                      {
                        countryOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.value}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>State</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={this.state.mail_state}
                      onValueChange={(value) => this.setState({mail_state: value})}
                    >
                      {
                        stateOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.value}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>City</Label>
                    <Input style={styles.input}
                        onChangeText = {(city) => this.setState({mail_city: city})}
                      />
                  </Item>
  
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Postcode</Label>
                    <Input style={styles.input}
                      onChangeText = {(postcode) => this.setState({mail_postcode: postcode})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Bank Account Info</SectionName>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Bank Name</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={this.state.bank}
                        onValueChange={(bankName) => this.setState({bankid: bankName})}
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
                      <Label style={styles.label}>Account Holder</Label>
                      <Input style={styles.input}
                          onChangeText = {(accHolder) => this.setState({bank_holder_name: accHolder})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Account No.</Label>
                      <Input style={styles.input}
                          onChangeText = {(accNo) => this.setState({bank_accountno: accNo})}
                        />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Company Info</SectionName>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Company Name</Label>
                      <Input style={styles.input}
                        onChangeText = {(companyName) => this.setState({company_name: companyName})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Job Title</Label>
                      <Input style={styles.input}
                          onChangeText = {(jobTitle) => this.setState({jobtitle: jobTitle})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Company Phone</Label>
                      <Input style={styles.input}
                          onChangeText = {(companyPhone) => this.setState({company_phoneno: companyPhone})}
                        />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Company Address</SectionName>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 1</Label>
                      <Input style={styles.input}
                          onChangeText = {(addr1) => this.setState({company_address: addr1})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 2</Label>
                      <Input style={styles.input}
                          onChangeText = {(addr2) => this.setState({company_address2: addr2})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Country</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={country}
                        onValueChange={(value) => this.setState({company_country: value})}
                      >
                        {
                          countryOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.value}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>State</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={state}
                        onValueChange={(value) => this.setState({company_state: value})}
                      >
                        {
                          stateOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>City</Label>
                      <Input style={styles.input}
                          onChangeText = {(city) => this.setState({company_city: city})}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Postcode</Label>
                      <Input style={styles.input}
                        onChangeText = {(postcode) => this.setState({company_postcode: postcode})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Upload Photos/Documents</SectionName>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Customer's Photo</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>NRIC Photo 1</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>NRIC Photo 2</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 1</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 2</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 3</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 4</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 5</ImageLabel>
                  </ImageContainer>
                </Section>
              </View>
              : null
            }
            {
              currentPage === 2 ?
              <View>
                <Section>
                  <SectionName>Personal Details</SectionName>
                  <Form>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Name</Label>
                      <Input style={styles.input}
                        onChangeText = {(gName) => this.setState({beneficiary_fullname: gName})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={styles.input}
                        onChangeText = {(gNric) => this.setState({beneficiary_nricno: gNric})}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No</Label>
                      <Input style={styles.input}
                        onChangeText = {(bphone) => this.setState({beneficiary_phoneno: bphone})}
                        keyboardType = 'number-pad'
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Relationship</Label>
                      <Input style={styles.input}
                        onChangeText = {(relationship) => this.setState({beneficiary_relationship: relationship})}
                      />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Guarantor's Address</SectionName>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 1</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr1) => this.setState({beneficiary_address: addr1})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 2</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({beneficiary_address2: addr2})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Country</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={this.state.beneficiary_country}
                      onValueChange={(value) => this.setState({beneficiary_country: value})}
                    >
                      {
                        countryOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.value}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>State</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={state}
                      onValueChange={(value) => this.setState({beneficiary_state: value})}
                    >
                      {
                        stateOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.value}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>City</Label>
                    <Input style={styles.input}
                        onChangeText = {(city) => this.setState({beneficiary_city: city})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Postcode</Label>
                    <Input style={styles.input}
                      onChangeText = {(postcode) => this.setState({beneficiary_postcode: postcode})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                </Section>
                <Section>
                  <SectionName>Upload Photos/Documents</SectionName>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Guarantor's Photo</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>NRIC Photo 1</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>NRIC Photo 2</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 1</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 2</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 3</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 4</ImageLabel>
                  </ImageContainer>
                  <ImageContainer>
                    <Icon
                      name = 'image'
                      type = 'font-awesome'
                      color = '#000'
                    />
                    <ImageLabel>Document 5</ImageLabel>
                  </ImageContainer>
                </Section>
              </View> : null
            }
            
          </ScrollView>
          {
            currentPage === 1 && pgView === 'add' ? 
              <ButtonContainer>
                <Button
                  title = 'NEXT'
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                  onPress = {() => this.setState({currentPage: 2})}
                />
              </ButtonContainer> 
              : currentPage === 2 && pgView === 'add' ?
              <ButtonsContainer>
                <View style={{flex:1}}>
                  <Button
                    title = 'Back'
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                    onPress = {() => this.setState({currentPage: 1})}
                  />
                </View>
                <View style={{flex:1}}>
                  <Button
                    title = 'SUBMIT'
                    buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                    onPress = {() => this._submit()}
                  />
                </View>
              </ButtonsContainer>
              : 
              <ButtonContainer>
                <Button
                  title = 'UPDATE'
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                  onPress = {() => this.setState({currentPage: 2})}
                />
              </ButtonContainer> 
          }
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