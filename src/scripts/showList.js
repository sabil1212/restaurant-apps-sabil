import 'regenerator-runtime';
import render from './restaurantDetail';
import DataSource from './data-source';
import { createRestaurantCard } from './template-creator';

const addReadMoreListener = () => {
  const readMoreLinks = document.querySelectorAll('.read-more a');
  readMoreLinks.forEach((link) => {
    // eslint-disable-next-line func-names
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const restaurantId = this.closest('.restaurant-card').id.replace('restaurant-', '');
      render(restaurantId);
    });
  });
};

const showList = {
  async render() {
    try {
      const restaurants = await DataSource.showList();

      const heroSection = document.querySelector('.hero');
      const restaurantsContainer = document.createElement('div');
      restaurantsContainer.classList.add('restaurants-container');

      restaurants.forEach((restaurant) => {
        const restaurantCard = document.createElement('div');
        restaurantCard.innerHTML = createRestaurantCard(restaurant);
        restaurantsContainer.appendChild(restaurantCard);
      });

      heroSection.insertAdjacentElement('afterend', restaurantsContainer);
      addReadMoreListener();
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  },
};

export default showList;
