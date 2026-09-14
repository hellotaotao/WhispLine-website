export function setupPageMotion(root: HTMLElement): () => void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const wideViewport = window.matchMedia('(min-width: 901px)')
  const revealed = new WeakSet<Element>()
  let teardown = () => {}

  const configure = () => {
    teardown()
    if (reducedMotion.matches) return

    const animations = new Set<Animation>()
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || revealed.has(entry.target)) continue
        observer?.unobserve(entry.target)
        if (typeof entry.target.animate !== 'function') continue
        revealed.add(entry.target)
        const animation = entry.target.animate(
          wideViewport.matches
            ? [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }]
            : [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: wideViewport.matches ? 650 : 400,
            delay: wideViewport.matches ? Number((entry.target as HTMLElement).dataset.revealDelay || 0) : 0,
            fill: 'backwards',
            easing: 'cubic-bezier(0.2, 0.75, 0.2, 1)',
          },
        )
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      }
    }, { threshold: 0.08 })
    root.querySelectorAll('.reveal-target').forEach((element) => {
      if (!revealed.has(element)) observer?.observe(element)
    })

    const hero = root.querySelector<HTMLElement>('.hero-section')
    const art = root.querySelector<HTMLElement>('.hero-art')
    const product = root.querySelector<HTMLElement>('.hero-product')
    const layeredMotion = finePointer.matches && wideViewport.matches
    let scrollFrame = 0
    let frame = 0
    const reset = () => {
      cancelAnimationFrame(frame)
      frame = 0
      art?.style.removeProperty('--wave-x')
      art?.style.removeProperty('--wave-y')
    }
    const onMove = (event: PointerEvent) => {
      if (!hero || !art || event.pointerType !== 'mouse' || document.hidden) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
        art.style.setProperty('--wave-x', `${x * 10}px`)
        art.style.setProperty('--wave-y', `${y * 7}px`)
        frame = 0
      })
    }
    const updateScroll = () => {
      scrollFrame = 0
      if (!hero || document.hidden) return
      const bounds = hero.getBoundingClientRect()
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return
      const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height)))
      art?.style.setProperty('--wave-scroll', `${progress * 30}px`)
      art?.style.setProperty('--wave-opacity', `${1 - progress * 0.45}`)
      product?.style.setProperty('--product-scroll', `${progress * 8}px`)
    }
    const scheduleScroll = () => {
      if (!document.hidden && !scrollFrame) scrollFrame = requestAnimationFrame(updateScroll)
    }
    const clearScroll = () => {
      cancelAnimationFrame(scrollFrame)
      scrollFrame = 0
      art?.style.removeProperty('--wave-scroll')
      art?.style.removeProperty('--wave-opacity')
      product?.style.removeProperty('--product-scroll')
    }
    const onVisibility = () => {
      reset()
      if (document.hidden) clearScroll()
      else scheduleScroll()
    }
    if (layeredMotion) {
      updateScroll()
      window.addEventListener('scroll', scheduleScroll, { passive: true })
      window.addEventListener('resize', scheduleScroll)

      hero?.addEventListener('pointermove', onMove, { passive: true })
      hero?.addEventListener('pointerleave', reset)
      document.addEventListener('visibilitychange', onVisibility)
    }
    teardown = () => {
      observer?.disconnect()
      animations.forEach((animation) => animation.cancel())
      animations.clear()
      hero?.removeEventListener('pointermove', onMove)
      hero?.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', scheduleScroll)
      window.removeEventListener('resize', scheduleScroll)
      clearScroll()
      reset()
    }
  }
  configure()
  reducedMotion.addEventListener('change', configure)
  finePointer.addEventListener('change', configure)
  wideViewport.addEventListener('change', configure)
  return () => {
    teardown()
    reducedMotion.removeEventListener('change', configure)
    finePointer.removeEventListener('change', configure)
    wideViewport.removeEventListener('change', configure)
  }
}
