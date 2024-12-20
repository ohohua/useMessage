/* for...of  + async、await 处理异步循环 */

function fetchData(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Data for ${id}`)
    }, 1000)
  })
}

async function asyncIteration() {
  const ids = [1, 2, 3, 4, 5]

  for (const id of ids) {
    const res = await fetchData(id)
    console.log('id', res)
  }
}

asyncIteration()
