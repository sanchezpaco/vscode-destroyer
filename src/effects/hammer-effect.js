import { EffectBase } from './effects-loader.js';

class HammerEffect extends EffectBase {
    constructor() {
        super();
        
        this.editorContent = document.querySelector('.editor-content');
        this.fragmentsOnGround = []; 
        this.groundLevel = window.innerHeight - 50;

        this.hammerHit = document.getElementById('hammer-hit');
        this.glassBreak = document.getElementById('glass-break');
        this.debrisFall = document.getElementById('debris-fall');
        this.explosionSound = document.getElementById('explosion');
        
        this.isActive = false;
        
        this.resizeListener = () => {
            this.groundLevel = window.innerHeight - 50;
        };
    }

    enable() {
        this.isActive = true;
        window.addEventListener('resize', this.resizeListener);
        this.initPhysics();
    }
    
    disable() {
        this.isActive = false;
        window.removeEventListener('resize', this.resizeListener);
    }

    initialize() {
    }

    initPhysics() {
        const existingGround = document.querySelector('.hammer-ground');
        if (existingGround) {
            existingGround.remove();
        }
        
        const ground = document.createElement('div');
        ground.className = 'hammer-ground';
        ground.style.position = 'absolute';
        ground.style.left = '0';
        ground.style.width = '100%';
        ground.style.height = '2px';
        ground.style.top = this.groundLevel + 'px';
        ground.style.zIndex = '150';
        this.editor.appendChild(ground);
    }

    createHammerImpact(x, y) {
        const impact = document.createElement('div');
        impact.className = 'hammer-impact';
        impact.style.left = x + 'px';
        impact.style.top = y + 'px';
        this.editor.appendChild(impact);
        
        setTimeout(() => {
            impact.remove();
        }, 500);
    }

    createHammerCrack(x, y) {
        const crack = document.createElement('div');
        crack.className = 'hammer-crack';
        crack.style.left = x + 'px';
        crack.style.top = y + 'px';
        crack.style.width = '60px';
        crack.style.height = '60px';
        this.editor.appendChild(crack);
        
        let size = 60;
        const interval = setInterval(() => {
            size += 15;
            crack.style.width = size + 'px';
            crack.style.height = size + 'px';
            crack.style.opacity = 1 - (size - 60) / 200;
            
            if (size > 260 || crack.style.opacity <= 0) {
                clearInterval(interval);
                crack.remove();
            }
        }, 40);
    }

    createGlassCracks(x, y) {
        const crackContainer = document.createElement('div');
        crackContainer.className = 'glass-crack';
        crackContainer.style.left = x + 'px';
        crackContainer.style.top = y + 'px';
        crackContainer.style.width = '0';
        crackContainer.style.height = '0';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = 'glass-crack-container';
        crackContainer.appendChild(innerContainer);
        
        const numCracks = Math.floor(Math.random() * 6) + 5;
        
        for (let i = 0; i < numCracks; i++) {
            this.createCrackLine(innerContainer, 0, 0, Math.random() * 360, Math.random() * 60 + 30);
            
            if (Math.random() > 0.3) {
                const branchLength = Math.random() * 35 + 15;
                const branchAngle = Math.random() * 40 - 20; // Mayor ángulo de desviación
                
                const branchStart = Math.random() * 0.6 + 0.2; // Entre 20% y 80% de la línea principal
                const x = Math.cos(i * Math.PI * 2 / numCracks) * (50 * branchStart);
                const y = Math.sin(i * Math.PI * 2 / numCracks) * (50 * branchStart);
                
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
        crack.style.height = `${Math.random() * 2.5 + 1.5}px`;
        crack.style.opacity = Math.random() * 0.4 + 0.3;
        
        container.appendChild(crack);
        
        if (length > 15 && Math.random() > 0.5) {
            const subX = length * 0.65;
            const subAngle = angle + (Math.random() * 50 - 25);
            const subLength = length * 0.7;
            
            setTimeout(() => {
                this.createCrackLine(container, x + subX * Math.cos(angle * Math.PI / 180), 
                               y + subX * Math.sin(angle * Math.PI / 180), subAngle, subLength);
            }, Math.random() * 40);
        }
    }

    checkCollision(rect1, rect2) {
        return !(rect1.right < rect2.left || 
                 rect1.left > rect2.right || 
                 rect1.bottom < rect2.top || 
                 rect1.top > rect2.bottom);
    }

    getFinalPosition(fragment, x, y, width, height) {
        const newRect = {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height,
            width: width,
            height: height
        };
        
        let finalY = y;
        let colliding = true;
        
        while (colliding) {
            colliding = false;
            
            for (const existingFragment of this.fragmentsOnGround) {
                const existingRect = existingFragment.getBoundingClientRect();
                
                const existingRectObj = {
                    left: existingRect.left,
                    right: existingRect.left + existingRect.width,
                    top: existingRect.top,
                    bottom: existingRect.top + existingRect.height,
                    width: existingRect.width,
                    height: existingRect.height
                };
                
                newRect.top = finalY;
                newRect.bottom = finalY + height;
                
                if (this.checkCollision(newRect, existingRectObj)) {
                    finalY = existingRectObj.top - height - 2;
                    colliding = true;
                    break;
                }
            }
            
            if (finalY < 100) {
                finalY = Math.random() * 100 + this.groundLevel - 200;
                break;
            }
        }
        
        return finalY;
    }

    createCodeFragments(x, y) {
        const fullText = this.editorContent.textContent;
        const lines = fullText.split('\n');
        
        const numFragments = Math.floor(Math.random() * 6) + 8;
        
        for (let i = 0; i < numFragments; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'code-fragment';
            
            const randomLine = Math.floor(Math.random() * lines.length);
            const startChar = Math.floor(Math.random() * Math.max(lines[randomLine].length - 10, 1));
            const length = Math.min(Math.floor(Math.random() * 20) + 5, lines[randomLine].length - startChar);
            const text = lines[randomLine].substring(startChar, startChar + length);
            
            fragment.textContent = text;
            
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            fragment.style.left = (x + offsetX) + 'px';
            fragment.style.top = (y + offsetY) + 'px';
            
            const width = Math.floor(Math.random() * 80) + 40;
            fragment.style.width = width + 'px';
            
            this.editor.appendChild(fragment);
            
            const fallX = (Math.random() - 0.5) * 300; // Destino X aleatorio
            const height = fragment.offsetHeight || 20;
            const targetY = this.groundLevel - height; // Punto base del suelo
            const rotation = (Math.random() - 0.5) * 720;
            const duration = Math.random() * 1.5 + 1;
            
            const finalY = this.getFinalPosition(fragment, x + fallX, targetY, width, height);
            
            fragment.style.setProperty('--fall-x', `${fallX}px`);
            fragment.style.setProperty('--fall-y', `${finalY - y}px`);
            fragment.style.setProperty('--rotation', `${rotation}deg`);
            
            fragment.style.animation = `fall-rotate ${duration}s cubic-bezier(0.7, 0, 0.84, 0) forwards`;
            
            fragment.dataset.finalX = x + fallX;
            fragment.dataset.finalY = finalY;
            fragment.dataset.width = width;
            fragment.dataset.height = height;
            
            setTimeout(() => {
                fragment.style.animation = 'none';
                fragment.style.transform = `translate(${fallX}px, ${finalY - y}px) rotate(${rotation}deg)`;
                fragment.style.opacity = '0.9';
                
                this.fragmentsOnGround.push(fragment);
                
                if (this.fragmentsOnGround.length > 60) {
                    const oldFragment = this.fragmentsOnGround.shift();
                    oldFragment.style.transition = 'opacity 0.5s';
                    oldFragment.style.opacity = '0';
                    setTimeout(() => oldFragment.remove(), 500);
                }
                
                if (Math.random() > 0.7) {
                    this.playSound(this.debrisFall, 2);
                }
                
                if (Math.random() > 0.5) {
                    const nearby = this.fragmentsOnGround.filter(f => {
                        const fx = parseFloat(f.dataset.finalX);
                        const fy = parseFloat(f.dataset.finalY);
                        const dx = fx - (x + fallX);
                        const dy = fy - finalY;
                        return Math.sqrt(dx*dx + dy*dy) < 50;
                    });
                    
                    nearby.forEach(f => {
                        f.style.transition = 'transform 0.3s';
                        const currentRotation = f.style.transform.match(/rotate\(([^)]+)\)/) || ['', '0deg'];
                        const currentDeg = parseFloat(currentRotation[1]) || 0;
                        const newRotation = currentDeg + (Math.random() * 20 - 10);
                        f.style.transform = f.style.transform.replace(/rotate\([^)]+\)/, `rotate(${newRotation}deg)`);
                    });
                }
            }, duration * 1000);
        }
    }

    screenShake() {
        this.editor.classList.add('hammer-shake');
        setTimeout(() => {
            this.editor.classList.remove('hammer-shake');
        }, 300);
    }

    showCodeMountain() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.5;
                this.createCodeFragments(x, y);
            }, i * 100);
        }
    }

    handleClick(e) {
        if (!this.isActive) return;
        
        this.playSound(this.hammerHit, 0);
        this.createHammerImpact(e.clientX, e.clientY);
        this.createHammerCrack(e.clientX, e.clientY);
        this.createGlassCracks(e.clientX, e.clientY);
        this.screenShake();
        this.playSound(this.glassBreak, 1);
        this.createCodeFragments(e.clientX, e.clientY);
        
        this.hitCount++;
    }
}

export { HammerEffect };
