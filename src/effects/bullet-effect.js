import { EffectBase } from './effects-loader.js';

class BulletEffect extends EffectBase {
    constructor() {
        super();
        
        this.gunshot1 = document.getElementById('gunshot1');
        this.explosionSound = document.getElementById('explosion');
        
        this.isActive = false;
        this.hitCount = 0;
        this.bulletHolePool = [];
        this.splashPool = [];
        this.crackPool = [];
        this.audioPool = [];
        
        this.bulletHoleTypes = ['bullet-hole-type1', 'bullet-hole-type2', 'bullet-hole-type3'];
        this.splashTypes = ['splash-red', 'splash-dark'];
        
        this._boundHandleClick = this.handleClick.bind(this);
    }

    enable() {
        this.isActive = true;
        document.addEventListener('click', this._boundHandleClick);
    }
    
    disable() {
        this.isActive = false;
        document.removeEventListener('click', this._boundHandleClick);
    }

    initialize() {
        this.preparePool('bulletHolePool', 20, 'div', 'bullet-hole');
        this.preparePool('splashPool', 50, 'div', 'splash');
        this.preparePool('crackPool', 20, 'div', 'crack-line');
        this.prepareAudioPool(5);
    }
    
    preparePool(poolName, count, elementType, className) {
        for (let i = 0; i < count; i++) {
            const element = document.createElement(elementType);
            if (className) element.className = className;
            element.style.display = 'none';
            this[poolName].push(element);
            this.editor.appendChild(element);
        }
    }
    
    prepareAudioPool(count) {
        for (let i = 0; i < count; i++) {
            const audio = new Audio();
            audio.style.display = 'none';
            this.audioPool.push(audio);
            document.body.appendChild(audio);
        }
    }

    playGunshotSound() {
        const sounds = [this.gunshot1];
        const randomIndex = Math.floor(Math.random() * sounds.length);
        const selectedSound = sounds[randomIndex];
        
        return this.playSound(selectedSound);
    }

    screenShake() {
        this.editor.classList.add('screen-shake');
        setTimeout(() => {
            this.editor.classList.remove('screen-shake');
        }, 50);
    }

    createBulletHole(x, y) {
        const hole = this.bulletHolePool.pop() || document.createElement('div');
        hole.className = 'bullet-hole';
        
        const size = Math.random() * 15 + 10; 
        
        const selectedType = this.bulletHoleTypes[Math.floor(Math.random() * this.bulletHoleTypes.length)];
        hole.classList.add(selectedType);
        
        hole.style.left = x + 'px';
        hole.style.top = y + 'px';
        
        const scale = 0.8 + Math.random() * 0.4;
        hole.style.transform = `translate(-50%, -50%) scale(${scale})`;
        
        hole.style.transform += ` rotate(${Math.random() * 360}deg)`;
        
        hole.style.display = 'block';
        this.editor.appendChild(hole);
    }

    createSplash(x, y) {
        for (let i = 0; i < 5; i++) {
            const splash = this.splashPool.pop() || document.createElement('div');
            splash.className = 'splash';
            
            splash.classList.add(this.splashTypes[Math.floor(Math.random() * this.splashTypes.length)]);
            
            const distance = Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            splash.style.left = (x + offsetX) + 'px';
            splash.style.top = (y + offsetY) + 'px';
            
            const size = Math.random() * 10 + 5;
            splash.style.width = size + 'px';
            splash.style.height = size * (0.8 + Math.random() * 0.4) + 'px';
            
            splash.style.display = 'block';
            this.editor.appendChild(splash);
            
            setTimeout(() => {
                splash.style.display = 'none';
                this.splashPool.push(splash);
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
                const branchAngle = Math.random() * 30 - 15; 
                
                const branchStart = Math.random() * 0.7 + 0.2;
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
        const crack = this.crackPool.pop() || document.createElement('div');
        crack.className = 'crack-line';
        
        crack.style.left = x + 'px';
        crack.style.top = y + 'px';
        
        crack.style.transform = `rotate(${angle}deg)`;
        crack.style.width = `${length}px`;
        crack.style.height = `${Math.random() * 2 + 1}px`;
        crack.style.opacity = Math.random() * 0.3 + 0.2;
        
        crack.style.display = 'block';
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
        
        this.playGunshotSound();
        this.screenShake();
        this.createBulletHole(e.clientX, e.clientY);
        this.createSplash(e.clientX, e.clientY);
        this.createCracks(e.clientX, e.clientY);
        
        this.hitCount++;
    }
}

export { BulletEffect };
