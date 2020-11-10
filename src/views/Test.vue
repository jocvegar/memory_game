<template>
    <div>
        <div>
            HOLA {{userProfile.username}}
            <br>
            <br>
            Monto en gift cards: {{totalAmount}}
            <hr>
            <button @click="sendGiftCard()">
                Enviar 100 a JOSE
            </button>
             <button @click="useFromGifCards()">
                Gastar 100
            </button>
            
            <ul>
                <li v-for="(item, idx) in sortedLedger" :key="idx" 
                    :class="item.type == 'withdrawal' ? 'withdrawal' : 'giftCard'">
                    {{ item.amount}} | {{ item.createdAt | moment().toDate() }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
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
    }
}
</script>

<style lang="scss" scoped>
.withdrawal {
    background: lightcoral;
}
.giftCard {
    background: lightgreen;
}
</style>>
