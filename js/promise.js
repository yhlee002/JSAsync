'use strict';

const promise = new Promise((resolve, reject) => {
	// doing some heavy work (network, read files ...)
	console.log('doing something');
  setTimeout(() => {
		resolve('ellie');
	}, 2000);
});

promise.then((value) => {
	console.log(value); // producer에서 제공한 'ellie'가 전달될 것
}).catch((error)=> {
  console.log(error);
}).finally(() => {
  console.log('finally');
});

const fetchNumber = new Promise((resolve, reject) => {
  setTimeout(()=> resolve(1), 1000);
});

// then에서는 값을 전달해도 되고, 또 다른 비동기(Promise) 객체를 전달해도 된다.
fetchNumber
  .then(num => num * 2)
  .then(num=> num * 3)
  .then(num=> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000);
    });
  })
  .then(num => console.log(num));

// Error handling
const getHen = () => 
  new Promise((resolve, reject) => {
    setTimeout(() => resolve('🐓'), 1000);
  });
const getEgg = hen =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(`error! ${hen} => 🥚`)), 1000);
  });
const cook = egg => 
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(`${egg} => 🍳`), 1000);
  });

/*
cf. then 내부에 callback을 둘 때 반환값이 하나라면, 인자를 적지 않아도 암묵적으로 반환된 값을 callback의 인자로 전달
getHen()
  .then(hen => getEgg(hen))
  .then(egg => cook(egg))
  .then(meal => console.log(meal));
*/

getHen()
  .then(getEgg)
  .catch(error => { // getEgg에서 발생할 수 있는 에러를 처리(순서 유의)
    return `🥖`;
  })
  .then(cook)
  .then(console.log)
  
