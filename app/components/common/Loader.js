import React, { Component } from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";


const styles = StyleSheet.create({
  modalBackground: {
    flex           : 1,
    alignItems     : 'center',
    flexDirection  : 'column',
    justifyContent : 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height         : 40,
    width          : 40,
    borderRadius   : 40,
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'space-around'
  }
});

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Modal
        transparent    = {true}
        animationType  = {'none'}
        visible        = {this.props.loading}
        onRequestClose = {() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.props.loading}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

export default Loader;
