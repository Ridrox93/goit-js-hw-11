import { Notify } from 'notiflix/build/notiflix-notify-aio';

Notify.init({ showOnlyTheLastOne: true })

export const showSuccessMessage = ( foundImagesCount, timeout=1000 ) => { 
  Notify.success(`Hooray! We found ${foundImagesCount} images.`, {
    timeout
  });
};

export const showFailureMessage = (timeout = 1000) => {
  Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.', {
    timeout
  });
};

export const showInfoMessage = (timeout = 1000) => { 
  Notify.info(
      `We're sorry, but you've reached the end of search results.`, {
    timeout
  });
};