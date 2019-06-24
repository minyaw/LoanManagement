import React, {Component} from 'react';
import styled from 'styled-components';
import MenuScene from '../scenes/MenuScene';
import Drawer from 'react-native-drawer';
import CustomHeader from '../common/CustomHeader';
import { colors } from '../../constants/colors';

const Container = styled.View`
  backgroundColor: ${colors.defaultBackground}
  flex             : 1;
`

export default class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false
    }
  }

  openMenu = () => {
    this.setState({menuOpen: true})
  }

  render () {
    const { menuOpen } = this.state;
    return(
      <Drawer
          ref={(ref) => this._drawer = ref}
          type="overlay"
          content={<MenuScene/>}
          styles={{ shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, height: 500}}
          open={menuOpen}
          openDrawerOffset={0.3}
          tapToClose={true}
          onClose={() => this.setState({menuOpen: false})}
      >
        <Container>
          <CustomHeader
            title = 'Due Listing'
            openMenu  = {this.openMenu.bind(this)}
          />
        </Container>
      </Drawer>
    )
  }
}