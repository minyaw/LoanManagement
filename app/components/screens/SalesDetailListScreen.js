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

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`

const HeaderList = [
  'Agent',
  'Sales ID',
  'Sales',
  'Next Due'
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
      loadPage: 1,
      contentList : [],
      widthArr: [130, 130, 130, 130],
      loading: false,
      salesIdList:[],
      custIdList:[]
    }
  }

  componentDidMount = () => {
    this._getSalesDetail();
  }

  _loadmore = () => {
    this.state.loadPage++;
    this._getSalesDetail();
  }

  _getSalesDetail = () => {
    const { cust_id } = this.props;
    const { loadPage } = this.state;

    const body = {
      act: 'getCustomerSalesList',
      page_no: loadPage,
      cust_id
    }
    this.setState({loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200 && res.data.errCode === 200) {
        if (this.state.item) {
          for (const content of res.data.response.records) {
            content.next_due_date = DataService.changeDateFormat(content.next_due_date);
            this.state.contentList.push([
              content.agent,
              // content.customer_name,
              // content.cust_id,
              content.sales_no,
              // content.sales_date,
              // content.apply_date,
              content.sales_amount,
              content.next_due_date
              // content.credit,
              // content.int,
              // content.dep,
              // content.fee,
              // content.payment,
              // content.days,
              // content.outstanding_amount,
              // content.status,
              // content.settle_date,
              // content.refund_amount,
              // content.remark,
              // content.gain_loss_amount,
              // content.broker,
              // content.bank_name,
              // content.bank_holder,
              // content.bank_account_no,
            ])
            this.state.salesIdList.push(content.sales_id);
            this.state.custIdList.push(content.cust_id)
          }
          this.state.item.records = this.state.item.records.concat(res.data.response.records);
          this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              content.next_due_date = DataService.changeDateFormat(content.next_due_date);
              this.state.contentList.push([
                content.agent,
                // content.customer_name,
                // content.cust_id,
                content.sales_no,
                // content.sales_date,
                // content.apply_date,
                content.sales_amount,
                content.next_due_date
                // content.credit,
                // content.int,
                // content.dep,
                // content.fee,
                // content.payment,
                // content.days,
                // content.outstanding_amount,
                // content.status,
                // content.settle_date,
                // content.refund_amount,
                // content.remark,
                // content.gain_loss_amount,
                // content.broker,
                // content.bank_name,
                // content.bank_holder,
                // content.bank_account_no,
              ])
              this.state.salesIdList.push(content.sales_id);
              this.state.custIdList.push(content.cust_id)
            }
            this.setState({contentList: this.state.contentList, salesIdList: this.state.salesIdList, custIdList: this.state.custIdList})
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

  _sort = () => {
    
  }


  render () {
    const { menuOpen, widthArr, item, loading } = this.state;
    if (item) {
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
              title = 'Sales Details'
              openMenu  = {this.openMenu.bind(this)}
              // showSearch = {true}
              // showMenu = {true}
              showBack = {true}
            />
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
          </Container>
        </Drawer>
      )
    } else {
      return (
        <Container>
          {/* <Loader loading={true}/> */}
        </Container>
      )
    }
  }
}