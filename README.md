![lovemeeet](https://github.com/user-attachments/assets/3f7aaea9-1555-4cbc-aeca-720f2d925393)

# 🎀 LoveMeet - 100% Open Source Date Planning App

A beautiful, fully open-source web application to create and share romantic date plans. **No paid APIs, no closed-source dependencies.** Everything runs on free, open-source technologies.

## ✨ Features

### 📋 Complete Date Planning Flow
- **Step 1**: Select date and time
- **Step 2**: Enter full address details
  - Address Line 1 (required)
  - Address Line 2 (optional)
  - City (required)
  - District/State (optional)
  - Postal Code (optional)
  - Country (default: Sri Lanka)
- **Step 3**: Pin location on interactive map
- **Step 4**: Get AI-powered venue recommendations
- **Step 5**: Generate and share unique link

### 🗺️ Open-Source Technologies

| Feature | Technology | License |
|---------|-----------|---------|
| **Map** | Leaflet + OpenStreetMap | MIT |
| **Front-end** | React 19 + TypeScript | MIT |
| **Routing** | React Router | MIT |
| **Animations** | Framer Motion | MIT |
| **Icons** | Lucide React | ISC |
| **Styling** | Tailwind CSS | MIT |
| **AI Venues** | Google Gemini API | ⚠️ Optional |
| **Storage** | Browser Local Storage | N/A |

**Zero paid dependencies!** The only optional paid API is Gemini for venue recommendations, but the app works without it.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or download the project
cd lovemeet

# Install dependencies
npm install

# Create .env file
echo "VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE" > .env
```

### Development

```bash
# Start dev server
npm run dev

# App runs at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Output in ./dist folder
npm run preview
```

## 🔑 Getting API Keys (Optional)

### Google Gemini API (for venue recommendations)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your key to `.env`:
   ```
   VITE_API_KEY=your_gemini_api_key_here
   ```

**Note**: The app works WITHOUT this key. Venue recommendations will be empty, but the sharing feature works perfectly!

## 💾 How Data is Stored

All data is stored **locally in your browser** using [localStorage](https://developers.mozilla.org/en-US/docs/Web/API/Window/localStorage):

- **Share Links**: Unique proposal data is stored in JSON format
- **Format**: Each proposal gets a unique ID (e.g., `share_1707654321abc123def456`)
- **URL**: `https://your-domain.com/#/share/share_1707654321abc123def456`
- **No Backend**: No server needed, works entirely client-side

### Share Link Structure
```typescript
{
  unique_id: "share_1707654321abc123def456",
  plan_data: {
    date: "2026-02-14",
    time: "19:30",
    addressLine1: "123 Love Street",
    city: "Colombo",
    latitude: 6.9271,
    longitude: 80.7789,
    venues: [...],
    createdAt: 1707654321000
  },
  created_at: 1707654321000
}
```

**Your Live Hosting**: https://lovemeeet.netlify.app

## 📱 Sharing Features

### Generate Share Link
1. Complete all date plan steps
2. On final screen, optionally enter recipient's phone
3. Click "GENERATE LINK"
4. Unique URL is instantly created

### Share Options
- **Copy to Clipboard**: Copy unique link with one click
- **WhatsApp**: Share directly with contact (if phone provided)
- **Email**: Share via email link
- **Manual Share**: Copy and send anywhere

### Example Share Link
```
https://lovemeeet.netlify.app/#/share/share_1707654321xyz789
```

When opened, displays:
- ✅ Full date/time details
- ✅ Complete address with coordinates
- ✅ Interactive map showing location
- ✅ Recommended venues with ratings
- ✅ Links to venue details

## 🏗️ Project Structure

```
lovemeet/
├── pages/
│   ├── DatePlannerPage.tsx      # Main planning flow
│   ├── ProposalPage.tsx         # Classic proposal (optional)
│   ├── QuotesPage.tsx           # Love quotes
│   └── RecipientView.tsx        # Shared plan viewer
├── services/
│   ├── gemini.ts                # AI venue recommendations
│   └── shareLink.ts             # Link generation & retrieval
├── types.ts                     # TypeScript definitions
├── constants.tsx                # Configuration
├── App.tsx                      # Main app & routing
└── index.tsx                    # Entry point
```

## 🗺️ Map Integration

Using **Leaflet** with **OpenStreetMap** (100% free):

```typescript
// Click on map to pin location
// Drag marker to adjust
// Coordinates auto-populate
// No API key required!
```

Features:
- Interactive clicking
- Draggable marker
- Zoom in/out
- Real-time coordinates display
- Works globally

## 🤖 AI Venue Recommendations (Optional)

If you add a Gemini API key:
- Automatically fetches 4+ nearby restaurants
- Shows ratings, addresses, maps links
- Uses location coordinates for accuracy
- Gracefully falls back if API fails

**Without the key?**
- Share links still work perfectly
- Just won't show venue recommendations
- All other features unaffected

## 🔐 Privacy

✅ **100% Client-Side**
- No data sent to external servers (except optional Gemini API)
- All storage is local browser localStorage
- Share links contain full date data (don't share in public!)
- No tracking, no analytics

## 🌍 Deployment

### Static Hosting (GitHub Pages, Vercel, Netlify)

```bash
# Build production bundle
npm run build

# Deploy ./dist folder to any static host
```

### Add Custom Domain

Update `vite.config.ts`:
```typescript
export default {
  base: '/',
  // Your domain will be: https://lovemeeet.netlify.app/#/
}
```

### Environment Variables

Create `.env` in root:
```
VITE_API_KEY=your_optional_gemini_key
```

## 📦 Technologies Used

### Core
- **React** 19.2.4 - UI framework
- **TypeScript** 5.8 - Type safety
- **Vite** 6.2 - Build tool
- **React Router** 7.13 - Navigation

### UI/UX
- **Framer Motion** 12.33 - Animations
- **Tailwind CSS** - Styling
- **Lucide React** 0.563 - Icons

### Maps
- **Leaflet** 1.9.4 - Map library (MIT)
- **React Leaflet** - React wrapper (MIT)
- **OpenStreetMap** - Tile provider (free)

### Data
- **Google Gemini API** - Venue recommendations (optional)
- **Browser Storage** - Local data persistence

## 🎯 Key Features Breakdown

### Date Planner
- Beautiful step-by-step form
- Date & time picker
- Full address form with validation
- Interactive map location selection

### Venue Discovery
- AI-powered recommendations
- Real-time data from Gemini
- Rating display
- Direct maps links

### Share System
- Unique URL generation
- Copy to clipboard
- WhatsApp/Email integration
- Recipient view display

### Responsive Design
- Mobile-first approach
- Works on all devices
- Touch-friendly map
- Optimized for sharing

## 🐛 Troubleshooting

### Map not loading?
- Check internet connection (needs tiles from OpenStreetMap)
- Clear browser cache
- Try different zoom level

### Venues not showing?
- Add Gemini API key to .env
- Check API key is valid
- Try different location

### Share link not working?
- Link expires when browser's localStorage is cleared
- Share link must include the full URL with hash: `/#/share/...`
- Sharing in private mode stores data temporarily

### Build issues?
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstall
npm install
npm run build
```

## 📄 License

MIT - Fully open source. Free to use, modify, and redistribute.

## 🤝 Contributing

This is a fully open-source project. Feel free to:
- Fork and modify
- Add features
- Report bugs
- Submit improvements



This app is designed to be self-contained. All code is included in the repository.

## 🎉 Have Fun!

Create beautiful date plans and share them with people you care about! 💕

---

**Made with ❤️ using 100% open-source technologies**
