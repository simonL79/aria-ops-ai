
/**
 * Play notification sound
 * @param type The notification type: 'success', 'warning', 'error', or 'info'
 */
export const playNotificationSound = (type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  try {
    // Different sound URLs based on type
    const soundUrls = {
      success: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3',
      warning: 'https://assets.mixkit.co/sfx/preview/mixkit-racing-countdown-timer-1051.mp3',
      error: 'https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3',
      info: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'
    };

    const audio = new Audio(soundUrls[type]);
    audio.volume = 0.5; // Set volume to 50%
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle potential autoplay restrictions
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Notification sound blocked by browser policy:', error);
      });
    }
    
    return true;
  } catch (error) {
    console.error('Failed to play notification sound:', error);
    return false;
  }
};
