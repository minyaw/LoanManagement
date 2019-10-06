import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import { Label, Item, Button, Form, Input, Text } from 'native-base';
import { View, Alert, TextInput, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import DataService from './DataService';

class CancelReasonModal extends Component {
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
    const { isVisible, closeModal, id, deleteSales } = this.props;
    return(
      <ScrollView keyboardShouldPersistTaps={'handled'}>
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
                <Label>Please enter cancel reason</Label>
                <Input
                  onChangeText = {(value)=> this.setState({reason: value})}
                  autoCapitalize = "none"
                  autoFocus = {true}
                />
              </Item>
            </Form>
            <Button full style={{color: colors.primary}} onPress={() => {
              closeModal();
              deleteSales(id, this.state.reason);
            }}>
              <Text>Submit</Text>
            </Button>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}

export default CancelReasonModal;