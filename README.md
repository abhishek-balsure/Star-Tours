# ST✪R Tours and Travels

A modern travel agency website for booking tours, visas, and travel packages worldwide.

## Features

- **Tour Booking** - Book tours with customizable options (flight, hotel, meals, guide)
- **Visa Processing** - Submit visa applications
- **Gallery** - Browse destinations with photo galleries
- **Contact Form** - Get in touch with the travel agency
- **User Auth** - Login/register with JWT (login page: `auth.html`)
- **Dashboard** - View and manage bookings & visa applications
- **Responsive Design** - Works on mobile, tablet, and desktop

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Main landing page with tours carousel |
| `about.html` | About the company |
| `tours.html` | Available tour packages |
| `gallery.html` | Photo gallery of destinations |
| `visa.html` | Visa application form |
| `booking.html` | Tour booking form |
| `contact.html` | Contact information |
| `auth.html` | Login / register |
| `dashboard.html` | User dashboard (bookings + visas) |

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend**: Python (Flask) — `server_python/`
- **Database**: MongoDB — `mongodb-data/`

## Backend Setup

### 1. Start MongoDB

```bash
# Start MongoDB server (data dir already initialized)
"C:\Users\User\Desktop\Star-Tours\mongo70\mongodb-win32-x86_64-windows-7.0.14\bin\mongod.exe" --dbpath "C:\Users\User\Desktop\Star-Tours\mongodb-data" --port 27017 --bind_ip 127.0.0.1
```

### 2. Start Flask API

```bash
cd server_python
pip install -r requirements.txt
python app.py
```

The API runs on `http://localhost:5000`. Admin and demo users are seeded automatically on first start.

**Accounts (seeded):**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@startours.com` | `admin123` |
| Demo | `demo@test.com` | `demo123` |

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | - | Register user |
| POST | `/api/auth/login` | - | Login, get JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET/POST | `/api/bookings` | ✓ | List / create bookings |
| PUT | `/api/bookings/:id/cancel` | ✓ | Cancel booking |
| PUT | `/api/bookings/:id/status` | admin | Change booking status |
| DELETE | `/api/bookings/:id` | ✓ | Delete booking |
| GET/POST | `/api/visas` | ✓ | List / create visa apps |
| PUT | `/api/visas/:id/status` | admin | Change visa status |
| DELETE | `/api/visas/:id` | ✓ | Delete visa app |
| GET | `/api/reviews` | - | List reviews (filter by `?destination=`) |
| POST | `/api/reviews` | ✓ | Add review |
| GET/POST | `/api/wishlist` | ✓ | Get / add wishlist |
| DELETE | `/api/wishlist/:destination` | ✓ | Remove from wishlist |
| GET | `/api/admin/stats` | admin | Dashboard stats |
| GET | `/api/admin/users` | admin | List all users |
| DELETE | `/api/admin/users/:id` | admin | Delete user |
| GET | `/api/health` | - | Health check |

## Local Setup (frontend)

Simply open `index.html` in your browser while the Flask API is running — the pages call `http://localhost:5000`.

## License

Private - All rights reserved
