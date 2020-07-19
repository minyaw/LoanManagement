import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { Header, Avatar, Icon, Badge, Button, Text, Alert } from 'react-native-elements';
import { TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import { Label, Item, Picker } from 'native-base';
import DataService from '../common/DataService';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const InfoContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 20px;
  flexDirection: row;
`
const Col = styled.View`
  flex: 1
  paddingHorizontal: 10px;
`
const IconContainer = styled.View`
  flex: 1;
  justifyContent: center;
`
const DetailsContainer = styled.View`
  flex: 3;
`
const Detail = styled.Text`
  fontFamily: 'Montserrat-Bold';
  fontSize: 11px;
  color: #192A59;
`
const ActionContainer = styled.TouchableOpacity`
  backgroundColor: #ebeef7;
  marginHorizontal: 15px;
  paddingHorizontal: 10px;
  paddingVertical: 10px;
  borderRadius: 5px;
`
const ActionText = styled.Text`
  color: #192A59;
  fontFamily: 'Montserrat-Regular';
  fontSize: 10px;
`
const Link = styled.Text`
  color: #192a58;
  fontWeight: 600;
  textDecoration: underline;
`
const DueDateListTitleContainer = styled.View`
  paddingHorizontal: 15px;
  paddingTop: 20px;
  flexDirection: row;
  paddingBottom: 15px;
`
const TitleContainer = styled.View`
  flex: 1;
  alignItems: flex-start;
`
const ButtonContainer = styled.TouchableOpacity`
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-end;
`
const DueDateTitle = styled.Text`
  fontFamily: AvenirLTStd-Black;
  color: #192a58;
  fontSize: 14px;
`
const ViewAllButton = styled.Text`
  fontFamily: AvenirLTStd-Black;
  color: #192a58;
  fontSize: 10px;
`
const Card = styled.TouchableOpacity`
  marginHorizontal: 15px;
  marginBottom: 10px;
  paddingBottom: 10px;
  flexDirection: row;
  borderBottomWidth: 1px;
  borderBottomColor: #eee;
`
const DetailsCol = styled.View`
  flex:1;
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
const DueAmt = styled.Text`
  color: #192A59;
  lineHeight: 20px;
  fontSize: 10px;
  fontFamily: 'Montserrat-Bold';
`
const Remark = styled.Text`
  color: #3F5AA6;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const RemarkAlert = styled.Text`
  color: #F44336;
  fontSize: 8px;
  fontFamily: 'Montserrat-Regular';
`
const BlankContainer = styled.View`
  paddingHorizontal: 20px;
`
const EmptyCard = styled.View`
  borderColor: #eee;
  borderWidth: 0.5px;
`
const EmptyText = styled.Text`
  textAlign: center;
  fontSize: 14px;
  paddingVertical: 20px;
`
const GroupContainer = styled.View`

`
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    flexDirection: 'row',
    borderColor: 'transparent',
  },
  label: {
    color: '#828899',
    fontFamily: 'Montserrat-Bold',
    fontSize: 12
  },
  inputContainer: {
    paddingVertical: 10,
    // borderBottomWidth: 0,
    paddingLeft: 15
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
      activeTab: 'home',
      menuOpen:false,
      userAvatar: null,
      totalUnread:0,
      token: null,
      refreshing: false,
      loading: false,
      groupOptions: [],
      role: null,
      loading: false,
      outstandingAccess: false,
      selectGroupAccess: false,
      approvalAccess: false
    }
  }

  componentDidMount = () => {
    this.setState({
      groupOptions: DataService.getGroup(),
      role: ApiService.getRole(),
      groupId: DataService.getSelectedGroup()
    })
    this._getDashBoardData();
    console.log('id', DataService.getSelectedGroup());
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'customer_outstanding_listing') {
        this.setState({ outstandingAccess: item.can_access })
      }
      if (item.screen_key === 'can_select_group') {
        this.setState({ selectGroupAccess: item.can_access })
      }
      if (item.screen_key === 'can_do_approval') {
        this.setState({ approvalAccess: item.can_access })
      }
    }
  }

  componentWillReceiveProps = (data) => {
    console.log(data);
    this.setState({
      groupOptions: DataService.getGroup(),
      role: ApiService.getRole(),
      groupId: DataService.getSelectedGroup()
    })
    this._getDashBoardData();
  }

  _getDashBoardData = () => {
    const body = {
      act: 'getDashboardData',
      sel_group_id: DataService.getSelectedGroup()
    }
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({item: res.data.response})
      } else {
        if (res.data.errCode === 905) {
          setTimeout(() => {
            Alert.alert('Error', res.data.errMsg, [
              {
                text: 'OK',
                onPress: () => Actions.Login()
              }
            ])
          }, 501);
        } else {
          Alert.alert('Error', res.data.errMsg);
        }
      }
      console.log(res);
    })
  }
  _changeTab = (name) => {
    this.setState({activeTab: name})
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _selectGroup = (groupId) => {
    console.log(groupId);
    DataService.setSelectedGroup(groupId);
    this.setState({ groupId });
    this._getDashBoardData();
  }

  render() {
    const {menuOpen, item, groupOptions, role, loading} = this.state;
    if (item) {
      return (
        <Drawer
          ref={(ref) => this._drawer = ref}
          type="overlay"
          content={<MenuScene/>}
          styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, height: 500}}
          open={menuOpen}
          openDrawerOffset={0.3}
          tapToClose={true}
          onClose={() => this.setState({menuOpen: false})}
        >
          <Container>
          <Loader loading={loading}/>
            <ScrollView>
              <CustomHeader
                title = 'HOME'
                openMenu  = {this.openMenu.bind(this)}
                showMenu = {true}
              />
              {
                this.state.selectGroupAccess ? (
                  <GroupContainer>
                    <Item fixedLabel style={styles.inputContainer}>
                      <Label style={styles.label}>Current Group</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name = 'chevron-down' type = 'font-awesome' size={16} />}
                        style={{ width: undefined }}
                        selectedValue={this.state.groupId}
                        // selectedValue = {"0"}
                        onValueChange={(value) => this._selectGroup(value)}
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
                  </GroupContainer>
                ) : null
              }
              <InfoContainer>
                <Col>
                  <TouchableOpacity
                    onPress= {() => Actions.SalesList({ today: true })}
                  >
                    <LinearGradient colors={['#f5f7ff', '#d9e1ff', '#becdff']} style={styles.linearGradient}>
                      <IconContainer>
                        <Icon
                          name = 'shopping-cart'
                          type = 'font-awesome'
                        />
                      </IconContainer>
                      <DetailsContainer>
                        <Detail>Today's Sales</Detail>
                        <Detail>{item.summary.today_sales}</Detail>
                      </DetailsContainer>
                    </LinearGradient>
                  </TouchableOpacity>
                  {
                    this.state.outstandingAccess ? (
                      <TouchableOpacity
                        onPress = {() => Actions.OutstandingList()}
                      >
                        <LinearGradient colors={['#ddf3e2', '#c2f3cc', '#9eecac']} style={styles.linearGradient}>
                          <IconContainer>
                            <Icon
                              name = 'alarm'
                              type = 'material-community'
                              // name = 'shopping-cart'
                              // type = 'font-awesome'
                            />
                          </IconContainer>
                          <DetailsContainer>
                            <Detail>Outstanding</Detail>
                            <Detail>{item.summary.total_outstanding}</Detail>
                          </DetailsContainer>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : null
                  }
                  <TouchableOpacity
                    onPress = {() => Actions.SalesList({pgView: 'dashboard'})}
                  >
                    <LinearGradient colors={['#bfeafe', '#7ed1f8', '#57c0f1']} style={styles.linearGradient}>
                      <IconContainer>
                        <Icon
                          name = 'currency-usd'
                          type = 'material-community'
                        />
                      </IconContainer>
                      <DetailsContainer>
                        <Detail>Bad Debt</Detail>
                        <Detail>{item.summary.total_bad_debt}</Detail>
                      </DetailsContainer>
                    </LinearGradient>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    onPress= {() => Actions.Transaction()}
                  >
                    <LinearGradient colors={['#fff2f6', '#ffc1d3', '#ff9cba']} style={styles.linearGradient}>
                      <IconContainer>
                        <Icon
                          name = 'cash-multiple'
                          type = 'material-community'
                        />
                      </IconContainer>
                      <DetailsContainer>
                        <Detail>Today's Trans</Detail>
                        <Detail>{item.summary.today_transaction}</Detail>
                      </DetailsContainer>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress= {() => Actions.DueList()}
                  >
                    <LinearGradient colors={['#f7e8ce', '#fedb99', '#ffca65']} style={styles.linearGradient}>
                      <IconContainer>
                        <Icon
                          name = 'exclamation-circle'
                          type = 'font-awesome'
                        />
                      </IconContainer>
                      <DetailsContainer>
                        <Detail>Late</Detail>
                        <Detail>{item.summary.total_late}</Detail>
                      </DetailsContainer>
                    </LinearGradient>
                  </TouchableOpacity>
                </Col>
              </InfoContainer>
              {
                this.state.approvalAccess && item.total_approval_count ? (
                  <ActionContainer
                    onPress={()=> Actions.ApprovalList()}
                  >
                    <ActionText>
                      You have {item.total_approval_count} case(s) of sales waiting for your approval or rejection. Please <Link>click here</Link> to process
                    </ActionText>
                  </ActionContainer>
                ) : null
              }
              <DueDateListTitleContainer>
                <TitleContainer>
                  <DueDateTitle>Due Date List</DueDateTitle>
                </TitleContainer>
                <ButtonContainer
                  onPress = {() => Actions.DueList()}
                >
                  <ViewAllButton>View All</ViewAllButton>
                  <Icon
                    name = 'chevron-right'
                    type = 'font-awesome'
                    size = {12}
                    containerStyle = {{justifyContent:'center', paddingLeft: 2, paddingTop: 2}}
                  />
                </ButtonContainer>
              </DueDateListTitleContainer>
              {
                item.due_date_list.length > 0 ? (
                  item.due_date_list.map((content) => {
                    return(
                    <Card
                      onPress = {() => Actions.SalesDetail({cust_id: content.cust_id, sales_id: content.sales_id, isFromHome: true})}
                    >
                      <DetailsCol>
                        <Username>{content.customer_name}</Username>
                        <DueDateDetail>Due Date: {content.due_date}</DueDateDetail>
                        <DueDateDetail>Sales ID: {content.repayment_no}</DueDateDetail>
                        <DueAmt>Due Amt: {content.repayment_amount}</DueAmt>
                      </DetailsCol>
                      <RemarksCol>
                      {
                        content.status === 'Bad Debt' || content.status === 'Arrears' ? (
                          <RemarkAlert>{content.status}</RemarkAlert>
                        ) : (
                          <Remark>{content.status}</Remark>
                        )
                      }
                      </RemarksCol>
                    </Card>
                    )
                  })
                ) : (
                    <BlankContainer>
                      <EmptyCard>
                        <EmptyText>Empty</EmptyText>
                      </EmptyCard>
                    </BlankContainer>
                )
              }
            </ScrollView>
          </Container>
        </Drawer>
      );
    } else {
      return (
        <Container>
          {/* <Loader loading={true}/> */}
        </Container>
      )
    }
  }
}
