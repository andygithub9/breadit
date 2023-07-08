// https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes
// https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes#examples
// Intercepting Routes 攔截對象的是 segment 不攔截 slot 或其他不會出現在 url 上的 folder ，以我們現在的 (.)sign-in 文件夾為例，我們攔截的是同一層的 sign-in 這個路徑，因為 @authModal 是 slot 不是 segment 所以我們攔截的是和 @authModal 同層的文件夾，和 @authModal 同層的文件夾是 (auth) ，但是 (auth) 是 Route Groups 同樣不會出現在 url ，所以我們要再往下一層找到 sign-in 文件夾，這個就會是我們要攔截的 segment

import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/SignIn";

const page = () => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
