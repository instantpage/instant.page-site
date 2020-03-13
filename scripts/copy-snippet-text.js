if (document.querySelectorAll('.js-copy-snippet-button').length == 2) {
  document.querySelectorAll('.js-copy-snippet-button')[1].innerHTML += ` now`
}

if (document.querySelectorAll('.js-copy-snippet-button').length == 1) {
  document.querySelectorAll('.js-copy-snippet-button')[0].innerHTML += ` now`
}
