import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body } from 'native-base';

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
      currentPage: 1,
      gender: 'm',
      race: 'm',
      nationality: 'm',
      country: '',
      state: '',
      copyAddr: false
    }
  }

  _copyAddr = () => {
    const { copyAddr } = this.state;
    this.setState({copyAddr: !copyAddr})
  }

  render() {
    const { currentPage, gender, race, nationality, country, state, copyAddr } = this.state;
    return(
      <Container>
        <ScrollView>
          <CustomHeader
            title = 'Create Customer'
            showBack = {currentPage === 1 ? true : false}
            showMenu = {false}
          />
          {
            currentPage === 1 ? 
            <View>
              <Divider>
                <DividerText>Customer Details</DividerText>
                <Pagination>
                  <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                  <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                </Pagination>
              </Divider>
              <Section>
                <SectionName>Personal Details</SectionName>
                <Form>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Salutation</Label>
                    <Input style={styles.input}
                      onChangeText = {(salutation) => this.setState({salutation: salutation})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Customer Name</Label>
                    <Input style={styles.input}
                      onChangeText = {(cusName) => this.setState({cusName: cusName})}
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
                    <Label style={styles.label}>Phone No.2</Label>
                    <Input style={styles.input}
                      onChangeText = {(phoneNo2) => this.setState({phoneNo2: phoneNo2})}
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
                      selectedValue={gender}
                      onValueChange={(value) => this.setState({gender: value})}
                    >
                      <Picker.Item label="Male" value="m" />
                      <Picker.Item label="Female" value="f" />
                      <Picker.Item label="Other" value="o" />
                    </Picker>
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
                      selectedValue={state}
                      onValueChange={(bankName) => this.setState({bankName: bankName})}
                    >
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Account Holder</Label>
                    <Input style={styles.input}
                        onChangeText = {(accHolder) => this.setState({accHolder: accHolder})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Account No.</Label>
                    <Input style={styles.input}
                        onChangeText = {(accNo) => this.setState({accNo: accNo})}
                      />
                  </Item>
                </Form>
              </Section>
              <Section>
                <SectionName>Company Info</SectionName>
                <Form>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Company Name</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={state}
                      onValueChange={(companyName) => this.setState({companyName: companyName})}
                    >
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Job Title</Label>
                    <Input style={styles.input}
                        onChangeText = {(jobTitle) => this.setState({jobTitle: jobTitle})}
                      />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Company Phone</Label>
                    <Input style={styles.input}
                        onChangeText = {(companyPhone) => this.setState({companyPhone: companyPhone})}
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
            :
            <View>
              <Divider>
                <DividerText>Guarantor Details</DividerText>
                <Pagination>
                  <PageNumber style={{color: currentPage === 1 ? '#303f6a' : '#999', fontWeight: currentPage === 1 ? '600':'100', paddingRight: 15}}>1</PageNumber>
                  <PageNumber style={{color: currentPage === 2 ? '#303f6a' : '#999', fontWeight: currentPage === 2 ? '600':'100', paddingRight: 15}}>2</PageNumber>
                </Pagination>
              </Divider>
              <Section>
                <SectionName>Personal Details</SectionName>
                <Form>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Name</Label>
                    <Input style={styles.input}
                      onChangeText = {(gName) => this.setState({gName: gName})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>NRIC/Passport</Label>
                    <Input style={styles.input}
                      onChangeText = {(gNric) => this.setState({gNric: gNric})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Phone No</Label>
                    <Input style={styles.input}
                      onChangeText = {(gName) => this.setState({gName: gName})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Relationship</Label>
                    <Input style={styles.input}
                      onChangeText = {(relationship) => this.setState({relationship: relationship})}
                    />
                  </Item>
                </Form>
              </Section>
              <Section>
                <SectionName>Guarantor's Address</SectionName>
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
            </View>
          }
          
        </ScrollView>
        {
          currentPage === 1 ? 
            <ButtonContainer>
              <Button
                title = 'NEXT'
                buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                onPress = {() => this.setState({currentPage: 2})}
              />
            </ButtonContainer> 
            :
            <ButtonsContainer>
              <View style={{flex:1}}>
                <Button
                  title = 'Back'
                  buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                  onPress = {() => this.setState({currentPage: 1})}
                />
              </View>
              <View style={{flex:1}}>
                <Button
                  title = 'SUBMIT'
                  buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                  onPress = {() => this.setState({currentPage: 2})}
                />
              </View>
            </ButtonsContainer> 
        }
      </Container>
    )
  }
}