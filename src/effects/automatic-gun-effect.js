import { BulletEffect } from './bullet-effect.js';

class AutomaticGunEffect extends BulletEffect {
    constructor() {
        super();
        this.isFiring = false;
        this.fireInterval = null;
        this.fireRate = 100;
        this.mousePosition = { x: 0, y: 0 };
        this.isActive = false;
        
        this.boundMouseMoveHandler = this.handleMouseMove.bind(this);
        this.boundMouseDownHandler = this.startFiring.bind(this);
        this.boundMouseUpHandler = this.stopFiring.bind(this);
        this.boundMouseLeaveHandler = this.stopFiring.bind(this);
        
        this.soundPool = [];
        this.initializeSoundPool();
    }
    
    initializeSoundPool() {
        const poolSize = 10;
        for (let i = 0; i < poolSize; i++) {
            if (this.gunshot1) {
                const sound = this.gunshot1.cloneNode(true);
                sound.volume = 0.3;
                this.soundPool.push(sound);
            }
        }
    }
    
    getSound() {
        for (let sound of this.soundPool) {
            if (sound.paused || sound.ended) {
                return sound;
            }
        }
        
        const newSound = this.gunshot1.cloneNode(true);
        newSound.volume = 0.3;
        this.soundPool.push(newSound);
        return newSound;
    }

    handleMouseMove(e) {
        if (!this.isActive) return;
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
    }

    initialize() {
    }

    startFiring(e) {
        if (this.isFiring || !this.isActive) return;
        
        this.isFiring = true;
        
        this.handleClick(e);
        
        this.fireInterval = setInterval(() => {
            if (!this.isActive) {
                this.stopFiring();
                return;
            }
            
            const simulatedEvent = {
                clientX: this.mousePosition.x,
                clientY: this.mousePosition.y
            };
            
            this.createBulletEffects(simulatedEvent);
            
            const spreadFactor = 15;
            this.mousePosition.x += (Math.random() - 0.5) * spreadFactor;
            this.mousePosition.y += (Math.random() - 0.5) * spreadFactor;
            
        }, this.fireRate);
    }
    
    createBulletEffects(e) {
        if (!this.isActive) return;
        
        const sound = this.getSound();
        sound.currentTime = 0;
        sound.play();
        
        this.screenShake();
        this.createBulletHole(e.clientX, e.clientY);
        this.createSplash(e.clientX, e.clientY);
        this.createCracks(e.clientX, e.clientY);
        
        this.hitCount++;
    }

    stopFiring() {
        if (!this.isFiring) return;
        
        clearInterval(this.fireInterval);
        this.isFiring = false;
    }

    handleClick(e) {
        if (!this.isActive) {
            this.stopFiring();
            return;
        }
        
        this.createBulletEffects(e);
    }

    disable() {
        this.isActive = false;
        this.stopFiring();
        
        this.editor.removeEventListener('mousemove', this.boundMouseMoveHandler);
        this.editor.removeEventListener('mousedown', this.boundMouseDownHandler);
        document.removeEventListener('mouseup', this.boundMouseUpHandler);
        this.editor.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
    }

    enable() {
        this.isActive = true;
        
        this.editor.addEventListener('mousemove', this.boundMouseMoveHandler);
        this.editor.addEventListener('mousedown', this.boundMouseDownHandler);
        document.addEventListener('mouseup', this.boundMouseUpHandler);
        this.editor.addEventListener('mouseleave', this.boundMouseLeaveHandler);
    }
}

export { AutomaticGunEffect };
