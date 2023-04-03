import { PixabayApi } from './fetchData';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderGallery } from './renderGallery';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const inputEl = document.querySelector('input[name="searchQuery"]');

let lightbox = null;
const pixabayApi = new PixabayApi();

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  pixabayApi.query = event.target.elements.searchQuery.value.trim();
  inputEl.value = '';
  pixabayApi.resetPage();

  if (pixabayApi.query === '') {
    Notiflix.Notify.failure('Sorry, enter something in search line.');
    clearMarkup();
    hideLoadMoreBtn();
    return;
  }

  try {
    const { data } = await pixabayApi.fetchPhoto();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearMarkup();
      hideLoadMoreBtn();
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryContainer.innerHTML = renderGallery(data.hits);
    showLoadMoreBtn();

    lightbox = new SimpleLightbox('.gallery  a', {
      captionDelay: 250,
      scrollZoom: false,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

    if (data.totalHits <= pixabayApi.perPage) {
      hideLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  pixabayApi.incrementPage();

  try {
    const { data } = await pixabayApi.fetchPhoto();

    if (Math.ceil(data.totalHits / pixabayApi.perPage) === pixabayApi.page) {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    galleryContainer.insertAdjacentHTML('beforeend', renderGallery(data.hits));
    lightbox.refresh();
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  galleryContainer.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}
