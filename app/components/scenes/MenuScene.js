import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import {View, Text,StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView} from 'react-native';
import { Avatar, ListItem, Icon, Image } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';
import ApiService from '../common/ApiService';
import Loader from '../common/Loader';
import DataService from '../common/DataService';

export class LeftIcon extends Component {
  render() {
    const { path } = this.props;
    return (
      <Image 
        source={path}
        style = {{width: 15, height:15}}
      />
    );
  }
}

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex:1;
  background: ${colors.primary};
  height:${height};
`;
const ProfileImageContainer = styled.TouchableOpacity`
  paddingHorizontal: 30;
  backgroundColor  : ${colors.primary};
  paddingTop       : 30;
  paddingBottom    : 30;
  flexDirection: row;
`;
const AvatarContainer = styled.View`
  flex:1;
`
const UsernameContainer = styled.View`
  flex:2;
  justifyContent: center;
  paddingLeft:20
`
const IconContainer = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: flex-start;
`
const ListContainer = styled.View`
  paddingHorizontal: 20;
  paddingTop: 15px;
  background: ${colors.primary};
  borderTopWidth: 1px;
  borderTopColor: #FFF;
`
const Username = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
`
const Role = styled.Text`
  font-size: 16px;
  color: #FFFFFF;
`
const list = [
  {
    title: 'HOME',
    navigate: 'Home',
  },
  {
    title: 'CUSTOMER SEARCH',
    navigate: 'SearchCustomer',
  },
  {
    title: 'CUSTOMER',
    navigate: 'Customer',
  },
  {
    title:'TRANSACTION',
    navigate: 'Transaction',
  },
  {
    title:'OTHER INCOME',
    navigate: 'IncomeList',
  },
  {
    title: 'SALES',
    navigate: 'SalesList',
  },
  {
    title: 'DUE DATE LIST',
    navigate: 'DueList',
  },
  {
    title: 'EXPENSES',
    navigate: 'ExpensesList',
  },
  {
    title: 'LOGOUT',
    navigate: 'Home',
  }
]

const masterList = [
  {
    title: 'HOME',
    navigate: 'Home',
  },
  {
    title: 'CUSTOMER',
    navigate: 'Customer',
  },
  {
    title:'TRANSACTION',
    navigate: 'Transaction',
  },
  {
    title:'OTHER INCOME',
    navigate: 'IncomeList',
  },
  {
    title: 'SALES',
    navigate: 'SalesList',
  },
  {
    title: 'DUE DATE LIST',
    navigate: 'DueList',
  },
  {
    title: 'EXPENSES',
    navigate: 'ExpensesList',
  },
  {
    title: 'LOGOUT',
    navigate: 'Home',
  }
]
const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.iconBackground,
  }
});

class Scene extends Component {
  constructor (props) {
    super(props);
    this.state = {
      username:null,
      changedPassword: null,
      userAvatar: null,
      loading: false,
      role: ApiService.getRole()
    }
  }

  _onItemPress = (item) => {
    const { title, navigate } = item;
    if (title === 'LOGOUT') {
      const body = {
        act: 'logout'
      }
      this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        DataService.clearGroup();
        this.setState({loading: false})
        if (res.status === 200) {
          Actions.Login();
        }
      })
    } else {
      Actions[navigate](); 
    }
  }
  render() {
    const { loading, role } = this.state;
      return (
        <Container>
          <Loader loading={loading}/>
          <ProfileImageContainer
            onPress = {() => Actions.Profile()}
          >
            <AvatarContainer>
              <Avatar
                rounded
                size = "medium"
                icon = {{name: 'person'}}
                // source        = { { uri: path === '' ? avatar : path} }
              />
            </AvatarContainer>
          <UsernameContainer>
              <Username>{ApiService.getFullName()}</Username>
              <Role>{ApiService.getRole()}</Role>
            </UsernameContainer>
            <IconContainer>
              <Icon
                name = 'chevron-right'
                type = 'font-awesome'
                color = '#FFF'
              />
            </IconContainer>
          </ProfileImageContainer>
          <ScrollView>
            <ListContainer>
              {
                role === 'Admin' ? (
                  list.map((item,index)=> {
                    let path = '';
                    if (item.title === 'HOME') {
                      path = require("../../../assets/icons/ic_home_24px.png")
                    } else if (item.title === 'CUSTOMER SEARCH') {
                      path = require("../../../assets/icons/ic_search_24px.png")
                    } else if (item.title === 'CUSTOMER') {
                      path = require("../../../assets/icons/ic_assignment_ind_24px.png")
                    } else if (item.title === 'TRANSACTION') {
                      path = require("../../../assets/icons/ic_swap_vert_24px.png")
                    } else if (item.title === 'SALES') {
                      path = require("../../../assets/icons/ic_next_week_24px.png")
                    } else if (item.title === 'DUE DATE LIST') {
                      path = require("../../../assets/icons/ic_query_builder_24px.png")
                    } else if (item.title === 'EXPENSES') {
                      path = require("../../../assets/icons/ic_attach_money_24px.png")
                    } else if (item.title === 'LOGOUT') {
                      path = require("../../../assets/icons/ic_exit_to_app_24px.png")
                    } else {
                      path = null
                    }
                    return(
                      <ListItem
                        key            = {index}
                        title          = {item.title}
                        titleStyle     = {{color: '#FFF', fontSize: 16}}
                        onPress        = {() => this._onItemPress(item)}
                        containerStyle = {{backgroundColor: colors.primary,paddingVertical:20}}
                        component      = {TouchableOpacity}
                        leftIcon = {<LeftIcon path={path}/>}
                      />
                    )
                  })
                ) : (
                  masterList.map((item,index)=> {
                    let path = '';
                    if (item.title === 'HOME') {
                      path = require("../../../assets/icons/ic_home_24px.png")
                    } else if (item.title === 'CUSTOMER SEARCH') {
                      path = require("../../../assets/icons/ic_search_24px.png")
                    } else if (item.title === 'CUSTOMER') {
                      path = require("../../../assets/icons/ic_assignment_ind_24px.png")
                    } else if (item.title === 'TRANSACTION') {
                      path = require("../../../assets/icons/ic_swap_vert_24px.png")
                    } else if (item.title === 'SALES') {
                      path = require("../../../assets/icons/ic_next_week_24px.png")
                    } else if (item.title === 'DUE DATE LIST') {
                      path = require("../../../assets/icons/ic_query_builder_24px.png")
                    } else if (item.title === 'EXPENSES') {
                      path = require("../../../assets/icons/ic_attach_money_24px.png")
                    } else if (item.title === 'LOGOUT') {
                      path = require("../../../assets/icons/ic_exit_to_app_24px.png")
                    } else {
                      path = null
                    }
                    return(
                      <ListItem
                        key            = {index}
                        title          = {item.title}
                        titleStyle     = {{color: '#FFF', fontSize: 16}}
                        onPress        = {() => this._onItemPress(item)}
                        containerStyle = {{backgroundColor: colors.primary,paddingVertical:20}}
                        component      = {TouchableOpacity}
                        leftIcon = {<LeftIcon path={path}/>}
                      />
                    )
                  })
                )
              }
            </ListContainer>
            {/* <View>
              <Image
                source = {{uri: '../../../'}}
              />
            </View> */}
          </ScrollView>
        </Container>
      );
  }
}

export default Scene;