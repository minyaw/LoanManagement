import React, {Component} from 'react';
import styled from 'styled-components';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { Form, Label, Input, Picker, DatePicker, CheckBox, Item, ListItem, Body } from 'native-base';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import DataService from '../common/DataService';
import { Button } from 'react-native-elements';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground};
  flex: 1;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const ButtonContainer = styled.View`

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
  constructor (props) {
    super(props);
    this.state = {
      filter_agent: DataService.getAgent(),
      filter_cust_name: DataService.getCustName(),
      filter_nric_no: DataService.getNric(),
      filter_sales_no: DataService.getSalesId(),
      filter_broker: DataService.getBroker(),
      filter_phone_no: DataService.getPhone(),
      s_trans_date: null,
      e_trans_date: null,
      s_set_date: null,
      e_set_date: null,
      s_due_date: null,
      e_due_date: null,
      normal: false,
      arrears: false,
      bad_debt: false,
      settle: false,
      pending: false,
      approved: false,
      rejected: false,
      selectedStatus: [],
      agentList:{},
      groupOptions: [],
      filter_agent_group: DataService.getAgentGroup()
    },
    this.setTransStartD = this.setTransStartD.bind(this)
    this.setTransEndD = this.setTransEndD.bind(this)
    this.setSetStartD = this.setSetStartD.bind(this)
    this.setSetEndD = this.setSetEndD.bind(this)
    this.setDueStartD = this.setDueStartD.bind(this)
    this.setDueEndD = this.setDueEndD.bind(this)
  }

  componentDidMount = () => {
    const { pgView } = this.props;
    if (pgView === 'Expenses') {
      this.setState({groupOptions: DataService.getGroup()})
    }
  }

  setTransStartD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ s_trans_date: [year, month, day].join('-') });
  }

  setTransEndD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ e_trans_date: [year, month, day].join('-') });
  }

  setSetStartD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ s_set_date: [year, month, day].join('-') });
  }

  setSetEndD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ e_set_date: [year, month, day].join('-') });
  }

  setDueStartD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ s_due_date: [year, month, day].join('-') });
  }

  setDueEndD(newDate) {
    let month = '' + (newDate.getMonth() + 1)
    let day = '' + newDate.getDate()
    let year = newDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    this.setState({ e_due_date: [year, month, day].join('-') });
  }

  _check = (status) => {
    const { selectedStatus } = this.state;
    if (this.state[status]) {
      this.setState({[status]: false})
      for (let i = 0; i < selectedStatus.length; i++) {
        if (selectedStatus[i] === status) {
          selectedStatus.splice(i, 1)
        }
      }
    } else {
      this.setState({[status]: true})
      selectedStatus.push(status)
    }
    
    for (let i = 0; i < selectedStatus.length; i++) {
      if (selectedStatus[i] === 'normal') {
        selectedStatus[i] = 'Normal'
      } else if (selectedStatus[i] === 'arrears') {
        selectedStatus[i] = 'Arrears'
      } else if (selectedStatus[i] === 'bad_debt') {
        selectedStatus[i] = 'Bad Debt'
      } else if (selectedStatus[i] === 'settle') {
        selectedStatus[i] = 'Settle'
      } else if (selectedStatus[i] === 'pending') {
        selectedStatus[i] = 'Pending'
      } else if (selectedStatus[i] === 'approved') {
        selectedStatus[i] = 'Approved'
      } else if (selectedStatus[i] === 'rejected') {
        selectedStatus[i] = 'Rejected'
      }
    }
  }

  _clear = () => {
    const { filter_agent, normal, arrears, bad_debt, filter_sales_no, filter_nric_no, filter_broker, filter_cust_name, filter_phone_no, settle, pending, approved, rejected, groupOptions, filter_agent_group } = this.state;
    this.setState({
      filter_agent: '',
      filter_sales_no: '',
      filter_nric_no: '',
      filter_cust_name: '',
      filter_phone_no: '',
    })
    DataService.setAgent('');
    DataService.setCustName('');
    DataService.setSDue('');
    DataService.setEDue('');
    DataService.setSTrans('');
    DataService.setETrans('');
    DataService.setSSet('');
    DataService.setESet('');
    DataService.setStatus('');
    DataService.setNric('');
    DataService.setSalesId('');
    DataService.setBroker('');
    DataService.setPhone('');
    DataService.setAgentGroup('');
  }

  render () {
    const { pgView, filter, _in } = this.props;
    const { filter_agent, normal, arrears, bad_debt, filter_sales_no, filter_nric_no, filter_broker, filter_cust_name, filter_phone_no, settle, pending, approved, rejected, groupOptions, filter_agent_group } = this.state;
    return (
      <Container>
        <ScrollView>
          <CustomHeader
            title = "Filter"
            showBack = {true}
            showDone = {true}
            filter = {filter()}
            agent = {DataService.setAgent(this.state.filter_agent)}
            custName = {DataService.setCustName(this.state.filter_cust_name)}
            sDue = {DataService.setSDue(this.state.s_due_date)}
            eDue = {DataService.setEDue(this.state.e_due_date)}
            sTrans = {DataService.setSTrans(this.state.s_trans_date)}
            eTrans = {DataService.setETrans(this.state.e_trans_date)}
            sSet = {DataService.setSSet(this.state.s_set_date)}
            eSet = {DataService.setESet(this.state.e_set_date)}
            status = {DataService.setStatus(this.state.selectedStatus)}
            nric = {DataService.setNric(this.state.filter_nric_no)}
            sales_id = {DataService.setSalesId(this.state.filter_sales_no)}
            broker = {DataService.setBroker(this.state.filter_broker)}
            phoneNo = {DataService.setPhone(this.state.filter_phone_no)}
            agentGroup = {DataService.setAgentGroup(this.state.filter_agent_group)}
            _in = {_in}
          />
          <FormContainer>
            <Form>
              {
                pgView !== 'Expenses' ? (
                  Object.keys(_in.state.agentList).length > 0 ? (
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Agent</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={filter_agent}
                        onValueChange={(value) => this.setState({filter_agent: value})}
                      >
                      <Picker.Item label="All" value="" />
                      {
                        Object.keys(_in.state.agentList).map((key, index) => {
                          return (
                            <Picker.Item label={_in.state.agentList[key]} value={key} />
                          )
                        })
                      }
                      </Picker>
                    </Item>
                  ) : (
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Agent</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={filter_agent}
                        onValueChange={(value) => this.setState({filter_agent: value})}
                      >
                      <Picker.Item label="All" value="" />
                      </Picker>
                    </Item>
                  )
                ) : null
              }
              {
                pgView === 'Expenses' ? (
                  <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Current Group</Label>
                      <Picker
                        mode="dropdown"
                        // iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        selectedValue={filter_agent_group}
                        onValueChange={(value) => this.setState({filter_agent_group: value})}
                      >
                        {
                          groupOptions.map((item,index) => {
                            return (
                              <Picker.Item label={item.value} value={item.id}/>
                            )
                          })
                        }
                      </Picker>
                    </Item>
                ) : null
              }
              {
                pgView === 'Customer' ? 
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Broker</Label>
                  <Picker
                    mode="dropdown"
                    // iosIcon={<Icon name="ios-arrow-down-outline" />}
                    style={{ width: undefined }}
                    selectedValue={filter_broker}
                    onValueChange={(value) => this.setState({filter_broker: value})}
                  >
                    <Picker.Item label="All" value="a" />
                    {
                      Object.keys(_in.state.brokerList).map((key, index) => {
                        return (
                          <Picker.Item label={_in.state.brokerList[key]} value={key} />
                        )
                      })
                    }
                  </Picker>
                </Item> : null
              }
              {
                pgView === 'Customer' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Phone No</Label>
                  <Input style={styles.input}
                    value = {filter_phone_no}
                    onChangeText = {(phoneNo) => this.setState({filter_phone_no: phoneNo})}
                    autoCorrect = {false}
                  />
                </Item> : null
              }
              {
                pgView !== 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Customer Name</Label>
                  <Input style={styles.input}
                    value = {filter_cust_name}
                    onChangeText = {(phoneNo) => this.setState({filter_cust_name: phoneNo})}
                    autoCorrect = {false}
                  />
                </Item> : null
              }
              {
                pgView !== 'Expenses' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>NRIC/Passport</Label>
                  <Input style={styles.input}
                    value = {filter_nric_no}
                    onChangeText = {(phoneNo) => this.setState({filter_nric_no: phoneNo})}
                    autoCorrect = {false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ? 
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>ID</Label>
                    <Input style={styles.input}
                      value = {filter_sales_no}
                      onChangeText = {(phoneNo) => this.setState({filter_sales_no: phoneNo})}
                      autoCorrect = {false}
                    />
                  </Item> : null
              }
              {
                pgView === 'Transaction' || pgView === 'Expenses' ?
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
                    onDateChange={this.setTransStartD}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Transaction' || pgView === 'Expenses' ?
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
                    onDateChange={this.setTransEndD}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Sales Date (From)</Label>
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
                    onDateChange={this.setTransStartD}
                    disabled={false}
                  />
                </Item> : null
              }
              {
                pgView === 'Sales' ?
                <Item fixedLabel style={styles.inputContainer}>
                  <Label style={styles.label}>Sales Date (To)</Label>
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
                    onDateChange={this.setTransEndD}
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
                    onDateChange={this.setSetStartD}
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
                    onDateChange={this.setSetEndD}
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
                    onDateChange={this.setDueStartD}
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
                    onDateChange={this.setDueEndD}
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
                      checked={normal}
                      onPress={() => this._check('normal')}
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
                      checked={arrears}
                      onPress={() => this._check('arrears')}
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
                      checked={bad_debt}
                      onPress={() => this._check('bad_debt')}
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
                      checked={settle}
                      onPress={() => this._check('settle')}
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
                      checked={pending}
                      onPress={() => this._check('pending')}
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
                      checked={rejected}
                      onPress={() => this._check('rejected')}
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
                      checked={approved}
                      onPress={() => this._check('approved')}
                    />
                    <Body>
                      <Text style={[styles.label, {paddingLeft: 10}]}>Approved</Text>
                    </Body>
                  </ListItem> : null
              }
            </Form>
          </FormContainer>
        </ScrollView>
        <ButtonContainer>
          <Button
            title = {'CLEAR'}
            buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
            onPress = {() => this._clear()}
            titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
          />
        </ButtonContainer>
      </Container>
    )
  }
}