# Health Reports Feature - MendRx Companion

## Overview
Complete health reports system with categorized health metrics for tracking patient lab results and health indicators.

## Navigation Flow
```
Profile Screen → My Reports → Reports List → Report Detail (with Categories)
```

## Database Schema

### Tables

1. **health_reports**
   - Stores lab report metadata
   - Fields: id, user_id, report_date, report_name, created_at

2. **health_categories**
   - Stores health category assessments per report
   - Fields: id, report_id, category_name, status, icon_name, summary, details, created_at
   - Status values: `good`, `needs_attention`, `at_risk`

## Health Categories (8 Total)

1. **Metabolic Health** - Blood sugar and metabolism markers
2. **Inflammation** - Inflammatory markers and indicators
3. **Nutrient Status** - Vitamin and mineral levels
4. **Liver Health** - Liver function tests
5. **Kidney Health** - Kidney function markers
6. **Gut Health** - Digestive health indicators
7. **Hormonal Balance** - Hormone level assessments
8. **Hematology** - Blood cell counts and related markers

## UI Components

### Reports List Screen (`/reports/index.tsx`)
- Lists all health reports chronologically
- Shows report name, date, and relative time
- Card-based layout with tap navigation
- Empty state for users with no reports

### Report Detail Screen (`/reports/[id].tsx`)
- Overall summary with status counts (good/attention/risk)
- Individual category cards with:
  - Category icon (color-coded)
  - Category name
  - Status badge (green/yellow/red)
  - Brief summary text
  - Tap to view detailed metrics (placeholder)

## Design System

### Status Colors
- **Good**: Green (#6B8E6F) with light green background (#F0F7F0)
- **Needs Attention**: Yellow/Warning (#E8A547) with light orange background (#FFF4E6)
- **At Risk**: Red/Error (#E85D5D) with light red background (#FFF0F0)

### Icons
- Activity (Metabolic Health)
- Flame (Inflammation)
- Apple (Nutrient Status)
- HeartPulse (Liver Health)
- Droplet (Kidney Health)
- Leaf (Gut Health)
- Zap (Hormonal Balance)
- Droplets (Hematology)

## Sample Data

The database includes 3 sample reports for demo user:
- Monthly Health Checkup (most recent, with all 8 categories)
- Initial Assessment
- Program Baseline

## Key Features

1. **Date-wise Organization**: Reports sorted by date (newest first)
2. **Visual Status Indicators**: Color-coded badges for quick assessment
3. **Non-Clinical Language**: User-friendly summaries instead of medical jargon
4. **Premium UI**: Clean cards, soft shadows, minimal design
5. **Tap Navigation**: Smooth transitions between list and detail views
6. **Overall Summary**: Quick overview of health status distribution

## Technical Notes

- Uses Supabase for data storage
- RLS policies configured for data security
- Demo mode allows public read access for testing
- Fully responsive mobile-first design
- Built with TypeScript for type safety

## Future Enhancements

- Detailed metrics view per category
- Trend comparison between reports
- Export report as PDF
- Share report with practitioner
- Add notes to specific categories
- Historical data visualization
- Download lab results
