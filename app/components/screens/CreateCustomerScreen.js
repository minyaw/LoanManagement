import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View, Alert, ImageBackground, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import ImagePicker from 'react-native-image-picker';
import ActionSheet from 'react-native-action-sheet';
import Modal from "react-native-modal";
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
  color: #828899;
  lineHeight: 24;
  paddingBottom: 10px;
  fontFamily: Montserrat-Regular;
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
  color: #192A59;
  textAlign: center;
  fontSize: 12px;
  fontFamily: Montserrat-SemiBold;
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
  fontSize: 14px;
  textAlign: center;
  fontFamily: AvenirLTStd-Black;
  color: #192a59;
`
const Guarantor = styled.Text`
  fontSize: 14px;
  textAlign: center;
  fontFamily: AvenirLTStd-Black;
  color: #192a59;
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
      nationality: 'MY',
      address: null,
      address2: null,
      city: null,
      postcode: null,
      state: null,
      country: 'MY',
      mail_address: null,
      mail_address2: null,
      mail_city: null,
      mail_postcode: null,
      mail_state: null,
      mail_country: 'MY',
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
      company_country: 'MY',
      beneficiary_fullname: null,
      beneficiary_phoneno: null,
      beneficiary_nricno: null,
      beneficiary_relationship: null,
      beneficiary_address: null,
      beneficiary_address2: null,
      beneficiary_city: null,
      beneficiary_postcode: null,
      beneficiary_state: null,
      beneficiary_country: 'MY',
      profile_image: null,
      nric_doc_image1: null,
      nric_doc_image2: null,
      doc_image1: null,
      doc_image2: null,
      doc_image3: null,
      doc_image4: null,
      doc_image5: null,
      beneficiary_profile_image: null,
      beneficiary_nric_doc_image1: null,
      beneficiary_nric_doc_image2: null,
      beneficiary_doc_image1: null,
      beneficiary_doc_image2: null,
      beneficiary_doc_image3: null,
      beneficiary_doc_image4: null,
      beneficiary_doc_image5: null,
      isVisible: false,
      broker: null,
      sVisible: false
    }
  }

  componentDidMount = () => {
    // this._getGender();
    this._getRace();
    this._getNationality();
    this._getState();
    this._getCountry();
    this._getBank();
    this._getBroker();
    // this._getSalutation();
    if (this.props.item) {
      console.log('item', this.props.item);
      const {item} = this.props;
      this.setState({
        profile_image: item.user_profile_image ? item.user_profile_image : null,
        nric_doc_image1: item.filename_nric1 ? item.filename_nric1 : null,
        nric_doc_image2: item.filename_nric2 ? item.filename_nric2 : null,
        doc_image1: item.filename_doc1 ? item.filename_doc1 : null,
        doc_image2: item.filename_doc2 ? item.filename_doc2 : null,
        doc_image3: item.filename_doc3 ? item.filename_doc3 : null,
        doc_image4: item.filename_doc4 ? item.filename_doc4 : null,
        doc_image5: item.filename_doc5 ? item.filename_doc5 : null,
        beneficiary_profile_image: item.beneficiary_profile_image ? item.beneficiary_profile_image : null,
        beneficiary_nric_doc_image1: item.beneficiary_nric_image1 ? item.beneficiary_nric_image1 : null,
        beneficiary_nric_doc_image2: item.beneficiary_nric_image2 ? item.beneficiary_nric_image2 : null,
        beneficiary_doc_image1: item.beneficiary_doc_image1 ? item.beneficiary_doc_image1 : null,
        beneficiary_doc_image2: item.beneficiary_doc_image2 ? item.beneficiary_doc_image2 : null,
        beneficiary_doc_image3: item.beneficiary_doc_image3 ? item.beneficiary_doc_image3 : null,
        beneficiary_doc_image4: item.beneficiary_doc_image4 ? item.beneficiary_doc_image4 : null,
        beneficiary_doc_image5: item.beneficiary_doc_image5 ? item.beneficiary_doc_image5 : null,
        gender: item.gender,
        race: item.race,
        salutation: item.salutation,
        nationality: item.nationality,
        country: item.country,
        state: item.state,
        mail_country: item.mail_country,
        mail_state: item.mail_state,
        company_country: item.company_country,
        company_state: item.company_state,
        broker: item.broker_id,
        beneficiary_country: item.beneficiary_country,
        beneficiary_state: item.beneficiary_state,
        customer_name: item.customer_name,
        ic_no: item.ic_no,
        phoneno: item.phone_no,
        phoneno2: item.phone_no2,
        email: item.email,
        remark: item.remark,
        address: item.address,
        address2: item.address2,
        city: item.city,
        postcode: item.postcode,
        bank_accountno: item.bank_acct_no,
        bank_holder_name: item.bank_holder_name,
        mail_address: item.mail_address,
        mail_address2: item.mail_address2,
        mail_city: item.mail_city,
        mail_postcode: item.mail_postcode,
        company_address: item.company_address,
        company_address2: item.company_address2,
        company_city: item.company_city,
        company_postcode: item.company_zip,
        beneficiary_address: item.beneficiary_address,
        beneficiary_address2: item.beneficiary_address2,
        beneficiary_city: item.beneficiary_city,
        beneficiary_postcode: item.beneficiary_zip,
        bankid: item.bank_id,
        beneficiary_fullname: item.beneficiary_name,
        beneficiary_nricno: item.beneficiary_ic_no,
        beneficiary_phoneno: item.beneficiary_phone_no,
        beneficiary_relationship: item.beneficiary_relationship
      })
    }
  }

  _getGender = () => {
    const body = {
      act: "getMasterDataList",
      type: "Gender"
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        console.log(res);
        this.setState({
          genderOptions: res.data.response.records,
          gender: res.data.response.records[0].id
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
          race: res.data.response.records[0].id,
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
          state: res.data.response.records[0].id
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
        console.log('country', res);
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
        console.log(res);
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
          bankOptions: res.data.response.records
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
        let options = [];
        options.push({id: "0", value: "None"});
        for (const item of res.data.response.records) {
          options.push(item)
        }
        this.setState({
          brokerOptions: options
        })
      }
    })
  }

  _copyAddr = () => {
    const { copyAddr, address, address2, country, state, city, postcode } = this.state;
    this.setState({copyAddr: !copyAddr}, () => {
      if (this.state.copyAddr) {
        this.setState({ mail_address: address, mail_address2: address2, mail_city: city, mail_country: country, mail_postcode: postcode, mail_state: state }, ()=> {console.log(this.state.mail_state);})
      } else {
        this.setState({ mail_address: null, mail_address2: null, mail_city: null, mail_country: 'MY', mail_postcode: null, mail_state: null })
      }
    })

  }

  _checkRequiredField = () => {
    const { customer_name, ic_no, phoneno} = this.state;
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
    this.setState({sVisible: true})
  }
  _submit = () => {
    let { customer_name, ic_no, phoneno, phoneno2, email, gender, dob, salutation, nationality, address, address2, city, postcode, state, country, mail_address, mail_address2, mail_city, mail_country, mail_postcode, mail_state, bankid, bank_holder_name, bank_accountno, company_name, jobtitle, company_phoneno, company_address, company_address2, company_city, company_postcode, company_state, company_country, beneficiary_address, beneficiary_address2, beneficiary_city, beneficiary_country, beneficiary_fullname, beneficiary_phoneno, beneficiary_postcode, beneficiary_relationship, beneficiary_nricno, beneficiary_state, genderOptions, salutationOptions, profile_image, nric_doc_image1, nric_doc_image2, doc_image1, doc_image2, doc_image3, doc_image4, doc_image5, beneficiary_profile_image, beneficiary_nric_doc_image1, beneficiary_nric_doc_image2, beneficiary_doc_image1, beneficiary_doc_image2, beneficiary_doc_image3, beneficiary_doc_image4, beneficiary_doc_image5, currentPage } = this.state;
    let body;
    if (this.props.item) {
      if (currentPage === 1) {
        body = {
          act: 'updateCustomer',
          sec_pass: DataService.getPassword(),
          cust_id: this.props.item.cust_id,
          fullname: customer_name,
          nricno: ic_no,
          phoneno,
          phoneno2,
          email,
          dob,
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
          company_name,
          company_phoneno,
          company_address,
          company_address2,
          company_city,
          company_postcode,
          company_state,
          company_country,
          profile_image,
          nric_doc_image1,
          nric_doc_image2,
          doc_image1,
          doc_image2,
          doc_image3,
          doc_image4,
          doc_image5,
          salutation: 'Mr.',
          gender: 'm'
        }
      } else {
        body = {
          act: 'updateGuarantor',
          sec_pass: DataService.getPassword(),
          cust_id: this.props.item.cust_id,
          beneficiary_address,
          beneficiary_address2,
          beneficiary_city,
          beneficiary_country,
          beneficiary_fullname,
          beneficiary_nricno,
          beneficiary_phoneno,
          beneficiary_postcode,
          beneficiary_relationship,
          beneficiary_state,
          beneficiary_profile_image,
          beneficiary_nric_doc_image1,
          beneficiary_nric_doc_image2,
          beneficiary_doc_image1,
          beneficiary_doc_image2,
          beneficiary_doc_image3,
          beneficiary_doc_image4,
          beneficiary_doc_image5
        }
      }
      this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        this.setState({loading: false})
        console.log(res);
        if (res.status === 200) {
          Alert.alert('Info', res.data.errMsg,[
            {
              text: 'OK',
              onPress: () => Actions.pop({ refresh: true })
            }
          ])
        }
      })
    } else {
      const body = {
        act: 'createCustomer',
        sec_pass: DataService.getPassword(),
        fullname: customer_name,
        nricno: ic_no,
        phoneno,
        phoneno2,
        email,
        dob,
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
        company_name,
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
        beneficiary_state,
        profile_image,
        nric_doc_image1,
        nric_doc_image2,
        doc_image1,
        doc_image2,
        doc_image3,
        doc_image4,
        doc_image5,
        beneficiary_profile_image,
        beneficiary_nric_doc_image1,
        beneficiary_nric_doc_image2,
        beneficiary_doc_image1,
        beneficiary_doc_image2,
        beneficiary_doc_image3,
        beneficiary_doc_image4,
        beneficiary_doc_image5,
        salutation: 'Mr.',
        gender: 'm'
      }

      this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        this.setState({loading: false})
        console.log(res);
        if (res.status === 200) {
          this.setState({ cust_id: res.data.response.cust_id});
          setTimeout(() => {
            Alert.alert('Info', res.data.errMsg,[
              {
                text: 'Done',
                onPress: () => Actions.pop({ refresh: true})
              },
              {
                text: 'Create Sales',
                onPress: () => Actions.CreateSales({item: this.state})
              }
            ])
          }, 501)
        }
      })
    }

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
              console.log(source);
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
          console.log(source);
          this.setState({
            [path]: source,
          });

          // formdata.append('avatar', response)

        }
      });
    }
  }

  render() {
    const { currentPage, gender, race, nationality, country, state, copyAddr, genderOptions, raceOptions, countryOptions, nationalityOptions, stateOptions, bankOptions, brokerOptions, salutationOptions, loading, customer_name, ic_no, phoneno, phoneno2, email, remark, address, address2, city, postcode, mail_address, mail_address2, mail_city, mail_postcode, bank_holder_name, bank_accountno, company_name, jobtitle, company_phoneno, company_address, company_address2, company_city, company_postcode, company_country, company_state, profile_image, nric_doc_image1, nric_doc_image2, doc_image1, doc_image2, doc_image3, doc_image4, doc_image5, beneficiary_profile_image, beneficiary_doc_image1, beneficiary_doc_image2, beneficiary_doc_image3, beneficiary_doc_image4, beneficiary_doc_image5, beneficiary_nric_doc_image1, beneficiary_nric_doc_image2, isVisible, source, sVisible, bankid } = this.state;
    const { pgView, item } = this.props;
    if (raceOptions.length > 0 && countryOptions.length > 0 && nationalityOptions.length > 0 && stateOptions.length > 0 && bankOptions.length > 0 && brokerOptions.length > 0) {
      return(
        <KeyboardAvoidingView
          style = {{ flex: 1, backgroundColor: `${colors.defaultBackground}` }}
          behavior = 'padding'
        >
          <Loader loading={loading}/>
          <ScrollView keyboardShouldPersistTaps={'handled'}>
            <CustomHeader
              title = {pgView === 'add' ? 'Create Customer' : 'Edit'}
              showBack = {currentPage === 1 && pgView === 'add' ? true : currentPage === 2 && pgView === 'add' ? false : true}
              showMenu = {false}
              refresh = {true}
            />
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
                    style = {{borderBottomColor: currentPage === 1 ? '#192a59' : '#CCC', borderBottomWidth: currentPage === 1 ? 2 : 1}}
                    onPress = {() => this.setState({currentPage: 1})}
                  >
                    <Customer>Customer</Customer>
                  </CustomerTab>
                  <GuarantorTab
                    style = {{borderBottomColor: currentPage === 2 ? '#192a59' : '#CCC', borderBottomWidth: currentPage === 2 ? 2 : 1}}
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
                          <Input style={[styles.input, {backgroundColor: '#eee'}]}
                            value = {item.register_date.substring(0,10)}
                            editable = {false}
                          />
                        </Item>
                        <Item fixedLabel style={styles.inputContainer}>
                          <Label style={styles.label}>Customer ID</Label>
                          <Input style={[styles.input, {backgroundColor: '#eee'}]}
                            value = {item.customer_code}
                            editable = {false}
                          />
                        </Item>
                      </Form> : null
                    }
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'Customer Name' : 'Customer Name*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(cusName) => this.setState({customer_name: cusName})}
                        defaultValue = {pgView === 'add' ? customer_name : item.customer_name}
                        autoCorrect = {false}
                        autoCapitalize = {'characters'}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'NRIC/Passport' : 'NRIC/Passport*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(nric) => this.setState({ic_no: nric})}
                        defaultValue = {pgView === 'add' ? ic_no: item.ic_no}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>{pgView === 'edit' ? 'Phone No' : 'Phone No*'}</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo) => this.setState({phoneno: phoneNo})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        defaultValue = {item ? item.phone_no : null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No.2</Label>
                      <Input style={styles.input}
                        onChangeText = {(phoneNo2) => this.setState({phoneno2: phoneNo2})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        defaultValue = {item ? item.phone_no2 : null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Email</Label>
                      <Input style={styles.input}
                        onChangeText = {(email) => this.setState({email: email})}
                        keyboardType = 'email-address'
                        defaultValue = {item ? item.email : null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Race</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
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
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
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
                        defaultValue = {item ? item.remark : null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Broker</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={this.state.broker}
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
                        defaultValue = {item ? item.address: null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 2</Label>
                      <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({address2: addr2})}
                        defaultValue = {item ? item.address2: null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Country</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={this.state.country}
                        onValueChange={(value) => this.setState({country: value})}
                      >
                        {
                          countryOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>State</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={this.state.state}
                        onValueChange={(value) => this.setState({state: value})}
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
                          onChangeText = {(city) => this.setState({city: city})}
                          defaultValue = {item ? item.city: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Postcode</Label>
                      <Input style={styles.input}
                        onChangeText = {(postcode) => this.setState({postcode: postcode})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        defaultValue = {item ? item.postcode: null}
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
                        defaultValue = {item ? item.mail_address: mail_address}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 2</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({mail_address2: addr2})}
                        defaultValue = {item ? item.mail_address2: mail_address2}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Country</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                      style={{ width: undefined }}
                      selectedValue={this.state.mail_country}
                      onValueChange={(value) => this.setState({mail_country: value})}
                    >
                      {
                        countryOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.id}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>State</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                      style={{ width: undefined }}
                      selectedValue={this.state.mail_state}
                      onValueChange={(value) => this.setState({mail_state: value})}
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
                        onChangeText = {(city) => this.setState({mail_city: city})}
                        defaultValue = {item ? item.mail_city: mail_city}
                      />
                  </Item>

                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Postcode</Label>
                    <Input style={styles.input}
                      onChangeText = {(postcode) => this.setState({mail_postcode: postcode})}
                      keyboardType = 'number-pad'
                      returnKeyType={"done"}
                      defaultValue = {item ? item.mail_postcode: mail_postcode}
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
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={bankid}
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
                          defaultValue = {item ? item.bank_holder_name: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Account No.</Label>
                      <Input style={styles.input}
                          onChangeText = {(accNo) => this.setState({bank_accountno: accNo})}
                          defaultValue = {item ? item.bank_acct_no: null}
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
                        defaultValue = {item ? item.company_name: null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Job Title</Label>
                      <Input style={styles.input}
                          onChangeText = {(jobTitle) => this.setState({jobtitle: jobTitle})}
                          // defaultValue = {item ? item.bank_holder_name: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Company Phone</Label>
                      <Input style={styles.input}
                          onChangeText = {(companyPhone) => this.setState({company_phoneno: companyPhone})}
                          defaultValue = {item ? item.company_phoneno: null}
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
                          defaultValue = {item ? item.company_address: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Address 2</Label>
                      <Input style={styles.input}
                          onChangeText = {(addr2) => this.setState({company_address2: addr2})}
                          defaultValue = {item ? item.company_address2: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Country</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={company_country}
                        onValueChange={(value) => this.setState({company_country: value})}
                      >
                        {
                          countryOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>State</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={company_state}
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
                          defaultValue = {item ? item.company_city: null}
                        />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Postcode</Label>
                      <Input style={styles.input}
                        onChangeText = {(postcode) => this.setState({company_postcode: postcode})}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                        defaultValue = {item ? item.company_postcode: null}
                      />
                    </Item>
                  </Form>
                </Section>
                <Section>
                  <SectionName>Upload Photos/Documents</SectionName>
                  <ImageContainer
                    onPress = {() => this._upload('profile_image')}
                  >
                  {
                    profile_image == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Customer's Photo</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Customer's Photo</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('nric_doc_image1')}
                  >
                  {
                    nric_doc_image1 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>NRIC Photo 1</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>NRIC Photo 1</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('nric_doc_image2')}
                  >
                  {
                    nric_doc_image2 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>NRIC Photo 2</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>NRIC Photo 2</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('doc_image1')}
                  >
                  {
                    doc_image1 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 1</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 1</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('doc_image2')}
                  >
                  {
                    doc_image2 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 2</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 2</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('doc_image3')}
                  >
                  {
                    doc_image3 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 3</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 3</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('doc_image4')}
                  >
                  {
                    doc_image4 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 4</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 4</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('doc_image5')}
                  >
                  {
                    doc_image5 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 5</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 5</ImageLabel>
                    </View>
                    )
                  }
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
                        defaultValue = {item ? item.beneficiary_name: null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>NRIC/Passport</Label>
                      <Input style={styles.input}
                        onChangeText = {(gNric) => this.setState({beneficiary_nricno: gNric})}
                        defaultValue = {item ? item.beneficiary_ic_no: null}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Phone No</Label>
                      <Input style={styles.input}
                        onChangeText = {(bphone) => this.setState({beneficiary_phoneno: bphone})}
                        defaultValue = {item ? item.beneficiary_phone_no: null}
                        keyboardType = 'number-pad'
                        returnKeyType={"done"}
                      />
                    </Item>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Relationship</Label>
                      <Input style={styles.input}
                        onChangeText = {(relationship) => this.setState({beneficiary_relationship: relationship})}
                        defaultValue = {item ? item.beneficiary_relationship: null}
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
                        defaultValue = {item ? item.beneficiary_address: null}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Address 2</Label>
                    <Input style={styles.input}
                        onChangeText = {(addr2) => this.setState({beneficiary_address2: addr2})}
                        defaultValue = {item ? item.beneficiary_address2: null}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Country</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                      style={{ width: undefined }}
                      selectedValue={this.state.beneficiary_country}
                      onValueChange={(value) => this.setState({beneficiary_country: value})}
                    >
                      {
                        countryOptions.map((item,index) => {
                          return (
                            <Picker.Item label={item.value} value={item.id}/>
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>State</Label>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                      style={{ width: undefined }}
                      selectedValue={this.state.beneficiary_state}
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
                        defaultValue = {item ? item.beneficiary_city: null}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Postcode</Label>
                    <Input style={styles.input}
                      onChangeText = {(postcode) => this.setState({beneficiary_postcode: postcode})}
                      keyboardType = 'number-pad'
                      returnKeyType={"done"}
                      defaultValue = {item ? item.beneficiary_zip: null}
                    />
                  </Item>
                </Section>
                <Section>
                  <SectionName>Upload Photos/Documents</SectionName>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_profile_image')}
                  >
                  {
                    beneficiary_profile_image == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Guarantor's Photo</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Guarantor's Photo</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_nric_doc_image1')}
                  >
                  {
                    beneficiary_nric_doc_image1 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>NRIC Photo 1</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>NRIC Photo 1</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_nric_doc_image2')}
                  >
                  {
                    beneficiary_nric_doc_image2 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>NRIC Photo 2</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>NRIC Photo 2</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_doc_image1')}
                  >
                  {
                    beneficiary_doc_image1 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 1</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 1</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_doc_image2')}
                  >
                  {
                    beneficiary_doc_image2 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 2</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 2</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_doc_image3')}
                  >
                  {
                    beneficiary_doc_image3 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 3</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 3</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_doc_image4')}
                  >
                  {
                    beneficiary_doc_image4 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 4</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 4</ImageLabel>
                    </View>
                    )
                  }
                  </ImageContainer>
                  <ImageContainer
                    onPress = {() => this._upload('beneficiary_doc_image5')}
                  >
                  {
                    beneficiary_doc_image5 == null ? (
                    <View>
                      <Icon
                        name = 'image'
                        type = 'font-awesome'
                        color = '#000'
                      />
                      <ImageLabel>Document 5</ImageLabel>
                    </View>
                    ) : (
                    <View>
                      <Icon
                        name = 'check-circle'
                        type = 'font-awesome'
                        color = '#4eff4e'
                      />
                      <ImageLabel>Document 5</ImageLabel>
                    </View>
                    )
                  }
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
                  titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                />
              </ButtonContainer>
              : currentPage === 2 && pgView === 'add' ?
              <ButtonsContainer>
                <View style={{flex:1}}>
                  <Button
                    title = 'Back'
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                    onPress = {() => this.setState({currentPage: 1, profile_image, nric_doc_image1, nric_doc_image2, doc_image1, doc_image2, doc_image3, doc_image4, doc_image5})}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </View>
                <View style={{flex:1}}>
                  <Button
                    title = 'SUBMIT'
                    buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                    onPress = {() => this._checkRequiredField()}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </View>
              </ButtonsContainer>
              :
              <ButtonContainer>
                <Button
                  title = {currentPage === 1 ? 'UPDATE CUSTOMER' : 'UPDATE GUARANTOR'}
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                  onPress = {() => this._checkRequiredField()}
                  titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                />
              </ButtonContainer>
          }
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