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
            currentUserState: {{currentUser.email}}
        </div>
        <br>
        <div>
            <!-- users: {{users}} -->
        </div>
        <br>
        <!-- <div v-for="city in cities" :key="city.id">
                <li>{{city}}</li>
        </div> -->
        <br>
        <div>
            <!-- algo: {{algo}} -->
            cityFirestore: {{cityFirestore}}
        </div>
        <br>
        <div>
            <!-- city: {{city}} -->
            <!-- cities_count: {{cities_count}} -->

            userCount: {{userCount}}
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
            // users: null,
            // cities: null,
            algo: null,
            city: {},
            // cities_count: 0
        }
    },
    async mounted() {
        this.mountedData = "I was mounted"
        // this.getCity();

        // this.$binding("ciudades", db.collection("cities"))
        // .then((ciudades) => {
        //     let _ciudades = []
        //     ciudades.forEach(ciudad => {
        //         _ciudades.push(ciudad)
        //     })
        //     console.log("_ciudades", _ciudades.length)
        //     this.cities_count = _ciudades.length
        // })

        // db.collection('cities').onSnapshot(snap => {
        //     let foo = [];
        //     snap.forEach(doc => {
        //         foo.push(doc)
        //     });
        //     this.cities_count = foo.length
        // });
    },
    computed: {
        ...mapState(["currentUser"]),
        userCount: function() {
            return this.miercolesUsers.length;
        }
    },
    firestore () {
        return {
            // Collection
            miercolesUsers: db.collection('users'),
            // Doc
            cities: db.collection('cities'),
            // Doc
            cityFirestore: db.collection('cities').doc('WeWEb075b1LDwxZ4I73x')
        }
    },
    methods: {
        // async getCity() {

        //     // var cityRef = db.collection('users').doc('BJ');

        //     // var setWithMerge = cityRef.set({
        //     //     capital: true
        //     // }, { merge: true });
        //     let _this = this
        //     let ciudad = db.collection("cities").doc('WeWEb075b1LDwxZ4I73x');

        //     ciudad.get().then(function(doc) {

        //         _this.city = doc.data();

        //     }).catch(function(error) {
        //         console.log("Error getting document:", error);
        //     });
        // },
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
