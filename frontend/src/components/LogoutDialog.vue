<template>
  <transition name="fade">
    <div
      class="bg-gray-500 bg-opacity-70 fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center"
      v-if="showLogout"
    >
      <div
        class="bg-gray-500 text-white rounded-md transition-all w-2/3 md:w-1/2"
        id="logoutModal"
        tabindex="-1"
      >
        <div
          class="border-none shadow-lg relative flex flex-col w-full pointer-events-auto rounded-md"
        >
          <h5 class="text-xl font-medium p-4" id="logoutModalLabel">Déconnexion</h5>
          <div class="relative p-4">Voulez vous vraiment vous déconnecter ?</div>
          <div class="flex-col-reverse sm:flex-row flex items-center justify-end p-4 rounded-b-md">
            <button type="button" class="btn-secondary" @click="closeLogout">Annuler</button>
            <button @click="logOut" class="btn-primary ml-1 mb-3 sm:mb-0">Déconnexion</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useLogoutDialogStore } from '../store/dialogs';
import { useUserDataStore } from '../store/userData';
import { mapState } from 'pinia';

export default {
  setup() {
    const logoutDialogStore = useLogoutDialogStore();
    const userDataStore = useUserDataStore();

    return { logoutDialogStore, userDataStore };
  },
  computed: {
    ...mapState(useLogoutDialogStore, {
      showLogout: 'logoutDialog',
    })

  },
  methods: {
    closeLogout() {
      this.logoutDialogStore.closeLogout();
    },

    async logOut() {
      const [error, data] = await this.userDataStore.logOut();

      if (error) {
        this.error_message = error;
      } else {
        this.logoutDialogStore.closeLogout();
      }
    },

    goToLogin() {
    }
  },
}
</script>