import type { Config } from 'jest'

export default async (): Promise<Config> => {
    return {
        rootDir: process.cwd(),
        moduleFileExtensions: ['ts', 'js' ],
        transform: { '.*\\.(ts?)$': '@swc/jest' }
    }
}

