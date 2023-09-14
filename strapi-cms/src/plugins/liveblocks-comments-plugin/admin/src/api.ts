import { getFetchClient } from "@strapi/helper-plugin";
import pluginId from "./pluginId";
import { ThreadData } from "@liveblocks/client"

export type Room = {
  type: "room";
  id: string;
  createdAt: string;
  lastConnectionAt: string;
  defaultAccesses: string[];
  groupsAccesses: Record<string, string[]>;
  usersAccesses: Record<string, string[]>;
  metadata: Record<string, string | string[]>;
}

export type RoomWithThreads = Room & {
  threads: ThreadData[]
}

const { get } = getFetchClient()

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await get(`/${pluginId}/getLiveblocksRooms`)
    return response.data.data;
  } catch(err) {
    console.log(err)
    return []
  }
}

export async function getThreadsInRoom(roomId: string): Promise<ThreadData[]> {
  try {
    const response = await get(`/${pluginId}/getLiveblocksRoomThreads?roomId=${roomId}`)
    return response.data.data;
  } catch(err) {
    console.log(err)
    return []
  }
}

export async function getRoomsWithThreads(): Promise<RoomWithThreads[]> {
  try {
    const response = await get(`/${pluginId}/getLiveblocksRoomsWithThreads`)
    console.log(response.data[0].threads.filter((thread) => thread.metadata.resolved).length)
    return response.data;
  } catch(err) {
    console.log(err)
    return []
  }
}
