import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { Header, Avatar, Icon, Badge, Button } from 'react-native-elements';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import LinearGradient from 'react-native-linear-gradient';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`
const InfoContainer = styled.View`
  paddingHorizontal: 15px;
  paddingVertical: 20px;
  flexDirection: row;
`
const FirstCol = styled.View`
  flex: 1
  paddingHorizontal: 10px;
`
  const SecondCol = styled.View`
  flex: 1
  paddingHorizontal: 10px;
`
const IconContainer = styled.View`
  flex: 1;
  justifyContent: center;
`
const DetailsContainer = styled.View`
  flex: 3;
`
const Detail = styled.Text`
  fontWeight: 600;
  color: #000;
`
const ActionContainer = styled.View`
  backgroundColor: #ebeef7;
  marginHorizontal: 15px;
  paddingHorizontal: 10px;
  paddingVertical: 10px;
  borderRadius: 5px;
`
const ActionText = styled.Text`
  color: #4b577e;
`
const Link = styled.Text`
  color: #192a58;
  fontWeight: 600;
  textDecoration: underline;
`
const DueDateListTitleContainer = styled.View`
  paddingHorizontal: 15px;
  paddingTop: 20px;
  flexDirection: row;
  paddingBottom: 15px;
`
const TitleContainer = styled.View`
  flex: 1;
  alignItems: flex-start;
`
const ButtonContainer = styled.View`
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: flex-end;
`
const DueDateTitle = styled.Text`
  fontWeight: 600;
  color: #192a58;
`
const ViewAllButton = styled.Text`
  fontWeight: 600;
  color: #192a58;
`
const Card = styled.View`
  marginHorizontal: 15px;
  marginBottom: 10px;
  paddingBottom: 10px;
  flexDirection: row;
  borderBottomWidth: 1px;
  borderBottomColor: #eee;
`
const DetailsCol = styled.View`
  flex:1;
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
const styles = StyleSheet.create({
  linearGradient: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    flexDirection: 'row',
    borderColor: 'transparent',
  }
})
export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 'home',
      menuOpen:false,
      userAvatar: null,
      totalUnread:0,
      token: null,
      refreshing: false,
      loading: false
    }
  }

  _changeTab = (name) => {
    this.setState({activeTab: name})
  }

  render() {
    const {activeTab, menuOpen, totalUnread, item, callToAdventure, userDetails, loading} = this.state;
    return (
        <Container>
          <CustomHeader
            title = 'HOME'
          />
          <InfoContainer>
            <FirstCol>
              <LinearGradient colors={['#f5f7ff', '#d9e1ff', '#becdff']} style={styles.linearGradient}>
                <IconContainer>
                  <Icon
                    name = 'shopping-cart'
                    type = 'font-awesome'
                  />
                </IconContainer>
                <DetailsContainer>
                  <Detail>Today's Sales</Detail>
                  <Detail>100,000.00</Detail>
                </DetailsContainer>
              </LinearGradient>
              <LinearGradient colors={['#ddf3e2', '#c2f3cc', '#9eecac']} style={styles.linearGradient}>
                <IconContainer>
                  <Icon
                    name = 'clock'
                    type = 'material-community'
                  />
                </IconContainer>
                <DetailsContainer>
                  <Detail>Outstanding</Detail>
                  <Detail>500,000.00</Detail>
                </DetailsContainer>
              </LinearGradient>
            </FirstCol>
            <SecondCol>
              <LinearGradient colors={['#fff2f6', '#ffc1d3', '#ff9cba']} style={styles.linearGradient}>
                <IconContainer>
                  <Icon
                    name = 'cash-multiple'
                    type = 'material-community'
                  />
                </IconContainer>
                <DetailsContainer>
                  <Detail>Today's Trans</Detail>
                  <Detail>10,000.00</Detail>
                </DetailsContainer>
              </LinearGradient>
              <LinearGradient colors={['#f7e8ce', '#fedb99', '#ffca65']} style={styles.linearGradient}>
                <IconContainer>
                  <Icon
                    name = 'exclamation-circle'
                    type = 'font-awesome'
                  />
                </IconContainer>
                <DetailsContainer>
                  <Detail>Late</Detail>
                  <Detail>50,000.00</Detail>
                </DetailsContainer> 
              </LinearGradient>
            </SecondCol>
          </InfoContainer>
          <ActionContainer>
            <ActionText>
              You have 1 case(s) of sales waiting for your approval or rejection. Please <Link onPress={()=> console.log('haha')}>click here</Link> to process
            </ActionText>
          </ActionContainer>
          <DueDateListTitleContainer>
            <TitleContainer>
              <DueDateTitle>Due Date List</DueDateTitle>
            </TitleContainer>
            <ButtonContainer>
              <ViewAllButton>View All</ViewAllButton>
              <Icon
                name = 'chevron-right'
                type = 'font-awesome'
                size = {12}
                containerStyle = {{justifyContent:'center', paddingLeft: 2, paddingTop: 2}}
              />
            </ButtonContainer>
          </DueDateListTitleContainer>
          <Card>
            <DetailsCol>
              <Username>LIM XUAN XUAN</Username>
              <DueDateDetail>Due Date: 11 March 2019</DueDateDetail>
              <DueDateDetail>Repayment No: 9J000010-1</DueDateDetail>
              <DueDateDetail>Due Amt: RM5,000.00</DueDateDetail>
            </DetailsCol>
            <RemarksCol>
              <Remark>Arrears</Remark>
            </RemarksCol>
          </Card>
          <Card>
            <DetailsCol>
              <Username>LIM XUAN XUAN</Username>
              <DueDateDetail>Due Date: 11 March 2019</DueDateDetail>
              <DueDateDetail>Repayment No: 9J000010-1</DueDateDetail>
              <DueDateDetail>Due Amt: RM5,000.00</DueDateDetail>
            </DetailsCol>
            <RemarksCol>
              <Remark>Arrears</Remark>
            </RemarksCol>
          </Card>
        </Container>
      // </Drawer>
    );
  }
}
