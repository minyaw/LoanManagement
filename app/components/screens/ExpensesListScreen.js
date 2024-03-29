import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text, ImageBackground } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Icon, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body, CheckBox } from 'native-base';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const ButtonContainer = styled.View`
  paddingRight: 15;
  paddingBottom: 15;
  position: absolute;
  bottom:0;
  right:0;
`
const EditButtonContainer = styled.View`
  paddingLeft: 15;
  paddingBottom: 15;
  position: absolute;
  bottom:0;
  left:0;
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
  'Expenses Type',
  'Trans Amt',
  'Remark',
  'Status',
  'Receipt'
]

const Loadmore = styled.Text`
  textAlign: left;
  color: ${colors.primary};
  fontSize: 14px;
  paddingVertical: 15px;
  paddingLeft: 20px;
  fontFamily: 'Montserrat-Bold';
`

const ButtonsContainer = styled.View`
  flexDirection: row;
`

const styles = StyleSheet.create({
  header: { height: 50 },
  text: { textAlign: 'left', fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#828899' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  // btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'left', padding: 5, textDecorationLine:'underline', fontFamily: 'Montserrat-Medium', fontSize: 12, color: `${colors.primary}`},
  cellText: { margin: 2, textAlign: 'left', fontFamily: 'Montserrat-Medium', fontSize: 12, color: `${colors.primary}`}
});

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      contentList : [],
      widthArr: [110, 130, 130, 130, 130, 130, 130, 130],
      loadPage: 1,
      loading: false,
      agentList:{},
      imageList:[],
      isVisible: false,
      imageIndex: null,
      role: ApiService.getRole(),
      list: [],
      userCode: ApiService.getUsercode(),
      expensesIdList: [],
      selectedList: [],
      addExpensesAccess: false,
      editExpensesAccess: false,
      sortAsc: false
    }
  }

  componentDidMount = () => {
    this._getExpensesList();
    for (const item of ApiService.getAccessList()) {
      if (item.screen_key === 'expenses_entry') {
        this.setState({ addExpensesAccess: item.can_access })
      }
      if (item.screen_key === 'expenses_entry_edit') {
        this.setState({ editExpensesAccess: item.can_access })
      }
    }
  }

  componentWillReceiveProps = () => {
    this.setState({
      contentList:[],
      imageList: [],
      list: [],
      expensesIdList: [],
      loadPage:1,
      val: null,
      filter: false
    })
    this._getExpensesList();
  }

  _getDefaultList = () => {
    this.setState({
      contentList:[],
      imageList: [],
      list: [],
      expensesIdList: [],
      loadPage:1,
      val: null,
      filter: false
    }, () => {
      this._getExpensesList();
    })
  }

  _getExpensesList = (val) => {
    const { loadPage, role } = this.state;
    let body;
    if (val) {
      body = {
        act: 'getExpensesList',
        page_no: loadPage,
        sort_by: val,
        sort_order: this.state.sortAsc ? 'asc' : 'desc'
      }
    } else {
      body = {
        act: 'getExpensesList',
        page_no: loadPage
      }
    }
    this.setState({ loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({ list: res.data.response.records })
        if (loadPage !== 1) {
          for (const content of res.data.response.records) {
            content.trans_date = DataService.changeDateFormat(content.trans_date);

            this.state.contentList.push([
              '',
              content.agent,
              content.trans_date,
              content.expenses_type,
              content.trans_amount,
              content.remark,
              content.status,
              content.receipt_file !== '' ? 'View Receipt': null
            ])
            this.state.imageList.push(
              content.receipt_file === '' ? 'none' : content.receipt_file
            )
            this.state.expensesIdList.push({ id: content.expenses_id})
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of res.data.response.records) {
              content.trans_date = DataService.changeDateFormat(content.trans_date);
              this.state.contentList.push([
                '',
                content.agent,
                content.trans_date,
                content.expenses_type,
                content.trans_amount,
                content.remark,
                content.status,
                content.receipt_file !== '' ? 'View Receipt': null
              ])
              this.state.imageList.push(
                content.receipt_file === '' ? 'none' : content.receipt_file
              )
              this.state.expensesIdList.push({ id: content.expenses_id})
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
    const { filter, val } = this.state;
    this.state.loadPage++;
    if (filter) {
      this._filter(val)
    } else {
      this._getExpensesList(val);
    }
  }

  _filter = (val) => {
    const { loadPage } = this.state;
    let body;
    if (val) {
      body = {
        act: 'getExpensesList',
        page_no: loadPage,
        sel_group_id: DataService.getAgentGroup(),
        filter_date_from: DataService.getSTrans(),
        filter_date_to: DataService.getETrans(),
        filter_status: DataService.getStatus(),
        sort_by: val,
        sort_order: this.state.sortAsc ? 'asc' : 'desc'
      }
    } else {
      body = {
        act: 'getExpensesList',
        page_no: loadPage,
        sel_group_id: DataService.getAgentGroup(),
        filter_date_from: DataService.getSTrans(),
        filter_date_to: DataService.getETrans(),
        filter_status: DataService.getStatus()
      }
    }
    this.setState({ loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({ loading: false })
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({ list: res.data.response.records })
        if (loadPage == 1) {
          this.setState({ item: res.data.response}, () => {
            for (const content of res.data.response.records) {
              content.trans_date = DataService.changeDateFormat(content.trans_date);
              this.state.contentList.push([
                '',
                content.agent,
                content.trans_date,
                content.expenses_type,
                content.trans_amount,
                content.remark,
                content.status,
                content.receipt_file !== '' ? 'View Receipt': null
              ])
              this.state.imageList.push(
                content.receipt_file === '' ? 'none' : content.receipt_file
              )
              this.state.expensesIdList.push({ id: content.expenses_id})
            }
            this.setState({contentList: this.state.contentList})
          })
        } else {
          for (const content of res.data.response.records) {
            content.trans_date = DataService.changeDateFormat(content.trans_date);
            this.state.contentList.push([
              '',
              content.agent,
              content.trans_date,
              content.expenses_type,
              content.trans_amount,
              content.remark,
              content.status,
              content.receipt_file !== '' ? 'View Receipt': null
            ])
            this.state.imageList.push(
              content.receipt_file === '' ? 'none' : content.receipt_file
            )
            this.state.expensesIdList.push({ id: content.expenses_id})
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList})
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

  _showReceipt = (index) => {
    if (this.state.imageList[index] !== 'none') {
      this.setState({isVisible: true, imageIndex: index})
    }
  }

  _checkRole = (index, status, code) => {
    const { role, list, userCode } = this.state;
      if (role === 'Admin' && status === 'Pending') {
        Actions.CreateExpenses({ pgView: 'edit', content: list[index] })
      } else {
        if (status === 'Pending' && code === userCode ) {
          Actions.CreateExpenses({ pgView: 'edit', content: list[index] })
        }
      }
  }

  _select = (id) => {
    console.log(id);
    if (this.state[id]) {
      this.setState({ [id]: false });
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

  _approve = () => {
    const { selectedList } = this.state;
    const body = {
      act: 'processExpensesApproval',
      records: selectedList
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200 && res.data.errCode === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress: () => Actions.pop()
          }
        ])
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

  _reject = () => {
    const { selectedList } = this.state;
    const body = {
      act: 'processExpensesReject',
      records: selectedList
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      console.log(res);
      if (res.status === 200 && res.data.errCode === 200) {
        Alert.alert('Info', res.data.errMsg,[
          {
            text: 'OK',
            onPress: () => Actions.pop()
          }
        ])
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
    if (val === 'Action') {
      return;
    }
    
    if (val === 'Agent') {
      sortBy = 'agent';
    } else if (val === 'Trans Date') {
      sortBy = 'trans_date';
    } else if (val === 'Expenses Type') {
      sortBy = 'expenses_type';
    } else if (val === 'Trans Amt') {
      sortBy = 'trans_amount';
    } else if (val === 'Remark') {
      sortBy = 'remark';
    } else if (val === 'Status') {
      sortBy = 'status';
    } else if (val === 'Receipt') {
      sortBy = 'receipt_file';
    }
    this.state.sortAsc = !this.state.sortAsc
    this.setState({ contentList: [], expensesIdList: [], imageList: [], isSort: true, loadPage: 1, val: sortBy, list: [] }, () => {
      if (!this.state.filter) {
        this.setState({ item:null });
        this._getExpensesList(sortBy);
      } else {
        this._filter(sortBy);
      }
    })
  }

  render () {
    const { menuOpen, widthArr, loading, item, contentList, filter, isVisible, imageList, imageIndex, role } = this.state;
    const element = (index) => (
      <TouchableOpacity onPress={() => this._showReceipt(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>{ this.state.imageList[index] !== 'none' ? 'View Receipt' : null}</Text>
        </View>
      </TouchableOpacity>
    );
    
    const edit = (index) => (
      <View style={[styles.btn, {alignItems: 'center', flexDirection: 'row'}]}>
        {
          this.state.role === 'Admin' && this.state.contentList[index][6] === 'Pending' ? (
            <TouchableOpacity
              onPress={() => this._select(this.state.expensesIdList[index].id)}
              style={{flex:1, alignItems: 'flex-start'}}
            >
              <CheckBox 
                checked={this.state[this.state.expensesIdList[index].id]}
                onPress={() => this._select(this.state.expensesIdList[index].id)}
              />
            </TouchableOpacity>
          ) : null
        }
        {
          ((this.state.role === 'Admin' && this.state.contentList[index][6] === 'Pending') || (this.state.editExpensesAccess && this.state.contentList[index][6] === 'Pending')) ? (
            <TouchableOpacity
              onPress= {() => this._checkRole(index, this.state.contentList[index][6], this.state.contentList[index][1])}
              style={{flex:1, alignItems: role === 'Admin' ? 'flex-end' : 'center'}}
            >
              <Icon
                name = 'md-create'
                type = 'ionicon'
                color = '#3e59a6'
                onPress= {() => this._checkRole(index, this.state.contentList[index][6], this.state.contentList[index][1])}
              />
            </TouchableOpacity>
          ) : null
        }
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
              title = 'Expenses'
              openMenu  = {this.openMenu.bind(this)}
              showSearch = {true}
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
                                // <TouchableOpacity
                                //   onPress={() => this._checkRole(index, rowData[6], rowData[1])}
                                // >
                                  <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                    {
                                      rowData.map((cellData, cellIndex) => {
                                        return(
                                          <Cell
                                            key={cellIndex}
                                            data={cellIndex === 7 ? element(index) : cellIndex === 0 ? edit(index) : cellData} textStyle={styles.cellText}
                                            style={[{width:cellIndex === 0 ? 110: 130}, index%2 && {backgroundColor: '#FFFFFF'}]}
                                          />
                                        )
                                      })
                                    }
                                  </TableWrapper>
                                // </TouchableOpacity>
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
              <View>
                <Modal
                  isVisible = {isVisible}
                  onBackdropPress = {() => this.setState({isVisible: false})}
                  onBackButtonPress = {() => this.setState({isVisible: false})}
                >
                  <View
                    style = {{ justifyContent: 'center', alignContent: 'center', alignItems:'center' }}
                  >
                    <ImageBackground
                      style = {{width: '90%', height: '90%', backgroundColor: '#EEE'}}
                    >
                      <ImageViewer
                        // source = {{uri: imageList[imageIndex]}}
                        // style = {{width: '100%', height: '100%', backgroundColor: '#EEE'}}
                        // imageStyle = {{resizeMode: 'contain'}}
                        imageUrls={[{ url: imageList[imageIndex ]}]}
                        saveToLocalByLongPress = {false}
                      ></ImageViewer>
                    </ImageBackground>
                  </View>
                </Modal>
              </View>
              {
                this.state.selectedList.length < 1 && this.state.addExpensesAccess ? (
                  <ButtonContainer>
                    <AddButton onPress={() => this._redirect()}>
                      {/* <Text style={{color: '#FFF', fontSize:42}}>+</Text> */}
                      <Icon
                        name = 'plus'
                        type = 'font-awesome'
                        color = '#FFF'
                      />
                    </AddButton>
                  </ButtonContainer>
                ) : null
              }
              {
                this.state.selectedList.length > 0 ? (
                  <ButtonsContainer>
                    <View style={{flex:1}}>
                      <Button
                        title = 'REJECT'
                        buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
                        onPress = {() => this._reject()}
                      />
                    </View>
                    <View style={{flex:1}}>
                      <Button
                        title = 'APPROVE'
                        buttonStyle = {{backgroundColor: '#1e3d8f', borderRadius:0}}
                        onPress = {() => this._approve()}
                      />
                    </View>
                  </ButtonsContainer>
                ) : null
              }
          </Container>
        </Drawer>
      )
  }
}