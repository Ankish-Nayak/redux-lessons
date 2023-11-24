import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // optional if you named it api
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
  }),
  tagTypes: ["Post", "User"],
  // @ts-expect-error  dfdfd
  endpoints: (builder) => ({}), // eslint-disable-line
});
