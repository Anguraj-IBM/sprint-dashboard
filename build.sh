#!/bin/bash
# Build script for Sprint Dashboard standalone executable

echo "=========================================="
echo "  Sprint Dashboard - Build Script"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found"

# Install PyInstaller if not already installed
echo "📦 Installing PyInstaller..."
pip3 install pyinstaller

echo ""
echo "🔨 Building executable..."
echo ""

# Build the executable
pyinstaller --onefile \
    --name "SprintDashboard" \
    --add-data "index.html:." \
    --add-data "dashboard.js:." \
    --add-data "styles.css:." \
    --add-data "data:data" \
    --icon=NONE \
    --clean \
    server.py

echo ""
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "📦 Executable location: dist/SprintDashboard"
echo ""
echo "To run:"
echo "  ./dist/SprintDashboard"
echo ""
echo "To distribute:"
echo "  Share the 'dist/SprintDashboard' file"
echo ""

# Made with Bob
