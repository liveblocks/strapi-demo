import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getLiveblocksRooms(ctx) {
    ctx.body = await strapi
      .plugin('liveblocks-comments-plugin')
      .service('liveblocksService')
      .getRooms(ctx);
  },
  async getLiveblocksRoomThreads(ctx) {
    ctx.body = await strapi
      .plugin('liveblocks-comments-plugin')
      .service('liveblocksService')
      .getRoomThreads(ctx);
  }
});
