export function setupPageMotion(root: HTMLElement): () => void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
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
          [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(0.2, 0.75, 0.2, 1)' },
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
    if (finePointer.matches) {
      hero?.addEventListener('pointermove', onMove, { passive: true })
      hero?.addEventListener('pointerleave', reset)
      document.addEventListener('visibilitychange', reset)
    }
    teardown = () => {
      observer?.disconnect()
      animations.forEach((animation) => animation.cancel())
      animations.clear()
      hero?.removeEventListener('pointermove', onMove)
      hero?.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', reset)
      reset()
    }
  }
  configure()
  reducedMotion.addEventListener('change', configure)
  finePointer.addEventListener('change', configure)
  return () => {
    teardown()
    reducedMotion.removeEventListener('change', configure)
    finePointer.removeEventListener('change', configure)
  }
}
