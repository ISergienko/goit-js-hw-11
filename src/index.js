import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import ApiService from './api-service.js';

const lightbox = new SimpleLightbox('.photo-card a');
const apiService = new ApiService();

const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', searchContent);
loadMoreBtn.addEventListener('click', loadMore);

function hideBtnMore(data) {
  const totalHits = data.totalHits;
  const totalPages = Math.ceil(totalHits / apiService.perPage);

  if (apiService.page > totalPages) {
    loadMoreBtn.classList.remove('show');

    window.onscroll = () => {
      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
    };
  }
}

function showMessage(data) {
  const totalHits = data.totalHits;

  console.log(totalHits);
  if (totalHits > 40) {
    loadMoreBtn.classList.add('show');
  }

  if (totalHits > 0) {
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    loadMoreBtn.classList.remove('show');
  }
}

function renderData(collection) {
  const hits = collection.hits;

  const cards = hits
    .map(value => {
      return `<div class="photo-card">
              <a href="${value.largeImageURL}">
                <img src="${value.webformatURL}" alt="${value.tags}" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <i>Likes</i>
                    <b>${value.likes}</b>
                  </p>
                  <p class="info-item">
                    <i>Views</i>
                    <b>${value.views}</b>
                  </p>
                  <p class="info-item">
                    <i>Comments</i>
                    <b>${value.comments}</b>
                  </p>
                  <p class="info-item">
                    <i>Downloads</i>
                    <b>${value.downloads}</b>
                  </p>
                </div>
                </a>
              </div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeEnd', cards);

  lightbox.refresh();
}

function cleanGallery() {
  gallery.innerHTML = '';
}

function searchContent(e) {
  e.preventDefault();

  loadMoreBtn.classList.remove('show');
  apiService.resetPage();

  apiService.searchQuery = e.target.elements.searchQuery.value;

  if (apiService.searchQuery.length === 0 || apiService.searchQuery.includes(' ')) {
    Notiflix.Notify.failure('Please enter your query');
  } else {
    apiService
      .getData()
      .then(collection => {
        showMessage(collection);
        return collection;
      })
      .then(renderData);
  }

  cleanGallery();
}

function loadMore() {
  apiService
    .getData()
    .then(collection => {
      hideBtnMore(collection);
      return collection;
    })
    .then(renderData);

  smoothScroll();
}

function smoothScroll() {
  setTimeout(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2.5,
      behavior: 'smooth',
    });
  }, 500);
}
