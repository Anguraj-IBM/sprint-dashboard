// Sprint Analytics Dashboard JavaScript

// Global variables
let sprintData = [];
let filteredData = [];
let charts = {};
let teamChoices = null;
let sprintChoices = null;

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    initializeFilters();
    updateDashboard();
    setupEventListeners();
});

// Load data from JSON file
async function loadData() {
    try {
        const response = await fetch('./data/sprint-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        sprintData = data.sprints;
        filteredData = [...sprintData];
        console.log('Data loaded successfully from sprint-data.json:', sprintData.length, 'records');
    } catch (error) {
        console.error('Error loading sprint data:', error);
        alert('Failed to load sprint data from data/sprint-data.json. Please ensure the file exists and the dashboard is served via a web server (not opened directly as a file).');
        // Initialize with empty data to prevent errors
        sprintData = [];
        filteredData = [];
    }
}

// Initialize filter dropdowns
function initializeFilters() {
    const teams = [...new Set(sprintData.map(s => s.team))];
    const sprints = [...new Set(sprintData.map(s => s.sprint))];
    
    const teamFilterElement = document.getElementById('teamFilter');
    const sprintFilterElement = document.getElementById('sprintFilter');
    
    // Initialize Choices.js for team filter
    teamChoices = new Choices(teamFilterElement, {
        removeItemButton: true,
        searchEnabled: true,
        searchPlaceholderValue: 'Search teams...',
        placeholder: true,
        placeholderValue: 'Select teams to compare',
        maxItemCount: -1,
        classNames: {
            containerOuter: 'choices choices-custom'
        }
    });
    
    // Initialize Choices.js for sprint filter
    sprintChoices = new Choices(sprintFilterElement, {
        removeItemButton: true,
        searchEnabled: true,
        searchPlaceholderValue: 'Search sprints...',
        placeholder: true,
        placeholderValue: 'Select sprints to compare',
        maxItemCount: -1,
        classNames: {
            containerOuter: 'choices choices-custom'
        }
    });
    
    // Set all teams and sprints as selected by default
    teamChoices.setValue(teams.map(team => ({ value: team, label: team })));
    sprintChoices.setValue(sprints.map(sprint => ({ value: sprint, label: sprint })));
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('teamFilter').addEventListener('change', applyFilters);
    document.getElementById('sprintFilter').addEventListener('change', applyFilters);
    document.getElementById('metricFilter').addEventListener('change', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('exportData').addEventListener('click', exportToCSV);
}

// Apply filters
function applyFilters() {
    const metricFilter = document.getElementById('metricFilter').value;
    
    // Get selected values from Choices.js
    const selectedTeams = teamChoices.getValue(true);
    const selectedSprints = sprintChoices.getValue(true);
    
    // If nothing selected, show all
    const allTeamsSelected = selectedTeams.length === 0;
    const allSprintsSelected = selectedSprints.length === 0;
    
    filteredData = sprintData.filter(item => {
        const teamMatch = allTeamsSelected || selectedTeams.includes(item.team);
        const sprintMatch = allSprintsSelected || selectedSprints.includes(item.sprint);
        return teamMatch && sprintMatch;
    });
    
    updateDashboard(metricFilter);
}

// Reset filters
function resetFilters() {
    // Get all teams and sprints
    const teams = [...new Set(sprintData.map(s => s.team))];
    const sprints = [...new Set(sprintData.map(s => s.sprint))];
    
    // Reset Choices.js dropdowns to all values
    teamChoices.removeActiveItems();
    sprintChoices.removeActiveItems();
    teamChoices.setValue(teams.map(team => ({ value: team, label: team })));
    sprintChoices.setValue(sprints.map(sprint => ({ value: sprint, label: sprint })));
    
    document.getElementById('metricFilter').value = 'all';
    filteredData = [...sprintData];
    updateDashboard();
}

// Update entire dashboard
function updateDashboard(metricFilter = 'all') {
    updateSummaryCards();
    updateCharts(metricFilter);
    updateDataTable();
}

// Update summary cards
function updateSummaryCards() {
    const avgCompletion = filteredData.reduce((sum, item) => sum + item.totalCompletionPercentage, 0) / filteredData.length || 0;
    const totalCommitments = filteredData.reduce((sum, item) => sum + item.storyPoints.committed, 0);
    const totalCompleted = filteredData.reduce((sum, item) => sum + item.storyPoints.done, 0);
    const defectsFixed = filteredData.reduce((sum, item) => sum + item.defects.done, 0);
    
    document.getElementById('avgCompletion').textContent = avgCompletion.toFixed(1) + '%';
    document.getElementById('totalCommitments').textContent = totalCommitments;
    document.getElementById('totalCompleted').textContent = totalCompleted;
    document.getElementById('defectsFixed').textContent = defectsFixed;
}

// Update all charts
function updateCharts(metricFilter) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart?.destroy());
    charts = {};
    
    // Create charts based on metric filter
    createCompletionTrendChart();
    createTeamComparisonChart();
    createCommitmentsChart();
    
    if (metricFilter === 'all' || metricFilter === 'storyPoints') {
        createStoryPointsChart();
    }
    
    if (metricFilter === 'all' || metricFilter === 'defects') {
        createDefectsChart();
    }
    
    if (metricFilter === 'all' || metricFilter === 'userStories') {
        createUserStoriesChart();
    }
    
    // Hide/show chart containers based on filter
    document.getElementById('storyPointsChart').parentElement.style.display = 
        (metricFilter === 'all' || metricFilter === 'storyPoints') ? 'block' : 'none';
    document.getElementById('defectsChart').parentElement.style.display = 
        (metricFilter === 'all' || metricFilter === 'defects') ? 'block' : 'none';
    document.getElementById('userStoriesChart').parentElement.style.display = 
        (metricFilter === 'all' || metricFilter === 'userStories') ? 'block' : 'none';
}

// Create Completion Trend Chart
function createCompletionTrendChart() {
    const ctx = document.getElementById('completionTrendChart');
    const labels = filteredData.map(item => `${item.team} - ${item.sprint}`);
    const data = filteredData.map(item => item.totalCompletionPercentage);
    
    charts.completionTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion %',
                data: data,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Story Points Chart
function createStoryPointsChart() {
    const ctx = document.getElementById('storyPointsChart');
    const labels = filteredData.map(item => `${item.team} - ${item.sprint}`);
    
    charts.storyPoints = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Committed',
                    data: filteredData.map(item => item.storyPoints.committed),
                    backgroundColor: 'rgba(79, 70, 229, 0.7)',
                    borderColor: '#4f46e5',
                    borderWidth: 2
                },
                {
                    label: 'Done',
                    data: filteredData.map(item => item.storyPoints.done),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Defects Chart
function createDefectsChart() {
    const ctx = document.getElementById('defectsChart');
    const labels = filteredData.map(item => `${item.team} - ${item.sprint}`);
    
    charts.defects = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Committed',
                    data: filteredData.map(item => item.defects.committed),
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: '#ef4444',
                    borderWidth: 2
                },
                {
                    label: 'Done',
                    data: filteredData.map(item => item.defects.done),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create User Stories Chart
function createUserStoriesChart() {
    const ctx = document.getElementById('userStoriesChart');
    const labels = filteredData.map(item => `${item.team} - ${item.sprint}`);
    
    charts.userStories = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Committed',
                    data: filteredData.map(item => item.userStories.committed),
                    backgroundColor: 'rgba(6, 182, 212, 0.7)',
                    borderColor: '#06b6d4',
                    borderWidth: 2
                },
                {
                    label: 'Done',
                    data: filteredData.map(item => item.userStories.done),
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create Team Comparison Chart
function createTeamComparisonChart() {
    const ctx = document.getElementById('teamComparisonChart');
    
    // Group data by team
    const teamData = {};
    filteredData.forEach(item => {
        if (!teamData[item.team]) {
            teamData[item.team] = [];
        }
        teamData[item.team].push(item.totalCompletionPercentage);
    });
    
    const teams = Object.keys(teamData);
    const avgCompletions = teams.map(team => {
        const completions = teamData[team];
        return completions.reduce((sum, val) => sum + val, 0) / completions.length;
    });
    
    charts.teamComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [{
                label: 'Average Completion %',
                data: avgCompletions,
                backgroundColor: [
                    'rgba(79, 70, 229, 0.7)',
                    'rgba(6, 182, 212, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    '#4f46e5',
                    '#06b6d4',
                    '#f59e0b',
                    '#ef4444',
                    '#10b981'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create Commitments Chart
function createCommitmentsChart() {
    const ctx = document.getElementById('commitmentsChart');
    const labels = filteredData.map(item => `${item.team} - ${item.sprint}`);
    
    charts.commitments = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Initial Commitments',
                data: filteredData.map(item => item.totalInitialCommitments),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update data table
function updateDataTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        
        const completionClass = 
            item.totalCompletionPercentage >= 85 ? 'completion-high' :
            item.totalCompletionPercentage >= 70 ? 'completion-medium' : 'completion-low';
        
        row.innerHTML = `
            <td>${item.team}</td>
            <td>${item.sprint}</td>
            <td>${item.date}</td>
            <td class="${completionClass}">${item.totalCompletionPercentage}%</td>
            <td>${item.storyPoints.committed}</td>
            <td>${item.storyPoints.done}</td>
            <td>${item.defects.committed}</td>
            <td>${item.defects.done}</td>
            <td>${item.userStories.committed}</td>
            <td>${item.userStories.done}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Export data to CSV
function exportToCSV() {
    const headers = ['Team', 'Sprint', 'Date', 'Completion %', 'SP Committed', 'SP Done', 
                     'Defects Committed', 'Defects Done', 'US Committed', 'US Done'];
    
    const rows = filteredData.map(item => [
        item.team,
        item.sprint,
        item.date,
        item.totalCompletionPercentage,
        item.storyPoints.committed,
        item.storyPoints.done,
        item.defects.committed,
        item.defects.done,
        item.userStories.committed,
        item.userStories.done
    ]);
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sprint-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Made with Bob
