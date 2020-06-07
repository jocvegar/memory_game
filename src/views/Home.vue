<template>
  <div class="home">
    <transition name="fade">
      <p v-if="showSuccess" class="success">
        profile updated!
      </p>
    </transition>
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    {{userProfile}}
     <h4>user profile</h4>
    <button @click="updateScore" class="button">update Score</button>
   
    <transition name="fade">
      <div v-if="userProfile == null">
        <form @submit.prevent>
          <label for="first_name">First Name</label>
          <input v-model.trim="signupForm.first_name" type="text" placeholder="Jack"
          id="first_name" />

          <label for="last_name">Last Name</label>
          <input v-model.trim="signupForm.last_name" type="text" placeholder="Reaper"
          id="last_name" />

          <button @click.prevent="createProfile" class="button">
            Save
          </button>

        </form>
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { mapState } from "vuex";
const fb = require("@/firebaseConfig.js");

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      signupForm: {
        first_name: "",
        last_name: "",
      },
      showSuccess: false
    }
  },
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  methods: {
    updateScore() {
      fb.usersCollection
        .doc(this.currentUser.uid)
        .set({
          high_score: "1000",
        })
        .catch(err => {
          console.log(err);
        });
    },
    createProfile() {
      this.$store.dispatch("createProfile", {
        first_name: this.signupForm.first_name,
        last_name: this.signupForm.last_name,
      });
      this.first_name = "";
      this.last_name = "";
      this.showSuccess = true;

      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
    }
  }
}
</script>
