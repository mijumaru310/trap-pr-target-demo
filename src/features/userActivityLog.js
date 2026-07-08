import { db } from '../utils/db';

export const logUserActivity = async (userId, activityType, details) => {
  try {
    const timestamp = new Date().toISOString();
    await db.collection('user_activity_logs').add({
      userId,
      activityType,
      details: JSON.stringify(details),
      timestamp
    });
    console.log(`User ${userId} activity logged: ${activityType}`);
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw new Error('Failed to log user activity.');
  }
};

export const getUserActivityLog = async (userId, limit = 10) => {
  try {
    const snapshot = await db.collection('user_activity_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      try {
        data.details = JSON.parse(data.details);
      } catch (e) {
        console.warn('Could not parse activity details for log entry:', doc.id, e);
        // Fallback to original string if parsing fails
      }
      return { id: doc.id, ...data };
    });
    return activities;
  } catch (error) {
    console.error('Error fetching user activity log:', error);
    throw new Error('Failed to fetch user activity log.');
  }
};