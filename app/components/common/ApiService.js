import axios from "axios";
import DeviceInfo from 'react-native-device-info';
import { Actions } from "react-native-router-flux";
import { Alert } from 'react-native';
import DataService from "./DataService";

let token = '';
let role = '';
let username = '';
let fullname = '';

class ApiService {
  getToken = () => {
    return token;
  }

  getUrl = () => {
    return 'https://dev.mmc899.com/_moappz_api_v1/app_call.php';
  }

  getUsername = () => {
    return username;
  }

  getRole = () => {
    return role;
  }
  
  getFullName = () => {
    return fullname;
  }

  post = (url, body, login = false) => {
    const reqOpts = {
      headers: {
      'Content-Type': 'application/json',
      }
    }

    if (login) {
      body.deviceid = DeviceInfo.getUniqueID();
      body.signature = '17872df7a1c70c4f97bf333084699243';
      body.reqtime = new Date().getTime();
    } else {
      body.deviceid = DeviceInfo.getUniqueID();
      body.signature = '17872df7a1c70c4f97bf333084699243';
      body.reqtime = new Date().getTime();
      body.token = this.getToken();
      body.username = this.getUsername();
      body.sel_group_id = DataService.getSelectedGroup();
    }
    
    console.log(body);
    if (login) {
      axios.post(url, body, reqOpts).then((res) => {
        console.log(res);
        if (res.status === 200) {
          if (res.data.errCode !== 200) {
            Alert.alert('Error', res.data.errMsg)
            return;
          }
          DataService.setGroup(res.data.result.group_selection);
          token = res.data.token;
          role = res.data.result.role_name;
          username = res.data.result.username;
          fullname = res.data.result.fullname;
          DataService.setPassword(body.pass)
          if (res.data.result.group_name === 'Kgroup') {
            DataService.setSelectedGroup("2");
          } else if (res.data.result.group_name === 'Agroup') {
            DataService.setSelectedGroup("3");
          } else if (res.data.result.group_name === 'Jgroup') {
            DataService.setSelectedGroup("1");
          }
          Actions.Home();
        } else {
          
        }
      })
    } else {
      return axios.post(url, body, reqOpts);
    }
  }
}

export default new ApiService();