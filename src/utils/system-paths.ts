import os from 'os'
import fs from 'fs'
import path from 'path'
import { isErrorNodeSystemError } from './errors'

const APP_CACHE_DIR_NAME = 'soccer-go'

/**
 * Gets the platform-specific, user-space cache directory path.
 *
 * This function covers the three main platforms: linux, macOS, and Windows.
 * Other platforms might have other directory conventions but, for now, a
 * temporary directory will suffice.
 */
const getPlatformSpecificCacheDirPath = (): string => {
  const homePath = os.homedir()

  switch (os.platform()) {
    case 'linux': {
      return path.join(homePath, '.cache', APP_CACHE_DIR_NAME)
    }

    case 'darwin': {
      return path.join(homePath, 'Library', 'Caches', APP_CACHE_DIR_NAME)
    }

    case 'win32': {
      return path.join(homePath, 'AppData', 'Local', 'Temp', APP_CACHE_DIR_NAME)
    }

    default: {
      // Not sure yet what is the standard approach to app caching on other
      // platforms, so use a temporary folder.
      return path.join(os.tmpdir(), APP_CACHE_DIR_NAME)
    }
  }
}

/**
 * Gets the application's cache directory path.
 *
 * If required, this function will also initialize the directory.
 */
export const getCacheDir = (): string => {
  const cacheDirPath = getPlatformSpecificCacheDirPath()

  try {
    fs.statSync(cacheDirPath)
  } catch (e: unknown) {
    if (isErrorNodeSystemError(e) && e.code === 'ENOENT') {
      fs.mkdirSync(cacheDirPath, { recursive: true })
    }
  }

  return cacheDirPath
}
