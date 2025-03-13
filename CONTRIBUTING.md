# Contributing to VS Code Destroyer

Thank you for your interest in contributing to VS Code Destroyer! This is a fun project meant for developers to blow off steam during coding sessions, and we welcome all kinds of contributions to make it even more entertaining.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/vscode-destroyer.git`
3. Create a feature branch: `git checkout -b my-new-feature`
4. Make your changes
5. Test your changes by pressing F5 in VS Code and selecting "Extension Development Host"
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin my-new-feature`
8. Submit a Pull Request

## Project Structure

- `/src/effects/` - Contains all destruction effect implementations
- `/src/images/` - Image assets like cursors and visual effects
- `/src/sounds/` - Audio files for the various destructive effects
- `/view.html` - The webview that displays the destructive interface
- `/extension.js` - Main extension entry point

## Adding a New Destruction Effect

1. Create a new effect file in `/src/effects/` (see README.md for detailed example)
2. Add your styles to `/src/styles/styles.css`
3. Register your effect in `/src/effects/effects-controller.js`
4. Add any necessary audio elements to `/view.html`
5. Add any necessary images to `/src/images/`

## Contribution Guidelines

- Keep it fun and entertaining
- Ensure performance is reasonable (don't freeze the editor)
- Make sure effects clean up after themselves to prevent memory leaks
- Test your effects thoroughly
- Follow the existing code style
- Add comments to explain complex or non-obvious code
- Update documentation when needed

## Asset Guidelines

- Audio files should be in MP3 format, no larger than 100KB
- Images should be in PNG format, optimized for size
- Cursor images should be no larger than 32x32 pixels

## Code Review Process

1. Once you submit a pull request, maintainers will review your code
2. We might suggest changes or improvements
3. Once approved, your PR will be merged into the main branch
4. Your contribution will be added to the CHANGELOG.md file

## Fun Ideas to Implement

- ⚡ Lightning strikes that electrocute code
- 💣 Bombs that create explosion patterns
- 🧪 Acid that melts characters slowly
- 🦶 Giant foot that squishes code (Monty Python style)
- 🌪️ Tornado that spins code around
- 🧱 Brick wall that smashes through the editor

## Thank You!

Your contributions help make VS Code Destroyer more enjoyable for frustrated developers everywhere. Remember, the main goal is to have fun while providing a therapeutic outlet for coding frustrations!
