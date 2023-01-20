import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Pictures } from './js/pictures';
import { createMarkup, galleryEl } from './js/create-markup';

const formEl = document.querySelector('form#search-form');
const loadBtn = document.querySelector('.load-more');
const startBtn = document.querySelector('.to-start-btn');

let querry = '';
let page = 1;

formEl.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', onClick);
startBtn.addEventListener('click', onStart);

async function onSearch(evt) {
  evt.preventDefault();
  galleryEl.innerHTML = '';
  startBtn.hidden = true;
  loadBtn.hidden = true;
  querry = formEl.searchQuery.value.trim();

  if (!querry) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  try {
    await Pictures(querry, (page = 1)).then(pics => {
      pics.hits.map(pic => createMarkup(pic));
      if (pics.hits.length < 40) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      } else {
        Notify.success(`Hooray! We found ${pics.totalHits} images.`);
        loadBtn.hidden = false;
      }
    });
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
}

async function onClick() {
  page += 1;
  try {
    await Pictures(querry, page).then(pics => {
      if (pics.hits.length < 40) {
        loadBtn.hidden = true;
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
      pics.hits.map(pic => {
        createMarkup(pic);
      });
      startBtn.hidden = false;
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2.4,
        behavior: 'smooth',
      });
    });
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
}

function onStart() {
  document.querySelector('.search-form').scrollIntoView({ behavior: 'smooth' });
}