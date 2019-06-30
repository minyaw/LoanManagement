import React, {Component} from 'react';
import styled from 'styled-components';
import { colors } from '../../constants/colors';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import CustomHeader from '../common/CustomHeader';
import { Actions } from 'react-native-router-flux';
import Loader from '../common/Loader';
import ApiService from '../common/ApiService';

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
  color: #b25656;
`
const Loadmore = styled.Text`
  textAlign: center;
  color: ${colors.primary};
  fontSize: 16px;
  paddingVertical: 15px;
`

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      loading: false,
      loadPage: 0
    }
  }
  
  componentDidMount = () => {
    this._getTransList();
  }
  
  _getTransList = () => {
    const { loadPage } = this.state;
      const body = {
        act: 'getCustomerTransList',
        page_no: loadPage
      }
      this.setState({loading: true})
      ApiService.post(ApiService.getUrl(), body).then((res) => {
        this.setState({loading: false})
        if (res.status === 200) {
          if (this.state.item) {
            this.state.item.records = this.state.item.records.concat(res.data.response.records);
            this.setState({item: this.state.item})
          } else {
            this.setState({item: res.data.response});
          }
        } else {
          Alert.alert('Error', res.data.errMsg)
        }
        console.log(res);
      })
  }
  
  openMenu = () => {
    this.setState({menuOpen: true})
  }

  _loadmore = () => {
    this.setState({loadPage: this.state.loadPage++})
    this._getTransList();
  }

  render() {
    const {menuOpen, item, loading} = this.state;
    if (item) {
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
          <Loader loading={loading}/>
            <ScrollView>
              <CustomHeader
                title = 'Transaction'
                openMenu = {this.openMenu.bind(this)}
                showSearch = {true}
                showMenu = {true}
              />
              {
                item.records.map((content, index) => {
                  return(
                    // this._renderList(content, index)
                    <Card onPress={()=> Actions.TransactionDetail({content: content})} key={index}>
                      <DetailsCol>
                        <Username>{content.customer_name}</Username>
                        <DueDateDetail>Repayment No: {content.repay_no}</DueDateDetail>
                        <DueDateDetail>Trans. Date: {content.trans_date}</DueDateDetail>
                        <DueDateDetail>Trans Amt: {content.trans_amount}</DueDateDetail>
                      </DetailsCol>
                      <RemarksCol>
                        <Remark>{content.trans_type}</Remark>
                      </RemarksCol>
                    </Card>
                  )
                })
              }
              {
                item.records.length < item.total_count ? (
                  <TouchableOpacity
                    onPress={() => this._loadmore()}
                  >
                    <Loadmore>View More ({item.total_count - item.records.length}) ...</Loadmore>
                  </TouchableOpacity>
                ) : (
                  null
                )
              }
            </ScrollView>
          </Container>
        </Drawer>
      )

    } else {
      return (
        <Container>
          <Loader loading={true}/>
        </Container>
      )
    }
  }
}