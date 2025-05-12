"""
Reddit Agent Controller
----------------------
Controller script to manage the Reddit posting agent and run the dashboard.
"""
import argparse
import json
import time
import os
import subprocess
import sys
import threading

# Import the RedditPostingAgent class
from reddit_agent import RedditPostingAgent

def create_sample_credentials():
    """Create a sample credentials file if it doesn't exist."""
    if not os.path.exists("credentials.json"):
        sample_credentials = {
            "client_id": "YOUR_CLIENT_ID",
            "client_secret": "YOUR_CLIENT_SECRET",
            "user_agent": "AdPostingAgent/1.0 by YourUsername",
            "username": "YOUR_REDDIT_USERNAME",
            "password": "YOUR_REDDIT_PASSWORD"
        }
        
        with open("credentials.json", "w") as f:
            json.dump(sample_credentials, f, indent=2)
        
        print("Created sample credentials.json file.")
        print("Please update with your Reddit API credentials before posting.")
        return False
    return True

def load_post_config(config_file):
    """Load posting configuration from JSON file."""
    try:
        with open(config_file, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Config file {config_file} not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error parsing JSON in {config_file}.")
        return None

def create_sample_config():
    """Create a sample post configuration file."""
    if not os.path.exists("post_config.json"):
        sample_config = [
            {
                "subreddit": "test",
                "title": "Example ad post",
                "content": "This is an example advertisement post content.",
                "url": None,
                "image_path": None
            },
            {
                "subreddit": "AnotherSubreddit",
                "title": "Check out this cool product",
                "content": None,
                "url": "https://example.com/product",
                "image_path": None
            }
        ]
        
        with open("post_config.json", "w") as f:
            json.dump(sample_config, f, indent=2)
        
        print("Created sample post_config.json file.")
        print("Please update with your desired posting configuration.")

def run_dashboard():
    """Run the dashboard in a separate process."""
    try:
        # Check if Flask is installed
        subprocess.check_call([sys.executable, "-c", "import flask"], 
                             stdout=subprocess.DEVNULL, 
                             stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        print("Flask is not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "watchdog"])
    
    # Run the dashboard
    dashboard_process = subprocess.Popen([sys.executable, "reddit_dashboard.py"])
    print("Dashboard started at http://127.0.0.1:5000")
    return dashboard_process

def main():
    """Main function to run the Reddit posting agent."""
    parser = argparse.ArgumentParser(description="Reddit Posting Agent Controller")
    parser.add_argument("--config", default="post_config.json", help="Path to posting configuration file")
    parser.add_argument("--credentials", default="credentials.json", help="Path to Reddit API credentials file")
    parser.add_argument("--dashboard", action="store_true", help="Start the web dashboard")
    parser.add_argument("--delay", type=int, default=60, help="Delay between posts in seconds")
    parser.add_argument("--export", default="events.json", help="Path to export events")
    
    args = parser.parse_args()
    
    # Create sample files if they don't exist
    create_sample_credentials()
    create_sample_config()
    
    # Start dashboard if requested
    dashboard_process = None
    if args.dashboard:
        dashboard_process = run_dashboard()
    
    # Load post configuration
    posts = load_post_config(args.config)
    if not posts:
        print("No valid post configuration found. Exiting.")
        if dashboard_process:
            print("Dashboard is still running. Press Ctrl+C to exit.")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                dashboard_process.terminate()
        return
    
    # Check if credentials file has been updated
    with open(args.credentials, 'r') as f:
        credentials = json.load(f)
        
    if credentials.get("client_id") == "YOUR_CLIENT_ID":
        print("Please update your credentials.json file with actual Reddit API credentials.")
        print("The agent will not post without valid credentials.")
        if dashboard_process:
            print("Dashboard is still running. Press Ctrl+C to exit.")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                dashboard_process.terminate()
        return
    
    # Initialize the Reddit posting agent
    try:
        agent = RedditPostingAgent(args.credentials)
    except Exception as e:
        print(f"Failed to initialize Reddit posting agent: {str(e)}")
        if dashboard_process:
            print("Dashboard is still running. Press Ctrl+C to exit.")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                dashboard_process.terminate()
        return
    
    # Post content
    print(f"Starting to post {len(posts)} items...")
    results = agent.batch_post(posts, delay_range=(args.delay, args.delay + 30))
    
    # Export events
    agent.export_events(args.export)
    print(f"Posting complete. Results exported to {args.export}")
    
    # Keep dashboard running if started
    if dashboard_process:
        print("Dashboard is still running at http://127.0.0.1:5000")
        print("Press Ctrl+C to exit.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            dashboard_process.terminate()

if __name__ == "__main__":
    main()