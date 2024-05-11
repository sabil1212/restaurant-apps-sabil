import DataSource from './data-source';
import { createRestaurantDetail, createLikeButtonTemplate, createLikedButtonTemplate, createReviewFormTemplate } from './template-creator';
import dbModule from './favorite-db';

const render = async (restaurantId) => {
  try {
    const restaurant = await DataSource.restaurantDetail(restaurantId);

    renderRestaurantDetail(restaurant);
    renderLikeButton(restaurantId);
    setupReviewFormListener(restaurantId);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
};

const renderRestaurantDetail = (restaurant) => {
  const detailContainer = document.getElementById('maincontent');
  detailContainer.innerHTML = createRestaurantDetail(restaurant);

  const likeButtonContainer = document.getElementById('likeButtonContainer');
  likeButtonContainer.innerHTML = createLikeButtonTemplate();

  const reviewFormContainer = document.getElementById('reviewFormContainer');
  reviewFormContainer.innerHTML = createReviewFormTemplate();
};

const setupReviewFormListener = (restaurantId) => {
  document.getElementById('reviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const reviewName = document.getElementById('reviewName').value;
    const reviewContent = document.getElementById('reviewContent').value;

    try {
      const result = await DataSource.submitReview(restaurantId, reviewName, reviewContent);
      if (result.success) {
        console.log('Review berhasil ditambahkan:', result.data);
        // eslint-disable-next-line no-alert
        alert('Terima kasih atas review Anda');
      } else {
        console.error('Error submitting review:', result.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  });
};

const renderLikeButton = async (restaurantId) => {
  const likeButton = document.getElementById('likeButton');
  if (!likeButton) return;

  try {
    const restaurant = await dbModule.get(restaurantId);
    if (restaurant) {
      likeButton.innerHTML = createLikedButtonTemplate();
      likeButton.classList.add('liked');
      console.log('Tombol like sudah ditambahkan (Sudah disukai)');
    } else {
      likeButton.innerHTML = createLikeButtonTemplate();
      console.log('Tombol like sudah ditambahkan (Belum disukai)');
    }

    likeButton.addEventListener('click', async () => {
      if (!restaurant) {
        await dbModule.put({ id: restaurantId });
        likeButton.classList.add('liked');
      } else {
        await dbModule.delete(restaurantId);
        likeButton.classList.remove('liked');
      }

      renderLikeButton(restaurantId);
    });
  } catch (error) {
    console.error('Error rendering like button:', error);
  }
};

// Tambahkan window.history.pushState di sini
const updateHistory = (restaurantId) => {
  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, null, `/detail/${restaurantId}`);
};

export default async (restaurantId) => {
  await render(restaurantId);
  updateHistory(restaurantId);
};
