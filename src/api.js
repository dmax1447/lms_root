import axios from "axios";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhdHVueTAiLCJlbWFpbCI6ImF0dW55MEBzb2h1LmNvbSIsImZpcnN0TmFtZSI6IlRlcnJ5IiwibGFzdE5hbWUiOiJNZWRodXJzdCIsImdlbmRlciI6Im1hbGUiLCJpbWFnZSI6Imh0dHBzOi8vcm9ib2hhc2gub3JnL1RlcnJ5LnBuZz9zZXQ9c2V0NCIsImlhdCI6MTcwODYwNzU0MCwiZXhwIjoxNzA4NjExMTQwfQ.20hwUQ4GEuq0U8AJo5mFoaIp2RWafNdAy4o8MR1p78k";

const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com/",
  timeout: 1000,
});

function login(username, password) {
  const payload = {
    username: "atuny0",
    password: "9uQFF1Lh",
  };

  return axiosInstance.post("/auth/login", payload);
}

function getCurrentUser() {
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axiosInstance.get("/user/me", params).then((r) => r.data);
}

export { axiosInstance, getCurrentUser, login };
