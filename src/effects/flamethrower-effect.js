import { EffectBase } from './effects-loader.js';

class FlamethrowerEffect extends EffectBase {
    constructor() {
        super();
        
        this.activeFlames = [];
        this.isFlameActive = false;
        this.mousePosition = { x: 0, y: 0 };
        this.flameInterval = null;
        this.isEnabled = false;
        
        this.fallbackSoundUrls = [
            'https://soundbible.com/mp3/Fire_Burning-JaBa-810606592.mp3',
            'https://soundbible.com/mp3/Realistic_Punch-Hancel_Deaton-1140835265.mp3',
            'https://soundbible.com/mp3/Explosion-SoundBible.com-2019248186.mp3'
        ];

        this.flameSound = document.getElementById('flame-sound');
        this.burnSound = document.getElementById('burn-sound');
        this.explosionSound = document.getElementById('explosion');
        
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        
        document.addEventListener('mouseup', this.boundMouseUp);
        
        this.burnIntensity = 0.4;
        this.maxScorchMarks = 200;
        this.scorchMarkSize = { min: 20, max: 60 };
    }
    
    handleMouseMove(e) {
        if (!this.isEnabled) return;
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
    }
    
    handleMouseDown(e) {
        if (!this.isEnabled) return;
        this.startFlame(e);
    }
    
    handleMouseUp() {
        if (this.isFlameActive) {
            this.stopFlame();
        }
    }

    enable() {
        console.log('Flamethrower effect enabled');
        this.isEnabled = true;
        this.editor.addEventListener('mousemove', this.boundMouseMove);
        this.editor.addEventListener('mousedown', this.boundMouseDown);
    }
    
    disable() {
        console.log('Flamethrower effect disabled');
        this.isEnabled = false;
        this.stopFlame();
        this.editor.removeEventListener('mousemove', this.boundMouseMove);
        this.editor.removeEventListener('mousedown', this.boundMouseDown);
    }

    initialize() {
        console.log('Flamethrower effect initialized (disabled by default)');
        this.isEnabled = false;
    }

    startFlame(e) {
        if (!this.isEnabled) return;
        
        this.playSound(this.flameSound, 0);
        this.flameSound.loop = true;
        
        this.isFlameActive = true;
        
        this.flameInterval = setInterval(() => {
            if (this.isFlameActive) {
                for (let i = 0; i < 3; i++) {
                    const offsetX = (Math.random() - 0.5) * 30;
                    const offsetY = (Math.random() - 0.5) * 30;
                    this.createFlame(this.mousePosition.x + offsetX, this.mousePosition.y + offsetY);
                }
                this.burnObjects(this.mousePosition.x, this.mousePosition.y);
            }
        }, 70);
    }

    stopFlame() {
        if (!this.isFlameActive) return;
        
        this.isFlameActive = false;
        clearInterval(this.flameInterval);
        
        if (this.flameSound) {
            const fadeOut = setInterval(() => {
                if (this.flameSound.volume > 0.1) {
                    this.flameSound.volume -= 0.1;
                } else {
                    this.flameSound.pause();
                    this.flameSound.currentTime = 0;
                    this.flameSound.volume = 0.3;
                    clearInterval(fadeOut);
                }
            }, 50);
        }
    }

    createFlame(x, y) {
        const flame = document.createElement('div');
        flame.className = 'flame-particle';
        
        const size = Math.random() * 40 + 20;
        flame.style.width = `${size}px`;
        flame.style.height = `${size}px`;
        
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        flame.style.left = `${x + offsetX}px`;
        flame.style.top = `${y + offsetY}px`;
        
        const duration = Math.random() * 0.5 + 0.5;
        flame.style.animationDuration = `${duration}s`;
        
        const directionX = (Math.random() - 0.5) * 100;
        const directionY = -(Math.random() * 100 + 50);
        flame.style.setProperty('--move-x', `${directionX}px`);
        flame.style.setProperty('--move-y', `${directionY}px`);
        
        this.editor.appendChild(flame);
        
        this.activeFlames.push(flame);
        setTimeout(() => {
            flame.remove();
            this.activeFlames = this.activeFlames.filter(f => f !== flame);
        }, duration * 1000);
    }

    burnObjects(x, y) {
        if (Math.random() > this.burnIntensity) {
            const numMarks = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numMarks; i++) {
                this.createScorchMark(x, y);
            }
        }
        
        if (Math.random() > 0.8) {
            this.playSound(this.burnSound, 1);
        }
        
        if (Math.random() > 0.7) {
            this.burnText(x, y);
        }
        
        if (Math.random() > 0.7) {
            this.createSparks(x, y);
        }
    }

    createSparks(x, y) {
        const numSparks = Math.floor(Math.random() * 8) + 5;
        
        for (let i = 0; i < numSparks; i++) {
            const spark = document.createElement('div');
            spark.className = 'flame-particle spark';
            
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const flyX = Math.cos(angle) * distance;
            const flyY = Math.sin(angle) * distance - 50;
            
            spark.style.setProperty('--fly-x', `${flyX}px`);
            spark.style.setProperty('--fly-y', `${flyY}px`);
            
            this.editor.appendChild(spark);
            
            setTimeout(() => {
                spark.remove();
            }, 500);
        }
    }

    createScorchMark(x, y) {
        const scorch = document.createElement('div');
        scorch.className = 'scorch-mark';
        
        if (Math.random() < 0.3) {
            scorch.classList.add('intense');
        }
        
        const size = Math.random() * (this.scorchMarkSize.max - this.scorchMarkSize.min) + this.scorchMarkSize.min;
        scorch.style.width = `${size}px`;
        scorch.style.height = `${size}px`;
        
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 60;
        scorch.style.left = `${x + offsetX}px`;
        scorch.style.top = `${y + offsetY}px`;
        
        scorch.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        const baseOpacity = Math.random() * 0.5 + 0.3;
        scorch.style.opacity = baseOpacity.toString();
        scorch.style.setProperty('--base-opacity', baseOpacity.toString());
        
        const markType = Math.floor(Math.random() * 3);
        switch (markType) {
            case 0:
                break;
            case 1:
                scorch.style.borderRadius = `${30 + Math.random() * 40}% ${20 + Math.random() * 40}% ${50 + Math.random() * 30}% ${10 + Math.random() * 50}%`;
                break;
            case 2:
                scorch.style.width = `${size * 1.5}px`;
                scorch.style.height = `${size * 0.7}px`;
                scorch.style.borderRadius = `${40 + Math.random() * 30}% / ${60 + Math.random() * 20}%`;
                break;
        }
        
        this.editor.appendChild(scorch);
        
        const allScorchMarks = document.querySelectorAll('.scorch-mark');
        if (allScorchMarks.length > this.maxScorchMarks) {
            allScorchMarks[0].remove();
        }
    }

    burnText(x, y) {
        const editorContent = document.querySelector('.editor-content');
        if (!editorContent) return;
        
        const burningText = document.createElement('div');
        burningText.className = 'burning-text';
        
        const fullText = editorContent.textContent;
        const randomIndex = Math.floor(Math.random() * Math.max(1, fullText.length - 20));
        const textFragment = fullText.substring(randomIndex, randomIndex + Math.floor(Math.random() * 20) + 10);
        
        burningText.textContent = textFragment;
        burningText.style.left = `${x}px`;
        burningText.style.top = `${y}px`;
        
        const meltDirection = Math.random() * 60 - 30;
        burningText.style.setProperty('--melt-direction', `${meltDirection}px`);
        
        burningText.style.fontSize = `${12 + Math.random() * 8}px`;
        
        const hue = Math.floor(Math.random() * 40);
        const saturation = 80 + Math.random() * 20;
        const lightness = 40 + Math.random() * 30;
        burningText.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        burningText.style.textShadow = `0 0 5px rgba(255, 200, 50, 0.8), 0 0 10px rgba(255, 120, 20, 0.5)`;
        
        this.editor.appendChild(burningText);
        
        setTimeout(() => {
            burningText.remove();
        }, 2000);
    }

    handleClick(e) {
        if (this.isEnabled) {
            if (!this.isFlameActive) {
                this.startFlame(e);
                
                setTimeout(() => {
                    if (this.isFlameActive) {
                        this.stopFlame();
                    }
                }, 500);
            }
        }
    }
}

export { FlamethrowerEffect };
