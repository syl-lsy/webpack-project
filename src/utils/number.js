import { isPrime } from './isPrime';

// 一个公共类来实现一段时间内随机生成数字
export default class NumberTimer {
  constructor(duration = 500) {
    this.duration = duration;
    this.number = 1; // 初始值为1
    this.onNumberCreated = null; // 当一个数字产生的时候要调用的回调函数
    this.timer = null; //  定时器参数
  }
  start() {
    this.timer = setInterval(() => {
      this.onNumberCreated(this.number, isPrime(this.number));
      this.number++;
    }, this.duration);
  }
  stop() {
    clearInterval(this.timer);
  }
}
