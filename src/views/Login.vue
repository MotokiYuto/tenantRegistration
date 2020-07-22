<template>
  <div>
    <h2>ログイン</h2>
    <div name="form">
      <div class="form-gro">
        <label for="username">メールアドレス</label>
        <input type="text" name="username" id="username" class="form-control" v-model="userName" />
      </div>
      <div class="form-group">
        <label for="password">パスワード</label>
        <input
          type="password"
          name="password"
          id="password"
          class="form-control"
          v-model="password"
        />
      </div>
      <p>テナント：{{tenantId}}</p>
      <div class="form-actions">
        <button @click="login" type="submit" class="btn btn-primary">ログイン</button>
        <button @click="$router.push('/registration')">登録ページへ</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import jwt from "jsonwebtoken";
export default {
  data() {
    return {
      userName: "",
      password: "",
      tenantId: "Tenant_a6f560e562e24237bc81935cab4dda27"
    };
  },
  methods: {
    login() {
      var _this = this;
      console.log("send");
      const user = {
        userName: this.userName,
        password: this.password,
        tenantId: this.tenantId
      };
      axios
        .post(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/user-login",
          user
        )
        .then(function(response) {
          console.log(response);
          console.log("Registration success");
          if (response.data.newPasswordRequired) {
            _this.$router.replace({ path: "/ChangePassword" });
          } else {
            if (!response.data.token) {
              return console.error("error");
            } else {
              console.log("get token success");
              // jwt token decode
              const decodeJwt = token => {
                const base64Url = token.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                return JSON.parse(
                  decodeURIComponent(escape(window.atob(base64)))
                );
              };
              const bearerToken = response.data.token;
              const accessToken = response.data.access;
              var decodedToken = decodeJwt(bearerToken);
              var decodedAccessToken = decodeJwt(accessToken);
              const userDisplayName =
                decodedToken["family_name"] + " " + decodedToken["given_name"];
              const userRole = decodedToken["custom:role"];
              console.log(response.data);
              console.log(decodedToken);
              console.log(decodedAccessToken);
              console.log(userDisplayName);
              console.log(userRole);
              _this.$store.dispatch("getDecodedToken", decodedToken);
              _this.$store.dispatch("getToken", response.data.token);
              _this.$router.replace({ path: "/" });
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>