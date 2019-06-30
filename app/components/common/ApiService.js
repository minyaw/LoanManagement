import axios from "axios";
import DeviceInfo from 'react-native-device-info';
import { Actions } from "react-native-router-flux";
import { Alert } from 'react-native';

let token = '';
let role = '';
let username = '';

class ApiService {
  getToken = () => {
    return token;
  }

  getUrl = () => {
    return 'http://dev.exsivsolutions.com:8099/collection2/_moappz_api_v1/app_call.php';
  }

  getUsername = () => {
    return username;
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
    }

    if (login) {
      axios.post(url, body, reqOpts).then((res) => {
        if (res.status === 200) {
          token = res.data.token;
          role = res.data.result.role_name;
          username = res.data.result.username;
          Actions.Home()
        } else {
          Alert.alert('Error', res.data.errMsg)
        }
      })
    } else {
      return axios.post(url, body, reqOpts);
    }
  }
}

export default new ApiService();