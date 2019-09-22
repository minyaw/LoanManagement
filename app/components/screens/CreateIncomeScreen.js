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
import SecurityModal from "../common/SecurityModal";
import DataService from '../common/DataService';
import ActionSheet from 'react-native-action-sheet';
import ImagePicker from 'react-native-image-picker';
import Modal from "react-native-modal";

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
      trans_date: null,
      income_item: null,
      trans_amount: null,
      remark: null,
      loading: false,
      bankAccountOptions: [],
      bank_acct_id: null
    },
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getBankAccount();
  }

  _getBankAccount = () => {
    const body = {
      act: "getMasterDataList",
      type: 'BankAccount'
    };

    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      if (res.status === 200) {
        this.setState({
          bankAccountOptions: res.data.response.records
        })
      }
    })
  }
  
  _submit = () => {
    let { trans_date, trans_amount, remark, income_item, bank_acct_id } = this.state;

    const body = {
      act: 'createOtherIncome',
      sec_pass: DataService.getPassword(),
      trans_date,
      trans_amount,
      remark,
      item: income_item,
      bank_acct_id
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress:() => Actions.pop({refresh: true})
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

  _checkRequiredField = () => {
    const { trans_date, trans_amount, income_item, bankAccountOptions } = this.state;
    this.setState({ bank_acct_id: bankAccountOptions[0].id })
    if (trans_date === null) {
      Alert.alert('Error', 'Please select Trans Date.');
      return;
    }
    if (trans_amount === null || trans_amount === '') {
      Alert.alert('Error', 'Please fill in Trans Amount.');
      return;
    }
    if (income_item === null || income_item === '') {
      Alert.alert('Error', 'Please fill in Item');
      return;
    }

    this.setState({ sVisible: true })
  }

  render() {
    const { loading, sVisible, bankAccountOptions, bank_acct_id } = this.state;
    return(
      <Container>
        <Loader loading={loading}/>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <CustomHeader
            title = 'Create Other Income'
            showBack = {true}
            showMenu = {false}
          />
          <View>
            {/* <View>
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
            </View> */}
            <SecurityModal
              isVisible = {sVisible}
              closeModal = {() => this.setState({sVisible: false})}
              submit = {() => this._submit()}
            />
            <Divider>
              <DividerText>New Other Income</DividerText>
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
                  <Label style={styles.label}>Item*</Label>
                  <Input style={styles.input}
                    onChangeText = {(value) => this.setState({income_item: value})}
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Transaction Amt*</Label>
                  <Input style={styles.input}
                    onChangeText = {(trans_amount) => this.setState({trans_amount: trans_amount})}
                    keyboardType = 'number-pad'
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Bank Account*</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={bank_acct_id}
                    onValueChange={(value) => this.setState({bank_acct_id: value})}
                  >
                  {
                    bankAccountOptions.map((item, index) => {
                      return (
                        <Picker.Item label={item.value} value={item.id} />
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
            onPress = {() => this._checkRequiredField()}
          />
        </ButtonContainer> 
      </Container>
    )
  }
}