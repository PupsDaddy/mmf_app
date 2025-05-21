import axios from "axios";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000; // Время в секундах
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Ошибка при проверке срока действия токена:", error);
    return true;
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await axios.post("http://127.0.0.1:8000/users/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token } = response.data;
    localStorage.setItem("token", access_token);
    return access_token;
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    return null;
  }
};

// Создаем экземпляр axios с перехватчиками для автоматического обновления токена
export const authAxios = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Перехватчик запросов для добавления токена
authAxios.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    // Если токен истек, пробуем обновить
    if (token && isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    // Если есть токен, добавляем его в заголовки
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов для обработки ошибок авторизации
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Пробуем обновить токен
      try {
        const token = await refreshAccessToken();
        if (token) {
          // Если получили новый токен, повторяем запрос
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authAxios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Ошибка при обновлении токена:", refreshError);
      }

      // Если не удалось обновить токен, перенаправляем на страницу входа
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

// Функция для получения данных о текущем пользователе из токена
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.user_id,
      role: payload.role,
    };
  } catch (error) {
    console.error("Ошибка при декодировании токена:", error);
    return null;
  }
};

// Функция для проверки авторизации
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && !isTokenExpired(token);
};

// Функция для выхода из системы
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/";
};
