import { EffectBase } from "./effects-loader.js";

class BombEffect extends EffectBase {
    constructor() {
        super();
        this.explosionSound = document.getElementById('explosion');
        this.bombPlantedSound = document.getElementById('bomb-planted');
        this.impactDelay = 300;
        this.explosionPatterns = [
            this.circlePattern,
            this.crossPattern,
            this.spiralPattern,
            this.starPattern
        ];
    }

    initialize() {
        console.log("Initializing Bomb Effect");
    }
    
    enable() {
        this.isActive = true;
        document.body.style.cursor = 'crosshair';
    }
    
    disable() {
        this.isActive = false;
        document.body.style.cursor = '';
    }

    playBombPlantedSound() {
        const soundClone = this.bombPlantedSound.cloneNode(true);
        soundClone.volume = this.bombPlantedSound.volume;
        soundClone.play();
        
        soundClone.onended = () => {
            soundClone.remove();
        };
    }

    playExplosionSound() {
        const soundClone = this.explosionSound.cloneNode(true);
        soundClone.volume = this.explosionSound.volume;
        soundClone.play();
        
        soundClone.onended = () => {
            soundClone.remove();
        };
    }

    handleClick(e) {
        if (!this.isActive) return;
        this.hitCount++;
        
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        this.createBombIndicator(clickX, clickY);
        this.playBombPlantedSound();
        
        setTimeout(() => {
            this.createExplosion(clickX, clickY);
        }, this.impactDelay);
    }
    
    createBombIndicator(x, y) {
        const indicator = document.createElement('div');
        indicator.className = 'bomb-indicator';
        indicator.style.left = `${x}px`;
        indicator.style.top = `${y}px`;
        
        const countdown = document.createElement('div');
        countdown.className = 'bomb-countdown';
        countdown.textContent = '💣';
        indicator.appendChild(countdown);
        
        this.editor.appendChild(indicator);
        
        indicator.classList.add('pulse-animation');
    }
    
    createExplosion(x, y) {
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 500);
        
        const randomPatternIndex = Math.floor(Math.random() * this.explosionPatterns.length);
        const createPattern = this.explosionPatterns[randomPatternIndex];
        
        this.playExplosionSound();
        createPattern.call(this, x, y);
        
        const indicators = document.querySelectorAll('.bomb-indicator');
        indicators.forEach(indicator => {
            indicator.remove();
        });
    }
    
    circlePattern(centerX, centerY) {
        const radius = 150;
        const points = 12;
        
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createExplosionParticle(x, y);
            
            if (i % 2 === 0) {
                const innerX = centerX + Math.cos(angle) * (radius / 2);
                const innerY = centerY + Math.sin(angle) * (radius / 2);
                this.createExplosionParticle(innerX, innerY);
            }
        }
        
        this.createExplosionParticle(centerX, centerY, true);
    }
    
    crossPattern(centerX, centerY) {
        const size = 200;
        const gap = 30;
        
        for (let x = centerX - size; x <= centerX + size; x += gap) {
            this.createExplosionParticle(x, centerY);
        }
        
        for (let y = centerY - size; y <= centerY + size; y += gap) {
            this.createExplosionParticle(centerX, y);
        }
        
        this.createExplosionParticle(centerX, centerY, true);
    }
    
    spiralPattern(centerX, centerY) {
        const maxRadius = 200;
        const points = 30;
        const revolutions = 2;
        
        for (let i = 0; i < points; i++) {
            const radius = (i / points) * maxRadius;
            const angle = (i / points) * Math.PI * 2 * revolutions;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createExplosionParticle(x, y);
        }
        
        this.createExplosionParticle(centerX, centerY, true);
    }
    
    starPattern(centerX, centerY) {
        const outerRadius = 180;
        const innerRadius = 70;
        const points = 5;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (points * 2)) * Math.PI * 2;
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createExplosionParticle(x, y);
        }
        
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            this.createExplosionParticle(x, y);
        }
        
        this.createExplosionParticle(centerX, centerY, true);
    }
    
    createExplosionParticle(x, y, isCenter = false) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion-particle';
        if (isCenter) {
            explosion.classList.add('explosion-center');
        }
        
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        
        const size = isCenter ? 
            80 + Math.random() * 40 : 
            30 + Math.random() * 50;
        
        explosion.style.width = `${size}px`;
        explosion.style.height = `${size}px`;
        
        this.editor.appendChild(explosion);
        
        if (isCenter) {
            this.createDebrisParticles(x, y);
        }
        
        this.createCraterMark(x, y, size * 0.8);
        
        setTimeout(() => {
            explosion.remove();
        }, 1000);
    }
    
    createDebrisParticles(x, y) {
        const debrisCount = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < debrisCount; i++) {
            const debris = document.createElement('div');
            debris.className = 'explosion-debris';
            
            debris.style.left = `${x}px`;
            debris.style.top = `${y}px`;
            
            const size = 3 + Math.random() * 8;
            debris.style.width = `${size}px`;
            debris.style.height = `${size}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 80 + Math.random() * 200;
            
            debris.style.setProperty('--fly-x', `${Math.cos(angle) * distance}px`);
            debris.style.setProperty('--fly-y', `${Math.sin(angle) * distance}px`);
            debris.style.setProperty('--rotation', `${Math.random() * 720 - 360}deg`);
            
            this.editor.appendChild(debris);
            
            setTimeout(() => {
                debris.remove();
            }, 1000);
        }
    }
    
    createCraterMark(x, y, size) {
        const crater = document.createElement('div');
        crater.className = 'explosion-crater';
        
        crater.style.left = `${x}px`;
        crater.style.top = `${y}px`;
        crater.style.width = `${size}px`;
        crater.style.height = `${size}px`;
        
        this.editor.appendChild(crater);
    }
}

export { BombEffect };
