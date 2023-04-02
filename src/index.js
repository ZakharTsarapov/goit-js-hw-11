import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let searchQuery = '';
let totalHits = 40;
const API_KEY = '34961541-6d5c00c2050e86bf56b399f26';
let page = 1;
const per_page = 40;
const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  scrollZoom: false,
});

function onSearch(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  resetMarkup();
  if (!searchQuery) {
    return;
  }
  fetchPictures(searchQuery);
  e.target.reset();
}

function resetMarkup() {
  refs.galleryContainer.innerHTML = '';
}

function renderMarkup(images) {
  page += 1;

  totalHits = images.data.totalHits;
  if (images.data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const createMarkup = images.data.hits
    .map(
      ({
        comments,
        downloads,
        largeImageURL,
        webformatURL,
        views,
        tags,
        likes,
      }) => {
        const markup = `
        <div class="gallery photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item">
                <b>Likes:<br> ${likes}</b>
                </p>
                <p class="info-item">
                <b>Views:<br> ${views}</b>
                </p>
                <p class="info-item">
                <b>Comments:<br> ${comments}</b>
                </p>
                <p class="info-item">
                <b>Downloads:<br> ${downloads}</b>
                </p>
            </div>
            </div>
        `;
        return markup;
      }
    )
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup);

  refs.loadMoreBtn.classList.remove('visually-hidden');

  simpleLightbox.refresh();

  if (images.data.hits.length < 40) {
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
}

function onFetchError() {
  Notiflix.Notify.failure('u made a mistake');
}

function onLoadMore() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  fetchPictures(searchQuery);
  searchQuery = '';
  if (totalHits - page * per_page > 0) {
    Notiflix.Notify.success(
      `Hooray! We found ${totalHits - page * per_page} images.`
    );
  } else if (totalHits - page * per_page < 40) {
    Notiflix.Notify.warning(
      'We`re sorry, but you`ve reached the end of search results.'
    );
  }
}

async function fetchPictures(searchQuery) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: searchQuery,
        per_page: per_page,
        page: page,
        safesearch: true,
        orientation: 'horizontal',
        image_type: 'photo',
      },
    });

    renderMarkup(response);
  } catch (error) {
    onFetchError(error);
  }
}
