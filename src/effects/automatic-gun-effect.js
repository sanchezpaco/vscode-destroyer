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
        this.currentSoundIndex = 0;
        this.spreadFactor = 15;
        
        // Pre-create simulated event object for reuse
        this.simulatedEvent = { clientX: 0, clientY: 0 };
    }
    
    initialize() {
        super.initialize();
        this.initializeSoundPool();
    }
    
    initializeSoundPool() {
        const poolSize = 10;
        if (!this.gunshot1) return;
        
        for (let i = 0; i < poolSize; i++) {
            const sound = this.gunshot1.cloneNode(true);
            sound.volume = 0.3;
            document.body.appendChild(sound);
            this.soundPool.push(sound);
        }
    }
    
    getSound() {
        if (this.soundPool.length === 0) return null;
        
        // Use a round-robin approach for sounds
        const sound = this.soundPool[this.currentSoundIndex];
        this.currentSoundIndex = (this.currentSoundIndex + 1) % this.soundPool.length;
        
        // Reset to beginning of sound
        sound.currentTime = 0;
        return sound;
    }

    handleMouseMove(e) {
        if (!this.isActive) return;
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
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
            
            // Update simulated event with current position
            this.simulatedEvent.clientX = this.mousePosition.x;
            this.simulatedEvent.clientY = this.mousePosition.y;
            
            this.createBulletEffects(this.simulatedEvent);
            
            // Apply spread to next position
            this.mousePosition.x += (Math.random() - 0.5) * this.spreadFactor;
            this.mousePosition.y += (Math.random() - 0.5) * this.spreadFactor;
            
        }, this.fireRate);
    }
    
    createBulletEffects(e) {
        if (!this.isActive) return;
        
        const sound = this.getSound();
        if (sound) sound.play();
        
        this.screenShake();
        this.createBulletHole(e.clientX, e.clientY);
        this.createSplash(e.clientX, e.clientY);
        
        // Only create cracks occasionally to improve performance
        if (this.hitCount % 3 === 0) {
            this.createCracks(e.clientX, e.clientY);
        }
        
        this.hitCount++;
    }

    stopFiring() {
        if (!this.isFiring) return;
        
        clearInterval(this.fireInterval);
        this.fireInterval = null;
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
    
    cleanup() {
        this.disable();
        
        // Clean up sound pool
        this.soundPool.forEach(sound => {
            if (sound && sound.parentNode) {
                sound.parentNode.removeChild(sound);
            }
        });
        this.soundPool = [];
    }
}

export { AutomaticGunEffect };
