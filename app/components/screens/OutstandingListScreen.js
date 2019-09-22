import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';

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
const AddButton = styled.TouchableOpacity`
  width: 80;
  height: 80;
  borderRadius: 40;
  backgroundColor: #192a58;
  justifyContent: center;
  alignItems: center;
`
const HeaderList = [
  'Agent',
  'Customer',
  'Latest Sales Date',
  'Total Case(s)',
  'Total Sales Amount',
  'Total Outstanding Amount'
]

const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 16px;
  paddingVertical: 15px;
`

const styles = StyleSheet.create({
  header: { height: 50 },
  text: { textAlign: 'center', fontWeight: '100' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff', padding: 5 },
  cellText: { margin: 6, textAlign: 'center'}
});

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      contentList : [],
      widthArr: [130, 130, 130, 130, 130, 130],
      loadPage: 1,
      loading: false,
      agentList:{},
      custIdList:[]
    }
  }

  componentDidMount = () => {
    this._getOutstandingList();
  }

  componentWillReceiveProps = () => {
    this.setState({
      contentList:[],
      loadPage:1
    })
    this._getOutstandingList();
  }

  _getOutstandingList = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getOutstandingList',
      page_no: loadPage
    }
    this.setState({ loading: true})
    ApiService.post(ApiService.getUrl(), body).then((res) => {
      console.log(res);
      this.setState({loading: false})
      if (res.status === 200) {
        if (this.state.item) {
          for (const content of res.data.response.records) {
            this.state.contentList.push([
              content.group_name,
              content.customer_name,
              content.trans_date.substring(0, 10),
              content.total_cases,
              content.total_sales,
              content.outstanding
            ])
            this.state.custIdList.push(content.cust_id)
          }
          this.setState({ contentList: this.state.contentList, custIdList: this.state.custIdList });

        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              this.state.contentList.push([
                content.group_name,
                content.customer_name,
                content.trans_date.substring(0, 10),
                content.total_cases,
                content.total_sales,
                content.outstanding
              ])
              this.state.custIdList.push(content.cust_id)
            }
            this.setState({ contentList: this.state.contentList, custIdList: this.state.custIdList });
          })
        }
      } else {
        Alert.alert('Error', res.data.errMsg);
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
    this._getOutstandingList();
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
      if (res.status === 200) {
        if (loadPage !== 1) {
          for (const content of res.data.response.records) {
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
        Alert.alert('Error', res.data.errMsg);
      }
    })
  }

  render () {
    const { menuOpen, widthArr, loading, item, contentList, filter } = this.state;
    if (contentList.length > 0 || filter) {
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
              title = 'Outstanding List'
              openMenu  = {this.openMenu.bind(this)}
              // showSearch = {true}
              showMenu = {true}
              filter = {()=> this._filter.bind(this)}
              _in = {this}
            />
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
                            onPress = {() => Actions.CustomerDetail({ custId: this.state.custIdList[index] })}
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
            {/* <ButtonContainer>
              <AddButton onPress={() => this._redirect()}>
                <Icon
                  name = 'plus'
                  type = 'font-awesome'
                  color = '#FFF'
                />
              </AddButton>
            </ButtonContainer> */}
          </Container>
        </Drawer>
      )
    } else {
      return (
        <Container>
          <Loader loading={true}/>
        </Container>
      )
    }
  }
}