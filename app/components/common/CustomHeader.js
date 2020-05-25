import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Alert, Text } from 'react-native';
import { Header, Icon, Button, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import DataService from './DataService';

class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchModalVisible: false,
      menuOpen: false
    };
  }

  _onSearchPress = () => {
    const { title, filter, _in } = this.props;
    Actions.Filter({pgView: title, filter: filter, _in: _in})
  }

  _search = () => {
    const {filter, agent, status, cust_name, e_due, s_due, _in, pgView} = this.props;
    _in.setState({
      loadPage: 1,
      contentList: [],
      filter: true,
      imageList: [],
      list: [],
      expensesIdList: [],
      custIdList:[],
      salesIdList: [],
      val: null
     }, () => {
       DataService.setPrevTitle(pgView)
      filter();
    })
    Actions.pop();
    // setTimeout(() => {
    // }, 500)
  }

  render() {
    const { title, openMenu, showSearch, showBack, showMenu, showDone, showEdit, edit, filter, refresh, _in } = this.props;
    const { menuOpen } = this.state;
    return (
      // <Drawer
      //   ref={(ref) => this._drawer = ref}
      //   type="overlay"
      //   content={<MenuScene/>}
      //   styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, height: 500}}
      //   open={menuOpen}
      //   openDrawerOffset={0.3}
      //   tapToClose={true}
      //   onClose={() => this.setState({menuOpen: false})}
      // >
        <View>
          <Header
            leftComponent        = {
              showBack ?
              <TouchableOpacity
                // hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                onPress = {() => refresh ? Actions.Home() : Actions.pop()}
                style={{ paddingHorizontal: Platform.OS === 'android' ? 15 : 0, paddingVertical: Platform.OS === 'android' ? 15 : 0}}
                activeOpacity = {0.5}
              >
                <Icon
                  name = 'chevron-left'
                  type = 'font-awesome'
                  color = '#000'
                  onPress = {() => refresh ? Actions.Home() : Actions.pop()}
                  containerStyle = {{paddingLeft: 15}}
                />
              </TouchableOpacity> : showMenu ?
              <TouchableOpacity
                onPress={ () => openMenu()}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={{ paddingHorizontal:Platform.OS === 'android' ? 15 : 0, paddingVertical: Platform.OS === 'android' ? 15 : 0}}
              >
                <Icon
                  name = 'bars'
                  type = 'font-awesome'
                  color = '#000'
                  containerStyle = {{paddingLeft: 15}}
                />
              </TouchableOpacity> : null
            }
            // centerComponent = {{ text: title, style: { color: '#192a59', fontSize: 20, fontFamily: 'AvenirLTStd-Black'} }}
            centerComponent = {
              title === 'Sales' || title === 'Customer' || title === 'Transaction' || title === 'Due Listing' || title === 'Expenses' ? (
                <TouchableOpacity
                  onPress = {() => _in._getDefaultList()}
                >
                  <Text style={{ color: '#192a59', fontSize: 20, fontFamily: 'AvenirLTStd-Black' }}>{title}</Text>
                </TouchableOpacity>
              ) : (
                { text: title, style: { color: '#192a59', fontSize: 20, fontFamily: 'AvenirLTStd-Black'} }
              )
            }
            rightComponent = { showSearch ? (
              <TouchableOpacity
                onPress = {() => this._onSearchPress()}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={{ paddingHorizontal:Platform.OS === 'android' ? 15 : 0, paddingVertical: Platform.OS === 'android' ? 15 : 0}}
              >
                <Icon
                  name = 'search'
                  type = 'font-awesome'
                  color = '#3e59a6'
                  containerStyle = {{paddingRight: 15}}
                  onPress = {() => this._onSearchPress()}
                />
              </TouchableOpacity>
              ) : showDone ? (
                <TouchableOpacity
                  onPress = {() => this._search()}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  style={{ paddingHorizontal:Platform.OS === 'android' ? 15 : 0, paddingVertical: Platform.OS === 'android' ? 15 : 0}}
                >
                  <Icon
                    name = 'check'
                    type = 'font-awesome'
                    color = '#3e59a6'
                    containerStyle = {{paddingRight: 15}}
                    onPress = {() => this._search()}
                  />
                </TouchableOpacity>
              ) : showEdit ? (
                <TouchableOpacity
                  onPress = {edit}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                  style={{ paddingHorizontal:Platform.OS === 'android' ? 15 : 0, paddingVertical: Platform.OS === 'android' ? 15 : 0}}
                >
                  <Icon
                    name = 'md-create'
                    type = 'ionicon'
                    color = '#3e59a6'
                    containerStyle = {{paddingRight: 15}}
                    onPress= {edit}
                  />
                </TouchableOpacity>
              ) : null
            }
            backgroundColor = '#FFF'
            containerStyle  = {{paddingBottom:20, borderBottomColor: '#eee', borderBottomWidth: 1}}
          />
        </View>
      // </Drawer>
    );
  }
}

export default CustomHeader;