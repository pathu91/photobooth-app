const video = document.createElement("video");
video.id = "video-stream";
const container = document.querySelector("#video-preview");
var photosToPrint = [];
var imageCount = 0;
var num = Math.ceil(Math.random()) * 8 * 32 * 1000;
var firstRun = true;

async function getCam() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            aspectRatio: 16 / 9,
            width: {
                ideal: 1280
            }
        }
    });
    var a = stream.getVideoTracks()[0].getSettings()
    console.log('settings', a)
    return stream;
}

function saveImage() {
    console.log('called');
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 3024;
    canvas.height = 4032;
    const backgroundImage = new Image();
    backgroundImage.src = "./test.jpg";
    backgroundImage.onload = () => {
        console.log('background loaded');
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        let loadedImagesCount = 0;
        const totalImagesCount = photosToPrint.length;
        console.log('total iamges')

        photosToPrint.forEach((img) => {
            console.log('image loaded');
            loadedImagesCount++;
            if (loadedImagesCount === totalImagesCount) { // Corrected the equality check
                let i = 0;
                photosToPrint.forEach((img, index) => {
                    console.log(img.height);
                    console.log(img.width);
                    let dy = (img.height * i) + 500 + (index * 100);
                    console.log('dy', dy)
                    context.drawImage(img, 1112, dy, img.width, img.height);
                    i++;
                });
                const link = document.createElement('a');
                link.download = `hulubabyshower_${num}`;
                link.href = canvas.toDataURL('image/jpeg');
                link.click();
                reset();
                console.log('link clicked');
            }
        });
    };
}
function refresh() {
    location.reload()
}
function reset() {
    console.log('reset');
    photosToPrint = [];
    imageCount = 0;
    firstRun = false;
    clearInterval(countdown);
}

var isRunning = false;
function startHandler() {
    if (isRunning) {
        console.log('currently running')
        return;
    }

    isRunning = true;
    captureImage();
}

function captureImage() {
    if (imageCount >= 3) {
        firstRun = false;
        isRunning = false;
        clearTimeout(captureTimeout);
        return saveImage();
    }

    if (firstRun) {
        startCountdown();
    }

    var captureTimeout = setTimeout(() => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        previewImage(canvas);
    }, 5000)
}

function startCountdown() {
    var text = ['GET READY', '3', '2', '1', '1'];
    var countdownEl = document.getElementById('countdown')
    countdownEl.classList.remove('hide');
    var i = 0;
    const countdown = setInterval(() => {
        if (i > 4) {
            clearInterval(countdown);
            countdownEl.classList.add('hide');
        }
        if (text[i]) {
            countdownEl.innerHTML = text[i];
        } else {
            countdownEl.innerHTML = text[0];
        }
        i += 1;


    }, 1000)
}

function previewImage(canvas) {
    const image = document.querySelector("#image");
    const imageContainer = document.querySelector("#image-preview")
    const dataURL = canvas.toDataURL();
    let img = new Image();
    img.id = "image";
    img.src = dataURL;
    imageContainer.appendChild(img);
    imageContainer.classList.remove("hide");
    photosToPrint.push(img);
    imageCount += 1;
    setTimeout(() => {
        imageContainer.removeChild(img);
        imageContainer.classList.add("hide");
        captureImage();
    }, 2000)
}

(async function () {
    var stream = await getCam();
    video.srcObject = stream;
    container.appendChild(video);
    video.play();
})();
