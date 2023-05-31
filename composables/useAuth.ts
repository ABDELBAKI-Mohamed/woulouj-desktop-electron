export default function () {
  const client = useSupabaseAuthClient();

  const accessToken = useState("token", () => localStorage.getItem("token"));

  const signup = async (user: { mail: string; pass: string }) => {
    try {
      const res = await client.auth.signUp({
        password: user.pass,
        email: user.mail,
      });
      navigateTo("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };
  const signin = async (user: { mail: string; pass: string }) => {
    try {
      const res = await client.auth.signInWithPassword({
        password: user.pass,
        email: user.mail,
      });
    } catch (error) {
      console.log(error);
      navigateTo("/auth/register");
    }
  };

  return {
    signup,
    signin,
    accessToken,
  };
  // auth is a bit tricky in tauri
  // i guess we will implement auth with google and auth with email and password
  // it will take time bcz we need an additional server to catch redirect
}
