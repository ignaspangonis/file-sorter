import { readdirSync, statSync, mkdirSync, renameSync } from 'fs'
import { extname } from 'path'
import colors from 'cli-color'
import os from 'os'

const { green, yellow, red, magenta } = colors

const pathExists = (path: string) =>
  statSync(path, {
    throwIfNoEntry: false,
  })

const validateFolderPathFormat = (folderPath: string) => {
  if (!folderPath.endsWith('/')) {
    throw new Error(`Folder path (${folderPath}) must end with a slash`)
  }
}

const validateFolderPathExists = (folderPath: string) => {
  if (!pathExists(folderPath)) {
    throw new Error('Folder path must exist')
  }
}

const DEFAULT_FOLDER = `/Users/${os.userInfo().username}/Desktop/test/`

const args = process.argv.slice(2) as string[] | undefined
const isRecursive = args?.includes('--recursive')
let folderToOrganize = args?.[0] || ''

if (!pathExists(folderToOrganize)) {
  console.log(yellow(`No folder specified or it doesn't exist, using default: ${DEFAULT_FOLDER}`))

  validateFolderPathExists(DEFAULT_FOLDER)

  folderToOrganize = DEFAULT_FOLDER
}

type DestFolder = 'Pictures' | 'Documents' | 'Videos' | 'Music' | 'Text'

type MoveFileOptions = {
  fileName: string
  srcFolderPath: string
  destFolderPath: string
}

/**
 * Moves a file from one folder to another. If the destination folder doesn't exist, it will be created.
 * @param fileName Name of the file to move
 * @param srcFolderPath Path to the folder where the file currently is
 * @param destFolderPath Path to the folder where the file should be moved to
 * @returns void
 * @throws Error if either of the paths are invalid (don't end with a slash)
 */
const moveFile = ({ fileName, srcFolderPath, destFolderPath }: MoveFileOptions) => {
  validateFolderPathFormat(srcFolderPath)
  validateFolderPathFormat(destFolderPath)

  const oldPath = `${srcFolderPath}${fileName}`
  const newPath = `${destFolderPath}${fileName}`

  console.log(magenta(`${oldPath} -> ${newPath}`))

  if (!pathExists(destFolderPath)) {
    mkdirSync(destFolderPath)
  }

  renameSync(oldPath, newPath)
}

const destFolderByExtension: Record<string, DestFolder> = {
  '.jpg': 'Pictures',
  '.jpeg': 'Pictures',
  '.png': 'Pictures',
  '.gif': 'Pictures',
  '.pdf': 'Documents',
  '.docx': 'Documents',
  '.xlsx': 'Documents',
  '.pptx': 'Documents',
  '.mp4': 'Videos',
  '.mp3': 'Music',
  '.txt': 'Text',
}

/**
 * Organizes files in a folder by moving them to their respective destination folders.
 * @param folderPath Path to the folder to organize
 * @returns void
 * @throws Error if the `folderPath` is invalid (doesn't end with a slash)
 */
const organizeFiles = (folderPath: string) => {
  validateFolderPathFormat(folderPath)

  const filesOrFolders = readdirSync(folderPath)

  filesOrFolders.forEach(name => {
    const path = `${folderPath}${name}`
    const isFolder = statSync(path).isDirectory()

    if (isFolder) {
      // If needed, recursively organize contents of the folder
      if (isRecursive) organizeFiles(`${path}/`)
      return
    }

    const isFile = statSync(path).isFile()
    const extension = extname(path)
    const destFolder = destFolderByExtension[extension]

    if (!isFile || !destFolder) {
      console.log(
        yellow(
          `Skipping ${name} as it either is not a file, has no extension or no destination folder`,
        ),
      )
      return
    }

    const destFolderPath = `${folderPath}${destFolder}/`

    moveFile({
      fileName: name,
      srcFolderPath: folderPath,
      destFolderPath,
    })
  })
}

try {
  organizeFiles(folderToOrganize)
} catch (error: unknown) {
  console.error(red((error as Error).message))
  process.exit(1)
}

console.log(green('Files organized successfully!'))
