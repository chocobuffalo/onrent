import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <>
      <h1>SignIn</h1>
       <form
      action={async (formData) => {
        "use server"
        await signIn("google")
      }}
    >
      
      <button type="submit">Signin with Resend</button>
    </form>
    </>
  );
}