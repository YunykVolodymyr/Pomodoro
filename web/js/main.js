let timerInterval;
let startButton = document.getElementsByClassName('timer-container')[0].getElementsByClassName('start-button')[0];
let pauseButton = document.getElementsByClassName('timer-container')[0].getElementsByClassName('pause-button')[0];
let timer = document.getElementsByClassName('timer')[0];
let menu = document.getElementsByClassName('timer-container')[0].getElementsByTagName('li');
let number = document.getElementsByClassName('number')[0];
let loadingBar = document.getElementsByClassName('before')[0];
let header = document.getElementsByClassName('header')[0];
Notification.requestPermission();

document.head.getElementsByTagName('title')[0].innerText =
    getFormattedTime(getTime('Pomodoro')) + ' - Time to focus!';

// transition between different regimes
for (let i = 0; i < menu.length; i++) {
    menu[i].addEventListener('click', function (ev) {
        clearInterval(timerInterval);
        startButton.classList.remove('collapse');
        pauseButton.classList.add('collapse');
        let bgs = {
            'Pomodoro': ['bg-red', 'color-red', 'icons/check-red.png'],
            'Short Break': ['bg-green', 'color-green', 'icons/check-green.png'],
            'Long Break': ['bg-blue', 'color-blue', 'icons/check-blue.png']
        };
        let firstPage = document.body.getElementsByClassName('firstPage')[0];
        firstPage.classList.forEach((c, i, arr) => {
            if (c.startsWith('bg')) arr.remove(c);
        });
        startButton.classList.forEach((c, i, arr) => {
            if (c.startsWith('color')) arr.remove(c);
        })
        pauseButton.classList.forEach((c, i, arr) => {
            if (c.startsWith('color')) arr.remove(c);
        })
        firstPage.classList.add(bgs[this.innerText][0]);
        startButton.classList.add(bgs[this.innerText][1]);
        pauseButton.classList.add(bgs[this.innerText][1]);
//        for (const link of document.getElementsByTagName('link')) {
//            if (link.getAttribute('rel') === 'icon') {
//                console.log(link)
//                link.setAttribute('href', bgs[this.innerText][2]);
//            }
//        }
        document.head.getElementsByTagName('link')
        document.getElementsByClassName('chosen')[0].classList.toggle('chosen');
        this.classList.toggle('chosen');
        document.getElementsByClassName('timer')[0].innerText = getFormattedTime(getTime(this.innerText));
    })
}



startButton.addEventListener('click', function () {
    let time = (+timer.innerText.split(':')[0] * 60000) + +timer.innerText.split(':')[1] * 1000;
    let finishTime = new Date(new Date().getTime() + time);
    timerInterval = window.setInterval(() => {
        let left = new Date(finishTime.getTime() - new Date().getTime());
        loadingBar.style.width = (100 - (left.getTime() / time * 100)) + '%';
        if (left <= 0) {
            document.getElementById('bell').play();
            clearInterval(timerInterval);
            if (document.getElementsByClassName('chosen')[0].innerText === 'Pomodoro') {
                console.log(number)
                number.innerText = '#' + ((+number.innerText.substring(1)) + 1);
                menu[1].click();
                new Notification('Time to have rest');
            } else {
                menu[0].click();
                new Notification('Time to focus',{body: 'body', icon: 'icon'})
            }
        } else{
            timer.innerText = getFormattedTime(left);
        }
    }, 0);
    this.classList.toggle('collapse');
    pauseButton.classList.toggle('collapse');

});

pauseButton.addEventListener('click', function () {
    clearInterval(timerInterval);
    this.classList.toggle('collapse');
    startButton.classList.toggle('collapse');
})


header.getElementsByClassName('settings-button')[0].addEventListener('click', function (){
   let settings = document.getElementsByClassName('settings-container')[0];
   document.body.style.overflow = 'hidden';
   settings.classList.remove('collapse');
});

number.addEventListener('click', function (){
    if(confirm('Do you want to refresh the pomodoro count?'))
        this.innerText = '#0';
})

function getTime(name) {
    let d = new Date();
    switch (name) {
        case 'Pomodoro':
            d.setTime(5_000);
            break;
        case 'Short Break':
            d.setTime(300_000);
            break;
        case 'Long Break':
            d.setTime(900_000);
    }
    return d;
}

function getFormattedTime(time) {
    return String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0');
}