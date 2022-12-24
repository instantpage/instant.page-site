let scrolledClass = false
const element = document.querySelector('.floating-logo')

function func() {
  if (scrollY == 0 && scrolledClass) {
    element.classList.remove('page-scrolled')
    scrolledClass = false
  }
  if (scrollY > 0 && !scrolledClass) {
    element.classList.add('page-scrolled')
    scrolledClass = true
  }
}

addEventListener('scroll', func)
func()
