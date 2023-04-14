let hasModifierClass = false
const $_ = document.querySelector('.background-logo')

updateBackgroundLogoVisibilityRelativeToScrollPosition()
addEventListener('scroll', updateBackgroundLogoVisibilityRelativeToScrollPosition)

function updateBackgroundLogoVisibilityRelativeToScrollPosition() {
  if (scrollY == 0 && hasModifierClass) {
    $_.classList.remove('page-scrolled')
    hasModifierClass = false
  }
  if (scrollY > 0 && !hasModifierClass) {
    $_.classList.add('page-scrolled')
    hasModifierClass = true
  }
}
