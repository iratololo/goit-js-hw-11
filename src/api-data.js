import axios from 'axios';
BASE_URL = 'https://pixabay.com/api/';
const API_KEY = "11644375-e9c2f2fccdc526658b5d6a867";
export const options = {
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 1,
    q: '',
  },
};


export async function serviceGetImages() {
    const resp = await axios.get(BASE_URL, options);
    return { hits, totalHits } = resp.data;
}