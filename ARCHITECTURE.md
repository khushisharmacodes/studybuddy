# StudyBuddy Architecture

## 1. Full Project Architecture

StudyBuddy follows a **MERN stack** with a **modular service-oriented backend** and a **component-driven React frontend**.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  React + Vite + Tailwind + Framer Motion + Zustand          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │  Auth Pages │ │  Dashboard  │ │  Focus / Pomodoro   │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Goals     │ │   Journal   │ │  Analytics / Exams  │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API / WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                      SERVER                                  │
│  Node.js + Express + MongoDB + Mongoose + Socket.io         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Routes    │ │ Controllers │ │    Services         │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Models    │ │  Middleware │ │  Cron / Scrapers    │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 2. Frontend Folder Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card, Input, Badge, Skeleton)
│   ├── common/          # Shared components
│   ├── layout/          # Layout-specific components
│   ├── dashboard/       # Dashboard widgets
│   ├── pomodoro/        # Timer components
│   ├── journal/         # Journal components
│   ├── goals/           # Goal components
│   ├── analytics/       # Chart components
│   ├── auth/            # Auth-specific components
│   ├── teddy/           # Teddy companion
│   ├── notifications/   # Notification components
│   └── recommendations/ # Recommendation cards
├── pages/               # Route-level pages
├── layouts/             # App shell layouts
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── services/            # API abstraction layer
├── animations/          # Animation utilities
├── assets/              # Static assets
├── lib/                 # Utility functions
├── utils/               # Helper utilities
├── routes/              # Route guards
└── context/             # React contexts (if needed)
```

## 3. Backend Folder Structure

```
backend/
├── config/              # DB configuration
├── controllers/         # Request handlers
├── middleware/          # Auth, error handling
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── services/
│   ├── scraper/         # Puppeteer / Cheerio scrapers
│   ├── recommendation/  # Recommendation engine
│   ├── notification/    # Notification service
│   └── analytics/       # Analytics aggregation
├── utils/               # Logger, token generator
├── jobs/                # node-cron scheduled tasks
├── validators/          # Input validators
└── server.js
```

## 4. Database Schemas

- **User**: profile, auth, streaks, XP, level, achievements, preferences
- **PomodoroSession**: focus sessions with category, duration, completion
- **Goal**: daily/weekly/monthly goals with progress tracking
- **Journal**: entries with mood and productivity rating
- **Exam**: scraped exam schedules from official college site
- **Notice**: scraped academic notices
- **Mark**: user-submitted marks for weak subject detection
- **Notification**: in-app alerts and reminders
- **Recommendation**: personalized study recommendations
- **Analytics**: aggregated focus data and reports

## 5. API Routes

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | Login user |
| `GET /api/auth/me` | Get current user |
| `PUT /api/users/profile` | Update profile |
| `POST /api/pomodoro/start` | Start focus session |
| `PUT /api/pomodoro/complete/:id` | Complete session |
| `GET /api/pomodoro/today` | Today’s focus stats |
| `GET /api/goals` | List goals |
| `POST /api/goals` | Create goal |
| `GET /api/journal` | List journal entries |
| `POST /api/journal` | Create journal entry |
| `GET /api/exams` | Upcoming exams |
| `GET /api/exams/status` | Schedule update status |
| `GET /api/marks/weak-subjects` | Weak subject analysis |
| `GET /api/analytics/dashboard` | Dashboard analytics |
| `GET /api/recommendations` | Personalized recommendations |

## 6. State Management (Zustand)

- **authStore**: authentication state, user, token
- **pomodoroStore**: timer state, sessions, categories
- **dashboardStore**: dashboard data, recommendations, exams
- **goalStore**: goals CRUD
- **journalStore**: journal entries

## 7. Scraper Architecture

- `examScraper.js`: Puppeteer-based exam schedule scraping
- `noticeScraper.js`: Cheerio-based notice scraping
- `pdfParser.js`: PDF text extraction
- `changeDetector.js`: Detects new/changed scraped data
- `scraperJobs.js`: node-cron scheduler (every 6 hours)

## 8. Recommendation Engine

Rule-based engine that considers:
- Frequent pomodoro categories
- Weak subjects from marks
- User interests & preferred categories
- Upcoming exams

## 9. Notification Architecture

- In-app notifications stored in MongoDB
- Cron jobs generate reminders (streak, goals, exams, weak subjects)
- Socket.io ready for real-time delivery

## 10. Deployment Architecture

- **Frontend**: Vercel / Netlify (static build)
- **Backend**: Railway / Render / AWS EC2
- **Database**: MongoDB Atlas
- **Optional**: Redis for caching, Cloudinary for assets

## 11. Future ML Integration

Architecture supports future additions:
- Collaborative filtering for recommendations
- Time-series analysis for burnout prediction
- Regression models for GPA prediction
- Reinforcement learning for optimal break intervals
