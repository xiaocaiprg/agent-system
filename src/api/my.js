import http from "./index";

const PATH = {
  LOGIN: "haiyang/agent/login",
};
const API = {
  login(params) {
    return http
      .loginPost(PATH.LOGIN, params)
      .then(res => {
        if (res.code === 200) {
          return res.success;
        }
      })
      .catch(err => {
        throw err;
      });
  },
};
export default API;
