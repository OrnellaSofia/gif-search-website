const apiKey = "eq7L69HytYM61kxeb7AkeaVDwEofdYgs";

window.addEventListener("load", () => {
  let arrLocalId = [];
  let arrLocalStorage = Object.entries(localStorage)
  for(let i = 1; i < arrLocalStorage.length; i++){
    arrLocalId.push(arrLocalStorage[i][1])
  }
  console.log(arrLocalId)
  let contenedorMisGuifos = document.querySelector(".contenedor-mis-guifos")
  arrLocalId.forEach(async function (i){
    console.log(i)
    let dataGif = await fetch(`http://api.giphy.com/v1/gifs/${i}?api_key=${apiKey}`)
      .then(res => res.json())
      .then(res => res.data);
      let gif = dataGif.url;
      gif = dataGif.images.fixed_height.url;
      contenedorMisGuifos.innerHTML += '<img src = "'+gif+'">';
  })
})

window.addEventListener('load', () => {
  if (localStorage.getItem("theme") === "light"){
    console.log("light")
  }else{
    let element = document.querySelector(".captura-light");
    element.classList.add("dark-captura");
    document.querySelector("BODY").style.background = "#110038";
    let logoDark = document.getElementById("logo");
    logoDark.src = "assets/gifOF_logo_dark.png";
  }
});

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
botonComenzar.addEventListener('click', () => {
  document.querySelector(".grabacion").style.display = "block" ;
  document.querySelector(".barra-busqueda").style.display = "none";
  document.querySelector(".crear-guifos").style.display = "none";
  document.querySelector(".contenedor-mis-guifos").style.display = "none"
  getStreamAndRecord()
});

let video = document.querySelector(".video-class");
let btnRecord = document.querySelector(".boton-capturar")
let btnStop = document.querySelector(".boton-listo")
let preview = document.querySelector(".preview")
let recorder;


async function getStreamAndRecord(){
  let stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  })
  video.srcObject = stream
  btnRecord.addEventListener("click", () => {
  recorder = new RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    })
  recorder.startRecording()
  btnRecord.style.display = "none";
  btnStop.style.display = "flex";
  document.querySelector(".chequeo").innerHTML = "Capturando Tu Guifo"
  console.log('Recording video ...');
  })
  btnStop.addEventListener("click", function() {
    recorder.stopRecording(stopRecordingCallback);
  })
}

async function stopRecordingCallback() {
  let blob = await recorder.getBlob();
  preview.src = URL.createObjectURL(blob);
  vistaPrevia()
  return blob
}

function vistaPrevia(){
  video.style.display = "none";
  preview.style.display = "block";
  document.querySelector(".chequeo").innerHTML = "Vista Previa"
  btnStop.style.display = "none";
  document.querySelector(".botones-vista-previa").style.display = "flex"
}

document.querySelector(".boton-repetir").addEventListener("click", () => {
  video.style.display = "block";
  preview.style.display = "none";
  document.querySelector(".chequeo").innerHTML = "Un Chequeo Antes de Empezar"
  btnRecord.style.display = "flex";
  document.querySelector(".botones-vista-previa").style.display = "none"
})

document.querySelector(".boton-subir").addEventListener("click", async () => {
  let blobGif = await stopRecordingCallback()
  console.log(blobGif)
  let form = new FormData();
  console.log(form)
  form.append('file', blobGif, 'myGif.gif')
  console.log(form.get('file'))
  uploadingGif()
  await fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, {
    method: 'POST',
    body: form,
  })
  .then(res => res.json())
  .then(res => dataGif = res)
  .catch((error) => {
   console.log("Error al ejecutar " + error)
  })
  gifSaved()
  saveGif(dataGif)
  localStorage.setItem("gif"+dataGif.data.id, dataGif.data.id)
  btnUploaded(blobGif)
})

function uploadingGif(){
  document.querySelector(".chequeo").innerHTML = "Subiendo Gif"
  document.querySelector(".boton-repetir").innerHTML = "Cancelar"
  document.querySelector(".boton-subir").style.display = "none"
  document.querySelector(".preview").style.display = "none"
  document.querySelector(".subiendo-gif").style.display = "block"
}

function gifSaved(){
  document.querySelector(".grabacion").style.display = "none"
  document.querySelector(".gifo-subido").style.display = "block"
  document.querySelector(".img-gif-subido").src = preview.src;
}

async function saveGif(dataGif){
  let dataId = dataGif.data.id;
  let contenedorCaptura = document.querySelector("#tendencias.barra-busqueda")
  contenedorCaptura.style.display = "block";
  document.querySelector(".contenedor-mis-guifos").style.display = "flex";
  let dataGifs = await fetch(`http://api.giphy.com/v1/gifs/${dataId}?api_key=${apiKey}`)
  .then(res => res.json())
  .then(res => res.data);
  let linkGif = dataGifs.url;
  btnCopy(linkGif)
}

document.querySelector("#subir-cancelar").addEventListener("click", () => {
  location.reload();
})

function btnUploaded(blobGif){
  document.querySelector(".descargar-guifo").addEventListener("click", () => {
    invokeSaveAsDialog(blobGif);
  })
}

function btnCopy(linkGif){
  document.querySelector(".copiar-enlace").addEventListener("click", (event) => {
    window.open(linkGif, '_blank');
  })
}

document.querySelector(".subido-listo").addEventListener("click", () => {
  location.reload()
})