export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== "/auth/login" && to.path !== "/auth/register") {
    const user = useSupabaseUser();
    if (!user.value) {
      // return navigateTo("/auth/login");
      return;
    }
    return;
  }
  return;
});
