<template>
    <div>
        <div>
            HOLA {{name}}
        </div>
        <br>
        <div>
            Mounted data {{mountedData}}
        </div>
        <br>
        <div>
            <!-- currentUserState: {{currentUser.email}} -->
        </div>
        <br>
        <div>
            <!-- currentUserFB: {{users}} -->
        </div>
        <br>
        <!-- <div v-for="city in cities" :key="city.id">
                <li>{{city}}</li>
        </div> -->
        <br>
        <div>
            <!-- algo: {{algo}} -->
            correo: {{correo}}
        </div>
        <br>
        <div>
            city: {{city}}
        </div>
        <button @click="updateCity">
            ClickME
        </button>
    </div>
</template>

<script>
import { mapState } from "vuex";
const { db, fb } = require("@/firebaseConfig.js");

export default {
    name: "test",
    data() {
        return {
            name: "JOSE",
            mountedData: "",
            currentUserFB: {},
            users: null,
            cities: null,
            algo: null,
            city: {},
            correo: null
        }
    },
    async mounted() {
        this.mountedData = "I was mounted"
        this.getCity();

        this.$binding("users", db.collection("users"))
        .then((users) => {
            let names = []
            users.forEach(user => {
                names.push(user.username)
            })
            this.algo = names 
        })
    },
    computed: {
        ...mapState(["currentUser"]),
    },
    firestore () {
        return {
            // Collection
            users: db.collection('users'),
            // Doc
            cities: db.collection('cities'),
            // Doc
            correo: db.collection('cities').doc('WeWEb075b1LDwxZ4I73x')
        }
    },
    methods: {
        async getCity() {

            // var cityRef = db.collection('users').doc('BJ');

            // var setWithMerge = cityRef.set({
            //     capital: true
            // }, { merge: true });
            let _this = this
            let ciudad = db.collection("cities").doc('WeWEb075b1LDwxZ4I73x');

            ciudad.get().then(function(doc) {

                _this.city = doc.data();

            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        },
        updateCity() {
            let _this = this
            let ciudad = db.collection("cities").doc('WeWEb075b1LDwxZ4I73x');
            console.log("ciudad ", ciudad)
            ciudad.update({
                alerta: "resorte"
            })
        }
    }
}
</script>
