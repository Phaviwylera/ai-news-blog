import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse

BASE_URL = 'https://www.indiatoday.in'
visited = set()
articles = []

def is_valid_link(href):
    return href and href.startswith('/') and not any(x in href for x in ['live', 'videos', 'tv', '#'])

def extract_article(url):
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            return None
        soup = BeautifulSoup(res.text, 'lxml')
        
        title_tag = soup.find('h1')
        summary_tag = soup.find('div', class_='description')
        date_tag = soup.find('span', class_='posted-date')
        image_tag = soup.find('img')
        
        title = title_tag.get_text(strip=True) if title_tag else None
        summary = summary_tag.get_text(strip=True) if summary_tag else None
        date = date_tag.get_text(strip=True) if date_tag else None
        image = image_tag['src'] if image_tag and 'src' in image_tag.attrs else None
        
        if title and summary:
            return {
                'title': title,
                'summary': summary,
                'source': url,
                'date': date,
                'image': image
            }
    except Exception as e:
        print(f"[ERROR] Failed to scrape {url}: {e}")
    return None

def crawl(url, depth=0, max_depth=2):
    if depth > max_depth or url in visited:
        return
    visited.add(url)
    
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            return
        soup = BeautifulSoup(res.text, 'lxml')

        # Extract and save article if it's a story page
        if '/story/' in url:
            article = extract_article(url)
            if article:
                articles.append(article)

        # Follow links
        for a in soup.find_all('a', href=True):
            href = a['href']
            if is_valid_link(href):
                full_url = urljoin(BASE_URL, href)
                if BASE_URL in full_url:
                    crawl(full_url, depth + 1, max_depth)
    except Exception as e:
        print(f"[ERROR] Failed to crawl {url}: {e}")

if __name__ == "__main__":
    print("Starting India Today recursive crawl...")
    crawl(BASE_URL, depth=0, max_depth=2)

    output_path = '../backend/posts.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    print(f"[FINISHED] Scraped {len(articles)} articles.")
    print(f"[SAVED] Articles written to {output_path}")
