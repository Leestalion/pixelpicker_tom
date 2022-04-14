import { authService } from "../services/auth.service";
import { defineStore } from "pinia";

const usePixelStore = defineStore({
    id: 'pixelStore',

    actions: {
        async addPixel(pixel) {
        
            pixel.user_id = 2;
            pixel.color = "ABCDEF";

            try {
                const { data } = await authService.post('/pixel', pixel);
                if (!data.error) {
                    return [null, data];
                } else if (data.error) {
                    return [error];
                }
            } catch (error) {
                return  [error];
            }
        },

       closeLogout() {
           this.pixelStore = false;
       }
    }
})

export { usePixelStore };