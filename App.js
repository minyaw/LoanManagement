import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
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
const Container = styled.View`
  flex: 1;
`
export default class App extends Component {
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
            <Scene key="Login" component={LoginScreen} initial={true}/>
          </Scene>
        </Router>
      </Container>
    );
  }
}
