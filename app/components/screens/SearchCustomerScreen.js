import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';
import { Button } from 'react-native-elements';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const ButtonContainer = styled.View`
  alignItems: flex-end;
  justifyContent: flex-end;
  paddingTop: 15px;
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
      gender: ''
    }
  }

  _redirect = () => {
    Actions.CreateCustomer();
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  render() {
    const { menuOpen, gender } = this.state;
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
          <CustomHeader
            title = 'Customer Search'
            openMenu  = {this.openMenu.bind(this)}
            // showSearch = {true}
            showMenu = {true}
          />
          <ScrollView>
            <FormContainer>
              <Form>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Request By</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={gender}
                    onValueChange={(value) => this.setState({gender: value})}
                  >
                    <Picker.Item label="A" value="m" />
                    <Picker.Item label="B" value="c" />
                    <Picker.Item label="C" value="i" />
                  </Picker>
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Sales Amount</Label>
                  <Input style={styles.input}
                    onChangeText = {(phoneNo) => this.setState({phoneNo: phoneNo})}
                    keyboardType = 'number-pad'
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Key In Phone No</Label>
                  <Input style={styles.input}
                    onChangeText = {(phoneNo) => this.setState({kphoneNo: phoneNo})}
                    keyboardType = 'number-pad'
                  />
                </Item>
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Search Phone No</Label>
                  <Input style={styles.input}
                    onChangeText = {(phoneNo) => this.setState({sphoneNo: phoneNo})}
                    keyboardType = 'number-pad'
                  />
                </Item>
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
              </Form>
              <ButtonContainer>
                <Button
                  title = 'SEARCH'
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0, width: 130}}
                />
              </ButtonContainer>
            </FormContainer>
          </ScrollView>
        </Container>
      </Drawer>
    )
  }
}