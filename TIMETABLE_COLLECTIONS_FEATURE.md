# Timetable Collections Feature

## Overview
Enhanced timetable management with multiple collections, multi-day support, and AI-based generation.

## Key Features

### 1. Timetable Collections
- **Multiple Collections**: Users can create multiple timetable collections (e.g., "Work Week", "Study Schedule", "AI Generated")
- **Default View**: One collection can be set as default (shown expanded by default)
- **Expand/Collapse**: Non-default collections can be expanded/collapsed with ▶/▼ button
- **AI Generated Flag**: Collections created by AI are marked with a purple badge

### 2. Multi-Day Support
- **Checkbox Selection**: Select multiple days for each timetable entry
- **Quick Presets**:
  - All Days (Mon-Sun)
  - Weekdays (Mon-Fri)
  - Weekends (Sat-Sun)
- **Backend Storage**: Days stored as JSON array in database for flexibility

### 3. AI Generation
- **New Analysis Type**: "Generate Goal-Based Timetable"
- **Input**: Uses goals data with descriptions containing:
  - Suitable time preferences (morning/evening)
  - Expected duration
  - Frequency preferences
  - Any constraints
- **Output**: AI creates structured JSON with timetable entries
- **Tips**: Shown in both Goals page and AI analysis page

### 4. Data Model

#### TimetableCollection
```typescript
{
  id: string
  name: string
  description?: string
  isDefault: boolean
  isAiGenerated: boolean
  createdAt: string
  updatedAt: string
}
```

#### Timetable (Updated)
```typescript
{
  id: string
  collectionId: string  // NEW
  title: string
  description?: string
  type: TimetableType
  daysOfWeek: DayOfWeek[]  // CHANGED from single dayOfWeek
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}
```

## API Endpoints

### Collections
- `POST /api/v1/timetable-collections` - Create collection
- `GET /api/v1/timetable-collections` - List all collections
- `PUT /api/v1/timetable-collections/:id` - Update collection
- `DELETE /api/v1/timetable-collections/:id` - Delete collection (and all entries)

### Timetables
- `POST /api/v1/timetables` - Create entry (requires collectionId)
- `GET /api/v1/timetables?collectionId=xxx` - List entries (optionally filtered)
- `PUT /api/v1/timetables/:id` - Update entry
- `DELETE /api/v1/timetables/:id` - Delete entry

## Migration
- V13 migration creates `timetable_collections` table
- Auto-creates default collection for existing users
- Updates `timetables` schema to support collections and multiple days
- Days stored as JSON text in `days_of_week_json` column

## User Experience

### Default Collection
- Shown expanded automatically
- Cannot be deleted
- Can be edited (name, description)
- Has "Default" blue badge

### Non-Default Collections
- Collapsed by default
- Click ▶ to expand
- Can be fully edited and deleted
- Entry count shown in header

### AI Generated Collections
- Created by "Generate Goal-Based Timetable" analysis
- Has "AI Generated" purple badge
- Marked with `isAiGenerated: true` flag
- Can be edited/deleted like other collections

## Tips for Users
1. **In Goals**: Add time preferences and duration details in Description field
2. **In AI Analysis**: Use GENERATE_TIMETABLE type to auto-create schedule from goals
3. **Avoid Conflicts**: Don't set conflicting time preferences across multiple goals
4. **Collections**: Organize timetables by context (work, personal, study, etc.)

## Technical Notes
- Jackson ObjectMapper used for JSON serialization/deserialization of days
- Setting a collection as default auto-unsets previous default
- Deleting a collection cascades to delete all its timetable entries
- Frontend uses React Query for efficient caching and updates
