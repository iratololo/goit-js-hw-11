import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { elements } from './js/elements';
import { options, BASE_URL } from './js/api-data';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const { form, gallery, guard} = elements;

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    showCounter: false,
    scrollZoom: false,
    overlayOpacity: 0.9,
});

const option = {
  root: null,
  rootMargin: "350px",
};

const observer = new IntersectionObserver(handlerLoadMore, option);


form.addEventListener('submit', handlerSearch);



async function handlerSearch(e) {
    e.preventDefault();
    options.params.page = 1;
    options.params.q === "";
    gallery.innerHTML = '';
    let enteredValue = e.currentTarget.elements.searchQuery;
    options.params.q = enteredValue.value.trim();
    if (options.params.q === "") {
        Notify.failure('"Еhe search field is empty, please enter something."');
        return;
    }
    // options.params.q = enteredValue.value.trim();
    try {
        // const images = await serviceGetImages();
        // const { hits, totalHits } = images;
        const resp = await axios.get(BASE_URL, options);
        const totalHits = resp.data.totalHits;
        const hits = resp.data.hits;
        if (!totalHits) {
            enteredValue.value = '';
            Notify.failure('"Sorry, there are no images matching your search query. Please try again."');
            return;
        }
        Notify.success(`Hooray! We found ${totalHits} images.`);
        gallery.insertAdjacentHTML('beforeend', createMurkupGallery(hits));
        lightbox.refresh();
        enteredValue.value = '';
        if (options.params.page * options.params.per_page < totalHits && options.params.q !== "") {
            observer.observe(guard);
        }
    
    } catch (error) {
        console.log('object :>> ',error);
        Notify.failure(error); 
    }
}



async function handlerLoadMore(entries, observer) {
    entries.forEach(async entry => {
        if (entry.isIntersecting && options.params.q !== "") {
            options.params.page += 1;
            try {
                // const images = await serviceGetImages();
                // console.log('images', images);
                // const { hits, totalHits } = images;
                const resp = await axios.get(BASE_URL, options);
        const totalHits = resp.data.totalHits;
        const hits = resp.data.hits;
                gallery.insertAdjacentHTML('beforeend', createMurkupGallery(hits));
                lightbox.refresh();
                if (options.params.page * options.params.per_page >= totalHits && totalHits !== 0) {
                    observer.unobserve(guard);
                    guard.textContent = "We're sorry, but you've reached the end of search results.";
                    guard.style.padding = "30px";
                }
            } catch (error) {
                console.log('catch observer',error);
                            Notify.failure(error);
            }
        }
    });
}




function createMurkupGallery(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<a href="${largeImageURL}" class="photo-card"> 
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    ${likes}
                </p>
                <p class="info-item">
                    <b>Views</b>
                     ${views}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    ${downloads}
                </p>
            </div>
        </a>`).join("");}


// export async function serviceGetImages() {
//     const resp = await axios.get(BASE_URL, options);
//     // const { hits, totalHits } = resp.data;
//     return resp.data;
//     // console.log(totalHits);
// }
































