import _axios from "axios";
const BASE_URL = "http://localhost:3000";

export const axios = _axios.create({ timeout: 500000, baseURL: BASE_URL });
