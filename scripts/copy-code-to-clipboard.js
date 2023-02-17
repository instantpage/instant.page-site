document.querySelectorAll('.js-copy-snippet-button').forEach(($copyButton) => {
  $copyButton.addEventListener('click', (event) => {
    const $parent = event.target.closest('.cta-widget')
    const $code = $parent.querySelector('.main-code-snippet__code')
    navigator.clipboard.writeText($code.innerText)

    const $copiedCta = $parent.querySelector('.cta__widget__copied-cta')
    $copiedCta.classList.add('cta__widget__copied-cta--displayed')
  })
})
