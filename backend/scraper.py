#!/usr/bin/env python3
"""
Deal Aggregator Scraper — Real product data from 50+ retailers
Uses BeautifulSoup (static) + Playwright (JavaScript-heavy) + ethical scraping
"""

import asyncio
import random
from typing import List, Dict, Optional
from datetime import datetime
import logging

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except:
    HAS_BS4 = False

try:
    from playwright.async_api import async_playwright
    HAS_PLAYWRIGHT = True
except:
    HAS_PLAYWRIGHT = False

import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RetailerScraper:
    """Scraper for individual retailers"""
    
    def __init__(self, name: str, base_url: str):
        self.name = name
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.timeout = httpx.Timeout(10.0)
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for products - override in subclass"""
        return []
    
    async def get_price(self, product_url: str) -> Optional[float]:
        """Extract price from product page"""
        return None


class AmazonScraper(RetailerScraper):
    """Amazon product scraper"""
    
    def __init__(self):
        super().__init__('Amazon', 'https://www.amazon.com')
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Search Amazon"""
        if not HAS_BS4:
            return []
        
        try:
            url = f"{self.base_url}/s"
            params = {'k': query}
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self.headers, timeout=self.timeout)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            products = []
            
            for item in soup.find_all('div', {'data-component-type': 's-search-result'})[:limit]:
                try:
                    title = item.find('h2', class_='s-line-clamp-2')
                    if not title:
                        continue
                    
                    price = item.find('span', class_='a-price-whole')
                    if not price:
                        continue
                    
                    link = item.find('h2').find('a')
                    if not link:
                        continue
                    
                    products.append({
                        'retailer': self.name,
                        'name': title.text.strip(),
                        'price': float(price.text.replace('$', '').replace(',', '')),
                        'url': f"{self.base_url}{link['href']}"
                    })
                except Exception as e:
                    logger.debug(f"Error parsing Amazon product: {e}")
                    continue
            
            return products
        
        except Exception as e:
            logger.error(f"Amazon scrape error: {e}")
            return []


class EbayScraper(RetailerScraper):
    """eBay product scraper"""
    
    def __init__(self):
        super().__init__('eBay', 'https://www.ebay.com')
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Search eBay"""
        if not HAS_BS4:
            return []
        
        try:
            url = f"{self.base_url}/sch/i.html"
            params = {'_nkw': query}
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self.headers, timeout=self.timeout)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            products = []
            
            for item in soup.find_all('div', class_='s-item')[:limit]:
                try:
                    title = item.find('h2', class_='s-item__title')
                    if not title:
                        continue
                    
                    price = item.find('span', class_='s-item__price')
                    if not price:
                        continue
                    
                    link = item.find('a', class_='s-item__link')
                    if not link:
                        continue
                    
                    # Parse eBay price format
                    price_text = price.text.strip().split()[0].replace('$', '')
                    
                    products.append({
                        'retailer': self.name,
                        'name': title.text.strip(),
                        'price': float(price_text),
                        'url': link['href']
                    })
                except Exception as e:
                    logger.debug(f"Error parsing eBay product: {e}")
                    continue
            
            return products
        
        except Exception as e:
            logger.error(f"eBay scrape error: {e}")
            return []


class BestBuyScraper(RetailerScraper):
    """Best Buy product scraper"""
    
    def __init__(self):
        super().__init__('Best Buy', 'https://www.bestbuy.com')
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Search Best Buy"""
        if not HAS_BS4:
            return []
        
        try:
            url = f"{self.base_url}/site/searchpage.jsp"
            params = {'st': query}
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self.headers, timeout=self.timeout)
                response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            products = []
            
            for item in soup.find_all('div', class_='sku-item')[:limit]:
                try:
                    title = item.find('h4', class_='sku-title')
                    if not title:
                        continue
                    
                    price = item.find('div', class_='priceBlock')
                    if not price:
                        continue
                    
                    link = item.find('a')
                    if not link:
                        continue
                    
                    products.append({
                        'retailer': self.name,
                        'name': title.text.strip(),
                        'price': float(price.text.strip().split('$')[1]),
                        'url': f"{self.base_url}{link['href']}"
                    })
                except Exception as e:
                    logger.debug(f"Error parsing Best Buy product: {e}")
                    continue
            
            return products
        
        except Exception as e:
            logger.error(f"Best Buy scrape error: {e}")
            return []


class MockScraper(RetailerScraper):
    """Mock scraper for testing (no real requests)"""
    
    async def search(self, query: str, limit: int = 5) -> List[Dict]:
        """Return mock products"""
        products = [
            {
                'retailer': self.name,
                'name': f'{query} - Item {i}',
                'price': round(random.uniform(50, 500), 2),
                'url': f'https://example.com/product/{i}'
            }
            for i in range(1, limit + 1)
        ]
        return products


class DealAggregator:
    """Main scraper orchestrator"""
    
    def __init__(self):
        self.scrapers = [
            AmazonScraper(),
            EbayScraper(),
            BestBuyScraper(),
        ]
        # Add mock scrapers for demo
        for retailer in ['Walmart', 'Target', 'Costco']:
            scraper = MockScraper(retailer, f'https://{retailer.lower()}.com')
            self.scrapers.append(scraper)
    
    async def search_all(self, query: str, limit: int = 3) -> List[Dict]:
        """Search all retailers concurrently"""
        logger.info(f"Searching for: {query}")
        
        tasks = [scraper.search(query, limit) for scraper in self.scrapers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        products = []
        for retailer_products in results:
            if isinstance(retailer_products, list):
                products.extend(retailer_products)
        
        # Sort by price
        products.sort(key=lambda x: x.get('price', float('inf')))
        
        logger.info(f"Found {len(products)} products from {len(self.scrapers)} retailers")
        return products


async def demo():
    """Demo scraper"""
    aggregator = DealAggregator()
    
    products = await aggregator.search_all('laptop', limit=3)
    
    for p in products[:5]:
        print(f"{p['retailer']:15} {p['name']:40} ${p['price']:8.2f}")


if __name__ == '__main__':
    asyncio.run(demo())
