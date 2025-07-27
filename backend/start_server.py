#!/usr/bin/env python3
"""
Start the ShopNaija Flask server
"""

from app import create_app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting ShopNaija server...")
    print("🌐 Server will be available at: http://127.0.0.1:5000")
    print("🔧 Use Ctrl+C to stop the server")
    app.run(host='127.0.0.1', port=5000, debug=True)
