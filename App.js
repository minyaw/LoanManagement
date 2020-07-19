import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, DeviceEventEmitter, Alert} from 'react-native';
import {Scene, Router, TabNavigator, ActionConst} from 'react-native-router-flux';
import styled from 'styled-components';
import HomeScreen from './app/components/screens/HomeScreen';
import ProfileScreen from './app/components/screens/ProfileScreen';
import CustomerScreen from './app/components/screens/CustomerScreen';
import TransactionScreen from './app/components/screens/TransactionScreen';
import DueListScreen from './app/components/screens/DueListScreen';
import SalesListScreen from './app/components/screens/SalesListScreen';
import CreateCustomerScreen from './app/components/screens/CreateCustomerScreen';
import ExpensesListScreen from './app/components/screens/ExpensesListScreen';
import TransactionDetailScreen from './app/components/screens/TransactionDetailScreen';
import SearchCustomerScreen from './app/components/screens/SearchCustomerScreen';
import CustomerDetailScreen from './app/components/screens/CustomerDetailScreen';
import CreateSalesScreen from './app/components/screens/CreateSalesScreen';
import CreateExpensesScreen from './app/components/screens/CreateExpensesScreen';
import SalesDetailListScreen from './app/components/screens/SalesDetailListScreen';
import SalesDetailScreen from './app/components/screens/SalesDetailScreen';
import CreateTransactionScreen from './app/components/screens/CreateTransactionScreen';
import LoginScreen from './app/components/screens/LoginScreen';
import FilterScreen from './app/components/screens/FilterScreen';
import ApprovalListScreen from './app/components/screens/ApprovalListScreen';
import OutstandingListScreen from './app/components/screens/OutstandingListScreen';
import IncomeListScreen from './app/components/screens/IncomeListScreen';
import CreateIncomeScreen from './app/components/screens/CreateIncomeScreen';
import EditApprovalScreen from './app/components/screens/EditApprovalScreen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import DataService from './app/components/common/DataService';

const Container = styled.View`
  flex: 1;
`
export default class App extends Component {
  async componentDidMount() {
    // TODO: You: Do firebase things
    // const { user } = await firebase.auth().signInAnonymously();
    // console.warn('User -> ', user.toJSON());

    // await firebase.analytics().logEvent('foo', { bar: '123'});
    // if (Platform.OS === 'android') {
      this._checkPermission();
      this.createNotificationListeners();
      this.createListeners();
      if (Platform.OS === 'ios') {
        DeviceInfo.syncUniqueId().then(id => {
          DataService.setDeviceId(id);
        });
        // DataService.setDeviceId(DeviceInfo.getUniqueID());
      } else {
        // DeviceInfo.getUniqueID().then(id => {
        //   DataService.setDeviceId(id);
        // })
        DataService.setDeviceId(DeviceInfo.getUniqueID());
      }
    // }

  }

  _checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this._getToken();
    } else {
      this._requestPermission()
    }
  }

  _getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
            DataService.setFcmToken(fcmToken);
        }
      } else {
        DataService.setFcmToken(fcmToken);
      }
      console.log('token', fcmToken)
      Alert.alert('token', fcmToken);
  }

    //2
  _requestPermission = async () => {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this._getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  createListeners = () => {
    const channel = new firebase.notifications.Android.Channel(
      'channelId',
      'Channel Name',
      firebase.notifications.Android.Importance.Max
    ).setDescription('Loan Channel');
    firebase.notifications().android.createChannel(channel);

    // the listener returns a function you can use to unsubscribe
    this.unsubscribeFromNotificationListener = firebase.notifications().onNotification((notification) => {
      if (Platform.OS === 'android') {

        const localNotification = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
          })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('channelId') // e.g. the id you chose above
          .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      } else if (Platform.OS === 'ios') {

        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));

      }
    });
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log(notification)
      const { title, body, _data } = notification;
      this.setState({message: _data.action})
          this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body,_data } = notificationOpen.notification;
        this.setState({message: _data.action})
          this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body, _data } = notificationOpen.notification;
        this.setState({message: _data.action})
          this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log('data', JSON.stringify(message));
    });
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => this._onTapped() },
      ],
      { cancelable: false },
    );
  }

  _onTapped = () =>{
    const { message } = this.state;
    
  }

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  render() {
    return (
      <Container>
        <Router>
          <Scene key="root" hideNavBar={true}>
            <Scene key="Home" component={HomeScreen} pandHandler={false} type={ActionConst.RESET}/>
            <Scene key="Profile" component={ProfileScreen}/>
            <Scene key="Customer" component={CustomerScreen}/>
            <Scene key="Transaction" component={TransactionScreen}/>
            <Scene key="DueList" component={DueListScreen}/>
            <Scene key="SalesList" component={SalesListScreen}/>
            <Scene key="CreateCustomer" component={CreateCustomerScreen}/>
            <Scene key="ExpensesList" component={ExpensesListScreen}/>
            <Scene key="TransactionDetail" component={TransactionDetailScreen}/>
            <Scene key="SearchCustomer" component={SearchCustomerScreen}/>
            <Scene key="CustomerDetail" component={CustomerDetailScreen}/>
            <Scene key="CreateSales" component={CreateSalesScreen}/>
            <Scene key="CreateExpenses" component={CreateExpensesScreen}/>
            <Scene key="SalesDetailList" component={SalesDetailListScreen}/>
            <Scene key="SalesDetail" component={SalesDetailScreen}/>
            <Scene key="CreateTransaction" component={CreateTransactionScreen}/>
            <Scene key="Filter" component={FilterScreen}/>
            <Scene key="ApprovalList" component={ApprovalListScreen}/>
            <Scene key="OutstandingList" component={OutstandingListScreen}/>
            <Scene key="IncomeList" component={IncomeListScreen}/>
            <Scene key="CreateIncome" component={CreateIncomeScreen}/>
            <Scene key="EditApproval" component={EditApprovalScreen}/>
            <Scene key="Login" component={LoginScreen} initial={true}/>
          </Scene>
        </Router>
      </Container>
    );
  }
}
