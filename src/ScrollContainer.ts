import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'

/**
 * Default options
 */
const options = {
  offset: 120,
  delay: 0,
  easing: 'ease',
  duration: 400,
  disable: false,
  once: false,
  mirror: false,
  disableMutationObserver: false,
  throttleDelay: 99,
  debounceDelay: 50,
  root: null,
}

export default function createScrollContainer({ root }: { root: HTMLElement }) {
  const $root = root
  const $content = $root.querySelector('[data-sc="content"]') as HTMLElement
  const $track = root.querySelector(
    '[data-sc="scrollbar-track-vertical"]'
  ) as HTMLElement
  const $thumb = root.querySelector(
    '[data-sc="scrollbar-thumb-vertical"]'
  ) as HTMLElement

  /**
   * these functions will be called by the user when the scroll container isn't needed anymore. It removes for example event listeners.
   */
  const destroyFunctions: Array<() => void> = []

  const ui = {
    set thumbHeight(value: number) {
      $thumb.style.height = `${value}px`
    },
    set scrollbarOffsetY(value: number) {
      $thumb.style.transform = `translateY(${value}px)`
    },
  }

  let scrollYTicking = false
  let percent:number
  const scrollY = () => {
    const maxOffset = $track.offsetHeight - $thumb.offsetHeight
    const currentOffset = Math.round(percent * maxOffset)
    ui.scrollbarOffsetY = currentOffset
    scrollYTicking = false
  }

  const handleScrollY = () => {
    const maxOffset = $content.scrollHeight - $content.offsetHeight
    const currentOffset = $content.scrollTop
    percent = currentOffset / maxOffset
    if (!scrollYTicking) {
      requestAnimationFrame(scrollY)
      scrollYTicking = true
    }
  }

  $content.addEventListener('scroll', handleScrollY)
  destroyFunctions.push(() =>
    $content.removeEventListener('scroll', handleScrollY)
  )

  const initialize = () => {
    // scrollbar should be at least this size
    const minScrollBarSize = Math.round(
      $track.scrollHeight ** 2 / $content.scrollHeight
    )

    ui.thumbHeight = minScrollBarSize
    setTimeout(() => {
      $root.dataset.scInitialized = 'true'
    }, 100)

    // const onScroll=(percent:number)=>{

    // }

    // let x = 0
    // setInterval(() => {
    //   ui.scrollbarOffsetY = x++
    // }, 100)
  }

  initialize()

  return {
    destroy() {
      destroyFunctions.forEach(fn => fn())
    },
  }
}
