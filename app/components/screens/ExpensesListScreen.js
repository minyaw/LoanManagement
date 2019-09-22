import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text, ImageBackground } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';
import DataService from '../common/DataService';
import { Content, Card, CardItem, Body } from 'native-base';
import Modal from "react-native-modal";

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
  'Submit Date',
  'Agent',
  'Trans Date',
  'Expenses Type',
  'Trans Amount',
  'Remark',
  'Status',
  'Receipt'
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
      widthArr: [130, 130, 130, 130, 130, 130, 130, 130],
      loadPage: 1,
      loading: false,
      agentList:{},
      imageList:[],
      isVisible: false,
      imageIndex: null
    }
  }

  componentDidMount = () => {
    this._getExpensesList();
  }

  componentWillReceiveProps = () => {
    this.setState({
      contentList:[],
      loadPage:1
    })
    this._getExpensesList();
  }

  _getExpensesList = () => {
    const { loadPage } = this.state;
    const body = {
      act: 'getExpensesList',
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
              content.submit_date,
              content.agent,
              content.trans_date,
              content.expenses_type,
              `${content.currency}${content.trans_amount}`,
              content.remark,
              content.status,
              content.receipt_file !== '' ? 'View Receipt': null
            ])
            this.state.imageList.push(
              content.receipt_file === '' ? 'none' : content.receipt_file
            )
          }
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              this.state.contentList.push([
                content.submit_date,
                content.agent,
                content.trans_date,
                content.expenses_type,
                `${content.currency}${content.trans_amount}`,
                content.remark,
                content.status,
                content.receipt_file !== '' ? 'View Receipt': null
              ])
              this.state.imageList.push(
                content.receipt_file === '' ? 'none' : content.receipt_file
              )
            }
            this.setState({contentList: this.state.contentList})
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
      if (res.status === 200) {
        if (loadPage !== 1) {
          for (const content of res.data.response.records) {
            this.state.contentList.push([
              content.submit_date,
              content.agent,
              content.trans_date,
              content.expenses_type,
              `${content.currency}${content.trans_amount}`,
              content.remark,
              content.status,
              content.receipt_file !== '' ? 'View Receipt': null
            ])
            this.state.imageList.push(
              content.receipt_file === '' ? 'none' : content.receipt_file
            )
          }
          this.setState({contentList: this.state.contentList})
        } else {
          this.setState({item: res.data.response}, () => {
            for (const content of this.state.item.records) {
              this.state.contentList.push([
                content.submit_date,
                content.agent,
                content.trans_date,
                content.expenses_type,
                `${content.currency}${content.trans_amount}`,
                content.remark,
                content.status,
                content.receipt_file !== '' ? 'View Receipt': null
              ])
              this.state.imageList.push(
                content.receipt_file === '' ? 'none' : content.receipt_file
              )
            }
            this.setState({contentList: this.state.contentList})
          })
        }
      } else {
        Alert.alert('Error', res.data.errMsg);
      }
    })
  }

  _showReceipt = (index) => {
    if (this.state.imageList[index] !== 'none') {
      this.setState({isVisible: true, imageIndex: index})
    }
  }

  render () {
    const { menuOpen, widthArr, loading, item, contentList, filter, isVisible, imageList, imageIndex } = this.state;
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
                        <Row data={HeaderList} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
                      </Table>
                      <ScrollView>
                          {
                            this.state.contentList.map((rowData, index) => {
                              return(
                                <TouchableOpacity
                                  onPress={() => this._showReceipt(index)}
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
                      <ImageBackground
                        source = {{uri: imageList[imageIndex]}}
                        style = {{width: '100%', height: '100%', backgroundColor: '#EEE'}}
                        imageStyle = {{resizeMode: 'contain'}}
                      ></ImageBackground>
                    </ImageBackground>
                  </View>
                </Modal>
              </View>
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
          </Container>
        </Drawer>
      )
  }
}