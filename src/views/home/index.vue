<template>
  <div>
    <van-tabs v-model="agentValue" sticky>
      <van-tab
        v-for="(tab, index) in agentTab"
        :key="index"
        :title="tab.label"
        :name="tab.value"
      >
        <div v-if="filterData && filterData.length" class="card-content">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <div
              v-for="(user, index) in filterData"
              :key="index"
              class="user-card"
            >
              <div class="left">
                <div v-if="user.username" class="user-item">
                  <span>用户名称：</span>
                  <span class="user-value">{{ user.username }}</span>
                </div>
                <div v-if="user.phone" class="user-item">
                  <span>联系方式：</span>
                  <span class="user-value">{{ user.phone }}</span>
                </div>

                <div class="user-item">
                  <span>{{ cardText.integralText }}</span>
                  <span class="user-value" style="font-weight: 700">{{
                    user.integral
                  }}</span>
                </div>
                <div class="user-item">
                  <span>{{ cardText.timeText }}</span>
                  <span class="user-value"> {{ user.createTime }}</span>
                </div>
              </div>
              <div v-if="agentValue === 'all'" class="right">
                <van-button
                  hairline
                  type="info"
                  size="mini"
                  color="#ff6633"
                  @click="onClickSend(user)"
                >
                  分配积分
                </van-button>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <van-dialog
      v-model="showConfirm"
      title="确认分配积分给该用户？"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-notice-bar
        v-if="curUser"
        style="margin: 1rem"
        left-icon="volume-o"
        color="#ff0000"
        text="请认真核对用户信息，积分一旦分配不可撤销，请谨慎操作"
      />

      <div v-if="curUser" class="cur-info">
        <div class="cur-item">
          <span>用户名称：</span>{{ curUser.username }}
        </div>
        <div class="cur-item">
          <span>用户联系方式：</span>{{ curUser.phone }}
        </div>

        <van-field
          v-model="integral"
          label="积分"
          :label-width="50"
          placeholder="请输入需要分配的积分"
        />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { mixins } from "@/lib/mixin";
import { IntegralTypeEnum } from "@/lib/config.ts";
import API from "@/api/home";
export default {
  name: "Order",
  components: {},
  mixins: [mixins],
  data() {
    return {
      agentValue: "all",
      userListData: [],
      integralData: [],
      agentTab: [
        {
          label: "用户管理",
          value: "all",
        },
        {
          label: "已分配积分",
          value: "send",
        },
        {
          label: "已获取积分",
          value: "get",
        },
      ],
      showConfirm: false,
      loading: false,
      finished: false,
      curUser: null,
      integral: "",
    };
  },
  computed: {
    filterData() {
      if (this.agentValue === "send") {
        return this.integralData.filter(
          item => item.integralType === IntegralTypeEnum.ATOUSER
        );
      }
      if (this.agentValue === "get") {
        return this.integralData.filter(
          item => item.integralType === IntegralTypeEnum.TOAGENT
        );
      }
      return this.userListData;
    },
    cardText() {
      if (this.agentValue === "send") {
        return {
          integralText: "本次分配积分：",
          timeText: "分配时间：",
        };
      }
      if (this.agentValue === "get") {
        return {
          integralText: "本次获得积分：",
          timeText: "获取时间：",
        };
      }
      return {
        integralText: "用户积分：",
        timeText: "加入时间：",
      };
    },
    isValid() {
      return this.integral && /^\d+$/.test(this.integral);
    },
  },
  mounted() {
    this.getAllUserList();
    this.getIntegral();
  },
  methods: {
    getAllUserList() {
      const params = {
        pageNum: 1,
        pageSize: 100,
      };
      API.getAll(params)
        .then(res => {
          this.userListData = res && res.records;
          this.finished = true;
        })
        .catch(err => {
          this.handleErr(err);
        });
    },
    getIntegral() {
      const params = {
        pageNum: 1,
        pageSize: 100,
        integralType: `${IntegralTypeEnum.ATOUSER},${IntegralTypeEnum.TOAGENT}`, // 1:管理员到代理 2：代理到用户 3:商家到用户 4.用户消费获得的积分 用逗号,分割
      };
      API.getIntegral(params)
        .then(res => {
          this.integralData = res && res.records;
          this.finished = true;
        })
        .catch(err => {
          this.handleErr(err);
        });
    },
    onClickSend(user) {
      this.showConfirm = true;
      this.curUser = user;
    },
    onLoad() {},
    beforeClose(action, done) {
      if (action === "confirm") {
        if (!this.isValid) {
          this.$toast.fail("请输入有效积分");
          done(false);
        } else {
          const params = {
            username: this.curUser.username,
            integral: this.integral, //积分
            integralType: 2, //1:管理员到代理 2：代理到用户 3:商家到用户
          };
          API.addIntegral(params).then(res => {
            if (res) {
              this.$toast.success("分配成功");
              this.userListData = [];
              this.getAllUserList();
              done();
            } else {
              this.$toast.fail("分配失败，请联系管理员");
              done(false);
            }
          });
        }
      } else {
        done();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.card-content {
  padding-bottom: 50px;
  .user-card {
    background: #f6f6f6;
    margin-top: 1rem;
    padding: 2rem;
    display: flex;
    font-size: 1.4rem;
    .left {
      .user-item {
        margin-bottom: 0.5rem;
        color: #000;
        .user-value {
          color: #ff6633;
        }
      }
    }
    .right {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: flex-end;
    }
  }
}
.cur-info {
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  .cur-item {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
</style>
