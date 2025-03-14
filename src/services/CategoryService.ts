import axios from "axios";
import { API_BASE_URL } from "../common/constant";
import { CategoryResponse } from "../common/models/category";
import { TypeItem } from "../common/enums/TypeItem";

const getAllByTypeItem = async (typeItem: TypeItem): Promise<CategoryResponse[]> => {
  const response = await axios.get<CategoryResponse[]>(`${API_BASE_URL}/category?typeItem=${typeItem}`);
  return response.data;
};

export default {
    getAllByTypeItem,
};
