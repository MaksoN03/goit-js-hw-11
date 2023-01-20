import axios from 'axios';

const KEY = '33002129-c8fefc6a81330199b280704a4';
const BASE_URL = 'https://pixabay.com/';

export async function Pictures(querry, page) {
  try {
    const response = await axios(
      `${BASE_URL}api/?key=${KEY}&q=${querry}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    const pics = await response.data;
    return pics;
  } catch (error) {
    throw new Error(error);
  }
}