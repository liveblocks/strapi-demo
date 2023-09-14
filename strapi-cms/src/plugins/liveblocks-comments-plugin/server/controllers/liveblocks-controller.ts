import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getLiveblocksRooms(ctx) {
    ctx.body = await strapi
      .plugin('liveblocks-comments-plugin')
      .service('liveblocksService')
      .getRooms();
  },

  async getLiveblocksRoomThreads(ctx) {
    const url = new URL("https://example.com" + ctx.request.url)
    const roomId = url.searchParams.get("roomId")

    ctx.body = await strapi
      .plugin('liveblocks-comments-plugin')
      .service('liveblocksService')
      .getRoomThreads(roomId);
  },

  async getLiveblocksRoomsWithThreads(ctx) {
    // Get a list of rooms
    const { data: rooms } = await strapi
      .plugin('liveblocks-comments-plugin')
      .service('liveblocksService')
      .getRooms(ctx);

    // Get threads for each room
    const promises  = [];
    for (const room of rooms) {
      promises.push(strapi
        .plugin('liveblocks-comments-plugin')
        .service('liveblocksService')
        .getRoomThreads(room.id)
      )
    }

    // Await and put in a flat map
    const threads = (await Promise.all(promises)).map((result) => result.data).flat();

    // Attach threads to correct rooms
    for (const thread of threads) {
      const room = rooms.find((room) => room.id === thread.roomId)

      if (room) {
        if (!("threads" in room)) {
          room.threads = []
        }

        room.threads.push(thread)
      }
    }

    // Filter out any rooms with no threads
    return rooms.filter((room) => "threads" in room && room.threads.length)
  }
});
