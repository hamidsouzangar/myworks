import { useEffect } from 'react';
import { soundEngine } from '../utils/SoundEngine';

export const useUiPop = () => {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Find closest button or 'a' tag
      const target = e.target as HTMLElement;
      const button = target.closest('button');

      if (button) {
        // Prevent playing pop for specific game resolution actions that have their own sounds
        const text = button.textContent?.toUpperCase() || '';
        if (
          !text.includes('SIP') &&
          !text.includes('DONE') &&
          !text.includes('VETO') &&
          !text.includes('START GAME') &&
          !text.includes('NEXT TURN') &&
          !text.includes('START TURN') &&
          !text.includes('YES, WE ARE SURE') &&
          !text.includes('TEST SPIN SOUND') // sound tester prevents double play
        ) {
           // Small timeout to allow potential unlock() calls in the click handler to fire first
           setTimeout(() => {
             soundEngine.playUiPop();
           }, 10);
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, true); // Use capture phase to ensure it catches everything
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);
};
