const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const photo = document.getElementById('photo')
const link = document.getElementById('link')

// const camera = document.getElementById('camera')


// await faceapi.loadSsdMobilenetv1Model('/models')
// // accordingly for the other models:
// await faceapi.loadTinyFaceDetectorModel('/models')
// await faceapi.loadMtcnnModel('/models')
// await faceapi.loadFaceLandmarkModel('/models')
// await faceapi.loadFaceLandmarkTinyModel('/models')
// await faceapi.loadFaceRecognitionModel('/models')
// await faceapi.loadFaceExpressionModel('/models')

// console.log(faceapi.nets)



Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
  displaySize = { width: video.scrollWidth, height: video.scrollHeight }

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})

startbutton.addEventListener('click', function(ev) {
  takepicture();
  ev.preventDefault();
}, false);

var width = video.width;
var height = video.height;

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, displaySize);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takepicture() {
  var context = canvas.getContext('2d');
  var link = document.getElementById('link');
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  if (displaySize.width && displaySize.height) {
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    photo.setAttribute('src', data);
    photo.setAttribute('downlaod', "download")

    var w = widnow.open('about:blank', 'image from canvas');

    w.document.write("<img src'" + data + "' alt='from canvas'/>")
  } else {
    clearphoto();
  }
}