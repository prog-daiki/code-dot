import { HeaderLogo } from "@/app/_components/header/header-logo";
import { LoginButton } from "@/app/_components/header/login-button";

export const MarketingHeader = () => {
  return (
    <header className="w-full border-b py-4 px-6 h-20">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between h-full">
        <HeaderLogo />
        <LoginButton />
      </div>
    </header>
  );
};
