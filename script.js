function calculateElevation(x, y, width, depth, baseElevation, slopePercentage, slopeDirection) {
    const slopeDecimal = slopePercentage / 100.0;
    
    switch (slopeDirection) {
        case 'frontToBack':
            return baseElevation + (y / depth) * slopeDecimal * depth;
            
        case 'backToFront':
            return baseElevation + ((depth - y) / depth) * slopeDecimal * depth;
            
        case 'leftToRight':
            return baseElevation + (x / width) * slopeDecimal * width;
            
        case 'rightToLeft':
            return baseElevation + ((width - x) / width) * slopeDecimal * width;
            
        case 'frontLeftToBackRight':
            const diagonal1 = Math.sqrt(width * width + depth * depth);
            const distanceFromStart1 = Math.sqrt(x * x + y * y);
            const normalizedDistance1 = distanceFromStart1 / diagonal1;
            return baseElevation + normalizedDistance1 * slopeDecimal * diagonal1;
            
        case 'frontRightToBackLeft':
            const diagonal2 = Math.sqrt(width * width + depth * depth);
            const distanceFromStart2 = Math.sqrt((width - x) * (width - x) + y * y);
            const normalizedDistance2 = distanceFromStart2 / diagonal2;
            return baseElevation + normalizedDistance2 * slopeDecimal * diagonal2;
            
        case 'backLeftToFrontRight':
            const diagonal3 = Math.sqrt(width * width + depth * depth);
            const distanceFromStart3 = Math.sqrt(x * x + (depth - y) * (depth - y));
            const normalizedDistance3 = distanceFromStart3 / diagonal3;
            return baseElevation + normalizedDistance3 * slopeDecimal * diagonal3;
            
        case 'backRightToFrontLeft':
            const diagonal4 = Math.sqrt(width * width + depth * depth);
            const distanceFromStart4 = Math.sqrt((width - x) * (width - x) + (depth - y) * (depth - y));
            const normalizedDistance4 = distanceFromStart4 / diagonal4;
            return baseElevation + normalizedDistance4 * slopeDecimal * diagonal4;
            
        default:
            return baseElevation;
    }
}

function getColorForElevation(elevation, minElevation, maxElevation) {
    if (maxElevation === minElevation) {
        return 'rgba(0, 123, 255, 0.3)';
    }
    
    const normalized = (elevation - minElevation) / (maxElevation - minElevation);
    const opacity = 0.2 + normalized * 0.6;
    return `rgba(0, 123, 255, ${opacity})`;
}

function feetInchesToDecimal(feet, inches) {
    return feet + (inches / 12.0);
}

function decimalToFeetInches(decimal) {
    const feet = Math.floor(decimal);
    const inches = (decimal - feet) * 12.0;
    return { feet, inches };
}

function updateSlopeDisplay() {
    const slopePercentage = parseFloat(document.getElementById('slopePercentage').value) || 0;
    const feetPer100 = slopePercentage;
    const inchesPer10 = slopePercentage * 1.2;
    
    document.getElementById('slopeDisplay').textContent = 
        `${slopePercentage}% equals ${feetPer100.toFixed(1)} Ft per 100 Ft / ${inchesPer10.toFixed(1)} In per 10 Ft`;
}

function generateGrid() {
    const width = parseFloat(document.getElementById('width').value);
    const depth = parseFloat(document.getElementById('depth').value);
    const gridSize = parseFloat(document.getElementById('gridSize').value);
    const baseElevationFt = parseFloat(document.getElementById('baseElevationFt').value);
    const baseElevationIn = parseFloat(document.getElementById('baseElevationIn').value);
    const baseElevation = feetInchesToDecimal(baseElevationFt, baseElevationIn);
    const slopePercentage = parseFloat(document.getElementById('slopePercentage').value);
    const slopeDirection = document.getElementById('slopeDirection').value;
    
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(depth / gridSize);
    
    let grid = [];
    let allElevations = [];
    
    // Calculate all elevations
    for (let row = 0; row < rows; row++) {
        let rowData = [];
        for (let col = 0; col < cols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            const elevation = calculateElevation(x, y, width, depth, baseElevation, slopePercentage, slopeDirection);
            rowData.push(elevation);
            allElevations.push(elevation);
        }
        grid.push(rowData);
    }
    
    // Find min and max for color scaling
    const minElevation = Math.min(...allElevations);
    const maxElevation = Math.max(...allElevations);
    
    // Generate HTML
    const gridContainer = document.getElementById('gridContainer');
    const elevationGrid = document.getElementById('elevationGrid');
    
    let html = '';
    for (let row = 0; row < rows; row++) {
        html += '<div class="grid-row">';
        for (let col = 0; col < cols; col++) {
            const elevation = grid[row][col];
            const { feet, inches } = decimalToFeetInches(elevation);
            const color = getColorForElevation(elevation, minElevation, maxElevation);
            html += `
                <div class="grid-cell" style="background-color: ${color}">
                    <div class="elevation-value">${feet}'${inches.toFixed(1)}"</div>
                </div>
            `;
        }
        html += '</div>';
    }
    
    elevationGrid.innerHTML = html;
    
    // Calculate and display deltas
    const deltaAcrossWidth = calculateDeltaAcrossWidth(width, depth, baseElevation, slopePercentage, slopeDirection);
    const deltaAcrossDepth = calculateDeltaAcrossDepth(width, depth, baseElevation, slopePercentage, slopeDirection);
    const deltaDiagonal = calculateDeltaDiagonal(width, depth, baseElevation, slopePercentage, slopeDirection);
    
    displayDeltas(deltaAcrossWidth, deltaAcrossDepth, deltaDiagonal, slopeDirection);
    
    gridContainer.style.display = 'block';
}

function calculateDeltaAcrossWidth(width, depth, baseElevation, slopePercentage, slopeDirection) {
    const leftEdge = calculateElevation(0, depth/2, width, depth, baseElevation, slopePercentage, slopeDirection);
    const rightEdge = calculateElevation(width, depth/2, width, depth, baseElevation, slopePercentage, slopeDirection);
    return Math.abs(rightEdge - leftEdge);
}

function calculateDeltaAcrossDepth(width, depth, baseElevation, slopePercentage, slopeDirection) {
    const frontEdge = calculateElevation(width/2, 0, width, depth, baseElevation, slopePercentage, slopeDirection);
    const backEdge = calculateElevation(width/2, depth, width, depth, baseElevation, slopePercentage, slopeDirection);
    return Math.abs(backEdge - frontEdge);
}

function calculateDeltaDiagonal(width, depth, baseElevation, slopePercentage, slopeDirection) {
    const diagonalDistance = Math.sqrt(width * width + depth * depth);
    
    let startCorner, endCorner;
    
    switch (slopeDirection) {
        case 'frontLeftToBackRight':
            startCorner = calculateElevation(0, 0, width, depth, baseElevation, slopePercentage, slopeDirection);
            endCorner = calculateElevation(width, depth, width, depth, baseElevation, slopePercentage, slopeDirection);
            break;
        case 'frontRightToBackLeft':
            startCorner = calculateElevation(width, 0, width, depth, baseElevation, slopePercentage, slopeDirection);
            endCorner = calculateElevation(0, depth, width, depth, baseElevation, slopePercentage, slopeDirection);
            break;
        case 'backLeftToFrontRight':
            startCorner = calculateElevation(0, depth, width, depth, baseElevation, slopePercentage, slopeDirection);
            endCorner = calculateElevation(width, 0, width, depth, baseElevation, slopePercentage, slopeDirection);
            break;
        case 'backRightToFrontLeft':
            startCorner = calculateElevation(width, depth, width, depth, baseElevation, slopePercentage, slopeDirection);
            endCorner = calculateElevation(0, 0, width, depth, baseElevation, slopePercentage, slopeDirection);
            break;
        default:
            return 0;
    }
    
    return Math.abs(endCorner - startCorner);
}

function displayDeltas(deltaWidth, deltaDepth, deltaDiagonal, slopeDirection) {
    const widthFeetInches = decimalToFeetInches(deltaWidth);
    const depthFeetInches = decimalToFeetInches(deltaDepth);
    const diagonalFeetInches = decimalToFeetInches(deltaDiagonal);
    
    const isDiagonal = ['frontLeftToBackRight', 'frontRightToBackLeft', 'backLeftToFrontRight', 'backRightToFrontLeft'].includes(slopeDirection);
    const diagonalDistance = Math.sqrt(parseFloat(document.getElementById('width').value) ** 2 + parseFloat(document.getElementById('depth').value) ** 2);
    
    let deltaHtml = `
        <div style="margin-top: 15px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Elevation Deltas</h4>
            <div><strong>Across Width (${document.getElementById('width').value} ft):</strong> ${widthFeetInches.feet}'${widthFeetInches.inches.toFixed(1)}"</div>
            <div><strong>Across Depth (${document.getElementById('depth').value} ft):</strong> ${depthFeetInches.feet}'${depthFeetInches.inches.toFixed(1)}"</div>`;
    
    if (isDiagonal) {
        deltaHtml += `<div style="color: #d63384; font-weight: bold;"><strong>Diagonal (${diagonalDistance.toFixed(1)} ft):</strong> ${diagonalFeetInches.feet}'${diagonalFeetInches.inches.toFixed(1)}"</div>`;
    }
    
    deltaHtml += `</div>`;
    
    // Remove existing delta display if it exists
    const existingDelta = document.getElementById('deltaDisplay');
    if (existingDelta) {
        existingDelta.remove();
    }
    
    // Add new delta display
    const deltaDiv = document.createElement('div');
    deltaDiv.id = 'deltaDisplay';
    deltaDiv.innerHTML = deltaHtml;
    document.getElementById('gridContainer').appendChild(deltaDiv);
}

// Initialize slope display on page load
window.onload = function() {
    updateSlopeDisplay();
};