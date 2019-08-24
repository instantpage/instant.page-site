if (location.hash) {
  requestAnimationFrame(() => {
    const headerHeight = document.querySelector('.header').offsetHeight
    const margin = 25 // magic number
    const newPosition = scrollY - headerHeight - margin
    scrollTo(0, newPosition)
  })
}
