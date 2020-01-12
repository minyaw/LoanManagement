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
import { Icon } from 'react-native-elements';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`

const HeaderList = [
  'Action',
  'Sales Date',
  'Agent',
  'Cust Name',
  'Sales ID',
  'Sales',
  'Next Due'
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
      loadPage: 1,
      salesIdList:[],
      contentList : [
      ],
      widthArr: [110, 130, 130, 130, 130, 130, 130],
      agentList: {},
      filter: false,
      custIdList:[],
      sortAsc: false
    }
  }

  componentDidMount = () => {
    const { today } = this.props;
    if (today) {
      DataService.setSTrans(new Date().toISOString().substring(0, 10));
      DataService.setETrans(new Date().toISOString().substring(0, 10));
      this._filter();
    } else {
      this._getSalesList();
    }
  }

  componentWillReceiveProps = (data) => {
    this.setState({ item: null, contentList: [], salesIdList: [], custIdList: [], loadPage: 1 }, () => {
      this._getSalesList();
    })
  }

  _getDefaultList = () => {
    this.setState({ contentList: [], salesIdList: [], custIdList: [], loadPage: 1, filter: false }, () => {
      this._getSalesList();
    })
  }

  _loadmore = () => {
    const { filter, val } = this.state;
    this.state.loadPage++;
    if (filter) {
      this._filter(val)
    } else {
      this._getSalesList(val);
    }
  }

  _getSalesList = (val) => {
    const { loadPage } = this.state;
    const { pgView } = this.props;
    let body;
    if (pgView === 'dashboard') {
      body = {
        act: 'getCustomerSalesList',
        page_no: loadPage,
        filter_status:'Bad Debt'
      }
    } else {
      if (val) {
        body = {
          act: 'getCustomerSalesList',
          page_no: loadPage,
          sort_by: val,
          sort_order: this.state.sortAsc ? 'asc': 'desc'
        }
      } else {
        body = {
          act: 'getCustomerSalesList',
          page_no: loadPage
        }
      }
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        this.setState({ agentList: res.data.response.agent_list })
        if (loadPage !== 1) {
          console.log('here');
          for (const content of res.data.response.records) {
            content.next_due_date = DataService.changeDateFormat(content.next_due_date);
            content.sales_date = DataService.changeDateFormat(content.sales_date);
            this.state.contentList.push([
              '',
              content.sales_date,
              content.agent,
              content.customer_name,
              content.sales_no,
              content.sales_amount,
              content.next_due_date,
              content.can_edit
            ])
            this.state.salesIdList.push(content.sales_id);
            this.state.custIdList.push(content.cust_id)
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
        } else {
          console.log('there');
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.next_due_date = DataService.changeDateFormat(content.next_due_date);
              content.sales_date = DataService.changeDateFormat(content.sales_date);
              this.state.contentList.push([
                '',
                content.sales_date,
                content.agent,
                content.customer_name,
                content.sales_no,
                content.sales_amount,
                content.next_due_date,
                content.can_edit
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id)
            }
            this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
          });
        }
      } else {
        Alert.alert('Error', res.data.errMsg)
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

  _filter = (val) => {
    const { loadPage } = this.state;
    let body;
    if (val) {
      body = {
        act: 'getCustomerSalesList',
        page_no: loadPage,
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_sales_no: DataService.getSalesId(),
        filter_trans_date_from: DataService.getSTrans(),
        filter_trans_date_to: DataService.getETrans(),
        filter_apply_date_from: DataService.getSApp(),
        filter_apply_date_to: DataService.getEApp(),
        filter_settle_date_from: DataService.getSSet(),
        filter_settle_date_to: DataService.getESet(),
        filter_status: DataService.getStatus(),
        sort_by: val,
        sort_order: this.state.sortAsc ? 'asc' : 'desc'
      }
    } else {
      body = {
        act: 'getCustomerSalesList',
        page_no: loadPage,
        filter_agent: DataService.getAgent(),
        filter_cust_name: DataService.getCustName(),
        filter_nric_no: DataService.getNric(),
        filter_sales_no: DataService.getSalesId(),
        filter_trans_date_from: DataService.getSTrans(),
        filter_trans_date_to: DataService.getETrans(),
        filter_apply_date_from: DataService.getSApp(),
        filter_apply_date_to: DataService.getEApp(),
        filter_settle_date_from: DataService.getSSet(),
        filter_settle_date_to: DataService.getESet(),
        filter_status: DataService.getStatus()
      }
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        if (loadPage === 1) {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.next_due_date = DataService.changeDateFormat(content.next_due_date);
              content.sales_date = DataService.changeDateFormat(content.sales_date);
              this.state.contentList.push([
                '',
                content.sales_date,
                content.agent,
                content.customer_name,
                content.sales_no,
                content.sales_amount,
                content.next_due_date,
                content.can_edit
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id)
            }
            this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
          });
        } else {
            for (const content of res.data.response.records) {
              content.next_due_date = DataService.changeDateFormat(content.next_due_date);
              content.sales_date = DataService.changeDateFormat(content.sales_date);
              this.state.contentList.push([
                '',
                content.sales_date,
                content.agent,
                content.customer_name,
                content.sales_no,
                content.sales_amount,
                content.next_due_date,
                content.can_edit
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id)
            }
            this.state.item.records = this.state.item.records.concat(res.data.response.records);
            this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
        }
      } else {
        Alert.alert('Error', res.data.errMsg)
      }
      console.log(res);
    })
  }

  _sort = (val) => {
    let sortBy;
    console.log(val);
    if (val === 'Agent' || val === 'Next Due' || val === 'Sales Date') {
      return;
    }
    
    if (val === 'Cust Name') {
      sortBy = 'customer_name';
    } else if (val === 'Sales ID') {
      sortBy = 'sales_no'
    } else if (val === 'Sales') {
      sortBy = 'sales_amount';
    }
    this.state.sortAsc = !this.state.sortAsc
    this.setState({ contentList: [], salesIdList: [], custIdList: [], isSort: true, loadPage: 1, val: sortBy, list: [] }, () => {
      if (!this.state.filter) {
        this.setState({ item:null });
        this._getSalesList(sortBy);
      } else {
        this._filter(sortBy);
      }
    })
  }

  render () {
    const edit = (index) => (
      this.state.contentList[index][7] ? (
        <View style={{ paddingLeft: 5}}>
          <TouchableOpacity
            onPress= {() => Actions.EditApproval({ salesDetail: this.state.item.records[index] })}
            style={{alignItems: 'flex-start'}}
          >
            <Icon
              name = 'md-create'
              type = 'ionicon'
              color = '#3e59a6'
              // onPress= {() => this._checkRole(index, this.state.contentList[index][6], this.state.contentList[index][1])}
            />
          </TouchableOpacity>
        </View>
      ) : null
    );

    const { menuOpen, widthArr, item, loading, contentList, filter } = this.state;
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
            title = 'Sales'
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
                              onPress={() => Actions.SalesDetail({sales_id: this.state.salesIdList[index], cust_id: this.state.custIdList[index]})}
                            >
                              <TableWrapper key={index} style={styles.row} borderStyle={{borderColor: 'transparent'}}>
                                {
                                  rowData.map((cellData, cellIndex) => {
                                    return(
                                      <Cell
                                        key={cellIndex}
                                        data={cellIndex === 0 ? edit(index) : cellData} textStyle={styles.cellText}
                                        style={[{width: cellIndex === 0 ? 110 : cellIndex < 7 ? 130 : 0}, index%2 && {backgroundColor: '#FFFFFF'}]}
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