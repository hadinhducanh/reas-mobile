import axios from "axios";
import { Item } from "../common/models/item-upload";
import { API_BASE_URL } from "../common/models/constants";

const createItem = async (item: Item, accessToken: string): Promise<Item> => {
  const response = await axios.post<Item>(`${API_BASE_URL}/item`, item, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export default {
  createItem,
};
