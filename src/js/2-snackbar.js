// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
// import "izitoast/dist/css/iziToast.min.css";

import errorIcon from '/src/img/izi-toast-svg/error-icon.svg';
import successIcon from '/src/img/izi-toast-svg/success-icon.svg';

const snackbar = {
  formEl: document.querySelector('.form'),
  delay: null,
  chosenState: null,

  createPromise(chosenState, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (chosenState === 'fulfilled') {
          resolve(delay);
        } else {
          reject(delay);
        }
      }, delay);
    });
  },

  onFormSubmit(event) {
    event.preventDefault();

    this.delay = this.formEl.delay.value;
    this.chosenState = this.formEl.state.value;

    const { delay, chosenState } = this;

    this.createPromise(chosenState, delay)
      .then(delay => {
        iziToast.success({
          message: `Fulfilled promise in ${delay}ms`,
          messageSize: '16',
          messageColor: '#fff',
          backgroundColor: '#59a10d',
          position: 'topRight',
          closeOnClick: true,
          timeout: 3500,
          close: false,
          iconUrl: successIcon,
        });

        // console.log(chosenState);
        // console.log(delay);
      })
      .catch(delay => {
        iziToast.error({
          message: `Rejected promise in ${delay}ms`,
          messageSize: '16',
          messageColor: '#fff',
          backgroundColor: '#ef4040',
          position: 'topRight',
          closeOnClick: true,
          timeout: 3500,
          close: false,
          iconUrl: errorIcon,
        });

        // console.log(chosenState);
        // console.log(delay);
      });

    this.formEl.reset();
  },
};

snackbar.formEl.addEventListener(
  'submit',
  snackbar.onFormSubmit.bind(snackbar)
);

document.querySelectorAll('.form fieldset input').forEach(input => {
  input.addEventListener('focus', event => {
    event.target.closest('fieldset').classList.add('focused');
  });

  input.addEventListener('blur', event => {
    event.target.closest('fieldset').classList.remove('focused');
  });
});