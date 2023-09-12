import { Room } from "@/components/assorted/Room";
import { PageArticle } from "@/components/assorted/PageArticle";
import { Comments } from "@/components/comments/Comments";

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Room>
      <PageArticle slug={params.slug} />
      <Comments />
    </Room>
  );
}
