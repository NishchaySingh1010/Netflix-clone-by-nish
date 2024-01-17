//const
const apikey="7543524441a260664a97044b8e2dc621";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCatagories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id)=>`${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=NETFLIX_CLONE_API_KEY`
}

//boots up the app
function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}

function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPaths.fetchTrending,'Trending Now')
    .then(list =>{
        const randomIndex=parseInt(Math.random()*list.length)
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err)
    });

}

function buildBannerSection(movie){
    const bannerCont=document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    const div=document.createElement('div');
    div.innerHTML=`
                <h2 class="ban-title">${movie.title}</h2>
                <p class="ban-info">Trending in movies | Released date - ${movie.release_date}</p>
                <p class="ban-overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+ '...':movie.overview }</p>
                <div class="ban-buttons-cont">
                    <button class="bs-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" fill="currentColor"></path></svg>&nbsp;&nbsp;Play</button>
                    <button class="bs-button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="Hawkins-Icon Hawkins-Icon-Standard"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" fill="currentColor"></path></svg>&nbsp;&nbsp;More info </button>
                </div>
    `;
    div.className="banner-content container";
    bannerCont.append(div);
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCatagories)
    .then(res=> res.json())
    .then(res => {
        const catagories=res.genres;
        if(Array.isArray(catagories) && catagories.length){
            catagories.slice(0,3).forEach(catagory =>{
                fetchAndBuildMovieSection(apiPaths.fetchMoviesList(catagory.id),catagory.name);
            })
        }
        // console.table(movies);
    })

    .catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl,catagoryName){
    console.log(fetchUrl,catagoryName);
     return fetch(fetchUrl)
    .then(res=> res.json())
    .then(res=>{
        // console.table(res.results);
        const movies=res.results;
        if(Array.isArray(movies) && movies.length){
            buildMovieSection(movies.slice(0,6),catagoryName);
        }  
        return movies;
    })
    .catch(err=> console.error(err))
}

function buildMovieSection(list, catagoryName){
    console.log(list, catagoryName);
    const moviesCont=document.getElementById('movies-cont');
    const moviesListHtML=list.map(item => {
        return ` 
        <img class="movies-item" src="${imgPath}${item.backdrop_path}" alt="${item.title} " onclick="searchMovieTrailer('${item.title}')">
        `;
    }).join('');

    const moviesSectionHTML=`
    <h2 class="mov-sec-heading">${catagoryName}<span class="Explore-nudge">Explore all</span></h2>
       <div class="movies-row">
       ${moviesListHtML}
        </div>
    `

    console.log(moviesListHtML);

    const div=document.createElement('div');
    div.className="movies-section"
    div.innerHTML=moviesSectionHTML;

    // APPEND
    moviesCont.append(div);

}
    
function searchMovieTrailer(movieName){
    if(!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res=> res.json())
    .then(res=>{
        console.log(res.items[0]);
        const bestResult=res.items[0];
        const youtubeUrl=`https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
        window.open(youtubeUrl,'_blank')
    })
    .catch(err=>console.log(err));
}


window.addEventListener('load',function(){
    init();
    this.window.addEventListener('scroll',function(){
        //header ui update
        const header=this.document.getElementById('header');
        if(this.window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
