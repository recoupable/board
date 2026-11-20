import { PrivyProviderWrapper } from "@/components/PrivyProviderWrapper";
import { SignIn } from "@/components/SignIn";

/** Sign-in page for the board: Privy email login, then back to the board. */
export default function SignInPage() {
  return (
    <PrivyProviderWrapper>
      <SignIn />
    </PrivyProviderWrapper>
  );
}
