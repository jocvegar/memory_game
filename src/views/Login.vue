<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>Memory Game</h1>
                <p>How far can you go?</p>
            </div>
            <div class="col2" >
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>

                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Welcome Back</h1>

                    <label for="login_email">Email</label>
                    <input v-model.trim="loginForm.email" type="text" 
                        placeholder="you@email.com" id="login_email" />

                    <label for="login_password">Password</label>
                    <input v-model.trim="loginForm.password" type="password"
                        placeholder="******" id="login_password" />

                    <div class="fix-me">
                        <button @click="login" class="button-primary">Log In</button>
                        <div class="extras">
                            <a @click="togglePasswordReset">Forgot Password</a>
                            <a @click="toggleForm">Create Account</a>
                        </div>
                    </div>
                </form>

                <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                    <h1>Create An Account</h1>
                    <label for="signup_email">Email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com"
                        id="signup_email" />

                    <label for="signup_password">Password</label>
                    <input v-model.trim="signupForm.password" type="password" 
                        placeholder="min 6 characters" id="signup_password" />

                    <div class="fix-me">
                        <button @click="signup" class="button-primary">Sign Up</button>
                        <div class="extras">
                            <a @click="toggleForm">Back to Log In</a>
                        </div>
                    </div>
                </form>

                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                    <!-- <div v-if="false"> -->
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset your password</p>

                        <label for="reset_email">Email</label>
                        <input v-model.trim="passwordForm.email" type="text"
                            placeholder="you@email.com" id="reset_email" />

                        <div class="fix-me">
                            <button @click="resetPassword" class="button-primary">Submit</button>

                            <div class="extras">
                                <a @click="togglePasswordReset">Back to Log In</a>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <button @click="togglePasswordReset" class="button-primary">
                            Back to login
                        </button>
                    </div>
                </form>
            </div>
        </section>
    </div>
</template>

<script>
const fb = require("@/firebaseConfig.js");

export default {
    data() {
        return {
            loginForm: {
                email: "",
                password: ""
            },
            signupForm: {
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            },
            passwordForm: {
                email: ""
            },
            showLoginForm: true,
            showForgotPassword: false,
            passwordResetSuccess: false,
            performingRequest: false,
            errorMsg: ""
        };
    },
    methods: {
        toggleForm() {
            this.errorMsg = "";
            this.showLoginForm = !this.showLoginForm;
        },
        togglePasswordReset() {
            if (this.showForgotPassword) {
                this.showLoginForm = true;
                this.showForgotPassword = false;
                this.passwordResetSuccess = false;
            } else {
                this.showLoginForm = false;
                this.showForgotPassword = true;
            }
        },
        login() {
            this.performingRequest = true;
            fb.auth.signInWithEmailAndPassword(
                this.loginForm.email,
                this.loginForm.password
            )
            .then(firebaseUser => {
                this.$store.commit("setCurrentUser", firebaseUser.user);
                this.$store.dispatch("fetchUserProfile");
                this.performingRequest = false;
                this.$router.push("/");
            })
            .catch(err => {
                console.log(err);
                this.performingRequest = false;
                this.errorMsg = err.message;
            });
        },
        signup() {
            this.performingRequest = true;

            fb.auth
            .createUserWithEmailAndPassword(
                this.signupForm.email,
                this.signupForm.password
            )
            .then(firebaseUser => {
                this.$store.commit("setCurrentUser", firebaseUser.user);
                this.performingRequest = false;
                this.$router.push("/");
            })
            .catch(err => {
                console.log(err);
                this.performingRequest = false;
                this.errorMsg = err.message;
            });
        },
        resetPassword() {
            this.performingRequest = true;
            fb.auth.sendPasswordResetEmail(this.passwordForm.email)
            .then(() => {
                this.performingRequest = false;
                this.passwordResetSuccess = true;
                this.passwordForm.email = "";
            })
            .catch(err => {
                console.log(err);
                this.performingRequest = false;
                this.errorMsg = err.message;
            });
        },
    }
};
</script>

<style lang="scss" scoped>
.fix-me {
    display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-around;
    align-items: center;
    align-content: space-around;
}
</style>

