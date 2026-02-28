import NumberTimer from '../utils/number.js';
import appendNumber from './appendNumber.js';
const n = new NumberTimer(200);
n.onNumberCreated = function (n, isPrime) {
  appendNumber(n, isPrime);
};
// 页面绑定点击事件
let isStart = false;
window.onclick = function (event) {
  if (isStart) {
    n.stop();
    isStart = false;
  } else {
    n.start();
    isStart = true;
  }
};
