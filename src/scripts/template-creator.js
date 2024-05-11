import CONFIG from './config';

const createRestaurantCard = (restaurant) => {
  const fullDescription = restaurant.description;
  const shortDescription = fullDescription.substring(0, 100);

  return `
        <div class="restaurant-card" tabindex="0" id="restaurant-${restaurant.id}">
            <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" />
            <div class="restaurant-info">
                <h2 aria-label="${restaurant.name}">${restaurant.name}</h2>
                <p>${shortDescription}<span class="read-more"><a href="#">Baca Lebih Lanjut</a></span></p>
                <p class="full-description" style="display: none;">${fullDescription}</p>
                <p>Rating: ${restaurant.rating}</p>
            </div>
        </div>
    `;
};

const createRestaurantDetail = (restaurant) => `
        <main id="maincontent" role="main" class="restaurant-detail">
            <h2>${restaurant.name}</h2>
            <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="${restaurant.name}" />
            <p class="alamat">Alamat: ${restaurant.address}, ${restaurant.city}</p>
            <p class="deskripsi-detail-resto"> ${restaurant.description}</p>
            <h3>Menu</h3>
            <div class="menu-resto">
                <div class="makanan-section">
                    <h4>Makanan</h4>
                    <ul>
                        ${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}
                    </ul>
                </div>
                <div class="minum-section">
                    <h4>Minuman</h4>
                    <ul>
                        ${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <h3>Customer Reviews</h3>
            <div class="review">
                <ul>
                    ${restaurant.customerReviews.map((review) => `
                        <li>
                            <div class="review-info">
                                <p><strong>${review.name}</strong></p>
                                <p class="review-date">${review.date}</p>
                            </div>
                            <p>${review.review}</p>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div id="reviewFormContainer">
                ${createReviewFormTemplate()}
            </div>
            <div id="likeButtonContainer"></div> <!-- Container untuk tombol like -->
        </main>
    `;

const createReviewFormTemplate = () => `
    <form id="reviewForm">
        <label for="reviewName">Nama:</label>
        <input type="text" id="reviewName" name="reviewName" required>
        <label for="reviewContent">Review:</label>
        <textarea id="reviewContent" name="reviewContent" required></textarea>
        <button type="submit">Kirim Review</button>
    </form>
`;

const createLikeButtonTemplate = () => `
        <button id="likeButton" class="like"><i class="fa fa-heart"></i></button>
    `;

const createLikedButtonTemplate = () => `
        <button id="likeButton" class="like liked"><i class="fa fa-heart"></i></button>
    `;

export {
  createRestaurantCard,
  createLikeButtonTemplate,
  createLikedButtonTemplate,
  createRestaurantDetail,
  createReviewFormTemplate,
};
