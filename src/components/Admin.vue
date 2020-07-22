<template>
  <div class="admin">
    <div>管理者のページです</div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      role: "TenantCoach",
      userName: null,
      email: null,
      firstName: null,
      lastName: null
    };
  },
  methods: {
    addUser() {
      //   var _this = this;
      console.log(this.$store.state.decodedToken);
      const params = {
        Role: this.role,
        UserName: this.userName,
        Email: this.userName,
        FirstName: this.firstName,
        LastName: this.lastName,
        TenantId: this.$store.state.decodedToken["custom:tenant_id"]
      };
      console.log(params);
      axios
        .post(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/cognitoUser",
          params
        )
        .then(function(data) {
          console.log(data);
          console.log("Registration success");
        })
        .catch(function(response) {
          console.log("Registration failed");
          console.log(response);
        });
    }
  }
};
</script>