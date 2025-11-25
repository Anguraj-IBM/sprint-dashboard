# Sprint Analytics Dashboard - Docker Image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY index.html .
COPY dashboard.js .
COPY styles.css .
COPY data/ ./data/
COPY server.py .

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000')" || exit 1

# Run the server
CMD ["python", "server.py"]