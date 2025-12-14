import { AxiosResponse } from "axios";
import {
  PaginationQuery,
  PaginationResponse,
  RecordCardInterface,
  CreateRecordFormInterface,
} from "../data";
import { api } from "./api";

export const getAllRecords = async (
  params?: PaginationQuery,
): Promise<PaginationResponse<RecordCardInterface>> => {
  const { page = 1, limit = 10 } = params || {};

  try {
    const response = await api.get<PaginationResponse<RecordCardInterface>>(
      "/records",
      {
        params: {
          page,
          limit,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error;
  }
};

export const getOneRecord = async (
  id: string,
): Promise<RecordCardInterface> => {
  return await api
    .get<RecordCardInterface>(`/records/${id}`)
    .then((response: AxiosResponse<RecordCardInterface>) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const createRecord = async (
  data: CreateRecordFormInterface,
): Promise<RecordCardInterface> => {
  return await api
    .post<RecordCardInterface>("/records", data)
    .then((response: AxiosResponse<RecordCardInterface>) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const updateRecord = async (
  id: string,
  data: Partial<CreateRecordFormInterface>,
): Promise<RecordCardInterface> => {
  return await api
    .put<RecordCardInterface>(`/records/${id}`, data)
    .then((response: AxiosResponse<RecordCardInterface>) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const deleteRecord = async (
  id: string,
): Promise<{ message: string }> => {
  return await api
    .delete<{ message: string }>(`/records/${id}`)
    .then((response: AxiosResponse<{ message: string }>) => response.data)
    .catch((error) => {
      throw error;
    });
};
