<template>
  <div>
    <Admin v-if="isTenantAdmin()"></Admin>
    <Coach v-if="isUser()"></Coach>
    <div id="add_user">
      <h2>ユーザー作成</h2>
      <div>
        <div>
          <label>メールアドレス</label>
          <input type="email" name="userName" v-model="userName" />
        </div>
        <div>
          <label>苗字</label>
          <input type="text" name="firstName" v-model="firstName" />
        </div>
        <div>
          <label>名前</label>
          <input type="text" name="lastName" v-model="lastName" />
        </div>
        <div>
          <label>役割</label>
          <input type="text" name="role" v-model="role" />
        </div>
        <div class="form-actions">
          <button @click="addUser" class="btn btn-primary">作成</button>
        </div>
      </div>
    </div>
    <div id="coach_list">
      <h2>Coach List</h2>
      <h3 v-if="coachList[0] === null">not found</h3>
      <ul>
        <li v-for="(coach, index) in coachList" :key="index" class="coach">
          <h3>coach name: {{coach.LastName}} {{coach.FirstName}}</h3>
          <p @click="deleteCognitoUser(coach)">coach delete</p>
          <button @click="$router.push({name: 'EditCoach', params: {coachId: coach}})">edit</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Admin from "../components/Admin.vue";
import Coach from "../components/Coach.vue";

export default {
  data() {
    return {
      role: "TenantCoach",
      userName: null,
      email: null,
      firstName: null,
      lastName: null,
      coachList: []
    };
  },
  components: {
    Admin,
    Coach
  },
  async mounted() {
    var _this = this;
    axios.interceptors.request.use(function(config) {
      const token = _this.$store.state.token;
      config.headers.Authorization = token;
      return config;
    });

    await this.getTenantCoachList();
  },
  methods: {
    isTenantAdmin() {
      return this.$store.state.decodedToken["custom:role"] === "TenantAdmin";
    },
    isUser() {
      return this.$store.state.decodedToken["custom:role"] === "TenantCoach";
    },
    addUser() {
      var _this = this;
      console.log(this.$store.state.decodedToken);
      console.log(this.$store.state.token);
      const params = {
        role: this.role,
        userName: this.userName,
        email: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        tenantId: this.$store.state.decodedToken["custom:tenant_id"]
      };
      console.log(params);
      axios
        .post(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/cognitoUser",
          params
        )
        .then(function(response) {
          console.log("user Registration success");
          console.log(response);
          console.log(response.data);
          _this.coachList.push(response.data);
        })
        .catch(function(err) {
          console.log("user Registration failed");
          console.log(err);
        });
    },
    getTenantCoachList() {
      console.log("send get coach list");
      axios
        .get(
          "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/tenant-user-list"
        )
        .then(response => {
          console.log("get coach list success");
          response.data.forEach(coachData => {
            this.coachList.push(coachData);
          });
        });
    },
    deleteCognitoUser(coach) {
      const _this = this;
      let adminCount = 0;
      if (coach.Role === "TenantAdmin") {
        this.coachList.forEach(c => {
          if (c.Role === "TenantAdmin") {
            adminCount++;
          }
          if (adminCount >= 2) {
            return;
          }
        });
      }
      if (adminCount === 1) {
        alert("これ以上管理者を削除することはできません！！");
        return;
      } else {
        console.log("send delete coach request");
        console.log(coach);
        const params = {
          userId: coach.UserId,
          email: coach.Email,
          tenantId: _this.$store.state.decodedToken["custom:tenant_id"]
        };
        console.log(params);
        axios
          .delete(
            "https://ykh1tuzxq3.execute-api.ap-northeast-1.amazonaws.com/Prod/v1/cognito-user",
            { data: params }
          )
          .then(response => {
            console.log("delete coach success");
            console.log(response.data);

            let i = this.coachList.length;
            while (i--) {
              if (this.coachList[i].UserId === coach.UserId) {
                this.coachList.splice(i, 1);
              }
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.coach {
  display: flex;
  justify-content: space-around;
  cursor: pointer;
}
</style>