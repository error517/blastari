"""
Reddit Posting Agent
-------------------
A simple agent that posts content to specified subreddits.
"""
import praw
import time
import json
import os
import logging
import random
from datetime import datetime
from typing import List, Dict, Any, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("reddit_agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("RedditAgent")

class RedditPostingAgent:
    """Agent for posting content to Reddit subreddits."""
    
    def __init__(self, credentials_file: str = "credentials.json"):
        """Initialize the Reddit agent with credentials."""
        self.credentials = self._load_credentials(credentials_file)
        self.reddit = self._initialize_reddit_client()
        self.events = []
        logger.info("Reddit Posting Agent initialized")
        
    def _load_credentials(self, credentials_file: str) -> Dict[str, str]:
        """Load Reddit API credentials from file."""
        try:
            with open(credentials_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.error(f"Credentials file {credentials_file} not found")
            raise
            
    def _initialize_reddit_client(self) -> praw.Reddit:
        """Initialize and return a Reddit client."""
        try:
            return praw.Reddit(
                client_id=self.credentials.get("client_id"),
                client_secret=self.credentials.get("client_secret"),
                user_agent=self.credentials.get("user_agent"),
                username=self.credentials.get("username"),
                password=self.credentials.get("password")
            )
        except Exception as e:
            logger.error(f"Failed to initialize Reddit client: {str(e)}")
            raise
    
    def validate_subreddit(self, subreddit_name: str) -> bool:
        """Check if a subreddit exists and is accessible."""
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            # Try to access a property to verify the subreddit exists
            subreddit.display_name
            return True
        except Exception as e:
            logger.warning(f"Subreddit validation failed for {subreddit_name}: {str(e)}")
            return False
    
    def post_content(self, 
                    subreddit_name: str, 
                    title: str, 
                    content: str = None, 
                    url: str = None, 
                    image_path: str = None) -> Dict[str, Any]:
        """Post content to a specified subreddit."""
        event = {
            "timestamp": datetime.now().isoformat(),
            "action": "post_attempt",
            "subreddit": subreddit_name,
            "title": title,
        }
        
        # Validate the subreddit exists
        if not self.validate_subreddit(subreddit_name):
            event.update({
                "status": "failed",
                "error": f"Subreddit {subreddit_name} could not be validated"
            })
            self.events.append(event)
            return event
        
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            
            if image_path and os.path.exists(image_path):
                # Image post
                submission = subreddit.submit_image(title=title, image_path=image_path)
            elif url:
                # Link post
                submission = subreddit.submit(title=title, url=url)
            else:
                # Text post
                submission = subreddit.submit(title=title, selftext=content or "")
            
            # Update event with successful post details
            event.update({
                "status": "success",
                "post_id": submission.id,
                "post_url": submission.url,
                "timestamp_complete": datetime.now().isoformat()
            })
            
            logger.info(f"Successfully posted to r/{subreddit_name}: {submission.url}")
            
        except Exception as e:
            # Update event with error information
            event.update({
                "status": "failed",
                "error": str(e),
                "timestamp_complete": datetime.now().isoformat()
            })
            
            logger.error(f"Failed to post to r/{subreddit_name}: {str(e)}")
        
        # Store the event
        self.events.append(event)
        return event
    
    def batch_post(self, posts_config: List[Dict[str, Any]], delay_range: tuple = (30, 120)) -> List[Dict[str, Any]]:
        """Post multiple pieces of content to different subreddits with random delays between posts."""
        results = []
        
        for post_config in posts_config:
            # Extract post details
            subreddit = post_config.get("subreddit")
            title = post_config.get("title")
            content = post_config.get("content")
            url = post_config.get("url")
            image_path = post_config.get("image_path")
            
            # Post the content
            result = self.post_content(subreddit, title, content, url, image_path)
            results.append(result)
            
            # If this isn't the last post, add a random delay
            if post_config != posts_config[-1]:
                delay = random.randint(delay_range[0], delay_range[1])
                logger.info(f"Waiting {delay} seconds before next post...")
                time.sleep(delay)
                
        return results
    
    def get_events(self) -> List[Dict[str, Any]]:
        """Get all recorded events."""
        return self.events
    
    def export_events(self, output_file: str = "events.json") -> None:
        """Export all events to a JSON file."""
        with open(output_file, 'w') as f:
            json.dump(self.events, f, indent=2)
        logger.info(f"Exported {len(self.events)} events to {output_file}")


# Example usage
if __name__ == "__main__":
    # Create a sample credentials.json file for testing
    sample_credentials = {
        "client_id": "YOUR_CLIENT_ID",
        "client_secret": "YOUR_CLIENT_SECRET",
        "user_agent": "AdPostingAgent/1.0 by YourUsername",
        "username": "YOUR_REDDIT_USERNAME",
        "password": "YOUR_REDDIT_PASSWORD"
    }
    
    with open("sample_credentials.json", "w") as f:
        json.dump(sample_credentials, f, indent=2)
    
    print("Sample credentials file created as 'sample_credentials.json'")
    print("Please fill in your actual Reddit API credentials before running this script.")
    
    # Example batch posting configuration
    example_posts = [
        {
            "subreddit": "test",
            "title": "Test post from Reddit Agent",
            "content": "This is a test post created by the Reddit Posting Agent."
        },
        {
            "subreddit": "python",
            "title": "Automated Reddit posting with PRAW",
            "content": "Has anyone used PRAW for automated content posting? Any tips?"
        }
    ]
    
    print("\nExample usage:")
    print("agent = RedditPostingAgent('your_credentials.json')")
    print("results = agent.batch_post(example_posts)")
    print("agent.export_events('posting_history.json')")