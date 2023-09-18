import { PageHome } from "@/components/site/PageHome";
import { Room } from "@/components/comments/Room";
import { Comments } from "@/components/comments/Comments";

export default async function Home() {
  return (
    <Room>
      <PageHome />
      <Comments />
    </Room>
  );
}
