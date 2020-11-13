<template>
    <div class="container">
        <!-- {{userledger}} -->
        <h4 class="text-center">Monto en gift cards {{userProfile.giftCardBalance}}</h4>
        <div class="d-flex justify-content-around my-5">
            <button 
                type="button" 
                class="btn btn-success"
                @click="sendGiftCard()">Agregar 500</button>
            <button 
                type="button" 
                class="btn btn-danger"
                @click="useGiftCard()">Usar 500</button>
        </div>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                <th scope="col">#</th>
                <th scope="col">Balance inicial</th>
                <th scope="col">Crédito</th>
                <th scope="col">Débito</th>
                <th scope="col">Balance final</th>
                <th scope="col">De quien</th>
                <th scope="col">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in userledger" :key=idx :class="item.debit ? 'red' : '' ">
                    <th scope="row">{{idx + 1}}</th>
                    <td>{{item.startBalance}}</td>
                    <td>{{item.credit}}</td>
                    <td>{{item.debit}}</td>
                    <td>{{item.finalBalance}}</td>
                    <td>{{item.fromUserId}}</td>
                    <td>{{item.createdAt.toDate() | moment}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// calls to db:
// get user ledgers by userID    (1)
// get allUsers to gift          (1)
// write (debit or credit)       (1)
// write latest balance to user  (1)
// _________________________________
// TOTAL:                        (4)

// * final balance saved on user doc
// * better if unique value wants to be showed to user
// * less data manipulation
import { mapState } from "vuex";
import moment from "moment"
const { db, firebase } = require("@/firebaseConfig.js");
export default {
    
    name: "test2",
    data() {
        return {
            userledger: [],
            // lastMovement: {},
            test: null
        }
    },
    created() {
        // this.fetchDB()
        this.onSnapFetch()
        // this.$store.dispatch("fetchAllUsers");
    },
    mounted() {
        setTimeout(() => {
            this.test = this.userledger[0]
        }, 1000);
    },
    computed: {
        ...mapState(["currentUser", "userProfile", "allUsers"]),
    },
    methods: {
        async sendGiftCard() {
            const userFinalBalance = this.test.finalBalance + 500
            db.collection('giftCardsLedger2').add({
                credit: 500,
                createdAt: new Date(),
                userId: this.currentUser.uid,                
                fromUserId: this.currentUser.uid,  
                startBalance: this.test.finalBalance,
                finalBalance: userFinalBalance,
            }).then((doc) => {
                // this.fetchDB()
                this.updateUserFinalBalance(userFinalBalance)
            }).catch((error) => {
                console.log("error ", error)
            })
        },
        useGiftCard() {
            const userFinalBalance = this.test.finalBalance - 500
            db.collection('giftCardsLedger2').add({
                debit: 500,
                createdAt: new Date(),
                userId: this.currentUser.uid,                
                fromUserId: this.currentUser.uid,  
                startBalance: this.test.finalBalance,
                finalBalance: userFinalBalance,
            }).then(() => {
                // this.fetchDB()
                this.updateUserFinalBalance(userFinalBalance)
            }).catch((error) => {
                console.log("error ", error)
            })
        },
        updateUserFinalBalance(balance) {
            db.collection('users').doc(this.userProfile.id).update({
                giftCardBalance: balance
            })
        },
        fetchDB() {
            db.collection('giftCardsLedger2')
            .where("userId", "==", this.currentUser.uid)
            .orderBy("createdAt", "desc")
            .get()
            .then((querySnapshot) => {
                if(!querySnapshot.empty) {
                    let movements = []
                    querySnapshot.forEach(function(doc) {
                        movements.push(doc.data())
                    });
                    this.userledger = movements
                    this.lastMovement = movements[0]
                } else {
                    db.collection('giftCardsLedger2').add({
                        credit: 0,
                        createdAt: new Date(),
                        userId: this.currentUser.uid,                
                        fromUserId: this.currentUser.uid,  
                        startBalance: 0,
                        finalBalance: 0
                    }).then(()=> {
                        // this.fetchDB()
                    }).catch((error) => {
                        console.log("error ", error)
                    })
                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        },
        onSnapFetch() {
            db.collection('giftCardsLedger2')
            .where("userId", "==", this.currentUser.uid)
            .orderBy("createdAt", "desc")
            .onSnapshot(querySnapshot => {
                var movements = [];
                querySnapshot.forEach(function(doc) {
                    movements.push(doc.data());
                });
                this.userledger = movements
            });
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).format('LLLL')
        }
    },
}
</script>

<style>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css";
.red {
    background-color: lightcoral;
}
</style>
