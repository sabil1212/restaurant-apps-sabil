import CONFIG from './config';

const API_ENDPOINT = {
  SHOW_LIST: `${CONFIG.BASE_URL}list`,
  RESTAURANT_DETAIL: (restaurantId) => `${CONFIG.BASE_URL}detail/${restaurantId}`,
  SUBMIT_REVIEW: `${CONFIG.BASE_URL}review`,
};
export default API_ENDPOINT;
