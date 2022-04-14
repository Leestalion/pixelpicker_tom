import { usePixelStore } from "../store/pixel";


const PixelApi = {
    async registerPixel(pixel) {
        const pixelStore = usePixelStore();
        console.log(pixel);
        await pixelStore.addPixel(pixel);
    }
}



export { PixelApi };