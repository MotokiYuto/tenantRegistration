<template>
  <div class="col-md-8 col-md-offset-1">
    <h3>ログイン成功!</h3>
    <p>パスワードの設定をお願いします</p>
    <div>
      <div>
        <label>メールアドレス</label>
        <input type="text" name="currentPassword" v-model="userName" />
      </div>
      <div>
        <label>現在の仮パスワード</label>
        <input type="password" name="currentPassword" v-model="password" />
      </div>
      <div>
        <label for="newPassword">新しいパスワード</label>
        <input type="password" name="newPassword" v-model="newPassword" />
      </div>
      <!-- <div>
        <label>パスワード再入力</label>
        <input />
      </div>-->
      <div class="form-actions">
        <button @click="changePassword" class="btn btn-primary">設定完了</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      userName: "",
      password: "",
      newPassword: "",
      tenantId: "Tenant_a6f560e562e24237bc81935cab4dda27"
    };
  },
  methods: {
    changePassword() {
      var _this = this;
      console.log("send new password");
      const user = {
        userName: this.userName,
        password: this.password,
        newPassword: this.newPassword,
        tenantId: this.tenantId
      };
      console.log(user);
      axios
        .post(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/user-login",
          user
        )
        .then(response => {
          console.log(response);
          console.log("Registration success");
          if (response.data.newPasswordRequired) {
            _this.$router.replace({ path: "/ChangePassword" });
          } else {
            if (!response.data.token) {
              return console.error("token is undefined");
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
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>