
/**
 * Play a notification sound for important alerts
 * @param type The type of notification sound to play
 */
export const playNotificationSound = (type: 'alert' | 'success' | 'urgent' = 'alert') => {
  try {
    let soundFile = '/notification-sound.mp3';
    
    if (type === 'urgent') {
      soundFile = '/urgent-notification.mp3';
    }
    
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(err => {
      console.log('Could not play notification sound:', err);
    });
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

/**
 * Check if a result should trigger an alert based on risk score
 * @param riskScore The risk score of the result
 * @returns boolean indicating if alert should be triggered
 */
export const shouldTriggerAlert = (riskScore?: number): boolean => {
  return !!riskScore && riskScore >= 8;
};
