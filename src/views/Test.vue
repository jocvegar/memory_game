<template>
    <div class="container">
        <h4 class="text-center">Monto en gift cards {{totalAmount}}</h4>
        <div class="d-flex justify-content-around my-5">
            <button 
                type="button" 
                class="btn btn-success"
                @click="sendGiftCard()">Enviar 100 a JOSE</button>
            <button 
                type="button" 
                class="btn btn-danger"
                @click="useFromGifCards()">Gastar 100</button>
        </div>

        <table class="table">
            <thead class="thead-dark">
                <tr>
                <th scope="col">#</th>
                <th scope="col">Monton</th>
                <th scope="col">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in sortedLedger" :key=idx 
                    :class="item.type == 'withdrawal' ? 'red' : '' ">
                    <th scope="row">{{idx + 1}}</th>
                    <td>{{item.amount}}</td>
                    <td>{{item.createdAt.toDate() | moment}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
// calls to db:
// get user ledger by userID     (1)
// get allUsers to gift          (1)
// write (debit or credit)       (1)
// _________________________________
// TOTAL:                        (3)
// * no final balance saved on user doc
// * final balance must be calcuted each time
// * by difference between credits and debits
// * better if always showing a ledger
// * more data manipulation
import { mapState } from "vuex";
import moment from "moment"
const { db, firebase } = require("@/firebaseConfig.js");
export default {
    name: "test",
    data() {
        return {
            name: "JOSE",
            withdrawals: [],
            giftCardsReceived: [],
            giftCardLedger: {},
            isMessage: false,
            message: ""
        }
    },
    async mounted() {
        db.collection("giftCardLedger").where("user_id", "==", this.currentUser.uid)
        .onSnapshot(querySnapshot => {
            if(!querySnapshot.empty) {
                this.giftCardLedger = Object.assign({id: querySnapshot.docs[0].id}, querySnapshot.docs[0].data())
                this.giftCardsReceived = this.giftCardLedger.giftCardsReceived
                this.withdrawals = this.giftCardLedger.withdrawals
            }
        });
    },
    computed: {
        ...mapState(["currentUser", "userProfile"]),
   
        totalAmount: function() {
            let giftCardsAmount = 0 
            let withdrawlsAmount = 0 
            
            this.giftCardsReceived.forEach(giftCard => {
                giftCardsAmount += giftCard.amount
            })

            this.withdrawals.forEach(withdrawal => {
                withdrawlsAmount += withdrawal.amount
            })
            return giftCardsAmount - withdrawlsAmount
        },
        ledger: function() {
            let ledgerArray = []
           
            this.withdrawals.forEach((withdrawal) => {
                ledgerArray.push({
                    "type": "withdrawal",
                    "amount": withdrawal.amount,
                    "createdAt": withdrawal.createdAt
                }) 
            })

            this.giftCardsReceived.forEach((giftCard) => {
                ledgerArray.push({
                    "type": "giftCard",
                    "amount": giftCard.amount,
                    "createdAt": giftCard.createdAt
                }) 
            })
            return ledgerArray
        },
        sortedLedger: function() {
            return this.ledger.slice().sort((a, b) => b.createdAt - a.createdAt)
        }
    },
    // firestore () {
    //     // return {
    //     //     // // Doc
    //     //     // cities: db.collection('cities'),
    //     //     // // Doc
    //     //     // cityFirestore: db.collection('cities').doc('WeWEb075b1LDwxZ4I73x')
    //     // }
    // },
    methods: {
        sendGiftCard() {
            db.collection("giftCardLedger").doc(this.giftCardLedger.id).update({
                giftCardsReceived: firebase.firestore.FieldValue.arrayUnion({
                    amount: 50,
                    createdAt: new Date(),
                    fromUserId: this.currentUser.uid,
                    productId: "product_id",
                })
            }).then(() => {
                this.isMessage = true
                this.message = "saved"
            })
        },
        useFromGifCards() {
            if(100 < this.totalAmount) {
                db.collection("giftCardLedger").doc(this.giftCardLedger.id).update({
                    withdrawals: firebase.firestore.FieldValue.arrayUnion({
                        amount: 100,
                        createdAt: new Date(),
                    })
                }).then(() => {
                    this.isMessage = true
                    this.message = "saved"
                })
            } else {
                this.isMessage = true
                this.message = "solo puedes gasta 10"
            }
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).format('LLLL')
        }
    },
}
</script>

<style lang="scss" scoped>
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css";
.red {
    background-color: lightcoral;
}
</style>>
