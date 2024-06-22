/* import mongoose from "mongoose";

export default async (_nitroApp) => {
    console.log('Nuxt Plugin');
    const config = useRuntimeConfig();

    try {
        
        await mongoose.connect(config.mongoUri);
        console.log('Connected to MongoDB');
    
    } catch (e) {
        console.error(e);
    }

}; */