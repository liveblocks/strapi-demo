export default [
  {
    method: 'GET',
    path: '/getLiveblocksRooms',
    handler: 'liveblocksController.getLiveblocksRooms',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/getLiveblocksRoomComments',
    handler: 'liveblocksController.getLiveblocksRoomComments',
    config: {
      policies: [],
    },
  },
];
