import { Metadata } from "next";
import GithubButton from "@/components/github-button";

export const metadata: Metadata = {
  title: "Hackyx",
  description: "The Search Engine for Hackers",
};

export default function AuthenticationPage() {

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <GithubButton />
          </div>
        </div>
      </div>
    </div>
  );
}

