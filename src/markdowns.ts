import md from 'markdown-it'
import { promises as fs } from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'
import colors from 'colors/safe'
import chokidar from 'chokidar'

const markdown = md({
  html: true
})

const markdownSets = [
  { src: 'src/markdowns/terms', out: 'src/assets/docs/terms' },
  { src: 'src/markdowns/privacypolicy', out: 'src/assets/docs/privacypolicy' },
  { src: 'src/markdowns/addblog', out: 'src/assets/docs/addblog' }
]

async function renderFile(src: string, out: string, filename: string) {
  const terms = await fs.readFile(path.join(src, filename), 'utf8')
  const result = markdown.render(terms)
  const htmlFilename = path.basename(filename, 'md') + 'html'
  await fsExtra.outputFile(path.join(out, htmlFilename), result)

  console.log(`${colors.green('parse completed')} ${filename}`)
}

async function renderDir(src: string, out: string) {
  const files = await fs.readdir(src)

  files.forEach(async filename => {
    await renderFile(src, out, filename)
  })
}

export const buildMarkdowns = (watch: boolean) => {
  markdownSets.forEach(async ({ src, out }) => {
    await renderDir(src, out)
  })

  if (watch) {
    markdownSets.forEach(({ src, out }) => {
      chokidar.watch(src).on('change', filePath => {
        renderFile(src, out, path.basename(filePath))
      })
    })
  }
}
