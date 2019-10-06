import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import { Label, Item, Button, Form, Input, Text } from 'native-base';
import { View, Alert, TextInput } from 'react-native';
import Modal from "react-native-modal";
import DataService from './DataService';
class SecurityModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      password: null
    }
  }

  _checkPassword = () => {
    if (this.state.password === DataService.getPassword()) {
      this.props.closeModal();
      this.props.submit();
    } else {
      Alert.alert('Error', 'Incorrect security password');
    }
  }

  render () {
    const { isVisible, closeModal } = this.props;
    return(
      <View>
        <Modal
          isVisible = {isVisible}
          onBackdropPress = {() => closeModal()}
          onBackButtonPress = {() => closeModal()}
        >
          <View
            style = {{ backgroundColor: '#FFF' }}
          >
            <Form style={{ paddingBottom: 20 }}>
              <Item stackedLabel>
                <Label style={{color: '#828899', fontFamily: 'Montserrat-Bold', fontSize: 14}}>Please enter security password</Label>
                <Input
                  placeholder = '******'
                  secureTextEntry = {true}
                  onChangeText = {(value)=> this.setState({password: value})}
                  autoCapitalize = "none"
                  autoFocus = {true}
                  style = {{
                    fontSize: 14,
                    fontFamily: 'Montserrat-SemiBold',
                    color: '#192a59'}}
                />
              </Item>
            </Form>
            <Button full style={{color: colors.primary}} onPress={() => this._checkPassword()}>
              <Text style={{ color: '#FFF', fontFamily: 'AvenirLTStd-Black', fontSize: 16}}>SUBMIT</Text>
            </Button>
          </View>
        </Modal>
      </View>
    )
  }
}

export default SecurityModal;