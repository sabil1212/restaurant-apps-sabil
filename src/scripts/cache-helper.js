import CONFIG from './config.js';

const CacheHelper = {
  async cachingAppShell(requests) {
    const cache = await this._openCache();
    cache.addAll(requests);
  },

  async deleteOldCache() {
    const cacheNames = await caches.keys();
    cacheNames
      .filter((name) => name !== CONFIG.CACHE_NAME)
      .map((filteredName) => caches.delete(filteredName));
  },

  async revalidateCache(request) {
    try {
      const response = await caches.match(request);

      if (response) {
        return response;
      }

      return await this._fetchRequest(request);
    } catch (error) {
      console.error('Error revalidating cache:', error);
      throw error;
    }
  },

  async _openCache() {
    return caches.open(CONFIG.CACHE_NAME);
  },

  async _fetchRequest(request) {
    try {
      const response = await fetch(request);

      if (!response || response.status !== 200) {
        throw new Error(`Failed to fetch: ${request.url}`);
      }

      await this._addCache(request, response.clone());
      return response;
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  },

  async _addCache(request, response) {
    const cache = await this._openCache();
    cache.put(request, response);
  },
};

export default CacheHelper;
