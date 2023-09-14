import {request} from "@strapi/helper-plugin";
import pluginId from "./pluginId";

export type Room = {
  id: string;
  createdAt: string;
  lastConnectionAt: string;
  defaultAccesses: string[];
  groupsAccesses: Record<string, string[]>;
  usersAccesses: Record<string, string[]>;
  metadata: Record<string, string | string[]>;
  type: "room"
}

export async function getRooms(): Promise<Room[]> {
  try {
    const response = await request(`/${pluginId}/getLiveblocksRooms?limit=100`)
    return response.data;
  } catch(err) {
    console.log(err)
    return []
  }
}
