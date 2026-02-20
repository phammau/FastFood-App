const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API_URL is undefined. Check .env file');
}

export { API_URL };
