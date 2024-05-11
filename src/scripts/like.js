import dbModule from './favorite-db';
import render from './restaurantDetail';
import DataSource from './data-source';
import '../styles/main.css';

const Like = {
  async render() {
    return `
            <div id="maincontent" class="favorite">
                <h2>Favorite Restaurants</h2>
                <div class="restaurants-container">
                    <!-- Daftar restoran favorit akan dimuat di sini -->
                </div>
            </div>
        `;
  },
  async afterRender() {
    try {
      const favoriteRestaurants = await dbModule.getAllFavorites();

      const mainContent = document.getElementById('maincontent');
      const restaurantsContainer = document.createElement('div');
      restaurantsContainer.classList.add('restaurants-container');

      if (favoriteRestaurants && favoriteRestaurants.length > 0) {
        const restaurantPromises = favoriteRestaurants.map(async (restaurant) => {
          const fullRestaurantData = await DataSource.restaurantDetail(restaurant.id);
          return fullRestaurantData;
        });

        const fullRestaurantDataArray = await Promise.all(restaurantPromises);

        fullRestaurantDataArray.forEach((fullRestaurantData) => {
          const restaurantCard = document.createElement('div');
          restaurantCard.classList.add('restaurant-card');
          restaurantCard.id = `restaurant-${fullRestaurantData.id}`;

          const fullDescription = fullRestaurantData.description;
          const shortDescription = fullDescription.substring(0, 100);

          restaurantCard.innerHTML = `
                        <img src="https://restaurant-api.dicoding.dev/images/medium/${fullRestaurantData.pictureId}" alt="${fullRestaurantData.name}" />
                        <div class="restaurant-info">
                            <h3>${fullRestaurantData.name}</h3>
                            <p>${shortDescription}</p>
                            <a href="#" class="read-more" data-id="${fullRestaurantData.id}">Baca Lebih Lanjut</a>
                        </div>
                    `;

          restaurantsContainer.appendChild(restaurantCard);
        });
      } else {
        restaurantsContainer.innerHTML = '<p>No favorite restaurants yet.</p>';
      }

      mainContent.innerHTML = '';
      mainContent.appendChild(restaurantsContainer);

      restaurantsContainer.querySelectorAll('.read-more').forEach((link) => {
        link.addEventListener('click', function (event) {
          event.preventDefault();
          const restaurantId = this.dataset.id;
          render(restaurantId);
        });
      });
    } catch (error) {
      console.error('Error loading favorite restaurants:', error);
      const mainContent = document.getElementById('maincontent');
      mainContent.innerHTML = '<p>Failed to load favorite restaurants.</p>';
    }
  },
};

export default Like;
