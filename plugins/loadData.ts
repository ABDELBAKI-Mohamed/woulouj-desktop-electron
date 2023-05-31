export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("vue:setup", () => {
    useGroup();
    useStudent();
    useTeacher();
    usePayment();
    useAssistant();
  });
});
