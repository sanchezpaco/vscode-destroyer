# VS Code Destroyer™

## _"Because sometimes, code just needs to be DESTROYED!"_

<p align="center">
  <img src="src/images/banner.webp" alt="VS Code Destroyer Banner" width="500" />
</p>

Are you tired of staring at that frustrating code that just won't work? Do you wish there was a more satisfying way to express your programming rage than just hitting backspace? **LOOK NO FURTHER!**

## 🔥 Introducing VS Code Destroyer™! 🔥

**BUT WAIT, THERE'S MORE!** With our patent-pending destruction technology, you can now:

- 🔫 SHOOT your broken functions with realistic bullet holes!
- 🔫 SPRAY your messy classes with automatic gunfire!
- 🔨 SMASH those terrible algorithms with a virtual hammer!
- 🔥 INCINERATE your spaghetti code with a flamethrower!

## How It Works

Simply load up this extension, select your weapon of choice, and click on the editor to unleash your fury! Each weapon offers a unique destruction experience:

1. **Bullet Mode**: One satisfying shot at a time
2. **Auto Gun Mode**: Rapid-fire destruction for those particularly annoying segments
3. **Hammer Mode**: Smash your code into fragments that pile up realistically
4. **Flamethrower Mode**: Watch your code burn away in glorious flames

## Installation

```bash
# Clone this repository
git clone https://github.com/sanchezpaco/vscode-destroyer.git

# Navigate to project directory
cd vscode-destroyer

# Install dependencies
npm install

# Run the extension
Open the project with VSCode
Press F5 and select VsCode Extension Development
This will open a new window where you can test it by running cmd/control + shift + P and select Destroy Editor!
```

## Usage

1. **Launch the Destroyer**: 
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open the command palette
   - Type `Destroy Editor!` and select it

2. **Select Your Weapon**:
   - Click on one of the weapon icons in the toolbar that appears
   - Or use number keys 1-4 to quickly switch between weapons:
     - `1`: Bullet Mode
     - `2`: Auto Gun Mode
     - `3`: Hammer Mode
     - `4`: Flamethrower Mode
     - `5`: Bomb mode 

3. **Unleash Destruction**:
   - Click anywhere in your code to apply the selected destruction effect
   - Hold and drag for continuous destruction with certain weapons

5. **Save Your Masterpiece**:
   - Use the "Save Destruction" button to capture a screenshot of your destroyed code
   - Share with colleagues for maximum satisfaction!

## Adding Your Own Destruction Effects

### "BUT HOW CAN I CREATE MY OWN DESTRUCTION METHODS?" We hear you ask!

Adding your own mayhem is as easy as 1-2-3! Just follow these simple steps:

### 1. Create your effect JavaScript file

Create a new file in the `/src/effects/` directory (e.g., `chainsaw-effect.js`):

```javascript
import { EffectBase } from './effects-loader.js';

class ChainsawEffect extends EffectBase {
    constructor() {
        super();
        
        // Reference your audio elements from view.html
        this.chainsawSound = document.getElementById('chainsaw-sound');
        this.woodCuttingSound = document.getElementById('wood-cutting-sound');
    }

    enable() {
        super.enable();
        document.body.style.cursor = 'url("src/images/chainsaw-cursor.png"), auto';
    }
    
    disable() {
        super.disable();
        document.body.style.cursor = 'default';
    }

    handleClick(e) {
        if (!this.isActive) return;
        
        // Play appropriate sound
        this.playSound(this.chainsawSound);
        
        // Create visual effects at click position
        this.createSawdustEffect(e.clientX, e.clientY);
        this.createCutLine(e.clientX, e.clientY);
        
        this.hitCount++;
    }
    
    createSawdustEffect(x, y) {
        // Create particles for sawdust
        for (let i = 0; i < 20; i++) {
            const dust = document.createElement('div');
            dust.className = 'sawdust';
            // ... implementation details
            this.editor.appendChild(dust);
        }
    }
    
    createCutLine(x, y) {
        // Create a jagged cut line
        const cut = document.createElement('div');
        cut.className = 'cut-line';
        // ... implementation details
        this.editor.appendChild(cut);
    }
}

export { ChainsawEffect };
```

### 2. Add CSS styles for your effect

Add styles to `/src/styles/styles.css`:

```css
/* Chainsaw effect styles */
.sawdust {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #d2b48c;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.8;
    z-index: 100;
    pointer-events: none;
    animation: sawdust-animation 1s forwards;
}

@keyframes sawdust-animation {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.9; }
    100% { transform: translate(calc(-50% + var(--dust-x)), calc(-50% + var(--dust-y))) scale(1.5); opacity: 0; }
}

.cut-line {
    position: absolute;
    height: 3px;
    background: linear-gradient(to right, transparent, #8b4513, transparent);
    transform-origin: center left;
    z-index: 95;
    pointer-events: none;
}
```

### 3. Add audio elements to `/view.html`

```html
<!-- Add your sound effects -->
<audio id="chainsaw-sound" src="src/sounds/chainsaw.mp3" preload="auto"></audio>
<audio id="wood-cutting-sound" src="src/sounds/wood-cutting.mp3" preload="auto"></audio>
```

### 4. Register your effect in `/src/effects/effects-controller.js`

```javascript
import { ChainsawEffect } from "./chainsaw-effect.js";

// ...existing code...

export function initializeEffects() {
    // ...existing effects...
    const chainsawEffect = new ChainsawEffect();
    
    const weapons = {
        // ...existing weapons...
        'chainsaw': {
            id: 'chainsaw-control',
            name: 'Chainsaw',
            icon: '🪚',
            key: '5',
            effect: chainsawEffect
        }
    };
    
    // ...remaining code...
}
```

### 5. Update HTML to include your new weapon button

```html
<div class="weapon-button" id="chainsaw-control" title="Chainsaw (5)">🪚</div>
```

## 📞 ACT NOW! 📞

Don't delay! Download VS Code Destroyer™ today and experience the most satisfying digital destruction you'll ever feel!

_But seriously, this is just for fun. Please don't actually use this for productive work._

## License

GNU General Public License v3.0 - This software is free as in freedom. You can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation.

See the [LICENSE](LICENSE) file for full details.

_VS Code Destroyer™ is not responsible for any lost work, missed deadlines, or emotional attachment to destroyed code. Not valid in regions where code destruction is prohibited. Some destruction may require modern browser support._
