import http from "../api/index";
const PATH = {
  GET_AGENT_INFO: "haiyang/agent/token",
};
export const mixins = {
  mounted() {},
  methods: {
    getLocalStorage() {
      const authorization = window.localStorage.getItem("a-authorization");
      return authorization;
    },
    setLocalStorage(value) {
      window.localStorage.setItem("a-authorization", value);
    },
    getUserInfo() {
      const authorization = this.getLocalStorage() || "";
      if (authorization) {
        return http
          .get(`${PATH.GET_AGENT_INFO}`)
          .then(res => {
            if (res.code === 200) {
              return res.result;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        return Promise.resolve("");
      }
    },
    handleErr(err) {
      if (err.response && err.response.status === 406) {
        this.$route.path !== "/agent-my" && this.$router.push("/agent-my");
      }
      console.log(err, "handleErr");
    },
  },
};
