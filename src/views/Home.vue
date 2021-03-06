<template>
	<div id="home">
		<transition name="fade">
			<p v-if="showSuccess" class="success">
				Profile updated!
			</p>
		</transition>

		<section class="title">
			<h4 class="text-center">Memory Game</h4>
		</section>

		<div v-if="level == 0">
			<section class="welcome">
				<h5>Rules:</h5>
				<p>No cheating!</p>
				<p>You get 2 tries</p>
				<br>
				<button @click="toggleStart" class="button-success">
					Start!
				</button>
			</section>
			<section v-if="userProfile && userProfile.level" class="score">
				highest level: {{userProfile.level}}
			</section>
		</div>
		<div v-else>
			<section class="game">
				<div v-if="hint">
					<h3>{{animatedNumber}}</h3>
					<br>
					<button @click="hint = false" class="button-success">
						OK
					</button>
				</div>
				<div v-else>
					<form @submit.prevent>
						<input v-model.trim="numberInput" type="number" v-focus @paste.prevent/>
						<button @click.prevent="checkNumber" :disabled="numberInput.length == 0" class="button-medium">
							Go!
						</button>
					</form>
				</div>
			</section>
		</div>

		<transition name="fade">
			<div v-if="userProfile == null" class="c-modal">
				<div class="c-container">
					<form @submit.prevent>
						<label for="username">Username</label>
						<input v-model.trim="signupForm.username" type="text" placeholder="create a username"
							id="username" />
						<button @click.prevent="createProfile" class="button-primary">
							Save
						</button>
					</form>
				</div>
			</div>
		</transition>
   
		<transition name="fade">
			<div v-if="showWrongAnswer" class="c-modal">
				<div class="c-container">
					<p>Oops wrong guess</p>
					<p>tries left: {{tries}}</p>
					<button @click.prevent="showWrongAnswer = false" class="button-error">
						OK
					</button>
				</div>
			</div>
		</transition>

		<transition name="fade">
			<div v-if="gameOver" class="c-modal">
				<div class="c-container">
					<h5>Nice try!</h5>
					<p>Level: {{level}}</p>
					<p>number: {{outputRandomNumber}}</p>
					<button @click.prevent="resetGame" class="button-success">
						Play Again
					</button>
				</div>
			</div>
		</transition>
  	</div>
</template>

<script>
import { mapState } from "vuex";
const fb = require("@/firebaseConfig.js");

export default {
	name: 'Home',
	data() {
		return {
			signupForm: {
				username: "",
			},
			showSuccess: false,
			start: true,
			level: 0,
			numberInput: "",
			hint: true,
			tries: 2,
			showWrongAnswer: false,
			gameOver: false,
    		animatedNumberPlaceHolder: 0
		}
	},
	computed: {
		...mapState(["currentUser", "userProfile"]),
		outputRandomNumber() {
			let num1 = Math.floor(Math.random() * 1000000000000000000000).toString()
			let num2 = Math.floor(Math.random() * 1000000000000000000000).toString()
			return (num1+num2).slice(0,this.level)
		},
		animatedNumber: function() {
      		return this.animatedNumberPlaceHolder.toFixed(0);
    	}	
	},
	watch: {
		outputRandomNumber: function(newValue) {
			gsap.to(this.$data, { duration: 0.5, animatedNumberPlaceHolder: newValue });
		}
	},
	methods: {
		resetGame() {
			this.start = true,
			this.level =  0,
			this.numberInput = "",
			this.hint = true,
			this.tries = 2,
			this.showWrongAnswer = false,
			this.gameOver = false

		},
		checkNumber() {
			if (this.numberInput.toString() == this.outputRandomNumber) {
				this.increaseLevel()
				this.numberInput = ""
				this.hint = true
			} else {
				this.tries = this.tries - 1
				if (this. tries == 0) {
					if (this.userProfile.level == null || this.level > this.userProfile.level) {
						this.updateScore()
					}
					this.gameOver = true
					this.numberInput = ""
				} else {
					this.showWrongAnswer = true
					this.numberInput = ""
				}
			}
		},
		updateScore() {
			fb.usersCollection
				.doc(this.currentUser.uid)
				.update({
					level: this.level,
					number: this.outputRandomNumber,
				})
			.catch(err => {
				console.log(err);
			});
		},
		createProfile() {
			this.$store.dispatch("createProfile", {
				username: this.signupForm.username,
			});
			this.username = "";
			this.showSuccess = true;

			setTimeout(() => {
				this.showSuccess = false;
			}, 2000);
		},
		toggleStart() {
			this.start = !this.start
			this.increaseLevel()
		},
		increaseLevel() {
			this.level = this.level + 1
		}
	},
	directives: {
		focus: {
			// directive definition
			inserted: function (el) {
			el.focus()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.title, .welcome, .game {
	flex-direction: column;
	flex-wrap: nowrap;
	justify-content: flex-start;
	align-items: center;
	align-content: stretch;
}

.score {
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-items: center;
	align-content: stretch;
	color: rgba(39, 39, 39, 0.5);
	position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
}

form {
	max-width: 20rem;
	margin: 0 auto;
}
</style>
