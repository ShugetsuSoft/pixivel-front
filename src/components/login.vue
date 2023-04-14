<template>
  <div class="modal-card" style="max-width: 30rem">
    <header class="modal-card-head">
      <p class="modal-card-title">
        {{ titles[mode] }}
      </p>
      <button type="button" class="delete" @click="$emit('close')" />
    </header>
    <section class="modal-card-body">
      <template v-if="mode == 0">
        <b-field
          label="用户名或邮箱"
          :message="notify.username"
          :type="notify.username.length > 0 ? 'is-danger' : ''"
        >
          <b-input v-model="forms.username" type="text" placeholder="用户名">
          </b-input>
        </b-field>

        <b-field
          label="密码"
          :message="notify.password"
          :type="notify.password.length > 0 ? 'is-danger' : ''"
        >
          <b-input
            v-model="forms.password"
            type="password"
            password-reveal
            placeholder="密码"
          >
          </b-input>
        </b-field>

        <div class="tips">
          <a @click="mode = 1">注册</a> <a @click="mode = 2">重设密码</a>
        </div>
      </template>
      <template v-else-if="mode == 1">
        <b-field
          label="邮箱"
          :message="notify.email"
          :type="notify.email.length > 0 ? 'is-danger' : ''"
        >
          <b-input
            v-model="forms.email"
            type="email"
            placeholder="邮箱"
            @focus="clearNotify"
          >
          </b-input>
        </b-field>

        <b-field
          label="密码"
          :message="notify.password"
          :type="notify.password.length > 0 ? 'is-danger' : ''"
        >
          <b-input
            v-model="forms.password"
            type="password"
            password-reveal
            placeholder="密码"
            @focus="clearNotify"
          >
          </b-input>
        </b-field>

        <b-field
          label="用户名"
          :message="notify.username"
          :type="notify.username.length > 0 ? 'is-danger' : ''"
        >
          <b-input
            v-model="forms.username"
            placeholder="可以被用来登录"
            @focus="clearNotify"
          >
          </b-input>
        </b-field>
        <div class="tips">
          <a @click="mode = 0">登录</a> <a @click="mode = 2">重设密码</a>
        </div>
      </template>
      <template v-if="mode == 2">
        <b-field
          label="用户名或邮箱"
          :message="notify.username"
          :type="notify.username.length > 0 ? 'is-danger' : ''"
        >
          <b-input v-model="forms.username" type="text" placeholder="用户名">
          </b-input>
        </b-field>

        <div class="tips">
          <a @click="mode = 0">登录</a> <a @click="mode = 1">注册</a>
        </div>
      </template>
      <Turnstile
        :sitekey="sitekey"
        v-on:verify="onCaptchaResponse"
        v-on:expire="onCaptchaExpired"
        v-on:fail="onCaptchaFailed"
      />
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <b-button label="关闭" @click="$emit('close')" />
      <b-button
        :label="titles[mode]"
        type="is-primary"
        @click="handle"
        :loading="loading"
      />
    </footer>
  </div>
</template>

<script>
import validate from "validate.js";
import CONFIG from "@/config.json";
import Turnstile from "@/components/turnstile";
import qs from "qs";
import {
  setAccessToken,
  setRefreshToken,
  clearAccountInformation,
} from "@/utils/account";

validate.validators.password = function (value, options) {
  if (value.length < options) {
    return "密码强度不够，再长一点";
  }
};

export default {
  name: "Login",
  components: {
    Turnstile,
  },
  data() {
    return {
      mode: 0,
      titles: ["登录", "注册", "重设密码"],
      loading: false,
      captchaToken: "",
      sitekey: CONFIG.CAPTCHA_SITEKEY,
      forms: {
        username: "",
        password: "",
        email: "",
      },
      notify: {
        username: "",
        password: "",
        email: "",
      },
      constraints: {
        register: {
          username: {
            presence: true,
            format: {
              pattern: "^[a-zA-Z0-9]+$",
              message: "用户名格式有误，应仅包含英文和数字",
            },
          },
          password: {
            presence: true,
            password: 6,
          },
          email: {
            presence: true,
            email: {
              message: "邮箱格式有误，请检查修正后再次尝试",
            },
          },
        },
      },
    };
  },
  watch: {
    mode() {
      Object.keys(this.forms).forEach((key) => {
        this.forms[key] = "";
      });
      this.loading = false;
      this.clearNotify();
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    handle() {
      if (!this.captchaToken) {
        this.$buefy.toast.open({
          message: "未完成人机交互验证，请检查你的页面是否完成了加载。",
          duration: 10000,
          type: "is-success",
        });
        return;
      }
      this.loading = true;
      let info;
      switch (this.mode) {
        case 0:
          info = validate.single(this.forms.username, {
            presence: true,
            email: true,
          });
          if (info) {
            info = validate.single(this.forms.username, {
              presence: true,
              format: { pattern: "^[a-zA-Z0-9]+$" },
            });
            if (info) {
              this.notify.username = "格式有误，应仅包含英文和数字";
              this.loading = false;
              return;
            }
          }
          info = validate.single(this.forms.password, {
            presence: true,
            password: 6,
          });
          if (info) {
            this.notify.password = info[0];
            this.loading = false;
            return;
          }
          this.handleLogin();
          break;
        case 1:
          info = validate.validate(this.forms, this.constraints.register);
          if (info) {
            this.toNotify(info);
            this.loading = false;
            return;
          }
          this.handleRegister();
          break;
        case 2:
          info = validate.single(this.forms.username, {
            presence: true,
            email: true,
          });
          if (info) {
            info = validate.single(this.forms.username, {
              presence: true,
              format: { pattern: "^[a-zA-Z0-9]+$" },
            });
            if (info) {
              this.notify.username = "格式有误，应仅包含英文和数字";
              this.loading = false;
              return;
            }
          }
          this.handleReset();
          break;
      }
    },
    handleLogin() {
      let isEmail = true;
      let info = validate.single(this.forms.username, {
        presence: true,
        email: true,
      });
      if (info) {
        isEmail = false;
      }
      const data = {
        "turnstile-response": this.captchaToken,
        password: this.forms.password,
      };
      if (isEmail) {
        data["email"] = this.forms.username;
      } else {
        data["username"] = this.forms.username;
      }
      this.axios
        .post(CONFIG.SHUGETSU_SOFT_API + "user/login", qs.stringify(data))
        .then((response) => {
          clearAccountInformation();
          setRefreshToken(response.data.refresh_token);
          setAccessToken(response.data.access_token);
          this.$buefy.toast.open({
            message: "登录成功。",
            duration: 10000,
            type: "is-success",
          });
          setTimeout(() => {
            this.$router.go(0);
          }, 2000);
          this.loading = false;
        })
        .catch((e) => {
          this.$buefy.notification.open({
            duration: 5000,
            message: e.response.data.err,
            type: "is-danger",
          });
          this.loading = false;
        });
    },
    handleRegister() {
      const data = {
        "turnstile-response": this.captchaToken,
        username: this.forms.username,
        password: this.forms.password,
        email: this.forms.email,
      };
      this.axios
        .post(CONFIG.SHUGETSU_SOFT_API + "user/register", qs.stringify(data))
        .then(() => {
          this.$buefy.toast.open({
            message: "注册成功。请查看您的收件箱，按指示激活账户后再次登录。",
            duration: 10000,
            type: "is-success",
          });
          this.loading = false;
          this.mode = 0;
        })
        .catch((e) => {
          this.$buefy.notification.open({
            duration: 5000,
            message: e.response.data.err,
            type: "is-danger",
          });
          this.loading = false;
        });
    },
    handleReset() {
      let isEmail = true;
      let info = validate.single(this.forms.username, {
        presence: true,
        email: true,
      });
      if (info) {
        isEmail = false;
      }
      const data = {
        "turnstile-response": this.captchaToken,
      };
      if (isEmail) {
        data["email"] = this.forms.username;
      } else {
        data["username"] = this.forms.username;
      }
      this.axios
        .post(CONFIG.SHUGETSU_SOFT_API + "user/reset", qs.stringify(data))
        .then(() => {
          this.$buefy.toast.open({
            message: "重设密码请求已经发送。请查看您的收件箱，按指示进行操作。",
            duration: 10000,
            type: "is-success",
          });
          this.loading = false;
          this.mode = 0;
        })
        .catch((e) => {
          this.$buefy.notification.open({
            duration: 5000,
            message: e.response.data.err,
            type: "is-danger",
          });
          this.loading = false;
        });
    },
    onCaptchaResponse(res) {
      this.captchaToken = res;
    },
    onCaptchaExpired() {
      this.captchaToken = "";
    },
    onCaptchaFailed() {
      this.captchaToken = "";
    },
    toNotify(info) {
      for (const [key, value] of Object.entries(info)) {
        this.notify[key] = value[0];
      }
    },
    clearNotify() {
      Object.keys(this.notify).forEach((key) => {
        this.notify[key] = "";
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tips {
  font-size: small;
  text-align: right;

  a:nth-child(1n + 1) {
    margin-left: 10px;
  }
}
</style>
