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
  'Expenses Type',
  'Trans Amount'
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
        ],
        [
          "DING DING",
          "YOKE YOKE",
          "2019-03-12",
        ]
      ],
      widthArr: [130, 130, 130]
    }
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
            title = 'Expenses'
            openMenu  = {this.openMenu.bind(this)}
            showSearch = {true}
            showMenu = {true}
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