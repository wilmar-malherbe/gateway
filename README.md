# Grace Community Church Mobile App

A modern, beautiful mobile app for Grace Community Church built with Expo and React Native.

## Features

### Home Screen
- **Hero Section** - Welcome banner with church branding
- **Livestream Banner** - Active livestream notification linked to YouTube
- **Sunday Service Times** - Display of three weekly services (8am, 11am, 6pm Teen)
- **Quick Action Buttons** - Donate and Contact links
- **Office Information** - Phone, email, address, and office hours
- **Pull-to-Refresh** - Manually refresh all content

### Additional Screens
- News (Coming Soon)
- Videos (Coming Soon)
- Menu (Coming Soon)

## Design Features

- **Brand Colors**: Downriver (#0d2262) and Moody Blue (#394462)
- **Typography**: Montserrat font family throughout
- **Modern UI**: Clean cards, gradients, shadows, and smooth interactions
- **Responsive Design**: Optimized for all device sizes
- **Haptic Feedback**: Touch feedback on button presses
- **Dark Mode Ready**: Theme infrastructure in place

## Technology Stack

- **Framework**: Expo with React Native
- **Navigation**: Expo Router with bottom tabs
- **Database**: Supabase for data persistence
- **Icons**: Expo Vector Icons (MaterialCommunityIcons)
- **Styling**: React Native StyleSheet with custom theme system
- **Fonts**: Google Fonts - Montserrat family

## Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx       # Tab navigation setup
│   ├── index.tsx         # Home screen
│   ├── news.tsx          # News screen
│   ├── videos.tsx        # Videos screen
│   └── menu.tsx          # Menu screen
└── _layout.tsx           # Root layout with font loading

components/
├── ActionButton.tsx      # Reusable action buttons
├── HeroSection.tsx       # Welcome banner
├── InfoCard.tsx          # Information display cards
├── LivestreamBanner.tsx  # Livestream notification
├── SectionHeader.tsx     # Section titles
└── ServiceCard.tsx       # Service time cards

hooks/
├── useServices.ts        # Fetch service times
├── useLivestream.ts      # Monitor livestream status
└── useContactInfo.ts     # Get office contact info

constants/
├── theme.ts              # Colors, spacing, fonts, shadows
└── church.ts             # Church information constants

lib/
└── supabase.ts           # Supabase client initialization
```

## Database Schema

### services
- id, day_of_week, service_time, description, capacity, created_at

### livestream
- id, is_active, youtube_url, title, start_time, updated_at

### contact_info
- id, department, phone_number, email, hours_of_operation

### announcements
- id, title, content, priority, image_url, created_at, updated_at

All tables have RLS enabled with public read access.

## Environment Variables

The `.env` file contains:
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Development

```bash
# Install dependencies
npm install

# Lint the code
npm run lint

# Start the dev server
npm start

# Build for Android
npm run android

# Build for iOS
npm run ios

# Build for Web
npm run web
```

## Customization

To customize for your church:

1. **Update `constants/church.ts`** with your church details
2. **Update `constants/theme.ts`** colors to match your branding
3. **Update Supabase data** with your service times and contact information
4. **Add announcements** to the database to display on the home screen

## Security

- Row-Level Security (RLS) is enabled on all database tables
- Data is public for read-only access
- No sensitive information should be stored in the app
- Use environment variables for all credentials

## Next Steps

1. Implement the News screen with announcements display
2. Add Videos screen with YouTube integration
3. Create Menu screen with navigation and settings
4. Add push notifications for important announcements
5. Implement prayer request feature
6. Add event calendar

## License

Private - Grace Community Church
