let scrolledClass = false
const element = document.querySelector('.floating-logo')

function func() {
  if (scrollY == 0 && scrolledClass) {
    element.classList.remove('floating-logo--page-scrolled')
    scrolledClass = false
  }
  if (scrollY > 0 && !scrolledClass) {
    element.classList.add('floating-logo--page-scrolled')
    scrolledClass = true
  }
}

addEventListener('scroll', func)
func()
