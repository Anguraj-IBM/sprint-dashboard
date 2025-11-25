# Sprint Analytics Dashboard

A comprehensive dashboard for tracking team sprint performance and analytics.

## Features

- 📊 Real-time sprint data visualization
- 🏢 Multi-team comparison
- 📈 Completion percentage trends
- 🎯 Story points, defects, and user stories tracking
- 📥 CSV export functionality
- 🎨 Modern, responsive UI

## Quick Start

### Option 1: Run with Python (Simplest)

#### Linux/Mac:
```bash
python3 server.py
```

#### Windows:
Double-click `run.bat` or run in Command Prompt:
```cmd
run.bat
```

Or directly:
```cmd
python server.py
```

The dashboard will automatically open in your browser at `http://localhost:8000`

### Option 2: Build Standalone Executable

#### Linux/Mac:

```bash
chmod +x build.sh
./build.sh
```

Then run:
```bash
./dist/SprintDashboard
```

#### Windows:

Double-click `build.bat` or run in Command Prompt:
```cmd
build.bat
```

Then run:
```cmd
dist\SprintDashboard.exe
```

The executable includes everything needed - no Python installation required on the target machine!

### Option 3: Run with Docker (Recommended for Production)

#### Using Docker Compose (Easiest):
```bash
docker-compose up -d
```

#### Using Docker Build Scripts:

**Linux/Mac:**
```bash
chmod +x docker-build.sh
./docker-build.sh
```

**Windows:**
```cmd
docker-build.bat
```

#### Manual Docker Commands:
```bash
# Build the image
docker build -t sprint-analytics-dashboard .

# Run the container
docker run -d --name sprint-analytics-dashboard -p 8000:8000 sprint-analytics-dashboard
```

Access at: http://localhost:8000

**Docker Benefits:**
- ✅ Consistent environment across all systems
- ✅ No Python installation needed
- ✅ Easy deployment and scaling
- ✅ Built-in health checks
- ✅ Auto-restart on failure

### Option 4: Use Other Web Servers

#### VSCode Live Server (Recommended for Development)
1. Install "Live Server" extension in VSCode
2. Right-click `index.html` → "Open with Live Server"

#### Node.js
```bash
npx http-server -p 8000
# or
npx serve -p 8000
```

#### PHP
```bash
php -S localhost:8000
```

#### Python (Manual)
```bash
python3 -m http.server 8000
```

## Project Structure

```
sprint-dashboard/
├── index.html          # Main dashboard HTML
├── dashboard.js        # Dashboard logic and charts
├── styles.css          # Styling
├── data/
│   └── sprint-data.json  # Sprint data (5 teams, 10 sprints each)
├── server.py           # Standalone server script
├── build.sh            # Build script for executable (Linux/Mac)
├── build.bat           # Build script for executable (Windows)
├── run.bat             # Quick run script (Windows)
├── docker-build.sh     # Docker build script (Linux/Mac)
├── docker-build.bat    # Docker build script (Windows)
├── Dockerfile          # Docker image configuration
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Docker ignore rules
├── requirements.txt    # Python dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Data Format

The dashboard loads data from `data/sprint-data.json`. Each sprint entry includes:

```json
{
  "team": "Team Name",
  "sprint": "Sprint X",
  "date": "YYYY-MM-DD",
  "totalInitialCommitments": 45,
  "totalCompletionPercentage": 78,
  "storyPoints": {
    "committed": 35,
    "done": 27
  },
  "defects": {
    "committed": 6,
    "done": 5
  },
  "userStories": {
    "committed": 4,
    "done": 3
  }
}
```

## Current Teams

- Kingfishers
- Mavericks
- RebelScrum
- Zest
- Titans

## Building for Distribution

### Linux/Mac
```bash
chmod +x build.sh
./build.sh
```

### Windows
Double-click `build.bat` or run in Command Prompt:
```cmd
build.bat
```

Or manually:
```cmd
pip install pyinstaller
pyinstaller --onefile --name "SprintDashboard" --add-data "index.html;." --add-data "dashboard.js;." --add-data "styles.css;." --add-data "data;data" server.py
```

The executable will be in the `dist/` folder.

## Windows Users - Quick Start Files

- **run.bat** - Double-click to start the server (requires Python)
- **build.bat** - Double-click to build standalone executable
- **dist\SprintDashboard.exe** - Standalone executable (after building)

## Requirements

### For Running (Options 1 & 2)
- Python 3.6 or higher

### For Building Executable
- Python 3.6 or higher
- PyInstaller (`pip install pyinstaller`)

### For Docker (Option 3)
- Docker Desktop or Docker Engine
- No Python installation needed

### For Development
- Any modern web browser
- Optional: Node.js (for npm-based servers)
- Optional: VSCode with Live Server extension

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 4.4.0
- **UI Components**: Choices.js 10.2.0
- **Backend**: Python 3 (http.server)
- **Build Tools**: PyInstaller, Docker
- **Containerization**: Docker, Docker Compose

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or questions, please check the console logs in your browser's developer tools.

