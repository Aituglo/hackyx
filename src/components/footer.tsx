import { Button } from "@/components/ui/button";
import {
  GitHubLogoIcon,
  MoonIcon,
  SunIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

export const Footer = ({ count }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="footer-social-icons mt-auto pb-5">
      {count > 0 && <h4 className="text-center">{count} contents indexed</h4>}
      {/**
           <h4 className="text-center">
            <a
              className="underline cursor-pointer"
              href="https://github.com/aituglo/hackyx"
              target="_blank"
            >
              Add a content
            </a>
          </h4>
           */}
      <ul className="social-icons text-center ">
        <li>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://x.com/aituglo")}
          >
            <TwitterLogoIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
        </li>
        <li>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://github.com/aituglo/hackyx")}
          >
            <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          </Button>
        </li>
        <li>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </li>
      </ul>
    </div>
  );
};
