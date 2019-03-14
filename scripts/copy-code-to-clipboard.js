const copyElement = document.createElement('textarea')
copyElement.readOnly = true
copyElement.style.setProperty('position', 'absolute')
copyElement.style.setProperty('left', '-9999px')
let appended = false

function copyToClipboard(value) {
  if (!appended) {
    document.body.appendChild(copyElement)
    appended = true
  }
  copyElement.value = value
  copyElement.style.setProperty('top', `${scrollY}px`) // Needed on Firefox, otherwise it scrolls to the top
  copyElement.select()
  copyElement.setSelectionRange(0, copyElement.value.length) // Needed on iOS
  document.execCommand('copy')
}

Array.from(document.querySelectorAll('.js-copy-snippet-button')).forEach((element) => {
  element.addEventListener('click', () => {
    copyToClipboard(document.querySelector('.main-code-snippet__code').innerText)

    const index = Array.from(document.querySelectorAll('.js-copy-snippet-button')).indexOf(element)
    const copiedCtaElement = document.querySelectorAll('.cta__widget__copied-cta')[index]
    copiedCtaElement.classList.add('cta__widget__copied-cta--displayed')
  })
})
