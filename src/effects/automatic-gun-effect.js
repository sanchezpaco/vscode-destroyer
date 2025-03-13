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
            
            super.handleClick(simulatedEvent);
            
            const spreadFactor = 15;
            this.mousePosition.x += (Math.random() - 0.5) * spreadFactor;
            this.mousePosition.y += (Math.random() - 0.5) * spreadFactor;
            
        }, this.fireRate);
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
        
        super.handleClick(e);
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
