# Notifications API Documentation

## Overview
The notifications API (`/api/notifications`) provides location-based disaster notifications to authenticated users. It fetches reports that are relevant to the user's city using geographic bounding boxes for efficient querying.

## How it Works

### 1. Authentication
- Uses NextAuth session-based authentication
- Requires user to be logged in with a valid session
- Fetches user data based on session email

### 2. Location-Based Filtering
- Retrieves user's city from their profile (`UserLocation` table)
- Uses Google Geocoding API to convert city name to geographic bounding box
- Queries reports within that bounding box using efficient lat/lng range queries

### 3. Report Filtering
- Only includes reports with status: `PENDING`, `ACTIVE`, or `VERIFIED`
- Limits results to reports from the last 7 days
- Orders by most recent first

### 4. Privacy Controls
- Respects user's `disasterUpdates` preference
- Returns empty array if user has disabled disaster notifications
- Returns empty array if user hasn't set their location

## API Endpoints

### GET /api/notifications
Returns disaster notifications for the authenticated user's location.

**Authentication:** Required (session-based)

**Response:**
```typescript
interface Notification {
  id: string;
  type: 'alert' | 'update' | 'report';
  title: string;
  description: string;
  timestamp: string;
  relatedDisasterId?: string;
}
```

**Error Responses:**
- `401` - Authentication required
- `404` - User not found
- `400` - User location not configured / Unable to locate user city
- `500` - Service configuration error / Internal server error

### POST /api/notifications
Mark notifications as read (placeholder for future implementation).

**Body:**
```json
{
  "notificationId": "string"
}
```

## Implementation Details

### Geographic Query Optimization
The API uses efficient range queries on latitude and longitude fields:

```sql
SELECT * FROM Report 
WHERE latitude BETWEEN sw_lat AND ne_lat 
  AND longitude BETWEEN sw_lng AND ne_lng
```

This approach is much faster than calculating distances for every record.

### Required Environment Variables
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### Database Indexes Recommendation
For optimal performance, consider adding composite indexes:

```sql
CREATE INDEX idx_reports_location_status ON Report(latitude, longitude, status);
CREATE INDEX idx_reports_datetime ON Report(datetime DESC);
```

## Usage Example

```typescript
// Frontend usage
const notifications = await fetch('/api/notifications', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});
const data = await notifications.json();
```

## Error Handling
The API includes comprehensive error handling for:
- Missing authentication
- User not found
- Missing location data
- Geocoding failures
- API key configuration issues
- Database connection errors

## Future Enhancements
- Real-time notifications using WebSockets
- Push notifications to mobile devices
- Notification preferences (severity levels, categories)
- Mark as read functionality
- Notification history
