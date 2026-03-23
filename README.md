# Deal Aggregator MVP

Find the best deals across 50+ retailers in one place.

## Quick Start

```bash
# Clone the project
cd deal-aggregator

# Start all services
docker-compose up -d

# Wait for databases to initialize (~30 seconds)

# Open browser
http://localhost:5173
```

## Services

- **Frontend:** http://localhost:5173 (React + Vite)
- **Backend API:** http://localhost:8000 (FastAPI)
- **API Docs:** http://localhost:8000/docs
- **Database:** PostgreSQL on localhost:5432

## Architecture

```
deal-aggregator/
├── backend/              (FastAPI API)
│   ├── main.py          (App entry)
│   ├── database.py       (SQLAlchemy config)
│   ├── models.py         (Database models)
│   ├── routes/           (API endpoints)
│   └── Dockerfile
├── frontend/             (React + Vite)
│   ├── src/              (React components)
│   ├── vite.config.ts    (Build config)
│   └── Dockerfile
└── docker-compose.yml    (Orchestration)
```

## Features (MVP)

✅ Search for products across retailers
✅ Compare prices
✅ View retailer information
✅ Real-time API
✅ Full-stack deployment

## Next Steps

1. **Add scraping** - Automatically populate deals from Amazon, eBay, Newegg, etc.
2. **Add authentication** - User accounts, watchlists, price alerts
3. **Add more retailers** - Expand from 3 to 50+ retailers
4. **Add analytics** - Track trends, popular products, deals
5. **Deploy to production** - Railway, Vercel, AWS, etc.

## Development

### Backend only
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend only
```bash
cd frontend
npm install
npm run dev
```

## Database

Migrations handled automatically via SQLAlchemy. To reset:

```bash
docker-compose down -v
docker-compose up -d
```

## API Endpoints

- `GET /api/search?q=headphones` - Search products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details with all prices

## Production Deployment

### Railway

```bash
# Backend
railway add fastapi
railway variables set DATABASE_URL=...
railway up

# Frontend
railway add node
railway up
```

### Docker Hub

```bash
docker build -f backend/Dockerfile -t myuser/deal-aggregator-api ./backend
docker build -f frontend/Dockerfile -t myuser/deal-aggregator-web ./frontend
docker push myuser/deal-aggregator-api
docker push myuser/deal-aggregator-web
```

## License

MIT
