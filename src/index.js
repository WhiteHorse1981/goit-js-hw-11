import { PictureAPI } from './js/picturePpixabayAPI.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderPictures } from './js/renderPictures';

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
  let amounItemsPage = pictureAPI.amountOfElements;

  pictureAPI.getPicture().then(data => {
    refs.btnLoad.style.display = 'none';

    if (inputValue && data.hits.length) {
      appendPicteureMarkup(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      refs.btnLoad.style.display = 'block';
      if (data.hits.length < amounItemsPage) {
        refs.btnLoad.style.display = 'none';
      }
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

function clearGallery() {
  refs.gallery.innerHTML = '';
  pictureAPI.resetPage();
  refs.btnLoad.style.display = 'none';
}
