import { PictureAPI } from './js/picturePpixabayAPI.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formElem: document.querySelector('.search-form'),
  inputFormElem: document.querySelector('.search-form-input'),
  btnSearch: document.querySelector('.search-form-button'),
  gallery: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.btnLoad.style.display = 'none';

const pictureAPI = new PictureAPI();

refs.formElem.addEventListener('submit', searchPictures);
refs.btnLoad.addEventListener('click', addPictures);

function searchPictures(event) {
  event.preventDefault();
  clearGallery();
  pictureAPI.searchQuery =
    event.currentTarget.elements.searchQuery.value.trim();
  const inputValue = pictureAPI.searchQuery;

  pictureAPI.getPicture().then(data => {
    refs.btnLoad.style.display = 'none';

    if (inputValue && data.hits.length) {
      appendPicteureMarkup(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.btnLoad.style.display = 'block';
      // if (data.hits.length) {
      //   refs.btnLoad.style.display = 'block';
      // }
      gallerySimpleLightbox.refresh();
    } else if (inputValue === '') {
      Notiflix.Notify.failure('Please enter a search term.');
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

function addPictures() {
  pictureAPI.getPicture().then(data => {
    //console.log(data.hits);
    appendPicteureMarkup(data.hits);
    gallerySimpleLightbox.refresh();
    if (+refs.gallery.children.length === +data.totalHits) {
      console.log(data.totalHits);
      refs.btnLoad.style.display = 'none';
      Notiflix.Notify.info('These are the latest pictures for your request.');
    } else {
      Notiflix.Notify.success('More photos.');
    }
  });
}

function appendPicteureMarkup(hits) {
  console.log(hits);
  refs.gallery.insertAdjacentHTML('beforeend', renderPictures(hits));
}

function renderPictures(hits) {
  const markup = hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
                <a class="gallery-item" href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        <span class="info-item-api">${likes}</span>
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        <span class="info-item-api">${views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        <span class="info-item-api">${comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        <span class="info-item-api">${downloads}</span>
                    </p>
                </div>
              </div>`
    )
    .join('');
  return markup;
}

function clearGallery() {
  refs.gallery.innerHTML = '';
  pictureAPI.resetPage();
  refs.btnLoad.style.display = 'none';
}
