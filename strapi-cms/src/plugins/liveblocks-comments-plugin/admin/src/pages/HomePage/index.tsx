/*
 *
 * HomePage
 *
 */


import React, {useEffect, useState} from 'react';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Stack, Box, HeaderLayout, Plus, Link, ArrowLeft, Button, Pencil, Text } from '@strapi/design-system';
import {getRoomsWithThreads, Room, RoomWithThreads} from "../../api";

const HomePage = () => {
  const [rooms, setRooms] = useState<RoomWithThreads[]>([])

  useEffect(() => {
    async function run() {
      const fetchedRooms = await getRoomsWithThreads()
      setRooms(fetchedRooms)
    }

    run()
  }, [])


  // TODO - add preview URL to metadata and link to it
  // TODO - details summary with list of threads
  return (
    <Stack gap={0} paddingBottom={10}>
      <HeaderLayout title="Liveblocks Comments" subtitle="A list of rooms. Open one to view comments." as="h2" />
      {rooms.length ? (

        <Stack gap={3}  paddingLeft={10} paddingRight={10}>
          {rooms.map((room) => (
            <Box key={room.id} background={"white"} padding={4}>
              <Stack horizontal justifyContent={"space-between"}>
                <Link to={`${pluginId}/room/${encodeURIComponent(room.id)}`}>
                  Room ID: {room.id}
                </Link>{" "}
                {room.threads ? <div>{room.threads.filter((thread) => thread.metadata.resolved).length} / {room.threads.length} resolved</div> : null}
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
};

export default HomePage;
