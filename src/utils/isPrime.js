// 判断一个数是不是素数（就是判断n这个数可不可以找到在2-n-1之间被整除,如果可以找到说明不是素数，否则是素数）
/**
 * 判断一个数是否为素数
 * @param {number} n - 需要判断的数字
 * @returns {boolean} 如果是素数返回true，否则返回false
 */
export function isPrime(n) {
  if (n < 2) return false; // 小于2的数都不是素数
  for (let i = 2; i < n; i++) {
    // 遍历从2到n-1的所有数字
    if (n % i === 0) return false; // 如果能被任何数整除，则不是素数
  }
  return true; // 如果没有找到能整除的数，则是素数
}
