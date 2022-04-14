import { defineStore } from "pinia";
import { authService, baseService } from "../services/auth.service";
import { useLocalStorage  } from '@vueuse/core';


const ERROR_NO_EMAIL = 400;
const ERROR_NO_PASSWORD = 401;
const ERROR_NO_USER_FOUND_WITH_EMAIL = 402;
const ERROR_NO_NAME = 403
const EMAIL_ALREADY_IN_USE = 404
const NAME_ALREADY_IN_USE = 405
const ERROR_WRONG_CREDENTIALS = 406

const useUserDataStore = defineStore({
    id: 'userData',
    state: () => ({
        user: useLocalStorage('user', {}),
        isLoggedIn: useLocalStorage('isLoggedIn', false),
        jwtToken: useLocalStorage('jwtToken', '')
    }),
    getters: {
        getIsLoggedIn: (state) => state.isLoggedIn,
        getUser: (state) => state.user,
        getJwtToken: (state) => state.jwtToken,
        getUserName: (state) => state.user.name
    },
    actions: {
        async registerUser(user) {
            try {
                const { data } = await baseService.post('/register', user);
                if (data.access_token) {
                    this.jwtToken = data.access_token;
                    this.isLoggedIn = true;
                    this.user = data.user;
                    return [null, data];
                } else if (data.error) {
                    if (data.error == EMAIL_ALREADY_IN_USE) {
                        return ["Cet email est déjà utilisé"];
                    } else if (data.error == NAME_ALREADY_IN_USE) {
                        return ["Ce nom est déjà utilisé"];
                    }
                    return [error];
                }
            } catch (error) {
                return  [error];
            }
        },
        async loginUser(user) {
            try {
                const { data } = await baseService.post('/login', user)
                if (data.access_token) {
                    this.jwtToken = data.access_token;
                    this.isLoggedIn = true;
                    this.user = data.user;
                    return [null, data];
                } else if ( data.error ){
                    if (data.error == ERROR_NO_USER_FOUND_WITH_EMAIL) {
                        return ["Aucun utilisateur n'a été trouvé avec cette adresse email"];
                    } else if (data.error == ERROR_WRONG_CREDENTIALS) {
                        return ["Le mot de passe ne correspond pas à l'adresse mail"]
                    }
                    return [data.error];
                } else {
                    return ["no data received from backend"];
                }
            } catch (error) {
                return [error];
            }

        },

        async logOut() {
            try {
                const { data } = await authService.post('/logout');
                
                this.jwtToken = '';
                this.isLoggedIn = false;
                this.user = {};

                return [null];
            } catch(error) {
                return [error]
            }
        },

        async ping() {
            try {
                const {data} = await baseService.get('/ping');
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        },

        async fetchUser() {
            try {
                const {data} = await authService.get('/protected');
                return [null, data]
            } catch (error) {
                return [error];
            }
        },

        setLocalUser(user) {
            this.user = user;
        },

        setIsLoggedIn(isLoggedIn) {
            this.isLoggedIn = isLoggedIn;
        },

        setJwtToken(token) {
            this.jwtToken = token;
        }
    }
})


export { useUserDataStore };