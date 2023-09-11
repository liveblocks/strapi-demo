import Room from "@/app/room/[roomId]/Room";
import { CollaborativeApp } from "@/components/CollaborativeApp";

export default function Page() {
  return (
    <Room>
      <CollaborativeApp />
    </Room>
  );
}
