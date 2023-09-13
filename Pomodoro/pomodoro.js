const settingsToggle = document.querySelector('#js-settings__icon--toggle');
const settingsCloseBtn = document.querySelector('#settings__close-btn');
const settingsModal = document.querySelector('#js-settings__modal');
const timerDisplay = document.querySelector('.min-sec');
const startBtn = document.querySelector('#start');
const endTimeEl = document.querySelector('#end-time');
const circleSvg = document.querySelector('.timer__path-elapsed');

// Control de botones
const controlDiv = document.querySelector('.control__buttons');
const controlBtns = controlDiv.querySelectorAll('.btn');

// Obtener Estilos
const root = document.querySelector(':root');
// root variable values
const fontKumbhSans = getComputedStyle(root)
  .getPropertyValue('--kumbhsans-font')
  .trim();
const fontRobotoSlab = getComputedStyle(root)
  .getPropertyValue('--robotoslab-font')
  .trim();
const fontSpaceMono = getComputedStyle(root)
  .getPropertyValue('--spacemono-font')
  .trim();

// Modal inputs
const pomodoroInput = document.querySelector('#js-settings__modal #pomodoro');
const shortBreakInput = document.querySelector(
  '#js-settings__modal #short-break'
);
const longBreakInput = document.querySelector(
  '#js-settings__modal #long-break'
);

// Botones de aumento y disminución
const jsIncreasePomodoro = document.querySelector('#jsIncreasePomodoro');
const jsDecreasePomodoro = document.querySelector('#jsDecreasePomodoro');
const jsIncreaseShortBreak = document.querySelector('#jsIncreaseShortBreak');
const jsDecreaseShortBreak = document.querySelector('#jsDecreaseShortBreak');
const jsIncreaseLongBreak = document.querySelector('#jsIncreaseLongBreak');
const jsDecreaseLongBreak = document.querySelector('#jsDecreaseLongBreak');

// Modal font buttons
const fontSettings = document.getElementsByName('fonts');
// Modal color buttons
const themeRed = document.querySelector('#primary-red');
const themeTeal = document.querySelector('#primary-teal');
const themePurple = document.querySelector('#primary-purple');
const colorSettings = document.getElementsByName('colors');
// Formulario Modal
const settingsForm = document.querySelector('#settings__form');
const applyBtn = document.querySelector('#apply-btn');

// Dar clic en el boton de configuracion y abrir modal
settingsToggle.addEventListener('click', () => {
  // add the class 'show-modal' which changes the display property
  settingsModal.classList.add('show-modal');
});

// Dar clic en la X para cerrar modal
settingsCloseBtn.addEventListener('click', () => {
  settingsModal.classList.remove('show-modal');
});

// boton aplicar
applyBtn.addEventListener('click', (e) => {

  settingsModal.classList.remove('show-modal');
});

// Cerrar modal al hacer clic fuera del modal
window.addEventListener('click', (event) => {
 
  event.target === settingsModal
    ? settingsModal.classList.remove('show-modal')
    : false;
});

// función de configuración para comprobar que el valor de entrada es superior a 90 (minutos)
function setMaxInputValue(input) {
  input.addEventListener('keyup', (e) => {
    if (e.target.value > 90) {
      input.value = 90;
      console.log("Can't enter a number greater than 90");
    }
  });
}
// LLamar los inputs
setMaxInputValue(pomodoroInput);
setMaxInputValue(shortBreakInput);
setMaxInputValue(longBreakInput);

// función de configuración para aumentar un valor de entrada
function increaseInputValue(input, button) {
  button.addEventListener('click', () => {
    
    if (input.value < 90) {
      return input.value++;
    }
    return;
  });
}
// Llamar a todos los botones de aumento
increaseInputValue(pomodoroInput, jsIncreasePomodoro);
increaseInputValue(shortBreakInput, jsIncreaseShortBreak);
increaseInputValue(longBreakInput, jsIncreaseLongBreak);

// función de configuración para disminuir un valor de entrada
function decreaseInputValue(input, button) {
  button.addEventListener('click', () => {
    
    if (input.value > 0) {
      input.value--;
    }
  });
}
// llamar a todos los botones de aumento
decreaseInputValue(pomodoroInput, jsDecreasePomodoro);
decreaseInputValue(shortBreakInput, jsDecreaseShortBreak);
decreaseInputValue(longBreakInput, jsDecreaseLongBreak);

function saveUserPreferences() {
  
  let color = '';
  let font = '';

  // bucle sobre la lista de nodos de configuración de fuente
  for (let i = 0; i < fontSettings.length; i++) {
    
    const element = fontSettings[i];
    
    if (element.checked) {
      
      if (element.value === 'kumbh-sans') {
        
        font = fontKumbhSans;
      }
      
      if (element.value === 'roboto-slab') {
       
        font = fontRobotoSlab;
      }
      
      if (element.value === 'space-mono') {
       
        font = fontSpaceMono;
      }
    }
  }

  // recorrer la lista de nodos de configuración de color
  for (let i = 0; i < colorSettings.length; i++) {
   
    const element = colorSettings[i];
    
    if (element.checked) {
      
      color = element.value;
    }
  }

  // crea el objeto para contener los datos ingresados ​​por el usuario
  const preferences = {
    theme: color,
    font: font,
    pomodoroTime: Number(pomodoroInput.value * 60),
    shortBreakTime: Number(shortBreakInput.value * 60),
    longBreakTime: Number(longBreakInput.value * 60),
  };

  console.log(preferences);
  
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  clearInterval(countdown);

  
  saveUserPreferences();
 
  getUserPreferences();
});

function getUserPreferences() {
  // varible to parse local storage back into an object
  const saved = JSON.parse(localStorage.getItem('userPreferences'));

  // if preferences are in local storage, save the theme and font styles to CSS variables
  if (saved !== null) {
    // set the CSS variable color
    document.documentElement.style.setProperty(
      '--set-theme-primary',
      saved.theme
    );
    // set the CSS variable font style
    document.documentElement.style.setProperty('--set-font-style', saved.font);
    renderTime(saved.pomodoroTime);
  } else {
    // otherwise, set preference default values
    const defaultPreferences = {
      theme: '#f87070',
      font: 'Kumbh Sans, sans-serif',
      pomodoroTime: 1500,
      shortBreakTime: 300,
      longBreakTime: 600,
    };
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
    // get the default settings from local storage
    const defaultSaved = JSON.parse(localStorage.getItem('userPreferences'));
    // set the CSS variable color
    document.documentElement.style.setProperty(
      '--set-theme-primary',
      defaultSaved.theme
    );
    // set the CSS variable font style
    document.documentElement.style.setProperty(
      '--set-font-style',
      defaultSaved.font
    );
  }
}

// initialize preferences on page load
getUserPreferences();

// get circle radius value
const radius = circleSvg.r.baseVal.value;
// set the circumference value of the circle
let circumference = radius * 2 * Math.PI;
console.log(circumference);

circleSvg.style.strokeDasharray = circumference;

function setProgress(percent) {
  // calculate the percentage of time left
  circleSvg.style.strokeDashoffset =
    circumference - (percent / 100) * circumference;
}

function renderTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;
  const adjustedSeconds = secondsLeft < 10 ? '0' : '';
  const display = `${minutes}:${adjustedSeconds}${secondsLeft}`;
  timerDisplay.textContent = display;
}

function renderEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  const adjustedMinutes = minutes < 10 ? '0' : '';
  endTimeEl.textContent = `Termina a las ${adjustedHour}:${adjustedMinutes}${minutes}`;
}

// set variable to clear interval with
let countdown;

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;

  renderTime(seconds);
  renderEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // making the remaing time into a percent friendly value (ex. 98, 97, 96)
    setProgress((secondsLeft / seconds) * 100);
    renderTime(secondsLeft);
  }, 1000);
}

startBtn.addEventListener('click', (e) => {
  clearInterval(countdown);
  // get the saved settings from local storage
  const settingsObj = JSON.parse(localStorage.getItem('userPreferences'));
  // gets the clicked button class' btn--state-active'
  const current = document.getElementsByClassName('btn--state-active');

  if (current[0].id === 'pomodoro') {
    renderTime(settingsObj.pomodoroTime);
    timer(settingsObj.pomodoroTime);
  } else if (current[0].id === 'short-break') {
    renderTime(settingsObj.shortBreakTime);
    timer(settingsObj.shortBreakTime);
  } else {
    renderTime(settingsObj.longBreakTime);
    timer(settingsObj.longBreakTime);
  }
});

function btnTimerControl(e) {
  // clear any existing timers
  clearInterval(countdown);
  // get the saved settings from local storage
  const settingsObj = JSON.parse(localStorage.getItem('userPreferences'));

  // gets the clicked button class' btn--state-active'
  const current = document.getElementsByClassName('btn--state-active');

  // If there's no active class
  if (current.length > 0) {
    current[0].className = current[0].className.replace(
      ' btn--state-active',
      ''
    );
  }

  // add the active class to the current clicked button
  e.target.classList.add('btn--state-active');

  if (current[0].id === 'pomodoro') {
    renderTime(settingsObj.pomodoroTime);
  } else if (current[0].id === 'short-break') {
    renderTime(settingsObj.shortBreakTime);
  } else {
    renderTime(settingsObj.longBreakTime);
  }
}

controlBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    btnTimerControl(e);
  });
});

settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // clear any existing timers
  clearInterval(countdown);

  // save the user entered data
  saveUserPreferences();
  // get the user entered data (without this, the page would need refreshed for changes to take affect)
  getUserPreferences();

  // get the saved settings from local storage
  const settingsObj = JSON.parse(localStorage.getItem('userPreferences'));

  // gets the clicked button class' btn--state-active'
  const current = document.getElementsByClassName('btn--state-active');

  if (current[0].id === 'pomodoro') {
    renderTime(settingsObj.pomodoroTime);
  } else if (current[0].id === 'short-break') {
    renderTime(settingsObj.shortBreakTime);
  } else {
    renderTime(settingsObj.longBreakTime);
  }
});
