document.querySelectorAll('.footnote-button').forEach(($button, index) => {
  $button.addEventListener('click', function () {
    const $content = document.querySelectorAll('.footnote-content')[index]
    $content.classList.toggle('footnote-content--displayed')
    this.classList.toggle('footnote-button--activated')
  })
})
