export const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URL = {
    LOGIN: `${BASE_URL}/api/auth/login`,
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGOUT: `${BASE_URL}/api/auth/logout`,
    REFRESH_TOKEN: `${BASE_URL}/api/auth/token`,
    GET_USER: `${BASE_URL}/api/users/me`,
    UPDATE_USER: `${BASE_URL}/api/users/me`,
    GET_MEAL_PLAN: `${BASE_URL}/api/users/meal-plan`,
    SAVE_MEAL_PLAN: `${BASE_URL}/api/users/meal-plan/save`,
    GET_RECOMMENDATION: `${BASE_URL}/api/users/recommendation`,
    GET_ANALYSIS: `${BASE_URL}/api/users/analysis`,
};