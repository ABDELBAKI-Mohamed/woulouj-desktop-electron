<script setup lang="ts">
import useAuth from "~~/composables/useAuth";
import useToast from "~~/composables/useToast";
const { signin } = useAuth();
const { toggleToast } = useToast();

const user = reactive({
  mail: String(),
  pass: String(),
});

const Login = () => {
  try {
    if (user.mail !== "" && user.pass !== "") {
      signin(user);
      return;
    }
    toggleToast({ text: "fill all the feilds", role: "alert" });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <section class="w-full h-full flex">
    <div class="w-full h-full flex justify-center flex-col items-center">
      <div class="w-full flex justify-center items-center">
        <div class="w-1/2 h-fit max-w-xl flex flex-col gap-2">
          <UiInput
            Placeholder="email"
            @on:input="(text:any)=> user.mail = text"
          />
          <UiInput
            Placeholder="Password"
            @on:input="(text:any)=> user.pass = text"
          />
          <UiButton @on:click="Login" :Disable="false" colorTheme="a">
            Login
          </UiButton>
          <p class="text-sky-700">
            you dont have an account ?
            <NuxtLink to="/auth/register" class="underline">
              click her
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
