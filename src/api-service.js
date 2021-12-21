import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '24859248-4166dc933cd9269e5d8314464';
const imageType = 'photo';
const orientation = 'horizontal';
const safeSearch = true;
// const perPage = 40;

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getData() {
    return await axios
      .get(
        `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&per_page=${this.perPage}&page=${this.page}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}`,
      )
      .then(response => {
        // console.log('api', response.data);
        this.incrementPage();

        return response.data;
      })
      .catch(error => {
        console.log(error);
        console.log('Sorry, there are no images matching your search query. Please try again.');
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
