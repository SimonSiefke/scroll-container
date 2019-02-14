export default function throttle(fn: () => void, limit: number) {
  let inThrottle: boolean
  return () => {
    if (!inThrottle) {
      fn()
      inThrottle = true
      // eslint-disable-next-line no-return-assign
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
