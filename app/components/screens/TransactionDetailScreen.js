import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const RepaymentContainer = styled.View`
  flexDirection: row;
  paddingHorizontal : 15px;
  paddingVertical: 15px;
`
const RepaymentTitle = styled.Text`
  textAlign: left;
  flex:1;
`
const RepaymentNo = styled.Text`
  textAlign: right;
  flex:1;
`
const TransactionListContainer = styled.View`
  paddingHorizontal : 15px;
  paddingVertical: 15px;
`
const TransactionListTitle = styled.Text`
  fontWeight: 600
`
const HeaderList = [
// 'Trans ID',
// 'Submit Date',
// 'Trans Currency',
// 'Trans Rate',
'Trans Date',
'Trans Amount',
'Trans Type',
// 'Receipt No. / Reference No.',
// 'Payment Receipt',
// 'Remark',
// 'Action By',
// 'Bank Name',
// 'Bank Holder Name',
// 'Bank Account No'
]

const styles = StyleSheet.create({
  header: { height: 50 },
  text: { textAlign: 'center', fontFamily: 'Montserrat-Medium', fontSize: 14, color: '#828899' },
  row: { flexDirection: 'row',height:50, backgroundColor: '#ebeef7' },
  btn: { backgroundColor: '#1a73e8',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff', padding: 5 },
  cellText: { margin: 6, textAlign: 'center', fontFamily: 'Montserrat-Medium', fontSize: 14, color: `${colors.primary}`}
});

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      contentList : [],
      widthArr: [130, 130, 130]
    }
  }

  componentDidMount = () => {
    const { content } = this.props;
    this.state.contentList.push([
      // content.trans_id,
      // content.submit_date,
      // content.currency,
      // content.repay_rate,
      content.trans_date,
      content.trans_amount,
      content.trans_type,
      // content.ref_no,
      // content.receipt_file,
      // content.remark,
      // content.agent,
      // content.bank_name,
      // content.bank_holder,
      // content.bank_account_no
    ])
    console.log(this.state.contentList);
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _payNow = (index) => {
    Alert.alert(`this is row ${index+1}`);
  }

  render () {
    const { menuOpen, widthArr, loading } = this.state;
    const { content } = this.props;
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
          <CustomHeader
            title = 'Trans Detail'
            openMenu  = {this.openMenu.bind(this)}
            showSearch = {true}
            showBack = {true}
          />
          <RepaymentContainer>
            <RepaymentTitle>Repayment No</RepaymentTitle>
            <RepaymentNo>{content.repay_no}</RepaymentNo>
          </RepaymentContainer>
          <TransactionListContainer>
            <TransactionListTitle>Transaction List</TransactionListTitle>
          </TransactionListContainer>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{borderColor: 'transparent'}}>
                <Row data={HeaderList} widthArr={widthArr} style={styles.header} textStyle={styles.text}/>
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
              </ScrollView>
            </View>
          </ScrollView>
        </Container>
      </Drawer>
    )
  }
}