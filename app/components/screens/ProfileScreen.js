import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Input, Button } from 'react-native-elements';
import { ScrollView, Text } from 'react-native';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Divider = styled.View`
  paddingHorizontal: 15px;
  backgroundColor: #ebeef7;
  paddingVertical: 10px;
`
const DividerText = styled.Text`
  color: #192a58;
  fontWeight: 600;
`
const FormContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 10px;
`
const ButtonContainer = styled.View`

`
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    }
  }

  render() {
    const {menuOpen} = this.state;
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={
        <MenuScene
          closeMenu = {() => this.setState({activeTab:'home', menuOpen: false})}
          switchTab = {() => this.setState({activeTab:'pillar', menuOpen:false})}
          switchStratecution = {() => this.setState({activeTab:'stratecution', menuOpen:false})}
          avatar = {`https://app.leadapreneur.com/storage/${this.state.userAvatar}`}
        />
      }
        styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3}}
        // open={true}
        open={menuOpen}
        openDrawerOffset={0.3}
        tapToClose={true}
        onClose={() => this.setState({menuOpen: false})}
      >
        <Container>
          <ScrollView>
            <Header
              leftComponent        = {
                <Icon
                  name = 'bars'
                  type = 'font-awesome'
                  color = '#000'
                  containerStyle = {{paddingLeft: 15}}
                  onPress = { () => this.setState({menuOpen: true})}
                />
              }
              centerComponent = {{ text: 'My Profile', style: { color: '#192a58', fontWeight: "600", fontSize: 20} }}
              backgroundColor = '#FFF'
              containerStyle  = {{paddingBottom:20, borderBottomColor: '#eee', borderBottomWidth: 1}}
            />
            <Divider>
              <DividerText>Personal Details</DividerText>
            </Divider>
            <FormContainer>
              <Input
                label = 'Username*'
                containerStyle = {{paddingBottom: 10}}
                />
              <Input
                label = 'Full Name*'
                containerStyle = {{paddingBottom: 10}}
                />
              <Input
                label = 'NRIC/Passport*'
                containerStyle = {{paddingBottom: 10}}
              />
            </FormContainer>
            <Divider>
              <DividerText>Permanent Address</DividerText>
            </Divider>
            <FormContainer>
              <Input
                label = 'Address 1'
                containerStyle = {{paddingBottom: 10}}
                />
              <Input
                label = 'Address 2'
                containerStyle = {{paddingBottom: 10}}
                />
              <Input
                label = 'City'
                containerStyle = {{paddingBottom: 10}}
              />
            </FormContainer>
          </ScrollView>
          <ButtonContainer>
            <Button
              title = 'UPDATE'
              buttonStyle = {{backgroundColor: colors.primary, borderRadius:0}}
            />
          </ButtonContainer>
        </Container>
      </Drawer>
    )
  }
}