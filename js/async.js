// async & await
// clear style of using promise

// 1. async 👻
async function fetchUser() {
  return 'ellie';
}

const user = fetchUser();
user.then(console.log);
console.log(user);

// 2.await 👻
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple() {
  await delay(1000); // promise의 결과를 기다려 줌
  return '🍎';
}

async function getBanana() {
  await delay(1000);
  return '🍌';
}
/* 위의 async와 await을 사용한 getBanana와 같지만 promise만으로 작성한 함수의 형태
function getBanana() {
  return delay(1000).then(() => '🍌');
}
*/

async function pickFruits() {
  const applePromise = getApple();
  const bananaPromise = getBanana();
  const apple = await applePromise;
  const banana = await bananaPromise;
  return `${apple} + ${banana}`;
}
/* 위의 async와 await을 사용한 pickFruits와 같지만 promise만으로 작성한 함수의 형태
function pickFruits() {
  return getApple().then(apple => {
    return getBanana().then(banana => `${apple} + ${banana}`);
  })
}
*/

pickFruits().then(console.log);