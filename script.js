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
            const distanceAlongDiagonal1 = (x / width + y / depth) / 2.0;
            return baseElevation + distanceAlongDiagonal1 * slopeDecimal * diagonal1;
            
        case 'frontRightToBackLeft':
            const diagonal2 = Math.sqrt(width * width + depth * depth);
            const distanceAlongDiagonal2 = ((width - x) / width + y / depth) / 2.0;
            return baseElevation + distanceAlongDiagonal2 * slopeDecimal * diagonal2;
            
        case 'backLeftToFrontRight':
            const diagonal3 = Math.sqrt(width * width + depth * depth);
            const distanceAlongDiagonal3 = (x / width + (depth - y) / depth) / 2.0;
            return baseElevation + distanceAlongDiagonal3 * slopeDecimal * diagonal3;
            
        case 'backRightToFrontLeft':
            const diagonal4 = Math.sqrt(width * width + depth * depth);
            const distanceAlongDiagonal4 = ((width - x) / width + (depth - y) / depth) / 2.0;
            return baseElevation + distanceAlongDiagonal4 * slopeDecimal * diagonal4;
            
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
    gridContainer.style.display = 'block';
}