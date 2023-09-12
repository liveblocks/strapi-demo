import { PageHome } from "@/components/assorted/PageHome";
import { Room } from "@/components/assorted/Room";
import { Comments } from "@/components/comments/Comments";

export default async function Home() {
  return (
    <Room>
      <PageHome />
      <Comments />
    </Room>
  );
}
