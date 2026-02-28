// 随机颜色
/**
 *
 * @param {*} min
 * @param {*} max
 * @returns 随机返回在min和max之间的数
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
const colors = [
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#00FFFF',
  '#FF00FF',
  '#C0C0C0',
  '#800000',
  '#008000',
  '#000080',
  '#808000',
  '#800080',
  '#008080',
  '#808080',
];
export function getRandomColor() {
  return colors[random(0, colors.length)]; // 使用random函数生成随机索引，从数组中获取对应颜色
}
