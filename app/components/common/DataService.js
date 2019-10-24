let groupOptions = [];
let groupId = 0;
let agentId = null;
let cust_name = null;
let nric_no = null;
let s_due_date = null;
let e_due_date = null;
let s_trans_date = null;
let e_trans_date = null;
let s_set_date = null;
let e_set_date = null;
let status = []
let agentList = [];
let salesId = null;
let brokerId = null;
let phone = null;
let agentGroupId = null;
let password = null;
let custId = null;

class DataService {
  setGroup = (item) => {
    groupOptions = [];
    groupOptions.push({ id: "0", value: "All" });
    for (const itm of item) {
      groupOptions.push(itm);
    }
  }

  getGroup = () => {
    return groupOptions;
  }

  setSelectedGroup = (id) => {
    groupId = id;
  }

  getSelectedGroup = () => {
    return groupId;
  }

  clearGroup = () => {
    groupId = null;
  }

  setAgent = (agent) => {
    agentId = agent
  }

  getAgent = () => {
    return agentId;
  }

  setCustName = (cust) => {
    cust_name = cust
  }

  getCustName = () => {
    return cust_name;
  }

  setNric = (nric) => {
    nric_no = nric;
  }

  getNric = () => {
    return nric_no;
  }

  setSDue = (date) => {
    s_due_date = date;
  }

  getSDue = () => {
    return s_due_date;
  }

  setEDue = (date) => {
    e_due_date = date;
  }

  getEDue = () => {
    return e_due_date;
  }

  setSTrans = (date) => {
    s_trans_date = date;
  }

  getSTrans = () => {
    return s_trans_date;
  }

  setETrans = (date) => {
    e_trans_date = date;
  }

  getETrans = () => {
    return e_trans_date;
  }
  setSSet = (date) => {
    s_set_date = date;
  }

  getSSet = () => {
    return s_set_date;
  }

  setESet = (date) => {
    e_set_date = date;
  }

  getESet = () => {
    return e_set_date;
  }

  setStatus = (item) => {
    status = item;
  }

  getStatus = () => {
    let text = '';
    for (const item of status) {
      text += `${item},`
    }
    let selected = text.substring(0, text.length - 1)
    return selected;
  }

  setAgentList = (item) => {
    agentList = item;
  }

  getAgentList = () => {
    return agentList;
  }

  setSalesId = (item) => {
    salesId = item;
  }

  getSalesId = () => {
    return salesId;
  }

  setBroker = (item) => {
    brokerId = item;
  }

  getBroker = () => {
    return brokerId;
  }

  setPhone = (item) => {
    phone = item;
  }

  getPhone = () => {
    return phone;
  }

  setAgentGroup = (item) => {
    agentGroupId = item;
  }

  getAgentGroup = () => {
    return agentGroupId;
  }

  setPassword = (value) => {
    password = value
  }

  getPassword = () => {
    return password;
  }

  setCustId = (value) => {
    custId = value;
  }

  getCustId = () => {
    return custId;
  }

  changeDateFormat(date) {
    let trans_date = new Date(date);
    let trans_day = trans_date.getDate();
    let trans_month = trans_date.getMonth() +1;
    let trans_year = trans_date.getFullYear().toString().substring(2,4);

    if (trans_day < 10) {
      trans_day = '0' + trans_day
    }

    if (trans_month < 10) {
      trans_month = '0' + trans_month
    }

    if (isNaN(trans_day) || isNaN(trans_month) || isNaN(trans_year)) {
      return ''
    } else {
      return `${trans_day}-${trans_month}-${trans_year}`;
    }
  }
}

export default new DataService();