import axios from 'axios';

const API_KEY = '34961541-6d5c00c2050e86bf56b399f26';
const URL = 'https://pixabay.com/api/';

export class ImageApi {
  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchImage() {
    try {
      return await axios.get(`${URL}`, {
        params: {
          key: API_KEY,
          q: this.query,
          image_type: 'photo',
          orientation: 'horizontal',
          page: this.page,
          per_page: this.perPage,
          safesearch: true,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
