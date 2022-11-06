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
      <div
        id="m-captcha"
        data-sitekey="4"
        data-invisible="true"
        ref="mcaptcha"
      ></div>
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
  components: {},
  data() {
    return {
      mode: 0,
      titles: ["登录", "注册", "重设密码"],
      siteKey: CONFIG.CAPTCHA_SITEKEY,
      loading: false,
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
              message: "用户名必须只包含英文和数字",
            },
          },
          password: {
            presence: true,
            password: 6,
          },
          email: {
            presence: true,
            email: {
              message: "邮箱不正确",
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
  mounted() {
    this.$refs.mcaptcha.setAttribute("data-sitekey", () => {
      switch (window.location.hostname) {
        case "pixivel.moe":
          return 4;
        case "pixivel.art":
          return 5;
      }
    });
    window.mcaptcha.init();
    window.mcaptcha.solve((token) => {
      this.captchaResolve(token);
    });
  },
  beforeDestroy() {
    window.mcaptcha.destroy();
    window.mcaptcha.solve((token) => {
      console.log(token);
    });
  },
  methods: {
    handle() {
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
              this.notify.username = "格式不正确";
              this.loading = false;
              break;
            }
          }
          info = validate.single(this.forms.password, {
            presence: true,
            password: 6,
          });
          if (info) {
            this.notify.password = info[0];
            this.loading = false;
            break;
          }
          window.mcaptcha.trigger();
          break;
        case 1:
          info = validate.validate(this.forms, this.constraints.register);
          if (info) {
            this.toNotify(info);
            this.loading = false;
            break;
          }
          window.mcaptcha.trigger();
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
              this.notify.username = "格式不正确";
              this.loading = false;
              break;
            }
          }
          window.mcaptcha.trigger();
          break;
      }
    },
    captchaResolve(token) {
      switch (this.mode) {
        case 0:
          this.handleLogin(token);
          break;
        case 1:
          this.handleRegister(token);
          break;
        case 2:
          this.handleReset(token);
          break;
      }
    },
    handleLogin(token) {
      let isEmail = true;
      let info = validate.single(this.forms.username, {
        presence: true,
        email: true,
      });
      if (info) {
        isEmail = false;
      }
      const data = {
        "h-captcha-response": token,
        password: this.forms.password,
      };
      if (isEmail) {
        data["email"] = this.forms.username;
      } else {
        data["username"] = this.forms.username;
      }
      this.axios
        .post(CONFIG.AUTHUGETSU_API + "user/login", qs.stringify(data))
        .then((response) => {
          clearAccountInformation();
          setRefreshToken(response.data.refresh_token);
          setAccessToken(response.data.access_token);
          this.$buefy.toast.open({
            message: "登录成功！耶！",
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
    handleRegister(token) {
      const data = {
        "h-captcha-response": token,
        username: this.forms.username,
        password: this.forms.password,
        email: this.forms.email,
      };
      this.axios
        .post(CONFIG.AUTHUGETSU_API + "user/register", qs.stringify(data))
        .then(() => {
          this.$buefy.toast.open({
            message: "注册成功！请查收您的邮件~",
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
    handleReset(token) {
      let isEmail = true;
      let info = validate.single(this.forms.username, {
        presence: true,
        email: true,
      });
      if (info) {
        isEmail = false;
      }
      const data = {
        "h-captcha-response": token,
      };
      if (isEmail) {
        data["email"] = this.forms.username;
      } else {
        data["username"] = this.forms.username;
      }
      this.axios
        .post(CONFIG.AUTHUGETSU_API + "user/reset", qs.stringify(data))
        .then(() => {
          this.$buefy.toast.open({
            message: "重设密码请求已经发送到邮箱！请查收您的邮件~",
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
