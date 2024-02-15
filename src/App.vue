<template>
  <div id="app">
    <router-view />
    <van-tabbar
      v-model="activeTab"
      active-color="#ff6200"
      inactive-color="#000"
      @change="onChange"
    >
      <van-tabbar-item icon="home-o"> 首页 </van-tabbar-item>
      <van-tabbar-item icon="manager-o"> 我的 </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mixins } from "./lib/mixin";
export default {
  name: "App",
  mixins: [mixins],
  data() {
    return {};
  },
  computed: {
    showTabbar() {
      return ["/", "/agent-my"].includes(this.$route.path);
    },
    activeTab: {
      get() {
        switch (this.$route.path) {
          case "/":
            return 0;
          case "/agent-my":
            return 1;
          default:
            return 0;
        }
      },
      set(val) {
        return val;
      },
    },
  },
  mounted() {},
  methods: {
    onChange(index) {
      switch (index) {
        case 1:
          this.$route.path !== "/agent-my" && this.$router.push("/agent-my");
          break;
        case 0:
          this.$route.path !== "/" && this.$router.push("/");
          break;
      }
    },
  },
};
</script>

<style lang="less"></style>
