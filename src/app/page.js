// import PostFeed from "@/components/PostFeed/PostFeed";
// import SideBar from "@/components/SideBar/SideBar";
// import Widgets from "@/components/Widgets/Widgets";

// export default function Home() {
//   return (
//    <div className="text-black bg-gray-100 min-h-screen m-w-[1400px] mx-auto flex">
//     <SideBar/>
//     <PostFeed/>
//     <Widgets/>
//    </div>

//   );
// }
import PostFeed from "@/components/PostFeed/PostFeed";
import SideBar from "@/components/SideBar/SideBar";
import Widgets from "@/components/Widgets/Widgets";

export default function Home() {
  return (
    <div className="text-black bg-gray-100 min-h-screen max-w-[1400px] mx-auto flex">
      <SideBar/>
      <main className="flex-1 border-x border-gray-200">
        <PostFeed/>
      </main>
      <div className="hidden lg:block w-[350px]">
        <Widgets/>
      </div>
    </div>
  );
}
