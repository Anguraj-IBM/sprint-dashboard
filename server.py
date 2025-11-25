#!/usr/bin/env python3
"""
Sprint Dashboard Server
A standalone web server for the Sprint Analytics Dashboard
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
HOST = "127.0.0.1"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve files from the correct directory"""
    
    def __init__(self, *args, **kwargs):
        # Get the directory where the script/executable is located
        if getattr(sys, 'frozen', False):
            # Running as compiled executable
            self.base_path = Path(sys._MEIPASS)
        else:
            # Running as script
            self.base_path = Path(__file__).parent
        
        super().__init__(*args, directory=str(self.base_path), **kwargs)
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    """Start the web server and open the dashboard"""
    
    print("=" * 60)
    print("  Sprint Analytics Dashboard Server")
    print("=" * 60)
    print(f"\n🚀 Starting server on http://{HOST}:{PORT}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print("\n✨ Dashboard will open in your default browser...")
    print("\n⚠️  Press Ctrl+C to stop the server\n")
    print("=" * 60 + "\n")
    
    # Create server
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        # Open browser
        url = f"http://{HOST}:{PORT}"
        webbrowser.open(url)
        
        try:
            # Start serving
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n" + "=" * 60)
            print("  Server stopped. Thank you for using Sprint Dashboard!")
            print("=" * 60 + "\n")
            sys.exit(0)

if __name__ == "__main__":
    main()

# Made with Bob
