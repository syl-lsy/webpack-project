import { getRandomColor, random } from '../utils/getRandom';

const divContainer = document.querySelector('#divContainer');
const divCenter = document.querySelector('#divCenter');

/**
 * 根据数字和是否为素数的条件来渲染数字
 * @param {number} n - 要处理的数字
 * @param {boolean} isPrime - 表示数字是否为素数
 */
export default function (n, isPrime) {
  const span = document.createElement('span'); // 创建一个span元素
  span.innerText = n; // 设置span元素的文本内容为数字n
  if (isPrime) {
    const color = getRandomColor(); // 产生随机颜色
    span.style.color = color; // 设置span元素的文本颜色为随机生成的颜色
    createPrimeNumber(n, color);
  }
  divContainer.appendChild(span); // 将数字添加到容器中
  createCenterNumber(n); // 将数字添加到中心
}

/**
 * 创建中心数字函数
 * @param {number} n - 需要显示在中心的数字
 */
function createCenterNumber(n) {
  // 将传入的数字n设置到divCenter元素的innerText中
  divCenter.innerText = n;
}

function createPrimeNumber(n, color) {
  const div = document.createElement('div');
  div.classList.add('center');
  div.innerText = n;
  div.style.color = color;
  document.body.appendChild(div);
  // 加入div后强行让页面渲染
  getComputedStyle(div).left; //只要读取某个元素的位置或尺寸信息，则会导致浏览器重新渲染 reflow
  div.style.transform = `translate(${random(-200, 200)}px, ${random(-200, 200)}px)`;
  div.style.opacity = 0;
}
