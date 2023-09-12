import Room from "./Room";
import { PageArticle } from "@/components/PageArticle";

export default function Page({
  params,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Room>
      <PageArticle slug={params.slug} />
    </Room>
  );
}
