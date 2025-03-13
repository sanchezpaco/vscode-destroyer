import { EffectBase } from './effects-loader.js';

class BulletEffect extends EffectBase {
    constructor() {
        super();
        
        this.fallbackSoundUrls = [
            'https://soundbible.com/mp3/Shotgun_Blast-Jim_Rogers-1914772763.mp3',
            'https://soundbible.com/mp3/Dry_Fire_Gun-SoundBible.com-2053652037.mp3',
            'https://soundbible.com/mp3/GunShot-SoundBible.com-1113900305.mp3',
            'https://soundbible.com/mp3/Bomb_Exploding-Sound_Explorer-68256487.mp3'
        ];

        this.gunshot1 = document.getElementById('gunshot1');
        this.gunshot2 = document.getElementById('gunshot2');
        this.gunshot3 = document.getElementById('gunshot3');
        this.explosionSound = document.getElementById('explosion');
        
        this.isActive = false;
    }

    enable() {
        this.isActive = true;
    }
    
    disable() {
        this.isActive = false;
    }

    initialize() {
    }

    playRandomGunshot() {
        const sounds = [this.gunshot1, this.gunshot2, this.gunshot3];
        const randomIndex = Math.floor(Math.random() * sounds.length);
        this.playSound(sounds[randomIndex], randomIndex);
    }

    screenShake() {
        this.editor.classList.add('screen-shake');
        setTimeout(() => {
            this.editor.classList.remove('screen-shake');
        }, 200);
    }

    createBulletHole(x, y) {
        const hole = document.createElement('div');
        hole.className = 'bullet-hole';
        
        const size = Math.random() * 15 + 10; 
        
        const types = ['bullet-hole-type1', 'bullet-hole-type2', 'bullet-hole-type3'];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        hole.classList.add(selectedType);
        
        hole.style.left = x + 'px';
        hole.style.top = y + 'px';
        
        const scale = 0.8 + Math.random() * 0.4; // entre 0.8 y 1.2
        hole.style.transform = `translate(-50%, -50%) scale(${scale})`;
        
        hole.style.transform += ` rotate(${Math.random() * 360}deg)`;
        
        this.editor.appendChild(hole);
    }

    createSplash(x, y) {
        const splashTypes = ['splash-red', 'splash-dark'];
        
        for (let i = 0; i < 5; i++) {
            const splash = document.createElement('div');
            splash.className = 'splash';
            
            splash.classList.add(splashTypes[Math.floor(Math.random() * splashTypes.length)]);
            
            const distance = Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            splash.style.left = (x + offsetX) + 'px';
            splash.style.top = (y + offsetY) + 'px';
            
            const size = Math.random() * 10 + 5;
            splash.style.width = size + 'px';
            splash.style.height = size * (0.8 + Math.random() * 0.4) + 'px';
            
            this.editor.appendChild(splash);
            
            setTimeout(() => {
                splash.remove();
            }, 1000);
        }
    }

    createCracks(x, y) {
        const crackContainer = document.createElement('div');
        crackContainer.className = 'glass-crack';
        crackContainer.style.left = x + 'px';
        crackContainer.style.top = y + 'px';
        crackContainer.style.width = '0';
        crackContainer.style.height = '0';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = 'glass-crack-container';
        crackContainer.appendChild(innerContainer);
        
        const numCracks = Math.floor(Math.random() * 7) + 6;
        
        for (let i = 0; i < numCracks; i++) {
            this.createCrackLine(innerContainer, 0, 0, Math.random() * 360, Math.random() * 70 + 50);
            
            if (Math.random() > 0.5) {
                const branchLength = Math.random() * 40 + 20;
                const branchAngle = Math.random() * 30 - 15; // Desviación entre -15 y 15 grados
                
                const branchStart = Math.random() * 0.7 + 0.2; // Entre 20% y 90% de la línea principal
                const x = Math.cos(i * Math.PI * 2 / numCracks) * (70 * branchStart);
                const y = Math.sin(i * Math.PI * 2 / numCracks) * (70 * branchStart);
                
                this.createCrackLine(
                    innerContainer, 
                    x, 
                    y, 
                    i * (360 / numCracks) + branchAngle, 
                    branchLength
                );
            }
        }
        
        this.editor.appendChild(crackContainer);
    }

    createCrackLine(container, x, y, angle, length) {
        const crack = document.createElement('div');
        crack.className = 'crack-line';
        
        crack.style.left = x + 'px';
        crack.style.top = y + 'px';
        
        crack.style.transform = `rotate(${angle}deg)`;
        crack.style.width = `${length}px`;
        crack.style.height = `${Math.random() * 2 + 1}px`;
        crack.style.opacity = Math.random() * 0.3 + 0.2;
        
        container.appendChild(crack);
        
        if (length > 20 && Math.random() > 0.7) {
            const subX = length * 0.7; 
            const subAngle = angle + (Math.random() * 40 - 20);
            const subLength = length * 0.6;
            
            setTimeout(() => {
                this.createCrackLine(container, x + subX * Math.cos(angle * Math.PI / 180), 
                               y + subX * Math.sin(angle * Math.PI / 180), subAngle, subLength);
            }, Math.random() * 50);
        }
    }

    handleClick(e) {
        if (!this.isActive) return;
        
        this.playRandomGunshot();
        this.screenShake();
        this.createBulletHole(e.clientX, e.clientY);
        this.createSplash(e.clientX, e.clientY);
        this.createCracks(e.clientX, e.clientY);
        
        this.hitCount++;
    }
}

export { BulletEffect };
