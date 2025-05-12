"""
Reddit Agent Dashboard
---------------------
A Flask-based web dashboard to display Reddit posting agent activities in real-time.
"""
from flask import Flask, render_template, jsonify
import json
import os
from datetime import datetime
import threading
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)

# In-memory cache of events
cached_events = []
last_update = datetime.now()

class EventFileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global cached_events, last_update
        if event.src_path.endswith('events.json'):
            try:
                with open('events.json', 'r') as f:
                    cached_events = json.load(f)
                    last_update = datetime.now()
                    print(f"Updated events cache: {len(cached_events)} events")
            except Exception as e:
                print(f"Error updating events cache: {str(e)}")

# Set up the file watcher
def start_file_watcher():
    event_handler = EventFileHandler()
    observer = Observer()
    observer.schedule(event_handler, path='.', recursive=False)
    observer.start()
    print("File watcher started")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/events')
def get_events():
    global cached_events
    return jsonify(cached_events)

@app.route('/api/status')
def get_status():
    return jsonify({
        'events_count': len(cached_events),
        'last_update': last_update.isoformat(),
        'server_time': datetime.now().isoformat()
    })

# Create templates directory and HTML file
os.makedirs('templates', exist_ok=True)

with open('templates/index.html', 'w') as f:
    f.write('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reddit Posting Agent Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { padding-top: 20px; }
        .post-success { background-color: #d4edda; }
        .post-failed { background-color: #f8d7da; }
        #status-bar {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #f8f9fa;
            padding: 5px 15px;
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reddit Posting Agent Dashboard</h1>
        <div class="row mb-3">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                        <h5>Post Activity</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h2 id="total-posts">0</h2>
                                        <p>Total Posts</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h2 id="successful-posts">0</h2>
                                        <p>Successful</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <h2 id="failed-posts">0</h2>
                                        <p>Failed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card mb-3">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5>Recent Activity</h5>
                <button id="refresh-btn" class="btn btn-sm btn-primary">Refresh</button>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Subreddit</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody id="events-table">
                            <tr>
                                <td colspan="5" class="text-center">No events yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <div id="status-bar">
        <div class="d-flex justify-content-between">
            <span>Last updated: <span id="last-update">Never</span></span>
            <span>Events: <span id="events-count">0</span></span>
        </div>
    </div>

    <script>
        function formatDateTime(isoString) {
            const date = new Date(isoString);
            return date.toLocaleString();
        }
        
        function updateDashboard() {
            fetch('/api/events')
                .then(response => response.json())
                .then(events => {
                    const eventsTable = document.getElementById('events-table');
                    const totalPosts = document.getElementById('total-posts');
                    const successfulPosts = document.getElementById('successful-posts');
                    const failedPosts = document.getElementById('failed-posts');
                    
                    // Update counters
                    totalPosts.textContent = events.length;
                    successfulPosts.textContent = events.filter(e => e.status === 'success').length;
                    failedPosts.textContent = events.filter(e => e.status === 'failed').length;
                    
                    // Clear table
                    eventsTable.innerHTML = '';
                    
                    // Sort events by timestamp, newest first
                    events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    // Add events to table
                    events.forEach(event => {
                        const row = document.createElement('tr');
                        row.className = event.status === 'success' ? 'post-success' : 'post-failed';
                        
                        row.innerHTML = `
                            <td>${formatDateTime(event.timestamp)}</td>
                            <td>r/${event.subreddit}</td>
                            <td>${event.title}</td>
                            <td>${event.status}</td>
                            <td>${event.status === 'success' 
                                ? `<a href="${event.post_url}" target="_blank">View Post</a>` 
                                : `Error: ${event.error}`}</td>
                        `;
                        
                        eventsTable.appendChild(row);
                    });
                    
                    if (events.length === 0) {
                        eventsTable.innerHTML = '<tr><td colspan="5" class="text-center">No events yet</td></tr>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching events:', error);
                });
                
            fetch('/api/status')
                .then(response => response.json())
                .then(status => {
                    document.getElementById('last-update').textContent = formatDateTime(status.last_update);
                    document.getElementById('events-count').textContent = status.events_count;
                });
        }
        
        // Initial update
        updateDashboard();
        
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', updateDashboard);
        
        // Auto-refresh every 10 seconds
        setInterval(updateDashboard, 10000);
    </script>
</body>
</html>
    ''')

if __name__ == '__main__':
    # Start file watcher in a separate thread
    watcher_thread = threading.Thread(target=start_file_watcher, daemon=True)
    watcher_thread.start()
    
    # Create an empty events file if it doesn't exist
    if not os.path.exists('events.json'):
        with open('events.json', 'w') as f:
            json.dump([], f)
    
    # Start the Flask app
    app.run(debug=True, port=5000)