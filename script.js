'use strict';

///////////////////////////// BANKIST APP ///////////////////////////////
// DATA
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-04-05T17:01:17.194Z',
    '2024-04-17T23:36:17.929Z',
    '2024-04-24T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2024-04-22T18:49:59.371Z',
    '2024-04-23T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS
// GENERATING USERNAME FOR EACH ACCOUNT
const createUserName = function (accounts) {
  accounts.forEach(function (account) {
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name.at(0);
      })
      .join('');
  });
};
createUserName(accounts);

// FORMATTING MOVEMENTS DATE
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  if (daysPassed === 0) return 'today';
  else if (daysPassed === 1) return 'yesterday';
  else if (daysPassed > 2 && daysPassed < 7) return `${daysPassed} days ago`;
  else return `${day}/${month}/${year}`;
};

// SHOWING MOVEMENTS OF AN ACCOUNT
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';
  const movements = sort
    ? account.movements.slice().sort(function (a, b) {
        return a - b;
      })
    : account.movements;
  movements.forEach(function (movement, index) {
    const date = new Date(account.movementsDates[index]);
    const displayDate = formatMovementDate(date);
    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${movement > 0 ? 'deposit' : 'withdrawal'}">
     ${index + 1} ${movement > 0 ? 'deposit' : 'withdrawal'}</div>
     <div class="movements__date">${displayDate}</div> 
     <div class="movements__value">${movement}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// SHOWING THE TOTAL OF DEPOSITS AND WITHDRAWALS
const calcDisplaySummary = function (account) {
  const sumIn = account.movements
    .filter(function (movement) {
      return movement > 0;
    })
    .reduce(function (acc, movement) {
      return acc + movement;
    }, 0);
  labelSumIn.textContent = `${sumIn}€`;
  const sumOut = account.movements
    .filter(function (movement) {
      return movement < 0;
    })
    .reduce(function (acc, movement) {
      return acc + movement;
    }, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;
  const interest = account.movements
    .filter(function (movement) {
      return movement > 0;
    })
    .map(function (movement) {
      return (movement * account.interestRate) / 100;
    })
    .filter(function (interest) {
      return interest >= 1;
    })
    .reduce(function (acc, interest) {
      return acc + interest;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// SHOWING BALANCE
const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce(function (acc, movement) {
    return acc + movement;
  }, 0);
  labelBalance.textContent = `${balance}€`;
};

// UPDATING INFO
const updateUI = function (account) {
  displayMovements(account);
  calcDisplaySummary(account);
  calcDisplayBalance(account);
};

// EVENT HANDLERS
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(function (account) {
    return account.userName === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    labelWelcome.textContent = `Welcome ${currentAccount.owner}!`;
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
    const loginDate = new Date();
    const day = loginDate.getDate();
    const month = loginDate.getMonth();
    const year = loginDate.getFullYear();
    const displayDate = `${day}/${month}/${year}`;
    labelDate.textContent = displayDate;
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (account) {
    return account.userName === inputTransferTo.value;
  });
  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.userName !== currentAccount.userName
  ) {
    console.log('transfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some(function (movement) {
      return movement >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(function (account) {
      return account.userName === currentAccount.userName;
    });
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
