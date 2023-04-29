# File Organizer Script

This is a TypeScript script (using Node.js APIs) for macOS that organizes your files and folders automatically based on file type.

## Installation
1. Install Node.js and pnpm (preferred) or npm.
2. Clone the repository or download the script file.
3. Install dependencies by running `pnpm install` (preferred) or `npm install`. I will use `pnpm` in the following tutorial

## Usage

To use the script, run the following command:

```bash
tsm index.ts [folderPath] [--recursive]
```

or

```bash
pnpm start [folderPath] -- [--recursive]
```

- `--recursive` (optional): Organize files recursively in folders.
- `folderPath` (optional): Specify the path to the folder to organize. If not provided, the script will try to organize files in the `/Users/{username}/Desktop/test/` directory.


If you have `ts-node` installed globally, you can also run the file with:

```bash
./index.ts
```

## Example

```bash
tsm index.ts ~/Documents --recursive
```

or

```bash
pnpm start ~/Documents -- --recursive
```

This will organize files in the `Documents` folder and all its subfolders based on file type.

## How it works

The script uses Node.js file APIs to search for files and move them to the appropriate folders based on their file type.

## License

This script is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
