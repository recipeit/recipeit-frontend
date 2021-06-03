const md = require('markdown-it')
const { promises: fs } = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const markdown = md({
  html: true
})

const markdownSets = [
  { src: 'src/markdowns/terms', out: 'src/assets/docs/terms' },
  { src: 'src/markdowns/privacypolicy', out: 'src/assets/docs/privacypolicy' },
  { src: 'src/markdowns/addblog', out: 'src/assets/docs/addblog' }
]

async function renderFile(src, out, filename) {
  const terms = await fs.readFile(path.join(src, filename), 'utf8')
  const result = markdown.render(terms)
  const htmlFilename = path.basename(filename, 'md') + 'html'
  await fsExtra.outputFile(path.join(out, htmlFilename), result)

  console.log(`${colors.green('parse completed')} ${filename}`)
}

async function renderDir(src, out) {
  const files = await fs.readdir(src)

  files.forEach(async filename => {
    await renderFile(src, out, filename)
  })
}

module.exports = {
  buildMarkdowns(watch) {
    markdownSets.forEach(async ({ src, out }) => {
      await renderDir(src, out)
    })

    if (watch) {
      const chokidar = require('chokidar')

      markdownSets.forEach(({ src, out }) => {
        chokidar.watch(src).on('change', filePath => {
          renderDir(src, out, path.basename(filePath))
        })
      })
    }
  }
}
