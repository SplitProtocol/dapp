import axios, { AxiosError } from 'axios';
import { notification, notificationMessages, notificationTitles } from '../helpers/notificationMessages';
// import Cookie from 'js-cookie';

// import { logOutUser } from '@/entities/User';
// import {
//   notification,
//   notificationMessages,
//   notificationTitles,
// } from '@/shared/helpers/notificationMessages';

export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  Accept: "application/json",
};

export type ErrorWithStatusCode = {
  statusCode: number;
  message: string;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30 * 1000,
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// apiClient.interceptors.request.use((config) => {
//   const accessToken = Cookie.get(
//     process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'authToken',
//   );
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

export const errorHandler = (error: unknown) => {
  if (error instanceof Error && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ErrorWithStatusCode>;
    if (axiosError?.response?.data?.message) {
      notification.error(
        notificationTitles.error,
        axiosError.response.data.message,
      );
    } else {
      notification.error(notificationTitles.error, axiosError.toString());
    }
  } else {
    notification.error(
      notificationTitles.error,
      notificationMessages.somethingWrong,
    );
  }
};
