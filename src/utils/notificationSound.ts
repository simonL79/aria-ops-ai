
/**
 * Utility function to play notification sounds
 */
export const playNotificationSound = (type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
  try {
    let soundFile = '/notification-sound.mp3';
    
    // Use different sounds based on notification type
    if (type === 'error' || type === 'warning') {
      soundFile = '/urgent-notification.mp3';
    }
    
    const audio = new Audio(soundFile);
    audio.volume = type === 'error' ? 0.6 : 0.4;
    
    // Play the sound and handle any errors
    audio.play().catch(error => {
      console.log('Could not play notification sound:', error);
    });
  } catch (err) {
    console.log('Audio notification not supported:', err);
  }
};
