import axios from "axios";
import DeviceInfo from 'react-native-device-info';
import { Actions } from "react-native-router-flux";
import { Alert, Platform } from 'react-native';
import DataService from "./DataService";

let token = '';
let role = '';
let username = '';
let fullname = '';
let code = '';
let accessList = [];
let appMode = 'PRD';
const md5 = require('md5');

class ApiService {
  getToken = () => {
    return token;
  }

  getUrl = () => {
    if (appMode === 'PRD') {
      return 'https://mmc899.com/_moappz_api_v1/app_call.php';
    } else if (appMode === 'UAT') {
      return 'https://uat.mmc899.com/_moappz_api_v1/app_call.php';
    } else if (appMode === 'DEV') {
      return 'https://dev.mmc899.com/_moappz_api_v1/app_call.php';
    }
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

  getUsercode = () => {
    return code;
  }

  getAccessList = () => {
    return accessList;
  }

  setAppMode = (mode) => {
    appMode = mode;
  }

  getAppMode = () => {
    return appMode;
  }

  post = (url, body, login = false) => {
    const reqOpts = {
      headers: {
      'Content-Type': 'application/json',
      }
    }

    body.deviceid = DataService.getDeviceId();
    body.reqtime = new Date().getTime();
    body.appVersion = DataService.getAppVersion();
    body.osVersion = Platform.Version;
    body.notifToken = DataService.getFcmToken();

    if (!login) {
      body.token = this.getToken();
      body.username = this.getUsername();
      body.sel_group_id = DataService.getSelectedGroup();
    }

    if(appMode === 'PRD') {
      body.signature = `${md5(body.act + body.reqtime + body.username + body.deviceid + 'Dac#w@d*;hd#1s@Ks9)2qd8*27Z@2@Sub2(q2#2E#$A+')}`;
    } else {
      body.signature = '17872df7a1c70c4f97bf333084699243';
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
          accessList = res.data.result.access_list;
          token = res.data.token;
          role = res.data.result.role_name;
          username = res.data.result.username;
          fullname = res.data.result.fullname;
          code = res.data.result.user_code;
          DataService.setPassword(body.pass)
          // if (res.data.result.group_name === 'Kgroup') {
          //   DataService.setSelectedGroup("2");
          // } else if (res.data.result.group_name === 'Agroup') {
          //   DataService.setSelectedGroup("3");
          // } else if (res.data.result.group_name === 'Jgroup') {
          //   DataService.setSelectedGroup("1");
          // }
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