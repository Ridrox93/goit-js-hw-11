//Imports
import axios from 'axios';

//Export basic logic to work with API
export default async function getUser(search, page) {
  try {
    const BASE_URL = `https://pixabay.com/api/`;
    const searchParams = new URLSearchParams({
      key: '39522726-97c4cbc537e3955cc385e620d',
      q : search,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page,
      per_page: 40,
    });

    const response = await axios.get(`${BASE_URL}/?${searchParams}`);

    return response;
  } catch (error) {
    throw new Error(error);
  }
}

