<template>
  <div class="reg">
    <form>
      <p>組織名</p>
      <input type="text" v-model="companyName" />
      <p>管理者名</p>
      <input type="text" v-model="userName" />
      <p>メールアドレス</p>
      <input type="text" v-model="email" />
      <p>苗字</p>
      <input type="text" v-model="lastName" />
      <p>名前</p>
      <input type="text" v-model="firstName" />
    </form>
    <button @click="signup">登録</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      companyName: null,
      userName: null,
      email: null,
      firstName: null,
      lastName: null
    };
  },
  methods: {
    signup() {
      console.log("call signup");
      if (!(this.companyName || this.userName)) {
        alert(
          "User name and company name are required. Please enter these values."
        );
      } else {
        const tenant = {
          tenantId: "",
          userId: "",
          companyName: this.companyName,
          accountName: this.companyName,
          ownerName: this.email,
          tier: "",
          email: this.email,
          userName: this.email,
          role: "",
          firstName: this.firstName,
          lastName: this.lastName
        };

        axios
          .post(
            "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/tenantReg",
            tenant
          )
          .then(function(data) {
            console.log("tenant Registration success");
            console.log(data);
          })
          .catch(function(response) {
            console.log("tenant Registration failed");
            console.log(response);
          });
      }
    }
  }
};
</script>
