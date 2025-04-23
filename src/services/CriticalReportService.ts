import axios from "axios";
import {
  CriticalReportResidentRequest,
  CriticalReportResponse,
  SearchCriticalReportRequest,
} from "../common/models/criticalReport";
import { ResponseEntityPagination } from "../common/models/pagination";
import { API_BASE_URL } from "../common/constant";

const searchCriticalReport = async (
  pageNo: number,
  request: SearchCriticalReportRequest,
  accessToken: string
): Promise<ResponseEntityPagination<CriticalReportResponse>> => {
  const response = await axios.post<
    ResponseEntityPagination<CriticalReportResponse>
  >(
    `${API_BASE_URL}/critical-report/search?pageNo=${pageNo}&pageSize=5&sortBy=id&sortDir=desc`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const createCriticalReport = async (
  request: CriticalReportResidentRequest,
  accessToken: string
): Promise<CriticalReportResponse> => {
  const response = await axios.post<CriticalReportResponse>(
    `${API_BASE_URL}/critical-report`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

const getCriticalReportDetail = async (
  id: number,
  accessToken: string
): Promise<CriticalReportResponse> => {
  const response = await axios.get<CriticalReportResponse>(
    `${API_BASE_URL}/critical-report/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export default {
  searchCriticalReport,
  createCriticalReport,
  getCriticalReportDetail,
};
