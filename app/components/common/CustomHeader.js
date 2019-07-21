import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Alert, Text } from 'react-native';
import { Header, Icon, Button, Avatar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchModalVisible: false,
      menuOpen: false
    };
  }

  _onSearchPress = () => {
    const { title } = this.props;
    Actions.Filter({pgView: title})
  }

  render() {
    const { title, openMenu, showSearch, showBack, showMenu, showDone } = this.props;
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
              <Icon
                name = 'chevron-left'
                type = 'font-awesome'
                color = '#000'
                onPress = {() => Actions.pop()}
                containerStyle = {{paddingLeft: 15}}
              /> : showMenu ?
              <TouchableOpacity
                onPress={ () => openMenu()}
              >
                <Icon
                  name = 'bars'
                  type = 'font-awesome'
                  color = '#000'
                  containerStyle = {{paddingLeft: 15}}
                />
              </TouchableOpacity> : null
            }
            centerComponent = {{ text: title, style: { color: '#192a59', fontWeight: "600", fontSize: 20} }}
            rightComponent = { showSearch ?
              <Icon
                name = 'search'
                type = 'font-awesome'
                color = '#3e59a6'
                containerStyle = {{paddingRight: 15}}
                onPress = {() => this._onSearchPress()}
                /> : showDone ? 
                <Icon
                name = 'check'
                type = 'font-awesome'
                color = '#3e59a6'
                containerStyle = {{paddingRight: 15}}
              /> : null
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