<template>
  <div>
    <div id="edit_user_profile">
      <div>
        <h3>{{email}}</h3>
      </div>
      <div>
        <label>苗字</label>
        <input type="text" name="firstName" v-model="lastName" />
      </div>
      <div>
        <label>名前</label>
        <input type="text" name="lastName" v-model="firstName" />
      </div>
      <div>
        <label>役割</label>
        <select v-model="role">
          <option :value="role" selected>{{role}}</option>
          <option value="TenantAdmin" v-if="role !== 'TenantAdmin'">TenantAdmin</option>
          <option value="TenantCoach" v-if="role !== 'TenantCoach'">TenantCoach</option>
        </select>
      </div>
    </div>
    <button @click="upDataUserAttribute">change attribute</button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      firstName: null,
      lastName: null,
      role: null,
      email: null,
      userId: null
    };
  },
  mounted() {
    const coach = this.$route.params.coachId;
    console.log(coach);
    this.firstName = coach.FirstName;
    this.lastName = coach.LastName;
    this.role = coach.Role;
    this.email = coach.Email;
    this.userId = coach.UserId;
  },
  methods: {
    upDataUserAttribute() {
      const _this = this;
      console.log("send put coach request");
      const params = {
        role: this.role,
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.email,
        userId: this.userId,
        tenantId: _this.$store.state.decodedToken["custom:tenant_id"]
      };
      console.log(params);
      axios
        .put(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/cognitoUser",
          params
        )
        .then(response => {
          console.log("put coach data success");
          console.log(response.data);
        });
    }
  }
};
</script>