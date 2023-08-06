import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Signature() {
  return (
    <div className="flex flex-grow items-end mt-3 mb-2">
      <span className="text-gray-300">
        <a
          href="https://twitter.com/simonpfish"
          className="hover:text-blue-400 transition-colors"
        >
          @simonpfish
        </a>
        <span className="mx-2">|</span>
        <a
          href="https://github.com/simonpfish/word-emotion-shapes"
          className="hover:text-black transition-colors"
        >
          <GitHubLogoIcon className="h-5 w-5 inline -mt-0.5" />
        </a>
      </span>
    </div>
  );
}
