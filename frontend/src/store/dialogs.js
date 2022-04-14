import { defineStore } from "pinia";
import { useLocalStorage  } from '@vueuse/core';



const useLoginDialogStore = defineStore({
    id: 'loginDialog',
    state: () => ({
        loginDialog: useLocalStorage('loginDialog', false),
    }),
    getters: {
        getLoginDialog: (state) => state.loginDialog,
    },
    actions: {
       showLogin() {
           this.loginDialog = true;
       },
       closeLogin() {
           this.loginDialog = false;
       }
    }
})

const useRegisterDialogStore = defineStore({
    id: 'registerDialog',
    state: () => ({
        registerDialog: useLocalStorage('registerDialog', false),
    }),
    getters: {
        getRegisterDialog: (state) => state.registerDialog,
    },
    actions: {
       showRegister() {
           this.registerDialog = true;
       },
       closeRegister() {
           this.registerDialog = false;
       }
    }
})


const useLogoutDialogStore = defineStore({
    id: 'logoutDialog',
    state: () => ({
        logoutDialog: useLocalStorage('logoutDialog', false),
    }),
    getters: {
        getLogoutDialog: (state) => state.logoutDialog,
    },
    actions: {
       showLogout() {
           this.logoutDialog = true;
       },
       closeLogout() {
           this.logoutDialog = false;
       }
    }
})

export { useLoginDialogStore, useRegisterDialogStore, useLogoutDialogStore };