import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body } from 'native-base';
import CancelReasonModal from "../common/CancelReasonModal";

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const ButtonContainer = styled.View`
`
const AddButton = styled.TouchableOpacity`
  width: 80;
  height: 80;
  borderRadius: 40;
  backgroundColor: #192a58;
  justifyContent: center;
  alignItems: center;
`
const HeaderList = [
  'Action',
  'Agent',
  'Trans Date',
  'Trans Type',
  'Item',
  'Trans Amt',
  'Remark'
]

const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 14px;
  paddingVertical: 15px;
  fontFamily: 'Montserrat-Bold';
`

const styles = StyleSheet.create({
  header: { height: 50 },
  text: { margin: 5, textAlign: 'left', fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#828899' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'left', color: '#fff', padding: 5 },
  cellText: { margin: 5, textAlign: 'left', fontFamily: 'Montserrat-Medium', fontSize: 12, color: `${colors.primary}`}
});

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      contentList : [],
      widthArr: [80, 130, 130, 130, 130, 130, 130],
      loadPage: 1,
      loading: false,
      agentList:{},
      createIncomeAccess: false,
      sortAsc: false,
      showCancelReason: false,
      deleteId: null
    }
  }

  componentDidMount = () => {
    this._getOtherIncomeList();
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'trans_other_income_add') {
        this.setState({ createIncomeAccess: item.can_access })
      }
    }
  }

  componentWillReceiveProps = () => {
    this.setState({
      contentList:[],
      loadPage:1
    })
    this._getOtherIncomeList();
  }

  _getOtherIncomeList = (val) => {
    const { loadPage } = this.state;
    if (val) {
      body = {
        act: 'getOtherIncomeList',
        page_no: loadPage,
        sort_by: val,
        sort_order: this.state.sortAsc ? 'asc' : 'desc'
      }
    } else {
      body = {
        act: 'getOtherIncomeList',
        page_no: loadPage
      }
    }
    this.setState({ loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        if (this.state.item) {
          for (const content of res.data.response.records) {
            content.trans_date = DataService.changeDateFormat(content.trans_date);
            this.state.contentList.push([
              '',
              content.agent,
              content.trans_date,
              content.trans_type,
              content.item,
              content.trans_amount,
              content.remark,
              content.id
            ])
          }
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.trans_date = DataService.changeDateFormat(content.trans_date);
              this.state.contentList.push([
                '',
                content.agent,
                content.trans_date,
                content.trans_type,
                content.item,
                content.trans_amount,
                content.remark,
                content.id
              ])
            }
            this.setState({contentList: this.state.contentList})
          })
        }
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
    })
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _payNow = (index) => {
    Alert.alert(`this is row ${index+1}`);
  }

  _redirect = () => {
    Actions.CreateExpenses();
  }

  _loadmore = () => {
    this.state.loadPage++;
    this._getExpensesList();
  }

  _filter = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getExpensesList',
      page_no: loadPage,
      sel_group_id: DataService.getAgentGroup(),
      filter_date_from: DataService.getSTrans(),
      filter_date_to: DataService.getETrans(),
      filter_status: DataService.getStatus()
    }
    this.setState({ loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        if (loadPage !== 1) {
          for (const content of res.data.response.records) {
            content.trans_date = DataService.changeDateFormat(content.trans_date);
            this.state.contentList.push([
              content.submit_date,
              content.expenses_type,
              `${content.currency}${content.trans_amount}`
            ])
          }
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.trans_date = DataService.changeDateFormat(content.trans_date);
              this.state.contentList.push([
                content.submit_date,
                content.expenses_type,
                `${content.currency}${content.trans_amount}`
              ])
            }
            this.setState({contentList: this.state.contentList})
          })
        }
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
    })
  }

  _sort = (val) => {
    let sortBy;
    console.log(val);
    if (val === 'Agent') {
      sortBy = 'agent';
    } else if (val === 'Trans Date') {
      sortBy = 'trans_date'
    } else if (val === 'Trans Type') {
      sortBy = 'trans_type';
    } else if (val === 'Item') {
      sortBy = 'item';
    } else if (val === 'Trans Amt') {
      sortBy = 'trans_amount';
    } else if (val === 'Remark') {
      sortBy = 'remark'
    }
    this.state.sortAsc = !this.state.sortAsc
    this.setState({ contentList: [], salesIdList: [], custIdList: [], isSort: true, loadPage: 1, val: sortBy, list: [] }, () => {
      if (!this.state.filter) {
        this.setState({ item:null });
        this._getOtherIncomeList(sortBy);
      } else {
        this._filter(sortBy);
      }
    })
  }

  _deleteIncome = (reason) => {
    const { deleteId } = this.state;
    const body = {
      act: 'deleteOtherIncome',
      id: deleteId,
      reason
    }
    this.setState({ loading: true })
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({ loading: false })
      console.log(res);
      if (res.status === 200 && res.data.errCode === 200) {
        Alert.alert('', res.data.errMsg)
        this.setState({
          contentList:[],
          loadPage:1
        })
        this._getOtherIncomeList();
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
    });
  }

  render () {
    const { menuOpen, widthArr, loading, item, contentList, filter } = this.state;

    const edit = (index) => (
      <View style={[{alignItems: 'center', flexDirection: 'row'}]}>
        {
          <TouchableOpacity
            onPress = {() => this.setState({ showCancelReason: true, deleteId: this.state.contentList[index][7] })}
            // onPress = {() => this._deleteIncome(index)}
            style={{flex:1, alignItems:'flex-start', paddingLeft: 15}}
          >
            <Icon
              name = 'md-trash'
              type = 'ionicon'
              color = '#B71C1C'
            />
          </TouchableOpacity>
        }
        <CancelReasonModal
          isVisible = {this.state.showCancelReason}
          closeModal = {() => this.setState({ showCancelReason: false })}
          deleteSales = {(reason) => this._deleteIncome(reason)}
          _in = {this}
        />
      </View>
    );
      return(
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
              <CustomHeader
                title = 'Other Income'
                openMenu  = {this.openMenu.bind(this)}
                // showSearch = {true}
                showMenu = {true}
                filter = {()=> this._filter.bind(this)}
                _in = {this}
                />
              {
                contentList.length > 0 || filter ? (
                  <ScrollView horizontal={true}>
                    <View>
                      <Table borderStyle={{borderColor: 'transparent'}}>
                        <Row rowPress={(col)=> this._sort(col)} data={HeaderList} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                      </Table>
                      <ScrollView>
                          {
                            this.state.contentList.map((rowData, index) => {
                              return(
                                <TouchableOpacity>
                                  <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                    {
                                      rowData.map((cellData, cellIndex) => {
                                        return(
                                          <Cell
                                            key={cellIndex}
                                            data={cellIndex === 0 ? edit(index) : cellData} textStyle={styles.cellText}
                                            style={[{width: cellIndex === 0 ? 80 : cellIndex < 7 ? 130 : 0}, index%2 && {backgroundColor: '#FFFFFF'}]}
                                          />
                                        )
                                      })
                                    }
                                  </TableWrapper>
                                </TouchableOpacity>
                              )
                            })
                          }
                          {
                            item.records.length < item.total_count ? (
                              <TouchableOpacity
                                onPress={() => this._loadmore()}
                              >
                                <Loadmore>View More ({item.records.length}/{item.total_count}) ...</Loadmore>
                              </TouchableOpacity>
                            ) : (
                              null
                            )
                          }
                      </ScrollView>
                    </View>
                  </ScrollView>
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
                this.state.createIncomeAccess ? (
                  <ButtonContainer>
                    <Button
                      title = 'CREATE OTHER INCOME'
                      buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                      onPress = {() => Actions.CreateIncome()}
                      titleStyle = {{fontFamily: 'AvenirLTStd-Black', fontSize: 14 }}
                    />
                  </ButtonContainer>
                ) : null
              }
          </Container>
        </Drawer>
      )
  }
}