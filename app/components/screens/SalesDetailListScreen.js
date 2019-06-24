import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';
import { ScrollView, StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { Actions } from 'react-native-router-flux';

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
          'JGROUP-FMC',
          '9J026 >',
          'RM2,000.00',
          '2019-03-26'
        ],
        [
          'KGROUP-OWJ',
          '9J026 >',
          'RM1,000.00',
          '2019-03-26'
        ],
        [
          'KGROUP-OWS',
          '9J026 >',
          'RM200.00',
          '2019-03-26'
        ],
        [
          'JGROUP-LBC',
          '9J026 >',
          'RM500.00',
          '2019-03-26'
        ],
      ],
      widthArr: [130, 130, 130, 130]
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
            title = 'Sales Detail'
            openMenu  = {this.openMenu.bind(this)}
            // showSearch = {true}
            // showMenu = {true}
            showBack = {true}
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
                          onPress={() => Actions.SalesDetail()}
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
              </ScrollView>
            </View>
          </ScrollView>
        </Container>
      </Drawer>
    )
  }
}