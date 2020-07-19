import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body } from 'native-base';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`

const HeaderList = [
  'Cust Name',
  'Due Date',
  'Sales ID',
  'Agent',
  'Instal Amt',
]

const Loadmore = styled.Text`
  textAlign: left;
  paddingLeft: 20px;
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
      loading: false,
      contentList : [
      ],
      widthArr: [130, 130, 130, 130, 130],
      loadPage: 1,
      custIdList: [],
      salesIdList:[],
      filter: false,
      agentList: {},
      custAcs: false,
      dueAcs: false,
      isSort: false,
      val: null
    }
  }

  componentDidMount = () => {
    this._getDueList();
  }

  _getDefaultList = () => {
    this.setState({ loadPage: 1, contentList: [], custIdList: [], salesIdList: [], filter: false, custAcs: false, dueAcs: false, isSort: false, val: null })
    this._getDueList();
  }

  _getDueList = (val) => {
    const { loadPage } = this.state;
    console.log('loadpage', loadPage);
    let body;
    if (val === 'Cust Name') {
      body = {
        act: 'getDueDateList',
        page_no: loadPage,
        sort_by: 'customer_name',
        sort_order: this.state.custAcs ? 'asc' : 'desc'
      }
    } else if (val === 'Due Date') {
      body = {
        act: 'getDueDateList',
        page_no: loadPage,
        sort_by: 'due_date',
        sort_order: this.state.dueAcs ? 'asc' : 'desc'
      }
    } else {
      body = {
        act: 'getDueDateList',
        page_no: loadPage
      }
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({ agentList: res.data.response.agent_list})
        if (this.state.item) {
          for (const content of res.data.response.records) {
            content.due_date = DataService.changeDateFormat(content.due_date);
            this.state.contentList.push([
              content.customer_name,
              content.due_date,
              content.repay_no,
              content.agent,
              content.installment_amount,
            ])
            this.state.salesIdList.push(content.sales_id);
            this.state.custIdList.push(content.cust_id);
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.due_date = DataService.changeDateFormat(content.due_date);
              this.state.contentList.push([
                content.customer_name,
                content.due_date,
                content.repay_no,
                content.agent,
                content.installment_amount,
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id);
            }
            this.setState({contentList: this.state.contentList})
          });
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
      console.log(res);
    })
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _payNow = (index) => {
    Alert.alert(`this is row ${index+1}`);
  }

  _loadmore = () => {
    const { filter, isSort, val } = this.state;
    this.state.loadPage++;
    if (filter) {
      if (isSort) {
        this._filter(val);
      } else {
        this._filter();
      }
    } else {
      if (isSort) {
        this._getDueList(val);
      } else {
        this._getDueList();
      }
    }
  }

  _filter = (val) => {
    const { loadPage, filter } = this.state;
    console.log(loadPage);
    let body;
    if (val === 'Cust Name') {
      body = {
        act: 'getDueDateList',
        page_no: loadPage,
        sort_by: 'customer_name',
        sort_order: this.state.custAcs ? 'asc' : 'desc',
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_due_date_from: DataService.getSDue(),
        filter_due_date_to: DataService.getEDue(),
        filter_status: DataService.getStatus()
      }
    } else if (val === 'Due Date') {
      body = {
        act: 'getDueDateList',
        page_no: loadPage,
        sort_by: 'due_date',
        sort_order: this.state.dueAcs ? 'asc' : 'desc',
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_due_date_from: DataService.getSDue(),
        filter_due_date_to: DataService.getEDue(),
        filter_status: DataService.getStatus()
      }
    } else {
      body = {
        act: 'getDueDateList',
        page_no: loadPage,
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_due_date_from: DataService.getSDue(),
        filter_due_date_to: DataService.getEDue(),
        filter_status: DataService.getStatus()
      }
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      if (res.status === 200 && res.data.errCode === 200) {
        this.setState({loading: false})
        if (loadPage === 1) {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.due_date = DataService.changeDateFormat(content.due_date);
              this.state.contentList.push([
                content.customer_name,
                content.due_date,
                content.repay_no,
                content.agent,
                content.installment_amount,
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id);
            }
            this.setState({contentList: this.state.contentList})
          });
        } else {
          for (const content of res.data.response.records) {
            content.due_date = DataService.changeDateFormat(content.due_date);
            this.state.contentList.push([
              content.customer_name,
              content.due_date,
              content.repay_no,
              content.agent,
              content.installment_amount,
            ])
            this.state.salesIdList.push(content.sales_id);
            this.state.custIdList.push(content.cust_id);
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
      console.log(res);
    })
  }

  _sort = (val) => {
    if (val !== 'Cust Name' && val !== 'Due Date') {
      return;
    }
    if (!this.state.filter) {
      this.setState({ val: val, item: null, contentList: [], salesIdList: [], custIdList: [], isSort: true, loadPage: 1 }, () => {
        if (val === 'Cust Name' ) {
          this.state.custAcs = !this.state.custAcs;
        } else if (val === 'Due Date') {
          this.state.dueAcs = !this.state.dueAcs;
        }
        this._getDueList(val);
      })
      console.log('val', val);
    } else {
      this.setState({ val: val, isSort:true, contentList: [], salesIdList: [], custIdList: [], loadPage: 1  });
      if (val === 'Cust Name' ) {
        this.state.custAcs = !this.state.custAcs;
      } else if (val === 'Due Date') {
        this.state.dueAcs = !this.state.dueAcs;
      }
      this._filter(val);
    }
  }

  render () {
    const { menuOpen, widthArr, loading, contentList, item, filter } = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._payNow(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Pay Now</Text>
        </View>
      </TouchableOpacity>
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
            title = 'Due Listing'
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
                        <TouchableOpacity
                          onPress= {()=> Actions.SalesDetail({cust_id: this.state.custIdList[index], sales_id: this.state.salesIdList[index]})}
                        >
                          <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                            {
                              rowData.map((cellData, cellIndex) => {
                                return(
                                  <Cell
                                    key={cellIndex}
                                    data={cellIndex === 7 ? element(cellData, index) : cellData} textStyle={styles.cellText}
                                    style={[{width:130}, index%2 && {backgroundColor: '#FFFFFF'}]}
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
        </Container>
      </Drawer>
    )
  }
}