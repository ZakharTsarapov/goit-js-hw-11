import { ImageApi } from './js/fetchImage';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { markupGallery } from './js/template';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  inputEl: document.querySelector('input[name="searchQuery"]')
};

let lightbox = null;
const imageApi = new ImageApi();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSearch(event) {
  event.preventDefault();

  imageApi.query = event.target.elements.searchQuery.value.trim();
  refs.inputEl.value = '';
  imageApi.resetPage();

  if (pixabayApi.query === '') {
    Notiflix.Notify.failure('Sorry, enter something in search line.');
    clearMarkup();
    hideLoadMoreBtn();
    return;
  }

  try {
    const { data } = await imageApi.fetchImage();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearMarkup();
      hideLoadMoreBtn();
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.galleryContainer.innerHTML = markupGallery(data.hits);
    showLoadMoreBtn();

    lightbox = new SimpleLightbox('.gallery  a', {
      captionDelay: 250,
      scrollZoom: false,
      captionsData: 'alt',
      captionPosition: 'bottom',
    });

    if (data.totalHits <= imageApi.perPage) {
      hideLoadMoreBtn();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  imageApi.incrementPage();

  try {
    const { data } = await imageApi.fetchImage();

    if (Math.ceil(data.totalHits / imageApi.perPage) === imageApi.page) {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    refs.galleryContainer.insertAdjacentHTML('beforeend', markupGallery(data.hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }
}

function clearMarkup() {
  refs.galleryContainer.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
