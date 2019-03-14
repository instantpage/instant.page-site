const clickTestButton = document.querySelector('.js-click-test-button')
const clickTestResultsElement = document.querySelector('.js-click-test-results')
let start
let lastTouchTimestamp = -1000

function hasBeenTouched() {
  return !(performance.now() - lastTouchTimestamp > 1000)
}
if (clickTestButton) {
  clickTestButton.addEventListener('touchstart', () => {
    start = performance.now()
    lastTouchTimestamp = start
  })

  clickTestButton.addEventListener('mouseover', () => {
    if (!hasBeenTouched()) {
      start = performance.now()
    }
  })

  clickTestButton.addEventListener('click', () => {
    if (!start) {
      clickTestResultsElement.innerHTML = 'Un-hover before clicking again.'
    }
    else {
      clickTestResultsElement.innerHTML = '<strong class="click-test-results__delay">' + Math.round(performance.now() - start) + '&nbsp;ms</strong> from ' + (hasBeenTouched() ? 'touchstart' : 'hover') + ' to click.'
      start = undefined
    }
  })
}
