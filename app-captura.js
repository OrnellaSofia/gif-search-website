
let flechaVar = document.getElementById("flecha")
flechaVar.addEventListener( "click", () => {
  window.location.href = 'index.html';
});

let botonCancelar = document.querySelector(".div-cancelar")
botonCancelar.addEventListener("click", () => {
  window.location.href = 'index.html';
});

let iconoEquis = document.querySelector(".icono-equis")
iconoEquis.addEventListener("click", () => {
  document.querySelector(".grabacion").style.display = "none" ;
  document.querySelector(".barra-busqueda").style.display = "block";
  document.querySelector(".crear-guifos").style.display = "block";
});

let botonComenzar = document.querySelector('.div-comenzar')
botonComenzar.addEventListener('click', async () => {
  document.querySelector(".grabacion").style.display = "block" ;
  document.querySelector(".barra-busqueda").style.display = "none";
  document.querySelector(".crear-guifos").style.display = "none";
  getStreamAndRecord()
})

async function getStreamAndRecord(){
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      height: { max: 480},
      width: {max: 830}
    }
  })
  .then((stream) => {
    document.querySelector('video').srcObject = stream
  })
}
