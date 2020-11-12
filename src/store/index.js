import Vue from 'vue'
import Vuex from 'vuex'
const fb = require("@/firebaseConfig.js");

Vue.use(Vuex)

fb.auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    store.commit("setCurrentUser", firebaseUser);
    store.dispatch("fetchUserProfile");

    fb.usersCollection.doc(firebaseUser.uid).onSnapshot(doc => {
      store.commit("setUserProfile", Object.assign({id: doc.id}, doc.data()));
    });
  }
});

export const store =  new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
    },
    fetchUserProfile({ commit, state }) {
      fb.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", Object.assign({id: res.id}, res.data()));
        })
        .catch(err => {
          console.log(err);
        });
    },
    // updateProfile({ state }, data) {
    //   let first_name = data["first_name"];
    //   let last_name = data.last_name;

    //   fb.usersCollection
    //     .doc(state.currentUser.uid)
    //     .update({ first_name: first_name, last_name: last_name })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    createProfile({ state }, data) {
      // let first_name = data["first_name"];
      let username = data.username;

      fb.usersCollection
        .doc(state.currentUser.uid)
        .set({ username: username })
        .catch(err => {
          console.log(err);
        });
    }
  },
})
