import axios from 'axios';

const API_KEY = '34888063-32f27f7df2cbfc9058681e962';
const BASE_URL = 'https://pixabay.com/api/';

export class PixabayApi {
  constructor() {
    this.query = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPhoto() {
    try {
      return await axios.get(`${BASE_URL}`, {
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
