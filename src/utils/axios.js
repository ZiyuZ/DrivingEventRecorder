import axios from "axios";
import backendConfig from "../config/backendConfig";
import { Modal, message } from "antd";

export default class Axios {
  static ajax(options) {
    return new Promise((resolve, reject) => {
      axios({
        url: options.url,
        method: options.method,
        baseURL: backendConfig.backendApi,
        timeout: 3000,
        params: options.params || "",
        data: options.data || "",
      }).then(response => {
        if (response.status === 200) {
          let res = response.data;
          if (res.code === 0) {
            message.success(res.message)
            resolve(res);
          } else {
            Modal.error({
              title: "错误",
              content: res.message
            });
          }
        } else {
          reject();
        }
      });
    });
  }
}
