import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import clamp from '../src/util/clamp'
import ResizeObserver from 'resize-observer-polyfill'

export default function createScrollContainer({ root }: { root: HTMLElement }) {
  const $root = root
  const $content = $root.querySelector('[data-sc="content"]') as HTMLElement
  const $track = root.querySelector('[data-sc="scrollbar-track-vertical"]') as HTMLElement
  const $thumb = root.querySelector('[data-sc="scrollbar-thumb-vertical"]') as HTMLElement

  // @ts-ignore
  const resizeObserver = new ResizeObserver(() => {
    console.log('resizes')
    initialize()
  })
  resizeObserver.observe($content)

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
  // window.percent = -1
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
      console.log('ticking', percent)
    }
  }

  $content.addEventListener('scroll', handleScrollY)

  //
  // ─── END SCROLLING ──────────────────────────────────────────────────────────────
  //

  const initialize = () => {
    // scrollbar should be at least this size
    const minScrollBarSize = Math.floor($track.scrollHeight ** 2 / $content.scrollHeight)
    console.log('size', minScrollBarSize)

    ui.thumbHeight = minScrollBarSize
    setTimeout(() => {
      $root.dataset.scInitialized = 'true'
    }, 100)
  }

  //
  // ─── START DRAGGING ─────────────────────────────────────────────────────────────
  //

  let dragOffset: number
  const dragStart = (event: MouseEvent) => {
    // Preventing the event's default action stops text being selectable during the drag.
    event.preventDefault()
    // Calculate how far the user's mouse is from the top of the scrollbar thumb.
    dragOffset = event.pageY - $thumb.getBoundingClientRect().top
    // console.log('offset', dragOffset)

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', dragEnd)
  }
  $thumb.addEventListener('mousedown', dragStart)

  const drag = (event: MouseEvent) => {
    // Calculate how far the user's mouse is from the top of the scrollbar (minus the dragOffset).
    const dragPosition = event.pageY - $track.getBoundingClientRect().top - dragOffset
    const maxDragPosition = 51
    percent = clamp(dragPosition / maxDragPosition, 0, 1)

    const maxOffset = $track.offsetHeight - $thumb.offsetHeight
    ui.scrollbarOffsetY = Math.round(percent * maxOffset)

    // console.log('dragposition', dragPosition)
  }

  const dragEnd = (event: Event) => {
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', dragEnd)
  }

  //
  // ─── END DRAGGING ───────────────────────────────────────────────────────────────
  //

  initialize()
}
