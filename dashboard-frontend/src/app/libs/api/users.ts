import { AxiosResponse } from "axios";
import {
  ChangePasswordFormInterface,
  PaginationQuery,
  PaginationResponse,
  UpdateUserFormInterface,
  UserCardInterface,
  ChangeRoleFormInterface,
} from "../data";
import { api } from "./api";

export const getAllUsers = async (
  params?: PaginationQuery,
): Promise<PaginationResponse<UserCardInterface>> => {
  return await api
    .get<PaginationResponse<UserCardInterface>>("/users", {
      params,
    })
    .then(
      (response: AxiosResponse<PaginationResponse<UserCardInterface>>) =>
        response.data,
    )
    .catch((error: unknown) => {
      throw error;
    });
};

export const getOneUser = async (id: string): Promise<UserCardInterface> => {
  return await api
    .get<UserCardInterface>(`/users/${id}`)
    .then((response: AxiosResponse<UserCardInterface>) => response.data)
    .catch((error: unknown) => {
      throw error;
    });
};

export const updateUser = async (
  id: string,
  data: UpdateUserFormInterface,
): Promise<UserCardInterface> => {
  return await api
    .put<UserCardInterface>(`/users/${id}`, data)
    .then((response: AxiosResponse<UserCardInterface>) => response.data)
    .catch((error: unknown) => {
      throw error;
    });
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  return await api
    .delete<{ message: string }>(`/users/${id}`)
    .then((response: AxiosResponse<{ message: string }>) => response.data)
    .catch((error: unknown) => {
      throw error;
    });
};

export const changePassword = async (
  data: ChangePasswordFormInterface,
): Promise<{ success: boolean }> => {
  return await api
    .post<{ success: boolean }>("/users/change-password", data)
    .then((response: AxiosResponse<{ success: boolean }>) => response.data)
    .catch((error: unknown) => {
      throw error;
    });
};

export const changeRole = async (
  data: ChangeRoleFormInterface,
): Promise<UserCardInterface> => {
  return await api
    .post<UserCardInterface>("/users/role", data)
    .then((response: AxiosResponse<UserCardInterface>) => response.data)
    .catch((error: unknown) => {
      throw error;
    });
};
