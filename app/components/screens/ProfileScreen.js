import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Button } from 'react-native-elements';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';

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
  fontWeight: 600;
  fontSize: 16px;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const ButtonContainer = styled.View`

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
      menuOpen: false,
      username: '',
      gender:'',
      chosenDate: new Date(),
      race: '',
      nationality: '',
      country: '',
      state: '',
      copyAddr: false
    }
    this.setDate = this.setDate.bind(this)
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  _copyAddr = () => {
    const { copyAddr } = this.state;
    this.setState({copyAddr: !copyAddr})
  }

  render() {
    const {menuOpen, gender, race, nationality, country, state, copyAddr} = this.state;
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
          <ScrollView>
            <Header
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
            />
            <Divider>
              <DividerText>Personal Details</DividerText>
            </Divider>
            <FormContainer>
              <Form>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Full Name</Label>
                  <Input style={styles.input}
                    onChangeText = {(fullname) => this.setState({fullname: fullname})}
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>NRIC/Passport</Label>
                  <Input style={styles.input}
                    onChangeText = {(nric) => this.setState({nric: nric})}
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Phone No</Label>
                  <Input style={styles.input}
                    onChangeText = {(phoneNo) => this.setState({phoneNo: phoneNo})}
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
                    style={{ width: undefined }}
                    selectedValue={gender}
                    onValueChange={(value) => this.setState({gender: value})}
                  >
                    <Picker.Item label="Male" value="m" />
                    <Picker.Item label="Female" value="f" />
                    <Picker.Item label="Other" value="o" />
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
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={race}
                    onValueChange={(value) => this.setState({race: value})}
                  >
                    <Picker.Item label="Malay" value="m" />
                    <Picker.Item label="Chinese" value="c" />
                    <Picker.Item label="Indian" value="i" />
                  </Picker>
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Nationality</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={nationality}
                    onValueChange={(value) => this.setState({nationality: value})}
                  >
                    <Picker.Item label="Malaysian" value="m" />
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
                      onChangeText = {(addr1) => this.setState({addr1: addr1})}
                    />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Address 2</Label>
                  <Input style={styles.input}
                      onChangeText = {(addr2) => this.setState({addr2: addr2})}
                    />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Country</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={country}
                    onValueChange={(value) => this.setState({country: value})}
                  >
                  </Picker>
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>State</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={state}
                    onValueChange={(value) => this.setState({state: value})}
                  >
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
                      onChangeText = {(addr1) => this.setState({addr1: addr1})}
                    />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Address 2</Label>
                  <Input style={styles.input}
                      onChangeText = {(addr2) => this.setState({addr2: addr2})}
                    />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Country</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={country}
                    onValueChange={(value) => this.setState({country: value})}
                  >
                  </Picker>
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>State</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={state}
                    onValueChange={(value) => this.setState({state: value})}
                  >
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
                      onChangeText = {(city) => this.setState({city: city})}
                    />
                </Item>
              </Form>
            </FormContainer>
          </ScrollView>
          <ButtonContainer>
            <Button
              title = 'UPDATE'
              buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
            />
          </ButtonContainer>
        </Container>
      </Drawer>
    )
  }
}