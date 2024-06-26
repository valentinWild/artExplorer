export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();

    if (!user.value && to.path === '/dashboard') {
        console.log('Middleware: No user logged in!');
        navigateTo('/');
    } else if (!user.value && to.path === '/question') {
        console.log('Middleware: No user logged in!');
        navigateTo('/user/login');
    } else if (user.value && to.path === '/') {
        navigateTo('dahsboard');
    }


});