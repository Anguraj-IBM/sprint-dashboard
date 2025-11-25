#!/bin/bash
# Docker build and run script for Sprint Analytics Dashboard

echo "=========================================="
echo "  Sprint Analytics Dashboard - Docker"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker found"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t sprint-analytics-dashboard .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Docker image built successfully!"
    echo ""
    echo "🚀 Starting container..."
    echo ""
    
    # Stop existing container if running
    docker stop sprint-analytics-dashboard 2>/dev/null || true
    docker rm sprint-analytics-dashboard 2>/dev/null || true
    
    # Run the container
    docker run -d \
        --name sprint-analytics-dashboard \
        -p 8000:8000 \
        --restart unless-stopped \
        sprint-analytics-dashboard
    
    echo "=========================================="
    echo "  🎉 Dashboard is now running!"
    echo "=========================================="
    echo ""
    echo "📱 Access the dashboard at: http://localhost:8000"
    echo ""
    echo "🐳 Container commands:"
    echo "  Stop:    docker stop sprint-analytics-dashboard"
    echo "  Start:   docker start sprint-analytics-dashboard"
    echo "  Logs:    docker logs sprint-analytics-dashboard"
    echo "  Remove:  docker rm -f sprint-analytics-dashboard"
    echo ""
    echo "🔍 Container status:"
    docker ps --filter name=sprint-analytics-dashboard
    echo ""
else
    echo "❌ Docker build failed!"
    exit 1
fi

# Made with Bob
