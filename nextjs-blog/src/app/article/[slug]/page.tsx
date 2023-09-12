import { Room } from "@/components/Room";
import { PageArticle } from "@/components/PageArticle";
import { PreviewToolbar } from "@/components/PreviewToolbar";

export default async function Article({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Room>
      <PageArticle slug={params.slug} />
      <PreviewToolbar />
    </Room>
  );
}
