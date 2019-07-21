import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { Form, Label, Input, Picker, DatePicker, CheckBox, Item, ListItem, Body } from 'native-base';
import { StyleSheet, Text, ScrollView } from 'react-native';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground};
  flex: 1;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
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

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {

    }
  }

  render () {
    const { pgView } = this.props;
    return (
      <Container>
        <ScrollView>
          <CustomHeader
            title = "Filter"
            showBack = {true}
            showDone = {true}
          />
          <FormContainer>
            <Form>
              <Item fixedLabel style={styles.inputContainer}>
                <Label style={styles.label}>Agent</Label>
                <Picker
                  mode="dropdown"
                  // iosIcon={<Icon name="ios-arrow-down-outline" />}
                  style={{ width: undefined }}
                  // selectedValue={gender}
                  onValueChange={(value) => this.setState({gender: value})}
                >
                  <Picker.Item label="All" value="a" />
                </Picker>
              </Item>
              {
                pgView === 'customer' ? 
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Broker</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    // selectedValue={gender}
                    onValueChange={(value) => this.setState({gender: value})}
                  >
                    <Picker.Item label="All" value="a" />
                  </Picker>
                </Item> : null
              }
              {
                pgView !== 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Customer Name</Label>
                  <Input style={styles.input}
                    // onChangeText = {(phoneNo) => this.setState({phoneNo: phoneNo})}
                  />
                </Item> : null
              }
              {
                pgView !== 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>NRIC/Passport</Label>
                  <Input style={styles.input}
                    // onChangeText = {(phoneNo) => this.setState({phoneNo: phoneNo})}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ? 
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>ID</Label>
                    <Input style={styles.input}
                      // onChangeText = {(phoneNo) => this.setState({phoneNo: phoneNo})}
                    />
                  </Item> : null
              }
              {
                pgView === 'Sales' || pgView === 'Transaction' || pgView === 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Trans Date (From)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' || pgView === 'Transaction' || pgView === 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Trans Date (To)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Settle Date (From)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Settle Date (To)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Due Listing' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Due Date (From)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Due Listing' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Due Date (To)</Label>
                  <DatePicker
                    defaultDate={new Date()}
                    // minimumDate={new Date(2018, 1, 1)}
                    // maximumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    placeHolderText="Select date"
                    textStyle={{ color: "#000" }}
                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                    // onDateChange={this.setDate}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' || pgView === 'Due Listing' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}>Status</Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Normal</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Sales' || pgView === 'Due Listing' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}></Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Arrears</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Sales' || pgView === 'Due Listing'?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}></Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Bad Debt</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Sales' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}></Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Settle</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Expenses' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}>Status</Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Pending</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Expenses' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}></Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Rejected</Text>
                    </Body>
                  </ListItem> : null
              }
              {
                pgView === 'Expenses' ?
                  <ListItem style={styles.listItem}>
                    <Body>
                      <Label style={[styles.label, {paddingLeft: 14}]}></Label>
                    </Body>
                    <CheckBox 
                      checked={true}
                      // onPress={() => this._copyAddr()}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Approved</Text>
                    </Body>
                  </ListItem> : null
              }
            </Form>
          </FormContainer>
        </ScrollView>
      </Container>
    )
  }
}