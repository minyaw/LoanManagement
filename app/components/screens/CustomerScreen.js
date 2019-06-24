import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Input, Button } from 'react-native-elements';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const Card = styled.TouchableOpacity`
  marginHorizontal: 15px;
  marginVertical: 10px;
  paddingBottom: 10px;
  flexDirection: row;
  borderBottomWidth: 1px;
  borderBottomColor: #eee;
`
const DetailsCol = styled.View`
  flex:2;
  justifyContent: flex-start;
`
const RemarksCol = styled.View`
  flex:1;
  justifyContent: center;
  alignItems: flex-end;
`
const Username = styled.Text`
  color: #3e59a6;
  fontSize: 18px;
  fontWeight: 600;
`
const DueDateDetail = styled.Text`
  color: #888fa8;
  lineHeight: 20px;
`
const Remark = styled.Text`
  color: #576eb1;
`
const ButtonContainer = styled.View`
  paddingRight: 15;
  paddingBottom: 15;
  position: absolute;
  bottom:0;
  right:0;
`
const AddButton = styled.TouchableOpacity`
  width: 80;
  height: 80;
  borderRadius: 40;
  backgroundColor: #192a58;
  justifyContent: center;
  alignItems: center;
`

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false
    }
  }

  _redirect = () => {
    Actions.CreateCustomer();
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
              centerComponent = {{ text: 'Customer', style: { color: '#192a58', fontWeight: "600", fontSize: 20} }}
              rightComponent = {
                <Icon
                  name = 'search'
                  type = 'font-awesome'
                  color = '#3e59a6'
                  containerStyle = {{paddingRight: 15}}
                />
              }
              backgroundColor = '#FFF'
              containerStyle  = {{paddingBottom:20, borderBottomColor: '#eee', borderBottomWidth: 1}}
            />
            <Card onPress={()=> Actions.CustomerDetail()}>
              <DetailsCol>
                <Username>LIM XUAN XUAN</Username>
                <DueDateDetail>NRIC/Passport: 690531528889</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 250,000.00 (5)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Normal</Remark>
              </RemarksCol>
            </Card>
            <Card>
              <DetailsCol>
                <Username>KHAT CHEE SENG</Username>
                <DueDateDetail>NRIC/Passport: 6660559342234</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 16,000.00 (4)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Suspended</Remark>
              </RemarksCol>
            </Card>
            <Card>
              <DetailsCol>
                <Username>TAN KOK HONG</Username>
                <DueDateDetail>NRIC/Passport: 690531528889</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 33,000.00 (5)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Normal</Remark>
              </RemarksCol>
            </Card>
            <Card>
              <DetailsCol>
                <Username>LIM XUAN XUAN</Username>
                <DueDateDetail>NRIC/Passport: 690531528889</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 250,000.00 (5)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Normal</Remark>
              </RemarksCol>
            </Card>
            <Card>
              <DetailsCol>
                <Username>LIM XUAN XUAN</Username>
                <DueDateDetail>NRIC/Passport: 690531528889</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 250,000.00 (5)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Normal</Remark>
              </RemarksCol>
            </Card>
            <Card>
              <DetailsCol>
                <Username>LIM XUAN XUAN</Username>
                <DueDateDetail>NRIC/Passport: 690531528889</DueDateDetail>
                <DueDateDetail>Reg. Date: 22 March 19 11:51pm</DueDateDetail>
                <DueDateDetail>Sales Amt: RM 250,000.00 (5)</DueDateDetail>
              </DetailsCol>
              <RemarksCol>
                <Remark>Normal</Remark>
              </RemarksCol>
            </Card>
          </ScrollView>
          <ButtonContainer>
            <AddButton onPress={() => this._redirect()}>
              {/* <Text style={{color: '#FFF', fontSize:42}}>+</Text> */}
              <Icon
                name = 'plus'
                type = 'font-awesome'
                color = '#FFF'
              />
            </AddButton>
          </ButtonContainer>
        </Container>
      </Drawer>
    )
  }
}