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
    path: '/getLiveblocksRoomThreads',
    handler: 'liveblocksController.getLiveblocksRoomThreads',
    config: {
      policies: [],
    },
  },
];
