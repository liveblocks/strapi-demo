/*
 *
 * HomePage
 *
 */


import React, {useEffect, useState} from 'react';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Stack, Box, HeaderLayout, Plus, Link, ArrowLeft, Button, Pencil } from '@strapi/design-system';
import {getRooms, Room} from "../../api";

const HomePage = () => {
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    async function run() {
      const fetchedRooms = await getRooms()
      console.log(3, fetchedRooms[0])
      setRooms(fetchedRooms)
    }

    run()
  }, [])

  return (
    <Stack gap={0} paddingBottom={10}>
      <HeaderLayout title="Liveblocks Comments" subtitle="A list of rooms. Open one to view comments." as="h2" />
        <Stack gap={3}  paddingLeft={10} paddingRight={10}>
          {rooms.map((room) => (
            <Box key={room.id} background={"white"} padding={4}>
              <Link to={`${pluginId}/room/${encodeURIComponent(room.id)}`}>
                Room ID: {room.id}
              </Link>
            </Box>
          ))}
        </Stack>
    </Stack>
  );
};

export default HomePage;
