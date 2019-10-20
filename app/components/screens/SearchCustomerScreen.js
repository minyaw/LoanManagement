import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, StyleSheet, Text, Alert, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomHeader from '../common/CustomHeader';
import { Form, Label, Input, Item, Picker, DatePicker, ListItem, CheckBox, Body, Content, Card, CardItem } from 'native-base';
import { Button, Icon } from 'react-native-elements';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';

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
const ItemCard = styled.View`
  marginHorizontal: 15px;
  marginVertical: 10px;
  paddingBottom: 10px;
  flexDirection: row;
  borderBottomWidth: 1px;
  borderBottomColor: #eee;
`
const DetailsCol = styled.TouchableOpacity`
  flex:2;
  justifyContent: flex-start;
`
const RemarksCol = styled.View`
  flex:1;
  justifyContent: center;
  alignItems: flex-end;
`
const Username = styled.Text`
  color: #3F5AA6;
  fontSize: 14px;
  fontFamily: 'Montserrat-Bold';
`
const DueDateDetail = styled.Text`
  color: #192A59;
  lineHeight: 20px;
  fontSize: 8px;
  fontFamily: 'Montserrat-SemiBold';
`
const Remark = styled.Text`
  color: #3F5AA6;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 14px;
  paddingVertical: 15px;
  fontFamily: 'Montserrat-Bold';
`
const Info = styled.Text`
  color: ${colors.primary};
  fontWeight: 600;
  paddingHorizontal: 15px;
`
const SelectCol = styled.View`
  flex:1;
  justifyContent: center;
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
      agentOptions: [],
      filter_agent: null,
      filter_ic_no: null,
      filter_keyin_phone: null,
      filter_name: null,
      filter_sales_amount: null,
      filter_search_phone: null,
      loadPage: '1',
      item: null,
      selectedList: [],
      loading: false
    }
  }

  componentDidMount = () => {
    this._getAgentList();
  }

  _getAgentList = () => {
    const body = {
      act: "getAdvancedSearchAgentList",
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200) {
        this.setState({
          agentOptions: res.data.response.records,
          filter_agent: res.data.response.records[0].agent_id
        })
      }
    })
  }

  _search = () => {
    const { filter_agent, filter_ic_no, filter_keyin_phone, filter_name, filter_sales_amount, filter_search_phone, loadPage } = this.state;

    if (filter_agent == null || filter_agent === '') {
      Alert.alert('Error', 'Please select Agent.');
      return;
    }
    
    if (filter_sales_amount === null || filter_sales_amount === '') {
      Alert.alert('Error', 'Please enter Sales Amount.');
      return;
    }

    if (filter_keyin_phone == null || filter_keyin_phone === '') {
      Alert.alert('Error', 'Please enter Key In Phone No.')
    }
    const body = {
      act: "getAdvancedSearch",
      filter_agent,
      filter_ic_no,
      filter_keyin_phone,
      filter_name,
      filter_sales_amount,
      filter_search_phone,
      page_no: loadPage,
      edit: false
    }
    this.setState({ loading: true })
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false})
      if (res.status === 200) {
        console.log('res', res);
        if (this.state.item) {
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({ item: this.state.item})
        } else {
          this.setState({
            item: res.data.response
          })
        }
      }
    })
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _loadmore = () => {
    this.setState({loadPage: this.state.loadPage++})
    this._search();
  }

  _select = (id) => {
    if (this.state[id]) {
      this.setState({[id]: false})
      for (let i = 0; i < this.state.selectedList.length; i++) {
        if (this.state.selectedList[i].id === id) {
          this.state.selectedList.splice(i, 1)
        }
      }
    } else {
      this.setState({[id]: true})
      this.state.selectedList.push({id})
    }

    console.log(this.state.selectedList);
  }

  _shareProfile = () => {
    const { selectedList, filter_agent } = this.state;
    const body = {
      act: 'shareCustomerAdvancedSearch',
      agent_id: filter_agent,
      records: selectedList
    }

    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false})
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg, [
          {
            text: 'OK',
            onPress: () => {
              this._search();
              this.setState({ edit: false })
            }
          }
        ])
      }
    })
  }

  _unshareProfile = (id) => {
    const { filter_agent } = this.state;
    const body = {
      act: 'unshareCustomerAdvancedSearch',
      agent_id: filter_agent,
      id
    }

    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false })
      if (res.status === 200) {
        Alert.alert('Info', res.data.errMsg, [
          {
            text: 'OK',
            onPress: () => {
              this._search();
              this.setState({ edit: false })
            }
          }
        ])
      }
    })
  }

  render() {
    const { menuOpen, agentOptions, filter_agent, filter_keyin_phone, filter_search_phone, filter_name, filter_ic_no, filter_sales_amount, item, edit, loading } = this.state;
    if (agentOptions) {
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
            <CustomHeader
              title = 'Customer Search'
              openMenu  = {this.openMenu.bind(this)}
              // showSearch = {true}
              showMenu = {true}
              showEdit = {true}
              edit = {() => this.setState({ edit: true})}
            />
            <ScrollView>
              <FormContainer>
                <Form>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Request By*</Label>
                    <Picker
                      mode="dropdown"
                      // iosIcon={<Icon name="ios-arrow-down-outline" />}
                      style={{ width: undefined }}
                      selectedValue={filter_agent}
                      onValueChange={(value) => this.setState({filter_agent: value})}
                    >
                      {
                        agentOptions.map((item, index) => {
                          return(
                            <Picker.Item label={item.agent_name} value={item.agent_id} />
                          )
                        })
                      }
                    </Picker>
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Sales Amount*</Label>
                    <Input style={styles.input}
                      onChangeText = {(phoneNo) => this.setState({filter_sales_amount: phoneNo})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Key In Phone No*</Label>
                    <Input style={styles.input}
                      onChangeText = {(phoneNo) => this.setState({filter_keyin_phone: phoneNo})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Search Phone No</Label>
                    <Input style={styles.input}
                      onChangeText = {(phoneNo) => this.setState({filter_search_phone: phoneNo})}
                      keyboardType = 'number-pad'
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>Full Name</Label>
                    <Input style={styles.input}
                      onChangeText = {(fullname) => this.setState({filter_name: fullname})}
                    />
                  </Item>
                  <Item fixedLabel style={styles.inputContainer}>
                    <Label style={styles.label}>NRIC/Passport</Label>
                    <Input style={styles.input}
                      onChangeText = {(nric) => this.setState({filter_ic_no: nric})}
                    />
                  </Item>
                </Form>
                <ButtonContainer>
                  <Button
                    title = 'SEARCH'
                    buttonStyle = {{backgroundColor: colors.primary, borderRadius: 0, width: 130}}
                    onPress = {() => this._search()}
                    titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                  />
                </ButtonContainer>
              </FormContainer>
              {
                item ? (
                  item.records.length > 0 ? (
                    <Info>Customer profile found in other group: {item.total_count_other}</Info>
                  ) : (
                    null
                  )
                ) : (
                  null
                )
              }
                {
                item ? (
                  item.records.map((content, index) => {
                    return(
                      <View>
                        <ItemCard key={index}>
                          {
                            edit ?
                            <SelectCol>
                              {
                                content.can_share ? (
                                  <CheckBox 
                                    checked={this.state[content.cust_id]}
                                    onPress={() => this._select(content.cust_id)}
                                  />
                                ) : (
                                  null
                                )
                              }
                            </SelectCol> : null
                          }
                          <DetailsCol onPress={() => content.can_view ? Actions.CustomerDetail({custId: content.cust_id}) : {} }>
                            <Username>{content.cust_name}</Username>
                            <DueDateDetail>Customer ID: {content.cust_no}</DueDateDetail>
                            <DueDateDetail>NRIC/Passport: {content.cust_icno}</DueDateDetail>
                            <DueDateDetail>Phone No: {content.cust_phoneno}</DueDateDetail>
                            <DueDateDetail>Total Loan Amt: {content.total_loan_amount}</DueDateDetail>
                            <DueDateDetail>Outstanding Amt: {content.total_outstanding}</DueDateDetail>
                            {
                              !content.can_share ? (
                                content.sharing_list.map((itm, index) => {
                                  return (
                                  <View style={{paddingVertical: 10, flexDirection:'row'}}>
                                    <View style={{flex:3, justifyContent: 'center'}}>
                                      <Text style={{fontWeight: 'bold'}}>Shared to: {itm.value}</Text>
                                    </View>
                                    <View style={{flex:1}}>
                                      <Button
                                        icon={
                                          <Icon
                                            name="trash"
                                            size={15}
                                            color="white"
                                            type='font-awesome'
                                          />
                                        }
                                        buttonStyle = {{backgroundColor: '#B71C1C'}}
                                        onPress = {() => this._unshareProfile(itm.id)}
                                      />
                                    </View>
                                  </View>
                                  )
                                })
                              ) : (
                                null
                              )
                            }
                          </DetailsCol>
                          <RemarksCol>
                            <Remark>{content.status}</Remark>
                          </RemarksCol>
                        </ItemCard>
                      </View>
                    )
                  })
                ) : (
                  <Content>
                    <Card>
                      <CardItem>
                        <Body style={{alignItems: 'center'}}>
                          <Text>
                            Empty
                          </Text>
                        </Body>
                      </CardItem>
                    </Card>
                  </Content>
                )
              }
              {
              item ? (
                item.records.length < item.total_count ? (
                  <TouchableOpacity
                    onPress={() => this._loadmore()}
                  >
                    <Loadmore>View More ({item.records.length}/{item.total_count}) ...</Loadmore>
                  </TouchableOpacity>
                ) : (
                  null
                )
              ) : null
            }
            </ScrollView>
            {
              edit ? (
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex:1}}>
                    <Button
                      title = 'CANCEL'
                      buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                      onPress = {() => this.setState({ edit: false })}
                    />
                  </View>
                  <View style={{flex:1}}>
                    <Button
                      title = 'SHARE'
                      buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                      // disabled = {selectedList.length > 0 ? false: true}
                      onPress = {() => this._shareProfile()}
                    />
                  </View>
                </View>
              ) : (
                null
              )
            }
          </Container>
        </Drawer>
      )
    } else {
      return null
    }
  }
}