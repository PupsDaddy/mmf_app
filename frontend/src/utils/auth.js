import axios from "axios";

export const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Date.now() / 1000; // Время в секундах
  return payload.exp < currentTime;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token"); // Предполагается, что refresh токен хранится в localStorage
  if (!refreshToken) return null;

  try {
    const response = await axios.post("http://127.0.0.1:8000/users/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token } = response.data;
    localStorage.setItem("token", access_token); // Сохраняем новый access токен
    return access_token;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return null;
  }
};
