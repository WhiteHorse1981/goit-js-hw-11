import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '12264091-4cbd1db829d9f1cef61b91b7a';
const PARAM = '&orientation=horizontal&image_type=photo&safesearch=true';

export class PictureAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.amountOfElements = 40;
  }

  async getPicture() {
    try {
      const res = await axios.get(
        `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.amountOfElements}${PARAM}`
      );
      //console.log(res.data);
      this.addPage();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

  addPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
