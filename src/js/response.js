import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({ showOnlyTheLastOne: true, timeout: 2000 })

export const showSuccessMessage = ( foundImagesCount) => { 
  Notify.success(`Hooray! We found ${foundImagesCount} images.`);
};

export const showFailureMessage = () => {
  Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.');
};

export const showInfoMessage = () => { 
  Notify.info(
      `We're sorry, but you've reached the end of search results.`);
};