
/**
 * Play a notification sound
 */
export const playNotificationSound = (type: 'success' | 'warning' | 'error' = 'success'): void => {
  try {
    let soundUrl = '/notification-sound.mp3';
    
    // Use different sounds based on notification type
    if (type === 'error' || type === 'warning') {
      soundUrl = '/urgent-notification.mp3';
    }
    
    const audio = new Audio(soundUrl);
    audio.volume = type === 'error' ? 0.5 : 0.3;
    audio.play().catch(err => {
      console.log('Audio play prevented by browser policy:', err);
    });
  } catch (err) {
    console.log('Audio notification not supported');
  }
};
