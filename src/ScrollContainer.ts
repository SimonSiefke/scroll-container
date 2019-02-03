/*
 *                                    Overview
 *                                    ‾‾‾‾‾‾‾‾
 * 1. HTML Structure
 * ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 * $root                         <div data-sc-role="root">
 *   $content	                     <div data-sc-role="content"><p>Some Content</p></div>
 *   $scrollbar                    <div data-sc-role="scrollbar">
 *     $scrollbarTrack               <div data-sc-role="scrollbar-track">
 *       $scrollbarThumb               <div data-sc-role="scrollbar-thumb">
 *                                   </div>
 *                                 </div>
 *                               </div>
 *
 *
 *
 * 2. Layout Structure
 * ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 *                     __________________________________________________
 *           |‾‾       |                                            | ▲ |
 *           |         |                                            |‾‾‾|                       ‾‾|
 *           |         |                                            |   |                         |
 *           |         |                                            | █ |  ‾‾|                    |
 *           |         |                                            | █ |    |                    |
 *           |         |                                            | █ |    |                    |
 *           |         |                                            | █ |    |                    |
 *  Content  |         |                                            | █ |    | Scrollbar Thumb    | Scrollbar Track
 *           |         |                                            | █ |    |                    |
 *           |         |                                            | █ |    |                    |
 *           |         |                                            | █ |  __|                    |
 *           |         |                                            |   |                         |
 *           |         |                                            |   |                         |
 *           |         |                                            |   |                         |
 *           |         |                                            |   |                         |
 *           |         |                                            |___|                       __|
 *           |__       |                                            | ▼ |
 *                     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
 *
 *
 */

/**
 * Creates a scroll container for the given element.
 *
 * @param $root - The root element for the scroll container.
 * @example
 * const root = document.querySelector('[data-sc-role="root"])
 * SimpleBar(root)
 */
export default function SimpleBar($root: HTMLElement) {
  const $content = document.querySelector('[data-sc-role="content"]') as HTMLElement
  const $track = document.querySelector('[data-sc-role="scrollbar-track"]') as HTMLElement
  const $scrollbar = $track.querySelector(`[data-sc-role="scrollbar-thumb"]`) as HTMLElement

  /**
   * height of the scrollbar track
   */
  let trackHeight: number
  /**
   * height of the content
   */
  let contentHeight: number
  /**
   * height of the scrollbar thumb
   */
  let scrollbarThumbHeight: number
  /**
   * whether we are currently animating the scrollbar, used for throttling the onScroll event
   */
  let scrollYTicking: boolean

  /**
   * Positions the scrollbar thumb based on how much the content has been scrolled.
   */
  const positionScrollbar = () => {
    const scrollOffset = $content.scrollTop
    const scrollPercent = scrollOffset / (contentHeight - trackHeight)
    const handleOffset = Math.floor((trackHeight - scrollbarThumbHeight) * scrollPercent)
    $scrollbar.style.transform = `translateY(${handleOffset}px)`
  }

  /**
   * Sets all the static variables that don't change often (like content height) and positions the scrollbar.
   */
  const recalculate = () => {
    trackHeight = $track.scrollHeight
    contentHeight = $content.scrollHeight
    scrollbarThumbHeight = Math.floor($track.scrollHeight ** 2 / $content.scrollHeight)
    $scrollbar.style.height = `${scrollbarThumbHeight}px`
    positionScrollbar()
  }

  /**
   * Animate the scrollbar.
   */
  const scrollY = () => {
    positionScrollbar()
    scrollYTicking = false
  }

  /**
   * OnScroll event handler.
   */
  const onScrollY = () => {
    /**
     * throttle scrolling because onScrollY is called very often, but we can only animate as fast as requestAnimationFrame can
     */
    if (!scrollYTicking) {
      requestAnimationFrame(scrollY)
      scrollYTicking = true
    }
  }

  //
  // ─── INITIALIZE ─────────────────────────────────────────────────────────────────
  //

  recalculate()
  $content.addEventListener('scroll', onScrollY)
  $root.setAttribute('data-sc-initialized', 'true') // let css know that the scrollbar is ready
}
