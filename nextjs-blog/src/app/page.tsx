import { PageHome } from "@/components/PageHome";
import { Room } from "@/components/Room";
import { PreviewToolbar } from "@/components/PreviewToolbar";

export default async function Home() {
  return (
    <Room>
      <PageHome />
      <PreviewToolbar />
    </Room>
  );
}
