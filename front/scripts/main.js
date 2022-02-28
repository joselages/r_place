
const socket = io();
const loadingIcon = document.querySelector('.js-loadingIcon');
const logoutBtn = document.querySelector('.js-logoutBtn');
const loginBtn = document.querySelector('.js-loginBtn');
const welcomeMsg = document.querySelector('.js-welcomeMsg');
const isLogged = localStorage.getItem('rPlaceLoginJWT');
const userName = localStorage.getItem('rPlaceUserName');
const infoWindow = document.querySelector('.js-infoWindow');
const closeMenu = document.querySelector('.js-hideMenu');
const openMenu = document.querySelector('.js-openMenu');
const sideMenu = document.querySelector('.js-sideMenu');
const mainContainer = document.querySelector('.js-mainConatiner');

closeMenu.addEventListener('click',() => {
    closeMenu.classList.add('hidden');
    openMenu.classList.remove('hidden');
    sideMenu.classList.add('-close')
});
openMenu.addEventListener('click',() =>{
    closeMenu.classList.remove('hidden');
    openMenu.classList.add('hidden');
    sideMenu.classList.remove('-close')
});



function getHeaderHeight(){
    const headerHeight = document.querySelector('.header').offsetHeight;
    document.documentElement.style.setProperty('--headerHeight',`${headerHeight}px`) 
}

function setWindowHeight(){
    const vh = window.innerHeight * 0.01;
     document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', () => setWindowHeight());

if(!isLogged){
    logoutBtn.remove();
} else {
    welcomeMsg.innerHTML = `Hello <span class="font-semibold">${userName}</span>!`
    loginBtn.remove();
}

logoutBtn.addEventListener('click', () => {

   if( !isLogged ){
       return;
   }

   localStorage.removeItem('rPlaceLoginJWT');
   localStorage.removeItem('rPlaceUserName');
   window.location = '/';        
});

async function getPixels(){
    const request = await fetch('/pixels',{
        method: 'GET',
        headers: {"Content-Type": "application/json"}
    });

    const response = await request.json();

    return response;
}

let pixels;
document.addEventListener('DOMContentLoaded', async () => {

    canvas.style.pointerEvents = 'none';
    getHeaderHeight();
    setWindowHeight()

    pixels = await getPixels();
    
    for(pixel of pixels){
        paintCanvas(pixel);
    }

    loadingIcon.remove();
    canvas.removeAttribute('style');
    
    if(isLogged){
        socket.emit('log', {'name': userName, action: 'login'});
    }
    
    socket.on('checkin', (data) => {
        const newSpan = document.createElement('span');
        let msg = '';
        switch (data.action) {
            case 'login':
                msg = 'Welcome <b>' + data.name + '</b>!';
                break;
            case 'paint':
                msg = 'Nice <b style="color:'+data.color+'">pixel</b>, <b>' + data.name + '</b>!';

                if(data.color === "#ffffff"){
                    msg = 'Nice <b style="padding:2px;background:black;color:'+data.color+'">pixel</b>, <b>' + data.name + '</b>!';
                }

                break;
        }

        newSpan.innerHTML = msg;
        infoWindow.appendChild(newSpan);
    });

})

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

function paintCanvas(pixel){
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, 1, 1);
}


const canvasZoomSize = canvas.offsetHeight;
const canvasRealSize = Number(canvas.attributes.width.value);
function convertPos(x, y) {
    const realX = Math.floor(canvasRealSize * x / canvasZoomSize);
    const realY = Math.floor(canvasRealSize * y / canvasZoomSize);
    return { x: realX, y: realY };
}

const pixelInfo = document.querySelector('.js-pixelInfo');
const canvasCont = document.querySelector('.canvas-container');
canvas.addEventListener('mousemove', evt => {
    const x = evt.pageX - evt.target.offsetLeft + canvasCont.scrollLeft;
    const y = evt.pageY - evt.target.offsetTop + canvasCont.scrollTop;
    
    const realPos = convertPos(x, y);
    
    const foundPixel = pixels.find(pix => pix.x === realPos.x && pix.y === realPos.y)

    if(
        foundPixel === undefined
    ){
        pixelInfo.style.display = 'none';
        return
    }

    pixelInfo.innerHTML = `by ${foundPixel.user_id.username}<br>at ${makeDateReadable(foundPixel.created_at)}`
    pixelInfo.style.top = evt.pageY + 'px';
    pixelInfo.style.left = evt.pageX + 'px';
    pixelInfo.style.display = 'block';
});

function makeDateReadable(date){
    date = new Date(date);

    let hours = addZeroBefore(date.getHours());
    let minutes = addZeroBefore(date.getMinutes());
    let day = addZeroBefore(date.getDate());
    let month = addZeroBefore(date.getMonth() + 1);
    let year = date.getFullYear();
    
    

    return `${hours}:${minutes} ${day}/${month}/${year}`
}

function addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
}

canvas.addEventListener('mouseleave', () => {pixelInfo.style.display = 'none'});

let countDownOn = false;
function startCountDown({duration}){

    canvas.style.cursor = 'not-allowed';
    countDownOn = true;

    let start = duration;

    //create and append countdown
    const timeFeedbackOverlay = document.createElement('div');
    timeFeedbackOverlay.classList.add( "time-overlay" );
    const timeFeedbackNumber = document.createElement('span');
    timeFeedbackNumber.textContent = start;
    timeFeedbackOverlay.append(timeFeedbackNumber);
    mainContainer.appendChild(timeFeedbackOverlay);

    //countdown interval
    const countDown = setInterval(() => {
        start--;
        timeFeedbackNumber.textContent = start;
        if(start <= 0){
            clearInterval(countDown)
            timeFeedbackOverlay.remove();
            canvas.removeAttribute('style');
            countDownOn = false;
        }
    }, 1000);
}

canvas.addEventListener('click', async (evt) => {

    if(!isLogged){
        return showError('<p>Please <a href="/login" class="font-semibold underline text-blue-500 hover:opacity-75">login</a> to play</p>');
    }

    if(countDownOn){
        return;
    }

    startCountDown({duration:5});


    const x = evt.pageX - evt.target.offsetLeft + canvasCont.scrollLeft;
    const y = evt.pageY - evt.target.offsetTop + canvasCont.scrollTop;
    const realPos = convertPos(x, y);
    
    let data = {
        "x":realPos.x,
        "y":realPos.y,
        "color": pickedColor
    }
    paintCanvas(data);
    
    const request = await fetch('/pixels',{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": localStorage.getItem('rPlaceLoginJWT')
        },
        body:JSON.stringify(data)
    });
    
    const response = await request.json();
    
    if(request.status !== 202){
        return showError(response.message);
    }
    
    data['created_at'] = new Date;
    data['user_id'] = {'username':userName}


    socket.emit('pixel', data);
    socket.emit('log', {'name': userName, 'action': 'paint', 'color': data.color});
});

function showError(msg){
    let htmlToInject = `
        <div class="message_overlay js-msgOverlay">
            <div class="message shadow-md">
                ${msg}
                <button class="js-closeMsg bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md shadow-blue-500/20">OK</button>
            </div>
        </div>    
    `;

    document.querySelector('body').insertAdjacentHTML('beforeend', htmlToInject);

    document.querySelector('.js-closeMsg').addEventListener('click', () => {
        document.querySelector('.js-msgOverlay').remove();
    });

    canvas.removeAttribute('style');
}

function updatePixel(data) {

    let existingPixel = -1;

    for(px in pixels){
        if(
            pixels[px].x === data.x &&
            pixels[px].y === data.y
        ){
            existingPixel = px;
            break;
        }   
    }

    if(existingPixel < 0){
        pixels.push(data)
    } else {
        pixels[existingPixel] = data;
    }
}

socket.on('pixel', (data) => {
    updatePixel(data);
    paintCanvas(data);
});


const userCount = document.querySelector('.js-userCount');
socket.on('user count', (users) => {
    let msg = `👀 <b>${users}</b> people are watching...`

    if(users === 1){
        msg = `😔 You are the only one here`
    }

    userCount.innerHTML = msg;
});

const colorPicker = document.querySelectorAll('.js-color');
let pickedColor = '#000000';

for(tile of colorPicker){
    tile.addEventListener('click', (evt) => {

        if(!isLogged){
            return showError('Please login to play');
        }

        if(evt.target.classList.contains('-active')) return;

        const activeTiles = document.querySelectorAll('.js-color.-active');

        for(activeTile of activeTiles){
            activeTile.classList.remove('-active')
        }

        evt.target.classList.add('-active');

        pickedColor = evt.target.dataset.color ?? '#000000';
    })
}