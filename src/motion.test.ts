import { afterEach, describe, expect, it, vi } from 'vitest'
import { setupPageMotion } from './motion'

class MediaQuery extends EventTarget {
  constructor(public matches: boolean) { super() }
  set(matches: boolean) { this.matches = matches; this.dispatchEvent(new Event('change')) }
}

function fixture(reduce = false) {
  const reduced = new MediaQuery(reduce)
  const fine = new MediaQuery(true)
  const hero = new EventTarget()
  const style = { setProperty: vi.fn(), removeProperty: vi.fn() }
  const animation = { cancel: vi.fn(), onfinish: null as (() => void) | null }
  const target = { animate: vi.fn(() => animation) }
  const observe = vi.fn()
  const unobserve = vi.fn()
  const disconnect = vi.fn()
  let deliver: IntersectionObserverCallback = () => {}
  const createObserver = vi.fn()
  class Observer {
    observe = observe
    unobserve = unobserve
    disconnect = disconnect
    constructor(callback: IntersectionObserverCallback) { createObserver(); deliver = callback }
  }
  let nextFrame: FrameRequestCallback | null = null
  const raf = vi.fn((callback: FrameRequestCallback) => { nextFrame = callback; return 1 })
  const cancel = vi.fn(() => { nextFrame = null })
  const doc = Object.assign(new EventTarget(), { hidden: false })
  Object.assign(hero, { getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }) })
  const root = {
    querySelectorAll: () => [target],
    querySelector: (selector: string) => selector === '.hero-section' ? hero : { style },
  } as unknown as HTMLElement
  vi.stubGlobal('window', { matchMedia: (query: string) => query.includes('reduced-motion') ? reduced : fine })
  vi.stubGlobal('document', doc)
  vi.stubGlobal('IntersectionObserver', Observer)
  vi.stubGlobal('requestAnimationFrame', raf)
  vi.stubGlobal('cancelAnimationFrame', cancel)
  const intersect = (visible: boolean) => deliver([{ isIntersecting: visible, target } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
  const move = (pointerType = 'mouse') => hero.dispatchEvent(Object.assign(new Event('pointermove'), { pointerType, clientX: 1000, clientY: 1000 }))
  return { root, reduced, fine, hero, style, animation, target, observe, unobserve, disconnect, createObserver, intersect, move, raf, cancel, doc, frame: () => nextFrame?.(0) }
}

afterEach(() => { vi.unstubAllGlobals() })

describe('scoped page motion', () => {
  it('does not set up animations or pointer motion with reduced motion enabled', () => {
    const f = fixture(true)
    const cleanup = setupPageMotion(f.root)
    expect(f.createObserver).not.toHaveBeenCalled()
    f.move()
    expect(f.raf).not.toHaveBeenCalled()
    cleanup()
  })

  it('reveals only intersecting sections and releases each observed target', () => {
    const f = fixture()
    const cleanup = setupPageMotion(f.root)
    expect(f.observe).toHaveBeenCalledWith(f.target)
    f.intersect(false)
    expect(f.target.animate).not.toHaveBeenCalled()
    f.intersect(true)
    expect(f.target.animate).toHaveBeenCalledOnce()
    expect(f.unobserve).toHaveBeenCalledWith(f.target)
    cleanup()
    expect(f.animation.cancel).toHaveBeenCalledOnce()
    expect(f.disconnect).toHaveBeenCalledOnce()
  })

  it('bounds mouse parallax and excludes touch and hidden documents', () => {
    const f = fixture()
    const cleanup = setupPageMotion(f.root)
    f.move('touch')
    expect(f.raf).not.toHaveBeenCalled()
    f.move()
    f.frame()
    expect(f.style.setProperty).toHaveBeenCalledWith('--wave-x', '10px')
    expect(f.style.setProperty).toHaveBeenCalledWith('--wave-y', '7px')
    f.doc.hidden = true
    f.move()
    expect(f.raf).toHaveBeenCalledOnce()
    f.doc.dispatchEvent(new Event('visibilitychange'))
    expect(f.style.removeProperty).toHaveBeenCalledWith('--wave-x')
    cleanup()
  })

  it('cancels active work when reduced motion changes and removes listeners on teardown', () => {
    const f = fixture()
    const cleanup = setupPageMotion(f.root)
    f.intersect(true)
    f.move()
    f.reduced.set(true)
    expect(f.animation.cancel).toHaveBeenCalledOnce()
    f.frame()
    expect(f.style.setProperty).not.toHaveBeenCalled()
    f.move()
    expect(f.raf).toHaveBeenCalledOnce()
    cleanup()
    const observerCount = f.createObserver.mock.calls.length
    f.reduced.set(false)
    expect(f.createObserver).toHaveBeenCalledTimes(observerCount)
  })

  it('does not replay sections after pointer or motion preferences change', () => {
    const f = fixture()
    const cleanup = setupPageMotion(f.root)
    f.intersect(true)
    f.fine.set(false)
    f.reduced.set(true)
    f.reduced.set(false)
    expect(f.observe).toHaveBeenCalledOnce()
    cleanup()
  })

  it('leaves content untouched if IntersectionObserver is unavailable', () => {
    const f = fixture()
    vi.stubGlobal('IntersectionObserver', undefined)
    const cleanup = setupPageMotion(f.root)
    expect(f.target.animate).not.toHaveBeenCalled()
    cleanup()
  })
})
