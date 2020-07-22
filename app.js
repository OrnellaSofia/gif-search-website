const apiKey = "eq7L69HytYM61kxeb7AkeaVDwEofdYgs";
let currentTheme = localStorage.setItem('theme', 'light');


document.querySelector("#logo").addEventListener("click", () => {
  location.reload();
})

const botonMostarMenu = document.querySelector(".boton2-contenedor")
botonMostarMenu.addEventListener("click", () => {
  let estadoMenu = document.querySelector(".theme-seleccion")
  if (estadoMenu.style.display === "none") {
    estadoMenu.style.display = "block";
  } else {
    estadoMenu.style.display = "none";
  }
});


function cambiarEstiloLight() {
    document.getElementById('theme').className = 'light';
    document.getElementsByTagName("BODY")[0].style.background = "#FFF4FD";
    // let temaActual = document.getElementById("tema-actual");
    // temaActual.href = "styles/light.css";
    let logoLight = document.getElementById("logo");
    logoLight.src = "assets/gifOF_logo.png";
    let lupaLight = document.getElementById("lupa");
    lupaLight.src = "assets/lupa_inactive.svg";
}

function cambiarEstiloDark() {
    // document.getElementById('theme').className = 'dark';
    document.getElementById('theme').className = 'dark';
    document.getElementsByTagName("BODY")[0].style.background = "#110038";
    // let temaActual = document.getElementById("tema-actual");
    // temaActual.href = "styles/dark.css";
    let logoDark = document.getElementById("logo");
    logoDark.src = "assets/gifOF_logo_dark.png";
    let lupaDark = document.getElementById("lupa");
    lupaDark.src = "assets/lupa_dark.svg";
}

async function gifsSugerencias(){
  let apiGiphy = await fetch(`http://api.giphy.com/v1/gifs/trending?limit=4&api_key=${apiKey}`)
  .then(res => res.json())
  .then(res => res.data);
  const arrGifsTrending = Array.from(document.getElementsByClassName("js-gif-sugerencias"));
  const arrTitulos = Array.from(document.querySelectorAll(".barra-titulo"))
  for(let i = 0; i < arrGifsTrending.length; i++) {
    gif = apiGiphy[i].images.fixed_height.url;
    title = apiGiphy[i].title
    arrGifsTrending[i].innerHTML += '<img src = "'+gif+'"  id="gif-sugerencias" title= "'+ title+'">';
    arrTitulos[i].innerText += apiGiphy[i].title;
  }
  newSearchTags(apiGiphy)
}
gifsSugerencias()

let contenedorTendencias = document.querySelector(".contenedor-tendencias");
async function gifsTrending(){
  let dataGifs = await fetch(`http://api.giphy.com/v1/gifs/trending?limit=19&api_key=${apiKey}&offset=8`)
  .then(res => res.json())
  .then(res => res.data);
  for(let i = 0; i < dataGifs.length; i++){
    gif = dataGifs[i].images.fixed_height.url;
    contenedorTendencias.innerHTML += '<img src = "'+gif+'" id="gif-tendencias">'; 
  }
}
gifsTrending()


let buscadorBarra = document.querySelector("#buscador")
buscadorBarra.addEventListener("input", () => {
    document.querySelector(".menu-input").style.display = "block";
    if(document.getElementById('theme').className === 'light'){
      document.querySelector(".boton-buscador").style.background = "#F7C9F3";
      document.querySelector(".boton-buscador-txt").style.color = "#110038";
      document.getElementById("lupa").src = "assets/lupa.svg";
    }else{
      document.querySelector(".boton-buscador").style.background = "#EE3EFE";
      document.querySelector(".boton-buscador-txt").style.color = "#FFFFFF";
      document.getElementById("lupa").src = "assets/lupa_light.svg";
    }
    window.addEventListener("click", () => {
      document.querySelector(".menu-input").style.display = "none";
      if(document.getElementById('theme').className === 'light'){
        document.querySelector(".boton-buscador").style.background = "#E6E6E6";
        document.querySelector(".boton-buscador-txt").style.color = "#B4B4B4";
        document.getElementById("lupa").src = "assets/lupa_inactive.svg";
      }else{
        document.querySelector(".boton-buscador").style.background = "#B4B4B4";
        document.querySelector(".boton-buscador-txt").style.color = "#8F8F8F";
        document.getElementById("lupa").src = "assets/lupa_dark.svg";
      }
    })
    menuSuggestions()
})

//////////

let contenedorResultados = document.querySelector(".contenedor-resultados");
let botonBusqueda = document.querySelector(".boton-buscador")
let barraResultados = document.querySelector(".resultados-busqueda")

function hideTrendingGifs(){
  document.querySelector(".gifs-sugerencias-contenedor").style.display = "none";
  document.querySelector("#sugerencias").style.display = "none";
  document.querySelector("#tendencias").style.display = "none";
  document.querySelector(".contenedor-tendencias").style.display = "none";
};

botonBusqueda.addEventListener("click", () => {
  checkInput()
}) 

async function checkInput() {
  var terminoBusqueda = document.getElementById("buscador").value;
  const data = await searchGifs(terminoBusqueda);
  barraResultados.style.display = "block";
  if (terminoBusqueda == ""){
    alert("Ingresa un término en la barra de búsqueda")
  } else{
    contenedorResultados.innerHTML = "";
    hideTrendingGifs()
  for(let i = 0; i < data.length; i++){
    gif = data[i].images.fixed_height.url;
    contenedorResultados.innerHTML += '<img src = "'+gif+'"  title="GIF via Giphy" id="gif-resultado">'; 
  }
}
}

async function searchGifs(terminoBusqueda) {
  let dataGifs = await fetch (`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q="+${terminoBusqueda}+"&limit=32`)
  .then(res => res.json())
  .then(res => res.data);
  return dataGifs;
};

async function menuSuggestions(){
  let valor = document.getElementById("buscador").value;
  let dataApi = await fetch (`https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${valor}`)
  .then(res => res.json())
  .then(res => res.data)
  console.log(dataApi)
  let arrBotones = Array.from(document.querySelectorAll(".input-boton"))
  for(let i = 0; i < arrBotones.length; i++){
    gifSuggestion = dataApi[i].name;
    arrBotones[i].innerHTML = gifSuggestion; 
  }
}

let arrBotonesBusqueda = Array.from(document.querySelectorAll(".input-boton"))
  arrBotonesBusqueda.forEach(function(item) {
    item.addEventListener("click", async function () {
      let terminoBusqueda = item.innerHTML;
      console.log(terminoBusqueda)
      let data = await searchGifs(terminoBusqueda);
      barraResultados.style.display = "block";
      hideTrendingGifs()
      contenedorResultados.innerHTML = "";
      for(let i = 0; i < data.length; i++){
        gif = data[i].images.fixed_height.url;
        contenedorResultados.innerHTML += '<img src = "'+gif+'"  title="GIF via Giphy" id="gif-resultado">'; 
      }
    })
  })


// 1) Acceder al title de c/gif
// 2) Slice 0:10
// 3) Tomar ese nuevo string como terminoBusqueda para una nueva búsqueda (función)


let arrVerMas = Array.from(document.querySelectorAll(".gif-ver-mas"))
async function newSearchTags(apiGiphy){
  arrVerMas.forEach(function (item) {
    item.addEventListener("click", async function() {
      let terminoBusqueda = apiGiphy[0].title.substr(0, 15);
      const data = await searchGifs(terminoBusqueda);
      barraResultados.style.display = "block";
      hideTrendingGifs()
      for(let i = 0; i < data.length; i++){
        gif = data[i].images.fixed_height.url;
        contenedorResultados.innerHTML += '<img src = "'+gif+'"  title="GIF via Giphy" id="gif-resultado">'; 
      }
    })
  })
}
