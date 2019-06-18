import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Scene, Router, TabNavigator, ActionConst} from 'react-native-router-flux';
import styled from 'styled-components';
import HomeScreen from './app/components/screens/HomeScreen';
import ProfileScreen from './app/components/screens/ProfileScreen';
import CustomerScreen from './app/components/screens/CustomerScreen';
import TransactionScreen from './app/components/screens/TransactionScreen';
import Drawer from 'react-native-drawer';
import MenuScene from './app/components/scenes/MenuScene';

const Container = styled.View`
  flex: 1;
`

export default class App extends Component {
  render() {
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={<MenuScene/>}
        styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, height: 500}}
        open={true}
        openDrawerOffset={0.3}
        tapToClose={true}
        onClose={() => this.setState({menuOpen: false})}
        >
        <Container>
          <Router>
            <Scene key="root" hideNavBar={true}>
              <Scene key="Home" component={HomeScreen} pandHandler={false} type={ActionConst.RESET} initial={true}/>
              <Scene key="Profile" component={ProfileScreen}/>
              <Scene key="Customer" component={CustomerScreen}/>
              <Scene key="Transaction" component={TransactionScreen}/>
            </Scene>
          </Router>
        </Container>
      </Drawer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
