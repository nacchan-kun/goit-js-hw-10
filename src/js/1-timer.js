// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів (доданий до css)
// import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
// import "izitoast/dist/css/iziToast.min.css";

import errorIcon from '/img/izi-toast-svg/error-icon.svg';
import successIcon from '/img/izi-toast-svg/success-icon.svg';

const timer = {
  userSelectedDate: null,
  deadlineintervalId: null,

  elements: {
    inputDateTimePickerEl: document.querySelector('input#datetime-picker'),
    startTimerBtnEl: document.querySelector('button[data-start]'),

    days: null, // days: document.querySelector('[data-days]'),
    hours: null, // houers: document.querySelector('[data-hours]'),
    minutes: null, // minutes: document.querySelector('[data-minutes]'),
    seconds: null, // seconds: document.querySelector('[data-seconds]'),
  },

  options: {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      let {
        elements: { startTimerBtnEl },
      } = timer;

      timer.userSelectedDate = selectedDates[0]; // Останній обраний час
      // timer.userSelectedDate = this.latestSelectedDateObj;

      // console.log(this.now); // Поточний час
      // console.log(this.latestSelectedDateObj); // Останній обраний час

      if (this.latestSelectedDateObj > this.now) {
        iziToast.success({
          message: 'Correct date',
          messageSize: '16',
          messageColor: '#fff',
          backgroundColor: '#59a10d',
          position: 'topRight',
          closeOnClick: true,
          timeout: 3500,
          close: false,
          iconUrl: successIcon,
        });

        startTimerBtnEl.disabled = false;
      } else {
        iziToast.error({
          message: 'Please choose a date in the future',
          messageSize: '16',
          messageColor: '#fff',
          backgroundColor: '#ef4040',
          position: 'topRight',
          closeOnClick: true,
          timeout: 3500,
          close: false,
          iconUrl: errorIcon,
        });

        startTimerBtnEl.disabled = true;
      }
    },
  },

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  onStartTimerBtnClick() {
    const {
      userSelectedDate,
      elements: {
        startTimerBtnEl,
        inputDateTimePickerEl,
        days,
        hours,
        minutes,
        seconds,
      },
    } = timer;

    startTimerBtnEl.disabled = true;
    inputDateTimePickerEl.disabled = true;

    let deadlineTimeLeft = userSelectedDate - Date.now();

    // console.log(userSelectedDate);

    const startTimerObj = timer.addLeadingZero(
      timer.convertMs(deadlineTimeLeft)
    );

    days.textContent = startTimerObj.days;
    hours.textContent = startTimerObj.hours;
    minutes.textContent = startTimerObj.minutes;
    seconds.textContent = startTimerObj.seconds;

    const deadlineintervalId = setInterval(() => {
      deadlineTimeLeft -= 1000;

      if (deadlineTimeLeft <= 0) {
        clearInterval(deadlineintervalId);
        inputDateTimePickerEl.disabled = false;
        return;
      }

      const runnigTimerObj = timer.addLeadingZero(
        timer.convertMs(deadlineTimeLeft)
      );

      days.textContent = runnigTimerObj.days;
      hours.textContent = runnigTimerObj.hours;
      minutes.textContent = runnigTimerObj.minutes;
      seconds.textContent = runnigTimerObj.seconds;

      // console.log(timer.convertMs(deadlineTimeLeft));
      // console.log(timer.addLeadingZero(timer.convertMs(deadlineTimeLeft)));
    }, 1000);
  },

  addLeadingZero(timeArr) {
    for (const key in timeArr) {
      timeArr[key] = String(timeArr[key]).padStart(2, '0');
    }
    return timeArr;
  },
};

const {
  options,
  elements: { startTimerBtnEl },
  onStartTimerBtnClick,
} = timer;

const {
  nextElementSibling: { children },
} = startTimerBtnEl;

timer.elements.days = children[0].firstElementChild;
timer.elements.hours = children[1].firstElementChild;
timer.elements.minutes = children[2].firstElementChild;
timer.elements.seconds = children[3].firstElementChild;

startTimerBtnEl.disabled = true;

flatpickr('input#datetime-picker', options);

startTimerBtnEl.addEventListener('click', onStartTimerBtnClick);