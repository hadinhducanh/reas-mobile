import { number } from "zod";
import { StatusCriticalReport } from "../../enums/StatusCriticalReport";
import { TypeCriticalReport } from "../../enums/TypeCriticalReport";
import { UserResponse } from "../auth";
import { FeedbackResponse } from "../feedback";
import { ExchangeResponse } from "../exchange";

export interface CriticalReportResidentRequest {
  typeReport: TypeCriticalReport;
  contentReport: string;
  imageUrl: string;
  residentId?: number;
  feedbackId?: number;
  exchangeId?: number;
}

export interface SearchCriticalReportRequest {
  ids?: number[];
  typeReports?: TypeCriticalReport[];
  residentIds?: number[];
  feedbackIds?: number[];
  exchangeRequestIds?: number[];
  reporterName?: string;
  reporterIds?: number[];
  answererName?: string;
  answererIds?: number[];
  statusCriticalReports?: StatusCriticalReport[];
}

export interface CriticalReportResponse {
  id: number;
  typeReport: TypeCriticalReport;
  contentReport: string;
  contentResponse: string;
  imageUrl: string;
  approvedTime: string;
  user: UserResponse;
  feedback: FeedbackResponse;
  exchangeRequest: ExchangeResponse;
  reporter: UserResponse;
  answerer: UserResponse;
  creationDate: string;
  lastModificationDate: string;
  statusCriticalReport: StatusCriticalReport;
}
