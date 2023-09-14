import { Strapi } from '@strapi/strapi';
import fetch from "node-fetch";

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
  async getRoomThreads(ctx) {
    const url = new URL("https://example.com" + ctx.request.url)
    const roomId = url.searchParams.get("roomId")

    const response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}/threads`, {
      headers
    })

    if (!response.ok) {
      throw new Error(`Can't retrieve Liveblocks threads for room ${roomId}`)
    }

    return await response.json();
  },
});
