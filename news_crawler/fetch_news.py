import requests
from bs4 import BeautifulSoup
import json
from urllib.parse import urljoin, urlparse
import time

START_URL = 'https://www.nytimes.com/section/todayspaper'
MAX_DEPTH = 2  # Increase to 10 once confirmed stable
visited = set()
articles = []

def is_valid_link(href):
    if not href:
        return False
    parsed = urlparse(href)
    return not parsed.netloc or "nytimes.com" in parsed.netloc

def scrape_article(url):
    try:
        res = requests.get(url, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        title = soup.find('h1')
        content = soup.find_all('p')

        if title and content:
            article = {
                'title': title.text.strip(),
                'url': url,
                'content': "\n".join(p.text.strip() for p in content if p.text.strip())
            }
            return article
    except Exception as e:
        print(f"Error scraping {url}: {e}")
    return None

def crawl(url, depth=0):
    if depth > MAX_DEPTH or url in visited:
        return
    visited.add(url)
    
    print(f"Visiting ({depth}): {url}")
    try:
        res = requests.get(url, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')

        links = soup.find_all('a')
        for link in links:
            href = link.get('href')
            if not is_valid_link(href):
                continue
            full_url = urljoin(url, href)
            if '/202' in full_url and full_url not in visited:
                article = scrape_article(full_url)
                if article:
                    print(f"  Added: {article['title']}")
                    articles.append(article)
            else:
                crawl(full_url, depth + 1)

    except Exception as e:
        print(f"Failed to crawl {url}: {e}")

def save_articles():
    if articles:
        try:
            with open('posts.json', 'w', encoding='utf-8') as f:
                json.dump(articles, f, ensure_ascii=False, indent=2)
            print(f"Saved {len(articles)} articles.")
        except Exception as e:
            print(f"Error saving articles: {e}")
    else:
        print("No articles found to save.")

if __name__ == "__main__":
    print("Starting scraper...")
    crawl(START_URL)
    save_articles()
    print("Finished.")
