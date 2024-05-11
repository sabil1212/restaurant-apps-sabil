import API_ENDPOINT from './api-endpoint';
import dbModule from './favorite-db';

const DataSource = {
  async showList() {
    try {
      const response = await fetch(API_ENDPOINT.SHOW_LIST);
      const responseJson = await response.json();
      return responseJson.restaurants;
    } catch (error) {
      console.error('Error fetching showList data:', error);
      return null;
    }
  },

  async restaurantDetail(restaurantId) {
    try {
      const response = await fetch(API_ENDPOINT.RESTAURANT_DETAIL(restaurantId));
      const responseJson = await response.json();
      return responseJson.restaurant;
    } catch (error) {
      console.error('Error fetching restaurantDetail data:', error);
      return null;
    }
  },

  async saveFavorite(restaurant) {
    try {
      const isSaved = await dbModule.get(restaurant.id);
      if (!isSaved) {
        await dbModule.put(restaurant);
        console.log(`Restaurant with ID ${restaurant.id} saved to favorites.`);
      } else {
        console.log(`Restaurant with ID ${restaurant.id} is already in favorites.`);
      }
      return { success: true };
    } catch (error) {
      console.error('Error saving favorite:', error);
      return { success: false, message: error.message };
    }
  },

  async submitReview(restaurantId, name, review) {
    try {
      if (!restaurantId) {
        throw new Error('Invalid restaurantId');
      }
      const response = await fetch(`${API_ENDPOINT.SUBMIT_REVIEW}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: restaurantId, name, review }),
      });
      const data = await response.json();
      console.log('Review berhasil ditambahkan:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting review:', error);
      return { success: false, message: error.message };
    }
  },
};

export default DataSource;
