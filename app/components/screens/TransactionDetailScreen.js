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
'Trans ID',
'Submit Date',
'Trans Currency',
'Trans Rate',
'Trans Date',
'Trans Type',
'Trans Amount',
'Receipt No. / Reference No.',
'Payment Receipt',
'Remark',
'Action By',
'Bank Name',
'Bank Holder Name',
'Bank Account No'
]

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
      contentList : [
        [
          "LIM XUAN XUAN",
          "XUAN XUAN LIM",
          "2019-03-11",
          "J00923123",
          "2",
          "100",
          "OK",
          'haha',
          "DING DING",
          "YOKE YOKE",
          "2019-03-12",
          "J00923123",
          "2",
          "100",
        ],
        [
          "DING DING",
          "YOKE YOKE",
          "2019-03-12",
          "J00923123",
          "2",
          "100",
          "OK",
          'haha',
          "LIM XUAN XUAN",
          "XUAN XUAN LIM",
          "2019-03-11",
          "J00923123",
          "2",
          "100",
        ]
      ],
      widthArr: [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130]
    }
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _payNow = (index) => {
    Alert.alert(`this is row ${index+1}`);
  }

  render () {
    const { menuOpen, widthArr } = this.state;
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
            <RepaymentNo>9J024-4</RepaymentNo>
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