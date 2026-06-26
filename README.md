# Health Tracking App

A premium React Native mobile application for functional medicine health tracking. Built with Expo, TypeScript, and Supabase.

## Features

### Onboarding Flow
- Welcome screen with smooth transitions
- Phone number authentication with OTP verification
- Practitioner linking
- Health snapshot overview

### Main Screens

#### 1. Home
- Daily health score with circular progress indicator
- Today's plan checklist (meals, supplements)
- Smart insights based on adherence patterns
- Upcoming reminders
- Quick log button

#### 2. Track
- Simple daily logging form (30-second completion)
- Meal adherence tracking
- Supplement tracking
- Energy level slider (1-5)
- Symptom selection with chips
- Sleep hours tracking
- Success feedback with adherence score

#### 3. Progress
- Weekly adherence chart
- Energy trend visualization
- Symptom trend indicators
- Weight progress tracker
- Clean, minimal data visualizations

#### 4. Plan
- Tabbed interface for Diet, Supplements, and Lifestyle
- Detailed meal plans with timing
- Supplement schedule with dosage and notes
- Lifestyle recommendations with benefits

#### 5. Profile
- User profile with health conditions
- Subscription status
- Program duration tracking
- Menu options for reports, billing, notifications
- Logout functionality

## Design Principles

- **Minimal Inputs**: Maximum 30-second daily usage
- **One-Tap Interactions**: No typing required for most actions
- **Premium UI**: Clean design with soft shadows and rounded cards
- **Calm Colors**: Greens, beige, white, and light grey palette
- **Mobile-First**: Optimized for mobile interactions

## Tech Stack

- **React Native**: Expo SDK 54
- **TypeScript**: Type-safe development
- **Navigation**: Expo Router with bottom tabs
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage for local persistence

## Database Schema

- `users`: User profiles and subscription data
- `health_conditions`: User's health conditions and goals
- `diet_plans`: Personalized meal plans
- `supplements`: Supplement schedules
- `lifestyle_plans`: Lifestyle recommendations
- `daily_logs`: Daily tracking data
- `daily_scores`: Calculated adherence scores

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build:web
```

## Mock Data

The app includes pre-populated mock data for a demo user:
- **Name**: Priya Sharma
- **Conditions**: Thyroid, Anemia
- **Goals**: Improve Energy, Weight Gain
- **Phone**: +91 9876543210

## Color Palette

- Primary: #6B8E6F (Calm Green)
- Secondary: #A8C7A7 (Light Green)
- Background: #F9F9F7 (Off White)
- Card: #FFFFFF (Pure White)
- Accent: #E8DED1 (Beige)
- Text Primary: #2C3E35
- Text Secondary: #6B7974
- Text Light: #9BA89F

## Architecture

The project follows a clean, modular architecture:

- `/app`: Screen components with file-based routing
- `/components`: Reusable UI components
- `/constants`: Theme and design tokens
- `/lib`: Supabase client configuration
- `/store`: Zustand state management
- `/hooks`: Custom React hooks

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authenticated access required
- Secure session management

## Future Enhancements

- Push notifications for reminders
- Chat with practitioner
- Lab report uploads
- Export progress reports
- Integration with wearables
- Meal photo logging
- Social accountability features
