# JavaScript 비동기처리 ✨

# Synchronous, Asynchronous

 JavaScript는 기본적으로는 Synchronous(동기)적이다. 즉, 호이스팅이 된 이후부터 작성된 코드가 동작된다. 하지만 Asynchronous하게 코드를 작성하는 방식들이 존재한다. 가장 익숙하고 대표적인 예로는 setTimeout(브라우저가 제공하는 api로, callback 함수를 전달해 특정 시간이 지난 후 callback 함수를 호출하는 형태)이 있다.

> Hoisting이란? var, function 정의가 자동으로 가장 최상단으로 올라가는 현상
> 

# CallBack 함수

 Callback 함수에는 Synchronous callback과 Asynchronous callback이 존재한다.

```jsx
function printImmediately(print) {
	print();
}

printImmediately(()=>console.log("hello"));
```

```jsx
function printWithDelay(print, timeout) {
	setTimeout(print, timeout);
}

printWithDelay(()=>console.log("async callback"), 2000);
```

---

# Promise

 Javascript에서 asynchronous operation 을 위해 사용된다. callback 함수 대신에 유용하게 사용되는 Object이다.

## State

 Promise에는 기본적으로 상태가 존재한다. 정의한 operation이 수행중일 때에는 Pending, 성공적으로 수행을 마치게 되면 fulfield, 파일을 찾을 수 없거나 네트워크에 문제가 생기는 상황 등에는 rejected 상태가 된다.

## Producer, Consumers

 기능(정보)를 제공하는 제공자와 이를 소비하는 소비자가 구분된다.

### **producer**

 새로운 Promise가 생성되는 순간에 executor(resolve, reject를 처리하는 executor)가 바로 실행되기 때문에, 불필요한 네트워킹 작업 또는 파일 로딩 등이 일어날 수 있음에 주의해야 한다.

- Promise 생성 시에는 resolve와 reject 라는 콜백 함수를 인자로 받는 executor를 콜백 함수로 가진다. (executor 역시 callback 함수가 되는 것)
- executor 내부에는 resolve 또는 reject를 해주지 않으면(결과를 정해주지 않으면) pending 상태로 유지되어 어떠한 값도 반환하지 않는다. 따라서 반드시 내부에서 수행 성공 여부를 정해주어야 한다.

```jsx
const promise = new Promise((resolve, reject) => {
	// doing some heavy work (network, read files ...)
	console.log('doing something');
	setTimeout(() => {
		// ...
		resolve('ellie');
		// ...
		reject(new Error('no network');
	}, 2000);
});
~~~~
```

### **Consumers**

 then, catch, finally 등을 이용해 결과값을 가져올 수 있다.

1. then은 성공적으로 작업을 수행한 후의 결과를 가져오는 것으로 resolve executor의 결과를 가져온다.
2. reject를 통해 에러를 발생시키는 경우 catch를 통해 이 error를 잡아낼 수 있다. (아래의 코드와 관련하여, then 함수는 해당 promise를 그대로 다시 반환한다. - map 함수와 같다.)
3. finally : 성공하든 실패하든 무조건 마지막에 실행된다.

```jsx
promise.then((value) => {
	console.log(value); // producer에서 제공한 'ellie'가 전달될 것
})
.catch((error) => {
	console.log(error);
})
.finally(()=> {
	console.log('finally');
});

```

## Promise Chaning

```jsx
const fetchNumber = new Promise((resolve, reject) => {
  setTimeout(()=> resolve(1), 1000);
});

fetchNumber
  .then(num => num * 2)
  .then(num=> num * 3)
  .then(num=> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(num - 1), 1000);
    });
  })
  .then(num => console.log(num));
```

 then에서는 값을 전달해도 되고, 또 다른 비동기(Promise) 객체를 전달해도 된다. (then은 값 또는 또 다른 Promise를 반환할 수 있다.)

## Error Handling

```jsx
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

getHen()
  .then(getEgg)
  .catch(error => { // getEgg에서 발생할 수 있는 에러를 처리(순서 유의)
    return `🥖`;
  })
  .then(cook)
  .then(console.log);
```

 cf. then 내부에 callback을 둘 때 반환값이 하나라면, 인자를 적지 않아도 암묵적으로 반환된 값을 callback의 인자로 전달한다.

```jsx
getHen()
  .then(hen => getEgg(hen))
  .then(egg => cook(egg))
  .then(meal => console.log(meal));

// 👇

getHen()
  .then(getEgg)
  .then(cook)
  .then(console.log);
```

# async, await

 promise를 좀 더 간결하고 간편하고, 동기적으로 실행되는 것 처럼 만들어줌. 프로미스를 순서대로 엮은 것을 프로미스 체인(Promise chain)이라고 하는데, 이를 보다 간편하고 동기적으로 코드를 작성하듯이 쉽게 작성할 수 있게 하는 것이 async와 await이다. 이렇게 새로운 것이 아닌 기존에 있는 것을 감싸서 보다 간편하게 사용할 수 있게 하는 것을 syntactic sugar이라고 한다. (ex. class는 새로운 개념이 아니라 prototype을 베이스로 하여 조금 더 무언가 덧붙여진 것)

## async

 함수 선언 시에 async 키워드를 붙이기만 하면 자동으로 promise를 반환하게 된다. promise와 마찬가지로 then 함수를 통해 프로미스의 결과값을 받을 수 있다.

```jsx
async function fetchUser() {
  return 'ellie';
}

const user = fetchUser();
user.then(console.log);
console.log(user);
```

## await

  promise의 결과를 기다려 주는 역할을 수행한다. await은 async 함수 내에서만 사용 가능하다.

```jsx
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple() {
  await delay(1000);
  return '🍎';
}

async function getBanana() {
  await delay(1000);
  return '🍌';
}

async function pickFruits() {
  const apple = await getApple();
  const banana = await getBanana();
  return `${apple} + ${banana}`;
}

pickFruits().then(console.log);
```

cf. getBanana와 pickFruits을 async와 await을 사용하지 않고 promise만으로 작성한 함수의 형태는 아래와 같다.

```jsx
function getBanana() {
  return delay(1000).then(() => '🍌');
}

function pickFruits() {
  return getApple().then(apple => {
    return getBanana().then(banana => `${apple} + ${banana}`);
  })
}
```

 cf. 만약 getApple, getBanana 내부에서 error를 반환할 경우에는 이를 모두 처리하는 pickFruits 내부에서 기존의 동기적인 코드 작성 방식과 마찬가지로 try catch문을 사용할 수 있다.

```jsx
async function getApple() {
  await delay(1000);
	throw 'Error';
  return '🍎';
}

async function getBanana() {
  await delay(1000);
  return '🍌';
}

async function pickFruits() {
	try {
		const apple = await getApple();
	  const banana = await getBanana();
	} catch(err) {
	  console.log(err);
	}
  return `${apple} + ${banana}`;
}
```

 위의 코드에서 사과와 바나나를 가져오는 데에는 연관관계가 없기 때문에 같이 실행해서 시간을 아껴야 한다. 이 때는 Promise를 생성하면 바로 그 콜백 함수인 executor가 실행되는 점을 이용할 수 있다. 아래와 같이 프로미스를 생성하도록 하는 부분을 분리하여 생성부터 하고 이 결과를 기다림으로 인해 두 가지의 async 처리를 병렬적으로 행할 수 있게 된다.

```jsx
async function pickFruits() {
	const applePromise = getApple();
	const bananaPromise = getBanana();
  const apple = await applePromise(); // 여기서 동기화시켜준다.
  const banana = await bananaPromise(); // 여기서 동기화시켜준다.
  return `${apple} + ${banana}`;
}
```

## Useful Promise APIs

### Promise.all()

 인자로 프로미스들을 전달하면 해당 프로미스들이 모두 실행될 때까지 기다려 이들의 결과를 배열로 반환한다.

```jsx
function pickAllFruits() {
	return Promise.all([getApple(), getBanana()]).then(fruits => 
						fruits.join(' + ')
	);
}

pickAllFruits().then(console.log);
```

### Promise.race()

 배열로 전달된 프로미스 중에서 가장 빨리 값을 리턴하는 프로미스 결과만 반환한다.

```jsx
function pickOnlyOne() {
	return Promise.race([getApple(), getBanana()]);
}

pickOnlyOne().then(console.log);
```
