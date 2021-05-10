import md from 'markdown-it'
import { promises as fs } from 'fs'
import fsExtra from 'fs-extra'
import path from 'path'

const markdown = md({
  html: true
})

async function renderTerms() {
  const termsDirSrc = 'src/markdowns/terms'
  const termsDirOut = 'src/assets/docs/terms'
  const termsFiles = await fs.readdir(termsDirSrc)

  termsFiles.forEach(async termsFilename => {
    const terms = await fs.readFile(path.join(termsDirSrc, termsFilename), 'utf8')
    const result = markdown.render(terms)
    const htmlFilename = path.basename(termsFilename, 'md') + 'html'
    console.log(htmlFilename)
    await fsExtra.outputFile(path.join(termsDirOut, htmlFilename), result)
  })
}

async function renderPrivacyPolicy() {
  const privacyPolicyDirSrc = 'src/markdowns/privacypolicy'
  const privacyPolicyDirOut = 'src/assets/docs/privacypolicy'
  const privacyPolicyFiles = await fs.readdir(privacyPolicyDirSrc)

  privacyPolicyFiles.forEach(async privacyPolicyFilename => {
    const privacyPolicy = await fs.readFile(path.join(privacyPolicyDirSrc, privacyPolicyFilename), 'utf8')
    const result = markdown.render(privacyPolicy)
    const htmlFilename = path.basename(privacyPolicyFilename, 'md') + 'html'
    console.log(htmlFilename)
    await fsExtra.outputFile(path.join(privacyPolicyDirOut, htmlFilename), result)
  })
}

renderTerms()
renderPrivacyPolicy()
