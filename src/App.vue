<template>
  <div id="app">
    <div v-if="currentUser" id="nav">
      <router-link to="/">Home</router-link> |
      <a @click="logout">Logout</a>
    </div>
    <router-view/>
  </div>
</template>

<script>
const fb = require("@/firebaseConfig.js");
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["currentUser"])
  },
  methods: {
    logout() {
      fb.auth.signOut()
        .then(() => {
          this.$store.dispatch("clearData");
          this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
