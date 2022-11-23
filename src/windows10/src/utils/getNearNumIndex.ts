/**
 * 获取一个数值在数值列表中相近的数值下标
 * @param list 
 * @param num 
 */
export default function getNearNumIndex(list: number[], num: number) {
  for (let i = 0; i < list.length - 1; i++) {
    const item = list[i], next = list[i + 1];
    // 如果 数值 小于 当前的数值，直接使用当前下标
    if (num < item) {
      return i
    }
    // 如果 数值 小于 下一个数值，则判断距离哪个数值比较近
    if (num < next) {
      // 和当前数值的距离 - 和下一个数值的距离 
      const m = (num - item) - (next - num);
      if (m <= 0) {
        // 如果是负数或者0，判定为距离当前数值比较近
        return i
      } else {
        // 否则 判定为距离下一个数值比较近
        return i + 1
      }
    }
  }
  return -1
}