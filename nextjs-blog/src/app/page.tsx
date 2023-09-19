import { PageHome } from "@/components/site/PageHome";
import { Room } from "@/components/comments/Room";
import { Cursors } from "@/components/comments/Cursors";
import { Comments } from "@/components/comments/Comments";

export default async function Home() {
  return (
    <Room>
      <PageHome />
      <Comments />
      <Cursors />
    </Room>
  );
}
