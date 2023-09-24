import getUser from './pixabay';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { showFailureMessage, showSuccessMessage, showInfoMessage } from './response';

const searchForm = document.querySelector('.search-form');
const galleryDiv = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

let searchText;
let photoPageNumber = 1;
let lastPhotoPageNumber = null;
let PHOTO_COUNT_PER_SCROLL = 40;

const options = {
  root: null, // vieport by default
  rootMargin: '50px',
  threshold: 1.0,
};

const loadMorePhotos = entries => {
  entries.forEach(entry => {
    const isPhotosPresent = galleryDiv.hasChildNodes();

    const shouldFireCallback =
      entry.isIntersecting && isPhotosPresent;

    if (shouldFireCallback) {
     
      getMarkup();
    }
  });
};

const observer = new IntersectionObserver(loadMorePhotos, options);

observer.observe(loadMoreEl);

const resetAppState = () => {
  photoPageNumber = 1;
  lastPhotoPageNumber = null;
};

function prepareMarkup(response) {
  return response.data.hits
    .map(object => {
      return `<a class="img-card" href="${object.largeImageURL}">
  <img src="${object.webformatURL}" alt="${object.tags}" loading="lazy" />
  <div class="about">
    <p class="about-item">
      <b>Likes</b></br> ${object.likes}
    </p>
    <p class="about-item">
      <b>Views</b></br> ${object.views}
    </p>
    <p class="about-item">
      <b>Comments</b></br> ${object.comments}
    </p>
    <p class="about-item">
      <b>Downloads</b></br> ${object.downloads}
    </p>
  </div>
</a>`;
    })
    .join('');
}

function createMarkup(markup, element) {
  element.insertAdjacentHTML('beforeend', markup);
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', async e => {
  e.preventDefault();

  searchText = e.target.elements.searchQuery.value.trim('');

  if (searchText == "") { return Notify.info(
      `Please, write your query!`, {
    timeout: 1500,
  }
  )};


  if (searchText) {
    emptyGallery();
    resetAppState();
    await getMarkup();
    smoothScroll();
  }
});

function emptyGallery() {
  galleryDiv.innerHTML = '';
}

async function getMarkup() {
 
  try {
    const response = await getUser(searchText, photoPageNumber);
  
    if (!response.data.hits.length) {
      showFailureMessage();
    
    }

    lastPhotoPageNumber = Math.ceil(
      response.data.totalHits / PHOTO_COUNT_PER_SCROLL
    );

    if (response.data.totalHits > PHOTO_COUNT_PER_SCROLL) {
      observer.observe(loadMoreEl);
    } 

    if (photoPageNumber === lastPhotoPageNumber) {
      observer.unobserve(loadMoreEl);
      showInfoMessage();
    };

   
    showSuccessMessage(response.data.totalHits);
    const preparation = prepareMarkup(response);
    createMarkup(preparation, galleryDiv);

    photoPageNumber += 1;

    lightbox.refresh();
  } catch (error) {
    throw new Error(error)
  };
}

function smoothScroll() {
  if (galleryDiv) {
    const elemTop = galleryDiv.getBoundingClientRect().top;
    const currentScroll = window.scrollY;

    window.scrollBy({
      top: elemTop - currentScroll,
      behavior: 'smooth',
    });
  } else {
    console.error('Element with ID "galleryDiv" not found.');
  }
}
