const footnoteButtons = Array.from(document.querySelectorAll('.footnote-button'))

footnoteButtons.forEach((element) => {
  element.addEventListener('click', function (event) {
    const index = footnoteButtons.indexOf(this)
    const footnoteContent = document.querySelectorAll('.footnote-content')[index]
    footnoteContent.classList.toggle('footnote-content--displayed')
    this.classList.toggle('footnote-button--activated')
  })
})
