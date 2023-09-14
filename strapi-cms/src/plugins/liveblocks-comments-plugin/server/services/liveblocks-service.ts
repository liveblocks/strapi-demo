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
  async getRoomComments(ctx) {
    const { roomId } = ctx.params;

    const response = await fetch(`https://api.liveblocks.io/v2/rooms/${roomId}/threads`, {
      headers
    })

    if (!response.ok) {
      throw new Error("Can't retrieve Liveblocks rooms")
    }

    return await response.json();
  },
});
