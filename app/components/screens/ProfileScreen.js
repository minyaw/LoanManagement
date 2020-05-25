import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Button } from 'react-native-elements';
import { ScrollView, Text, StyleSheet, Alert, View } from 'react-native';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import CustomHeader from '../common/CustomHeader';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Divider = styled.View`
  paddingHorizontal: 15px;
  backgroundColor: #ebeef7;
  paddingVertical: 10px;
`
const DividerText = styled.Text`
  color: #192a58;
  fontSize: 14px;
  flex:1;
  fontFamily: 'AvenirLTStd-Black'
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const ButtonContainer = styled.View`

`
const PasswordButtonContainer = styled.View`
  alignItems: flex-end;
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
      menuOpen: false,
      loading: false,
      username: '',
      chosenDate: new Date(),
      race: '',
      copyAddr: false,
      item: null,
      fullname: null,
      nricno: null,
      phoneno: null,
      email: null,
      gender: null,
      dob: null,
      nationality: null,
      address: null,
      address2: null,
      city: null,
      postcode: null,
      state: null,
      mail_address: null,
      mail_address2: null,
      mail_city: null,
      mail_postcode: null,
      mail_state: null,
      mail_country: null,
      genderOptions: [],
      raceOptions: [],
      nationalityOptions: [],
      stateOptions:[],
      countryOptions: [],
      role: null,
      currentPage: 1,
      new_password: null,
      current_password: null,
      confirmed_password: null,
      new_sec_password: null,
      current_sec_password: null,
      confirmed_sec_password: null,
      accessList: [],
      profileAccess: false,
      passwordAccess: false
    }
    this.setDate = this.setDate.bind(this)
  }

  componentDidMount = () => {
    this._getInfo();
    this._getGender();
    this._getRace();
    this._getNationality();
    this._getState();
    this._getCountry();
    this.setState({ role: ApiService.getRole() })
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'my_profile') {
        this.setState({ profileAccess: item.can_access }, () => {
          if (!this.state.profileAccess) {
            this.setState({ currentPage: 2 })
          }
        })
      }

      if (item.screen_key === 'change_password') {
        this.setState({ passwordAccess: item.can_access })
      }
    }
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

  _getInfo = () => {
    const body = {
      act:'getUserInfo'
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false});
      if (res.status === 200) {
        console.log(res);
        this.setState({
          item: res.data.response.userInfo,
        })
        this._mapData()
      }
    })
  }

  _mapData = () => {
    const {item} = this.state;
    this.setState({
      fullname: item.fullname,
      nricno: item.icno,
      phoneno: item.phoneno,
      email: item.email,
      gender: item.gender,
      dob: item.dob,
      race: item.race,
      nationality: item.nationality,
      address: item.address,
      address2: item.address2,
      country: item.country,
      state: item.state,
      city: item.city,
      postcode: item.zip,
      mail_address: item.mail_address,
      mail_address2: item.mail_address2,
      mail_city: item.mail_city,
      mail_postcode: item.mail_postcode,
      mail_state: item.mail_state,
      mail_country: item.mail_country
    })
  }

  setDate(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ dob: [year, month, day].join('-') });
  }

  _copyAddr = () => {
    const { copyAddr } = this.state;
    this.setState({copyAddr: !copyAddr})
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _update = () => {
    const { fullname, nricno, phoneno, email, gender, dob, nationality, address, address2, city, postcode, state,country,  mail_address, mail_address2, mail_city, mail_postcode, mail_state, mail_country, new_password, confirmed_password, current_password, currentPage } = this.state
      const body = {
        act: 'updateProfile',
        sec_pass: DataService.getPassword(),
        fullname,
        nricno,
        phoneno,
        email,
        gender,
        dob,
        nationality,
        address,
        address2,
        city,
        postcode,
        state,
        mail_address,
        mail_address2,
        mail_city,
        mail_postcode,
        mail_state,
        mail_country
      }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        Alert.alert(res.data.errMsg)
      }
    })
  }

  _updatePassword = () => {
    const { current_password, new_password, confirmed_password } = this.state;
    if (current_password === null || current_password === '') {
      Alert.alert('Error', 'Please fill in current password.')
      return;
    }
    if (new_password === null || new_password === '') {
      Alert.alert('Error', 'Please fill in new password.')
      return;
    }
    if (confirmed_password === null || confirmed_password === '') {
      Alert.alert('Error', 'Please fill in confirm password.')
      return;
    }

    const body = {
      act: 'updatePassword',
      sec_pass: DataService.getPassword(),
      current_password,
      new_password,
      confirmed_password
    }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200) {
        if (res.data.ErrCode !== 200) {
          Alert.alert(res.data.ErrMsg);
        } else if (res.data.ErrCode === 200) {
          Alert.alert(res.data.response.succMsg);
        }
      }
    })
  }

  _updateSecPassword = () => {
    const { current_sec_password, new_sec_password, confirmed_sec_password } = this.state;
    if (current_sec_password === null || current_sec_password === '') {
      Alert.alert('Error', 'Please fill in current security password.')
      return;
    }
    if (new_sec_password === null || new_sec_password === '') {
      Alert.alert('Error', 'Please fill in new security password.')
      return;
    }
    if (confirmed_sec_password === null || confirmed_sec_password === '') {
      Alert.alert('Error', 'Please fill in confirm security password.')
      return;
    }

    const body = {
      act: 'updateSecPassword',
      sec_pass: DataService.getPassword(),
      current_sec_password,
      new_sec_password,
      confirmed_sec_password
    }

    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200) {
        if (res.data.ErrCode !== 200) {
          Alert.alert(res.data.ErrMsg);
        } else if (res.data.ErrCode === 200) {
          Alert.alert(res.data.response.succMsg);
        }
      }
    })
  }

  render() {
    const {menuOpen, copyAddr, item, loading, genderOptions, raceOptions, countryOptions, nationalityOptions, stateOptions, role, currentPage, profileAccess, passwordAccess } = this.state;
    if (item && genderOptions && raceOptions && countryOptions && nationalityOptions && stateOptions) {
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
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              {/* <Header
                leftComponent        = {
                  <Icon
                    name = 'bars'
                    type = 'font-awesome'
                    color = '#000'
                    containerStyle = {{paddingLeft: 15}}
                    onPress = { () => this.setState({menuOpen: true})}
                  />
                }
                centerComponent = {{ text: 'My Profile', style: { color: '#192a58', fontWeight: "600", fontSize: 20} }}
                backgroundColor = '#FFF'
                containerStyle  = {{paddingBottom:20, borderBottomColor: '#eee', borderBottomWidth: 1}}
              /> */}
              <CustomHeader
                title = 'My Profile'
                openMenu  = {this.openMenu.bind(this)}
                showMenu = {true}
              />
              {
                profileAccess ? (
                  <Tab>
                    <CustomerTab
                      style = {{borderBottomColor: currentPage === 1 ? '#192a59' : '#CCC', borderBottomWidth: currentPage === 1 ? 2 : 1}}
                      onPress = {() => this.setState({currentPage: 1})}
                    >
                      <Customer>Details</Customer>
                    </CustomerTab>
                    <GuarantorTab
                      style = {{borderBottomColor: currentPage === 2 ? '#192a59' : '#CCC', borderBottomWidth: currentPage === 2 ? 2 : 1}}
                      onPress = {() => this.setState({currentPage: 2})}
                    >
                      <Guarantor>Password</Guarantor>
                    </GuarantorTab>
                  </Tab>
                ) : null
              }
              {
                profileAccess && currentPage === 1 ? (
                <View>
                  <Divider>
                    <DividerText>Personal Details</DividerText>
                  </Divider>
                  <FormContainer>
                    <Form>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Full Name</Label>
                        <Input style={styles.input}
                          defaultValue = {item.fullname}
                          onChangeText = {(fullname) => this.setState({fullname: fullname})}
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>NRIC/Passport</Label>
                        <Input style={styles.input}
                          defaultValue = {item.icno}
                          onChangeText = {(nricno) => this.setState({nricno: nricno})}
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Phone No</Label>
                        <Input style={styles.input}
                          defaultValue = {item.phoneno}
                          onChangeText = {(phoneno) => this.setState({phoneno: phoneno})}
                          keyboardType = 'number-pad'
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Email</Label>
                        <Input style={styles.input}
                          defaultValue = {item.email}
                          onChangeText = {(email) => this.setState({email: email})}
                          keyboardType = 'email-address'
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Gender</Label>
                        <Picker
                          mode="dropdown"
                          iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                          style={{ width: undefined }}
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
                        <Label style={styles.label}>Date of Birth</Label>
                        <DatePicker
                          defaultDate={new Date(1990, 1, 1)}
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
                          selectedValue ={this.state.nationality}
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
                    </Form>
                  </FormContainer>
                  <Divider>
                    <DividerText>Permanent Address</DividerText>
                  </Divider>
                  <FormContainer>
                    <Form>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Address 1</Label>
                        <Input style={styles.input}
                          defaultValue = {item.address}
                          onChangeText = {(addr1) => this.setState({address: addr1})}
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Address 2</Label>
                        <Input style={styles.input}
                          defaultValue = {item.address2}
                          onChangeText = {(addr2) => this.setState({address2: addr2})}
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
                          defaultValue={item.city}
                          onChangeText = {(city) => this.setState({city: city})}
                        />
                      </Item>

                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Postcode</Label>
                        <Input style={styles.input}
                          defaultValue = {item.zip}
                          onChangeText = {(postcode) => this.setState({postcode: postcode})}
                        />
                      </Item>
                    </Form>
                  </FormContainer>
                  <Divider>
                    <DividerText>Mailing Address</DividerText>
                  </Divider>
                  <FormContainer>
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
                          defaultValue = {item.mail_address}
                          onChangeText = {(addr1) => this.setState({mail_address: addr1})}
                        />
                      </Item>
                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Address 2</Label>
                        <Input style={styles.input}
                          defaultValue = {item.mail_address2}
                          onChangeText = {(addr2) => this.setState({mail_address2: addr2})}
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
                          onChangeText = {(city) => this.setState({city: city})}
                          defaultValue = {item.mail_city}
                        />
                      </Item>

                      <Item fixedLabel style={styles.inputContainer}>
                        <Label style={styles.label}>Postcode</Label>
                        <Input style={styles.input}
                          onChangeText = {(city) => this.setState({city: city})}
                          defaultValue = {item.mail_postcode}
                        />
                      </Item>
                    </Form>
                  </FormContainer>
                </View>
                ) : null
              }
              {
                currentPage === 2 ? (
                  (
                    <View>
                      <Divider>
                        <DividerText>Password</DividerText>
                      </Divider>
                      <FormContainer>
                        <Form>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>Current Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({current_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>New Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({new_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>Confirm Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({confirmed_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                        </Form>
                        <PasswordButtonContainer>
                          <Button
                            title = {'UPDATE'}
                            buttonStyle = {{backgroundColor: colors.primary, paddingHorizontal: 10}}
                            onPress = {() => this._updatePassword()}
                            titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                          />
                        </PasswordButtonContainer>
                      </FormContainer>

                      <Divider>
                        <DividerText>Secondary Password</DividerText>
                      </Divider>
                      <FormContainer>
                        <Form>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>Current Security Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({current_sec_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>New Security Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({new_sec_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                          <Item fixedLabel style={styles.inputContainer}>
                            <Label style={styles.label}>Confirm Security Password*</Label>
                            <Input style={styles.input}
                              onChangeText = {(value) => this.setState({confirmed_sec_password: value})}
                              autoCapitalize = "none"
                              secureTextEntry = {true}
                              // defaultValue = {item.mail_postcode}
                            />
                          </Item>
                        </Form>
                        <PasswordButtonContainer>
                          <Button
                            title = {'UPDATE'}
                            buttonStyle = {{backgroundColor: colors.primary, paddingHorizontal: 10}}
                            onPress = {() => this._updateSecPassword()}
                            titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                          />
                        </PasswordButtonContainer>
                      </FormContainer>
                    </View>
                  )
                ) : null
              }
            </ScrollView>
            {
              currentPage === 1 ? (
                <ButtonContainer>
                  <Button
                    title = {'UPDATE'}
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                    onPress = {() => this._update()}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </ButtonContainer>
              ) : null
            }
          </Container>
        </Drawer>
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