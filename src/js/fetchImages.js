import axios from 'axios';

const API_KEY = '34961541-6d5c00c2050e86bf56b399f26';
const URL = 'https://pixabay.com/api/';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.count = 16;
  }
  async fetchImages() {
    try {
      const response = await axios.get(`${URL}`, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          page: this.page,
          per_page: this.count,
          safesearch: true,
          lang: 'pl,bg',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
