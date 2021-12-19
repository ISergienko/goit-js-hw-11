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

function renderData(collection) {
  const totalHits = collection.totalHits;

  if (totalHits > 40) {
    loadMoreBtn.classList.add('show');
  }

  if (totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    loadMoreBtn.classList.remove('show');
  }

  const hits = collection.hits;

  let cards = hits
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

  const cardArray = [];
  cardArray.push(cards);

  cardArray.forEach(el => {
    gallery.insertAdjacentHTML('beforeEnd', el);
  });

  lightbox.refresh();
}

function cleanGallery() {
  gallery.innerHTML = '';
}

function searchContent(e) {
  e.preventDefault();

  loadMoreBtn.classList.remove('show');

  apiService.searchQuery = e.target.elements.searchQuery.value;

  if (apiService.searchQuery === '') {
    Notiflix.Notify.info('Please enter your query');
  } else {
    apiService.getData().then(renderData);
  }

  apiService.resetPage();
  cleanGallery();
}

function loadMore() {
  apiService.getData().then(renderData);

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
