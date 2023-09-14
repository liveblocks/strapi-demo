import { Strapi } from '@strapi/strapi';
import fetch from "node-fetch";
import { type ThreadData } from "@liveblocks/client";

const headers =  {
  "Authorization": `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`
}

export default ({ strapi }: { strapi: Strapi }) => ({
  async getRooms() {
    const response = await fetch(`https://api.liveblocks.io/v2/rooms`, {
      headers
    })

    if (!response.ok) {
      throw new Error("Can't retrieve Liveblocks rooms")
    }

    return await response.json();
  },
  async getRoomThreads(roomId: string): Promise<ThreadData[]> {
    const response = await fetch(`https://api.liveblocks.io/v2/rooms/${encodeURIComponent(roomId)}/threads`, {
      headers
    })

    if (!response.ok) {
      throw new Error(`Can't retrieve Liveblocks threads for room ${roomId}`)
    }

    return await response.json();
  },
});
