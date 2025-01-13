import { mod } from init.js
export default {}

export const _startGenerateImageAndMovie = async ({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }) => {
  const OPENAI_CHATGPT_API_KEY = mod.setting.getValue('env.OPENAI_CHATGPT_API_KEY')
  const MOVIE_DIR_PATH = mod.setting.getValue('path.MOVIE_DIR_PATH') 
  const IMAGE_EXT = '.png'
  const dirPath = `${MOVIE_DIR_PATH}${requestId}/`
  mod.output.makeDir({ dirPath, })
  const tmpJsonDirPath = `${dirPath}tmpJson/`
  mod.output.makeDir({ dirPath: tmpJsonDirPath, })
  const chatgptResultJsonFilePath = `${dirPath}chatgpt_result_json.txt`
  mod.output.saveFile({ filePath: chatgptResultJsonFilePath, fileBuffer: Buffer.from(JSON.stringify({ requestId, title, themeText, targetText, prompt, chatgptResponse, narrationCsv, imagePromptList }, null, 2)) })

  const imageFilePathList = []
  const promiseList = imagePromptList.map((imagePrompt, i) => {
    const imageFilePath = `${dirPath}image_${i}${IMAGE_EXT}`
    imageFilePathList.push(imageFilePath)
    const tmpJsonFilePath = `${tmpJsonDirPath}${i}_json.txt`

    return new Promise((resolve) => {
      const resultList = []
      const commandList = ['/app/lib/dalle3/generate.sh', imageFilePath, tmpJsonFilePath, `"${OPENAI_CHATGPT_API_KEY}"`, `"${imagePrompt.replace(/"/g, '')}"`]

      mod.lib.fork({ commandList, resultList }).then(() => {
        resolve()
      })
    })
  })
