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
  root: null
}

export default function createScrollContainer({ root }: { root: HTMLElement }) {
  const $root = root
  const $content = $root.querySelector('[data-sc="content"]') as HTMLElement
  const $track = root.querySelector('[data-sc="scrollbar-track-vertical"]') as HTMLElement
  const $thumb = root.querySelector('[data-sc="scrollbar-thumb-vertical"]') as HTMLElement

  const ui = {
    set thumbHeight(value: number) {
      $thumb.style.height = `${value}px`
    },
    set scrollbarOffsetY(value: number) {
      $thumb.style.transform = `translateY(${value}px)`
    }
  }

  //
  // ─── SCROLLING ──────────────────────────────────────────────────────────────────
  //

  let scrollYTicking = false
  let percent: number
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

  //
  // ─── END SCROLLING ──────────────────────────────────────────────────────────────
  //

  const initialize = () => {
    // scrollbar should be at least this size
    const minScrollBarSize = Math.round($track.scrollHeight ** 2 / $content.scrollHeight)

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

  //
  // ─── START DRAGGING ─────────────────────────────────────────────────────────────
  //

  let dragOffset: number
  const dragStart = (event: DragEvent) => {
    // Preventing the event's default action stops text being selectable during the drag.
    event.preventDefault()
    // Calculate how far the user's mouse is from the top of the scrollbar thumb.
    dragOffset = event.pageY - $thumb.getBoundingClientRect().top
    // console.log('offset', dragOffset)

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)
  }
  $thumb.addEventListener('mousedown', dragStart)

  const drag = (event: DragEvent) => {
    // Calculate how far the user's mouse is from the top of the scrollbar (minus the dragOffset).
    const dragPosition = event.pageY - $track.getBoundingClientRect().top - dragOffset
    const maxDragPosition = 50
    console.log(maxDragPosition)
    const percent = dragPosition / maxDragPosition

    const maxOffset = $track.offsetHeight - $thumb.offsetHeight
    ui.scrollbarOffsetY = Math.round(percent * maxOffset)

    // console.log('dragposition', dragPosition)
  }

  const dragEnd = (event: DragEvent) => {
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', dragEnd)
  }

  //
  // ─── END DRAGGING ───────────────────────────────────────────────────────────────
  //

  initialize()
}
