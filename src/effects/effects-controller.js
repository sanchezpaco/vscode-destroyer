import { EffectBase } from "./effects-loader.js";
import { BulletEffect } from "./bullet-effect.js";
import { AutomaticGunEffect } from "./automatic-gun-effect.js";
import { HammerEffect } from "./hammer-effect.js";
import { FlamethrowerEffect } from "./flamethrower-effect.js";
import { BombEffect } from "./bomb-effect.js";

// Import the sound controller
import SoundController from './sound-controller.js';

export function initializeEffects() {
    const bulletEffect = new BulletEffect();
    const automaticGunEffect = new AutomaticGunEffect();
    const hammerEffect = new HammerEffect();
    const flamethrowerEffect = new FlamethrowerEffect();
    const bombEffect = new BombEffect();
    
    // Initialize the sound controller
    const soundController = new SoundController();

    const editor = document.getElementById('editor');
    
    let activeEffect = 'bullet';
    
    const weapons = {
        'bullet': {
            id: 'bullet-control',
            name: 'Bullet',
            icon: '🔫',
            key: '1',
            effect: bulletEffect
        },
        'automatic-gun': {
            id: 'automatic-gun-control',
            name: 'Auto Gun',
            icon: '🔫',
            key: '2',
            effect: automaticGunEffect
        },
        'hammer': {
            id: 'hammer-control',
            name: 'Hammer',
            icon: '🔨',
            key: '3',
            effect: hammerEffect
        },
        'flamethrower': {
            id: 'flamethrower-control',
            name: 'Flamethrower',
            icon: '🔥',
            key: '4',
            effect: flamethrowerEffect
        },
        'bomb': {
            id: 'bomb-control',
            name: 'Bomb',
            icon: '💣',
            key: '5',
            effect: bombEffect
        }
    };
    
    Object.values(weapons).forEach(weapon => {
        if (typeof weapon.effect.initialize === 'function') {
            weapon.effect.initialize();
        }
        
        if (!weapon.effect.enable) {
            weapon.effect.enable = function() {};
        }
        if (!weapon.effect.disable) {
            weapon.effect.disable = function() {};
        }
    });
    
    function handleEditorClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const effect = weapons[activeEffect].effect;
        if (typeof effect.handleClick === 'function') {
            effect.handleClick(e);
        }
    }
    
    editor.addEventListener('click', handleEditorClick, true);
    
    function switchActiveWeapon(newWeaponId) {
        if (newWeaponId === activeEffect) {
            return;
        }
        
        weapons[activeEffect].effect.disable();

        activeEffect = newWeaponId;
        
        weapons[activeEffect].effect.enable();

        updateActiveWeapon();
    }
    
    function updateActiveWeapon() {
        Object.values(weapons).forEach(weapon => {
            document.getElementById(weapon.id).classList.remove('weapon-active');
        });
        
        document.getElementById(weapons[activeEffect].id).classList.add('weapon-active');
    }
    
    document.addEventListener('keydown', (e) => {
        Object.entries(weapons).forEach(([weaponId, weapon]) => {
            if (e.key === weapon.key) {
                switchActiveWeapon(weaponId);
            }
        });
    });
    
    Object.entries(weapons).forEach(([weaponId, weapon]) => {
        document.getElementById(weapon.id).addEventListener('click', (e) => {
            e.stopPropagation();
            switchActiveWeapon(weaponId);
        });
    });
    
    weapons[activeEffect].effect.enable();
    updateActiveWeapon();
}

document.addEventListener('DOMContentLoaded', initializeEffects);
