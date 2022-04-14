<template>
    <main>
        <div class="bg-gray-500 text-white">
            <div
                class="px-5 py-5 grid justify-items-center items-center md:grid-cols-5 xl:grid-cols-7"
            >
                <h1
                    class="text-5xl sm:text-7xl xl:text-9xl font-title md:col-span-3 xl:col-span-5"
                >Pixel Picker</h1>
            </div>
            <div class="flex justify-end mr-5">
                <button
                    v-if="this.userDataStore.getIsLoggedIn"
                    @click="goToUser"
                    class="text-white font-bold py-2 px-4 border-r border-b-4 border-gray-700 hover:border-gray-600 hover:bg-gray-400 rounded-tl-lg"
                >{{ this.userDataStore.getUserName }}</button>
                <button
                    v-if="this.userDataStore.getIsLoggedIn"
                    class="text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:bg-gray-400 hover:border-gray-600 rounded-tr-lg transition duration-150 ease-in-out"
                    @click="showLogout"
                >Déconnexion</button>
                <button
                    @click="showRegister"
                    v-if="!this.userDataStore.getIsLoggedIn"
                    class="text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-600 hover:bg-gray-400 rounded-tl-lg"
                >Inscription</button>
                <button
                    @click="showLogin"
                    v-if="!this.userDataStore.getIsLoggedIn"
                    class="text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-600 hover:bg-gray-400 rounded-tr-lg"
                >Connexion</button>
            </div>
        </div>

        
    </main>
</template>


<script>
import { useUserDataStore } from '../store/userData';
import { useLoginDialogStore } from '../store/dialogs';
import { useRegisterDialogStore } from '../store/dialogs';
import { useLogoutDialogStore } from '../store/dialogs';

export default {
    setup() {
        const userDataStore = useUserDataStore();
        const loginDialogStore = useLoginDialogStore();
        const registerDialogStore = useRegisterDialogStore();
        const logoutDialogStore = useLogoutDialogStore();

        return {loginDialogStore, userDataStore, registerDialogStore, logoutDialogStore}
    },
    created() {
        console.log(this.userDataStore.isLoggedIn);
    },
    methods: {
        async logOut() {
            const [error] = await this.userDataStore.logOut();
            if (error) {
                console.log(error);
            } else {
                this.loginDialogStore.closeLogout();
            }
        },

        goToLogin() {
        },
        goToHome() {
        }, 
        goToRegister() {
        },
        goToUser() {
        },

        showLogin() {
            this.loginDialogStore.showLogin();
        },

        showRegister() {
            this.registerDialogStore.showRegister();
        },

        showLogout() {
            this.logoutDialogStore.showLogout();
        }
    },
}
</script>