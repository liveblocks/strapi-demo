/*
 *
 * HomePage
 *
 */


import React, {useEffect, useState} from 'react';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Stack, Box, HeaderLayout, Plus, Link, ArrowLeft, Button, Pencil } from '@strapi/design-system';
import {getThreadsInRoom, getRooms, Room} from "../../api";
import {ThreadData} from "@liveblocks/client";

const RoomPage = (a) => {
  const roomId = a.match.params[0];
  const [threads, setThreads] = useState<ThreadData[]>([])

  useEffect(() => {
    async function run() {
      const fetchedThreads = await getThreadsInRoom(roomId)
      setThreads(fetchedThreads)
    }

    run()
  }, [])

  return (
    <Stack gap={0} paddingBottom={10}>
      <HeaderLayout title={roomId} subtitle={`Comments in room "${roomId}"`} as="h2" />
      <Stack gap={3}  paddingLeft={10} paddingRight={10}>
        {threads.map((thread) => (
          <Box key={thread.id} background={"white"} padding={4}>
            Thread ID: {thread.id}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default RoomPage;
