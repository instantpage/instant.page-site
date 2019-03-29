function showsNumberOfStars(text) {
  return !isNaN(parseInt(text))
}

async function fetchNumberOfStars() {
  const response = await fetch(location.pathname + '?' + +new Date)
  const text = await response.text()
  const [, newGithubText] = /<span class="github-text">(.+)<\/span>/.exec(text)
  return newGithubText
}

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

;(async () => {
  const githubTextElement = document.querySelector('.github-text')
  if (!githubTextElement) {
    return
  }

  const currentText = githubTextElement.innerHTML
  if (showsNumberOfStars(currentText)) {
    return
  }

  const newText = await fetchNumberOfStars()
  if (showsNumberOfStars(newText)) {
    githubTextElement.innerHTML = newText
    return
  }

  for (let multiplier = 2; multiplier <= 2 ** 4; multiplier *= 2) {
    await sleep(100 * multiplier)
    const newText = await fetchNumberOfStars()
    if (showsNumberOfStars(newText)) {
      githubTextElement.innerHTML = newText
      break
    }
  }
})()
