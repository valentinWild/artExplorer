import  {NuxtAuthHandler} from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials'; 530 (gzipped: 327)

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret,
    
    providers: [
        CredentialsProvider.default({
            name: 'credentials',
            credentials: {},
            async authorize(credentials: { username: String; password: string}) {
                return {};
            },
        }),
    ]

})