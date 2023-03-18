let firstPage = document.getElementsByClassName('firstPage')[0];
let settingsContainer = document.getElementsByClassName('settings-container')[0];
let menu = document.querySelectorAll('.timer-container .menu li');
let times = JSON.parse(localStorage.getItem('times')) || [];
let themes = JSON.parse(localStorage.getItem('themes')) || [];
let timer = document.getElementsByClassName('timer')[0];
let timeSettings = document.getElementsByClassName('settings')[0]
    .getElementsByClassName('time-settings')[0]
    .getElementsByTagName('input');
let pickColorContainer = document.getElementsByClassName('pick-color-container')[0];
let chooseBoxes = pickColorContainer.getElementsByClassName('box');
let timerInterval;
let numberOfIntervals = JSON.parse(localStorage.getItem('numberOfIntervals')) || 0;
let longBreakInterval = JSON.parse(localStorage.getItem('longBreakInterval')) || 4;
let autoStartBreaks = JSON.parse(localStorage.getItem('autoStartBreaks')) || 2;
let autoStartPomodoros = JSON.parse(localStorage.getItem('autoStartPomodoros')) || 1;
let title = document.getElementsByTagName('title')[0];

const THEMERANGE = ['red', 'green', 'blue', 'gold', 'purple', 'light-purple', 'dark-green', 'gray'];
//adjusting default values
update();

function update() {
    times = JSON.parse(localStorage.getItem('times')) || [];
    timer = document.getElementsByClassName('timer')[0];
    themes = JSON.parse(localStorage.getItem('themes')) || [];
    if (times.length === 0)
        times = ['25:00', '05:00', '15:00'];
    if (themes.length === 0)
        themes = ['red', 'green', 'blue']
    document.getElementsByClassName('long-break-interval')[0].value = longBreakInterval;
    if (autoStartPomodoros == 2) {
        document.getElementsByClassName('auto-start-pomodoros')[0].setAttribute('chosen', '');
    }
    if (autoStartBreaks == 2) {
        document.getElementsByClassName('auto-start-breaks')[0].setAttribute('chosen', '');
    }
    changeRegime();
}

menu.forEach(li => {
    li.addEventListener('click', changeRegime)
})

function changeRegime() {


    if (this !== window) {
        self = this;
        document.getElementsByClassName('chosen')[0].classList.toggle('chosen');
        self.classList.add('chosen');
    } else {
        self = document.querySelector('.menu .chosen');
    }
    if (self.previousElementSibling === null)
        i = 0;
    else if (self.nextElementSibling === null)
        i = 2;
    else i = 1;

    for (const theme of THEMERANGE)
        firstPage.classList.remove(theme);
    firstPage.classList.add(themes[i]);
    timer.innerText = times[i];
    for (let j = 0; j < times.length; j++) {
        timeSettings[j].value = +(times[j].split(':')[0]);
    }
    for (let j = 0; j < 3; j++) {
        settingsContainer.getElementsByClassName('box')[j].classList.value =
            settingsContainer.getElementsByClassName('box')[j].classList[0] + ' ' + themes[j];
    }
    let iconLink = document.querySelector('link[rel="icon"]');
    iconLink.setAttribute('href', `icons/${themes[i]}.png`);

    document.getElementsByClassName('number-of-intervals')[0]
        .innerText = '#' + numberOfIntervals;
    firstPage.setAttribute('regime', i);
    document.getElementsByTagName('title')[0].innerText =
        timer.innerText +
        (firstPage.getAttribute('regime') === '0' ? ' - Time to focus!' : ' - Time for a break');
    document.getElementsByClassName('timeFor')[0].innerText =
        firstPage.getAttribute('regime') === '0' ? 'Time to focus!' : 'Time for a break!';
    document.getElementsByClassName('loadingBar')[0].style.width = '0';
}

for (let i = 0; i < timeSettings.length; i++) {
    let input = timeSettings[i];
    input.addEventListener('blur', function () {
        let times = [];
        for (const input of timeSettings)
            times.push(String(input.value.padStart(2, '0') + ':00'));
        localStorage.setItem('times', JSON.stringify(times));
        update(i);
    })
}

for (let switchButton of document.getElementsByClassName('switch')) {
    switchButton.addEventListener('click', function () {
        this.toggleAttribute('chosen');
    })
}

document.getElementsByClassName('menu')[0].children[1].addEventListener('click', function () {
    settingsContainer.classList.remove('collapse');
    document.body.style.overflow = 'hidden'
    document.getElementsByClassName('chosen')[0].click();
})

document.querySelector('.settings .exit img').addEventListener('click', function () {
    settingsContainer.classList.toggle('collapse');
    document.body.style.overflow = 'visible'
    document.getElementsByClassName('chosen')[0].click();
});

settingsContainer.addEventListener('click', (ev) => {
    if (ev.target.classList.contains('settings-container')) {
        settingsContainer.classList.toggle('collapse');
        document.body.style.overflow = 'visible'
    }
})

let boxes = document.getElementsByClassName('settings')[0]
    .getElementsByClassName('box');

for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function () {
        settingsContainer.classList.toggle('collapse');
        pickColorContainer.classList.toggle('collapse');
        let regimes = ['Pomodoro', 'Short Break', 'Long Break'];
        pickColorContainer.getElementsByClassName('head')[0]
            .innerText = 'Pick a color for ' + regimes[i];
        for (const box of chooseBoxes) {
            if (box.classList.contains(themes[i]))
                box.innerHTML = '<i class="fa-solid fa-check"></i>'
        }
        pickColorContainer.setAttribute('number', i);
    })
}

pickColorContainer.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('pick-color-container')) {
        settingsContainer.classList.toggle('collapse');
        pickColorContainer.classList.toggle('collapse');
        for (const box of chooseBoxes) {
            box.innerHTML = '';
        }
    }
})

for (let box of pickColorContainer.getElementsByClassName('box')) {
    box.addEventListener('click', function () {
        let storedThemes = JSON.parse(localStorage.getItem('themes')) || themes;
        storedThemes[+pickColorContainer.getAttribute('number')] =
            this.classList[this.classList.length - 1];
        localStorage.setItem('themes', JSON.stringify(storedThemes));
        for (let box of pickColorContainer.getElementsByClassName('box')) {
            box.innerHTML = '';
        }
        this.innerHTML = '<i class="fa-solid fa-check"></i>';
        update(+pickColorContainer.getAttribute('number'));
    })
}

//long break interval settings
settingsContainer.getElementsByClassName('long-break-interval')[0]
    .addEventListener('blur', function () {
        longBreakInterval = this.value;
        localStorage.setItem('longBreakInterval', longBreakInterval);
    });

//start timer
document.getElementsByClassName('start-button')[0]
    .addEventListener('click', function () {
        document.getElementsByClassName('press-audio')[0].play();
        this.classList.toggle('collapse');
        document.getElementsByClassName('pause-button')[0].classList.toggle('collapse');
        let finishTime = new Date().getTime() + +timer.innerText.split(':')[0] * 60000
            + timer.innerText.split(':')[1] * 1000;

        let time = times[firstPage.getAttribute('regime')];
        time = +time.split(':')[0] * 60000 + +time.split(':')[1] * 1000;

        timerInterval = setInterval(function () {
            let left = finishTime - new Date().getTime();

            if (left <= 0) {
                clearInterval(timerInterval);
                document.getElementsByClassName('start-button')[0].classList.toggle('collapse');
                document.getElementsByClassName('pause-button')[0].classList.toggle('collapse');
                if (+firstPage.getAttribute('regime') == 0) {
                    numberOfIntervals++;
                    if (numberOfIntervals % longBreakInterval === 0 && numberOfIntervals !== 0) {
                        menu[2].click();
                    } else
                        menu[1].click();
                    if (autoStartBreaks === 2)
                        document.getElementsByClassName('start-button')[0].click();
                } else {
                    menu[0].click();
                    if (autoStartPomodoros === 2)
                        document.getElementsByClassName('start-button')[0].click();

                }

            } else {
                timer.innerText = String(Math.floor(left / 60000)).padStart(2, '0') + ':' +
                    String(Math.floor((left % 60000) / 1000)).padStart(2, '0');
                title.innerText = timer.innerText + title.innerText.substring(5);
                document.getElementsByClassName('loadingBar')[0].style.width = (100 - (left / time * 100)) + '%';
            }
            console.log(timerInterval)
        }, 100);
        document.querySelector('link[rel="icon"]').setAttribute('href', `icons/${firstPage.classList[1]}.png`);
    });

//pause timer
document.getElementsByClassName('pause-button')[0]
    .addEventListener('click', function () {
        document.getElementsByClassName('press-audio')[0].play();
        this.classList.toggle('collapse');
        document.getElementsByClassName('start-button')[0].classList.toggle('collapse');
        clearInterval(timerInterval);
        document.querySelector('link[rel="icon"]').setAttribute('href', 'icons/light-gray.png');
        //todo
    })

//auto start breaks settings
document.getElementsByClassName('auto-start-breaks')[0]
    .addEventListener('click', function () {
        autoStartBreaks = autoStartBreaks === 1 ? 2 : 1;
        localStorage.setItem('autoStartBreaks', JSON.stringify(autoStartBreaks));
    })
//auto start pomodoros settings
document.getElementsByClassName('auto-start-pomodoros')[0]
    .addEventListener('click', function () {
        autoStartPomodoros = autoStartPomodoros === 1 ? 2 : 1;
        localStorage.setItem('autoStartPomodoros', JSON.stringify(autoStartPomodoros));

    })


//numbe of intervals to zero
document.getElementsByClassName('number-of-intervals')[0]
    .addEventListener('click', function () {
        if (confirm('Do you want to refresh the pomodoro count?')) {
            numberOfIntervals = 0;
            this.innerText = '#0';
        }
    })