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
  text: { textAlign: 'center', fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#828899' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff', padding: 5 },
  cellText: { margin: 6, textAlign: 'center', fontFamily: 'Montserrat-Medium', fontSize: 12, color: `${colors.primary}`}
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
      widthArr: [130, 130, 130, 130, 130],
      agentList: {},
      filter: false,
      custIdList:[]
    }
  }

  componentDidMount = () => {
    this._getSalesList();
  }

  _loadmore = () => {
    const { filter } = this.state;
    this.state.loadPage++;
    if (filter) {
      this._filter()
    } else {
      this._getSalesList();
    }
  }

  _getSalesList = () => {
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
      body = {
        act: 'getCustomerSalesList',
        page_no: loadPage
      }
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        if (this.state.item) {
          for (const content of res.data.response.records) {
            this.state.contentList.push([
              content.agent,
              content.customer_name,
              content.sales_no,
              content.installment_amount,
              content.next_due_date
            ])
            this.state.salesIdList.push(content.sales_id);
            this.state.custIdList.push(content.cust_id)
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              this.state.contentList.push([
                content.agent,
                content.customer_name,
                content.sales_no,
                content.installment_amount,
                content.next_due_date
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

  _filter = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getCustomerSalesList',
      page_no: loadPage,
      filter_agent: DataService.getAgent(),
      filter_cust_name: DataService.getCustName(),
      filter_nric_no: DataService.getNric(),
      filter_sales_no: DataService.getSalesId(),
      filter_trans_date_from: DataService.getSTrans(),
      filter_trans_date_to: DataService.getETrans(),
      filter_settle_date_from: DataService.getSSet(),
      filter_settle_date_to: DataService.getESet(),
      filter_status: DataService.getStatus()
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      this.setState({loading: false})
      if (res.status === 200) {
        if (loadPage === 1) {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              this.state.contentList.push([
                content.agent,
                content.customer_name,
                content.sales_no,
                content.installment_amount,
                content.next_due_date
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id)
            }
            this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
          });
        } else {
            for (const content of res.data.response.records) {
              this.state.contentList.push([
                content.agent,
                content.customer_name,
                content.sales_no,
                content.installment_amount,
                content.next_due_date
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

  render () {
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
                    <Row data={HeaderList} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
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
                                        data={cellData} textStyle={styles.cellText}
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