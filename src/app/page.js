import CommentModal from "@/components/modals/CommentModal";
import PostFeed from "@/components/PostFeed/PostFeed";
import SideBar from "@/components/SideBar/SideBar";
import Widgets from "@/components/Widgets/Widgets";

export default function Home() {
  return (
    <>
      <PostFeed />

      <CommentModal />
    </>
  );
}
