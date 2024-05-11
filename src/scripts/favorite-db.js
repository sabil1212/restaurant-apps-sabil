import { openDB } from 'idb';
import CONFIG from './config';

const dbPromise = openDB(CONFIG.DATABASE_NAME, CONFIG.DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(CONFIG.OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const dbModule = {
  async getAllFavorites() {
    return (await dbPromise).getAll(CONFIG.OBJECT_STORE_NAME);
  },

  async get(id) {
    return (await dbPromise).get(CONFIG.OBJECT_STORE_NAME, id);
  },

  async put(restaurant) {
    return (await dbPromise).put(CONFIG.OBJECT_STORE_NAME, restaurant);
  },

  async delete(id) {
    return (await dbPromise).delete(CONFIG.OBJECT_STORE_NAME, id);
  },
};

export default dbModule;
