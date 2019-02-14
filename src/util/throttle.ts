export default function throttle(fn, limit) {
  let inThrottle
  return () => {
    if (!inThrottle) {
      fn()
      inThrottle = true
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
