export default (value: number, minValue: number, maxValue: number) => {
  return value < minValue ? minValue : value > maxValue ? maxValue : value
}
