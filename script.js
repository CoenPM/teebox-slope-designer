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

function getOriginPoint(slopeDirection, width, depth) {
    const baseElevationFt = parseFloat(document.getElementById('baseElevationFt').value);
    const baseElevationIn = parseFloat(document.getElementById('baseElevationIn').value);
    const baseElevation = baseElevationFt + (baseElevationIn / 12.0);
    const { feet, inches } = decimalToFeetInches(baseElevation);
    const label = `${feet}'${inches.toFixed(1)}"`;
    
    switch (slopeDirection) {
        case 'frontToBack':
        case 'leftToRight':
        case 'frontLeftToBackRight':
            return { x: 0, y: 0, label };
        case 'backToFront':
        case 'backLeftToFrontRight':
            return { x: 0, y: depth, label };
        case 'rightToLeft':
        case 'frontRightToBackLeft':
            return { x: width, y: 0, label };
        case 'backRightToFrontLeft':
            return { x: width, y: depth, label };
        default:
            return { x: 0, y: 0, label };
    }
}

function createSurveyGrid(grid, width, depth, gridSize, slopeDirection) {
    const cols = Math.floor(width / gridSize) + 1;  // 0, 10, 20, 30 = 4 points
    const rows = Math.floor(depth / gridSize) + 1;  // 0, 10, 20, ..., 100 = 11 points
    
    // Make container proportional to actual dimensions
    const maxDimension = Math.max(width, depth);
    const containerWidth = Math.round((width / maxDimension) * 500) + 100;  // Add padding for labels
    const containerHeight = Math.round((depth / maxDimension) * 500) + 100;
    
    const gridStartX = 80;  // More space for vertical measuring stick
    const gridStartY = 80;  // Much more space for horizontal measuring stick
    const scaleX = (containerWidth - gridStartX - 20) / width;
    const scaleY = (containerHeight - gridStartY - 20) / depth;
    
    let html = `<div style="width: ${containerWidth}px; height: ${containerHeight}px; position: relative; margin: 50px;">`;
    
    // Draw grid lines
    for (let row = 0; row < rows; row++) {
        const y = gridStartY + (row * gridSize * scaleY);
        html += `<div class="grid-line" style="left: ${gridStartX}px; top: ${y}px; width: ${containerWidth - gridStartX - 20}px; height: 1px;"></div>`;
    }
    
    for (let col = 0; col < cols; col++) {
        const x = gridStartX + (col * gridSize * scaleX);
        html += `<div class="grid-line" style="left: ${x}px; top: ${gridStartY}px; width: 1px; height: ${containerHeight - gridStartY - 20}px;"></div>`;
    }
    
    // Draw survey points with elevations
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = gridStartX + (col * gridSize * scaleX);
            const y = gridStartY + (row * gridSize * scaleY);
            
            // Calculate elevation for this actual point
            const actualX = col * gridSize;
            const actualY = row * gridSize;
            const elevation = calculateElevation(actualX, actualY, width, depth, 
                parseFloat(document.getElementById('baseElevationFt').value) + 
                parseFloat(document.getElementById('baseElevationIn').value) / 12,
                parseFloat(document.getElementById('slopePercentage').value),
                slopeDirection
            );
            const { feet, inches } = decimalToFeetInches(elevation);
            
            html += `
                <div class="survey-point" style="left: ${x}px; top: ${y}px;"></div>
                <div class="elevation-label" style="left: ${x}px; top: ${y}px;">
                    ${feet}'${inches.toFixed(1)}"
                </div>
            `;
        }
    }
    
    // Calculate rise/fall for measuring sticks - use front edge for consistent measurement
    const leftEdge = calculateElevation(0, 0, width, depth, 
        parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12,
        parseFloat(document.getElementById('slopePercentage').value), slopeDirection);
    const rightEdge = calculateElevation(width, 0, width, depth, 
        parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12,
        parseFloat(document.getElementById('slopePercentage').value), slopeDirection);
    const frontEdge = calculateElevation(0, 0, width, depth, 
        parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12,
        parseFloat(document.getElementById('slopePercentage').value), slopeDirection);
    const backEdge = calculateElevation(0, depth, width, depth, 
        parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12,
        parseFloat(document.getElementById('slopePercentage').value), slopeDirection);
    
    const widthDelta = Math.abs(rightEdge - leftEdge);
    const depthDelta = Math.abs(backEdge - frontEdge);
    const widthDeltaFI = decimalToFeetInches(widthDelta);
    const depthDeltaFI = decimalToFeetInches(depthDelta);
    
    // Add measuring sticks with rise/fall
    html += `<div class="measuring-stick" style="left: ${gridStartX}px; top: 10px; width: ${containerWidth - gridStartX - 20}px; height: 35px;">${width} ft<br>Δ ${widthDeltaFI.feet}'${widthDeltaFI.inches.toFixed(1)}"</div>`;
    html += `<div class="measuring-stick" style="left: 5px; top: ${gridStartY}px; width: 50px; height: ${containerHeight - gridStartY - 20}px; writing-mode: vertical-rl;">${depth} ft | Δ ${depthDeltaFI.feet}'${depthDeltaFI.inches.toFixed(1)}"</div>`;
    
    // Add origin marker
    const origin = getOriginPoint(slopeDirection, width, depth);
    const originX = gridStartX + (origin.x / width) * (containerWidth - gridStartX - 20);
    const originY = gridStartY + (origin.y / depth) * (containerHeight - gridStartY - 20);
    
    html += `
        <div class="origin-marker" style="left: ${originX}px; top: ${originY}px;"></div>
        <div class="origin-label" style="left: ${originX}px; top: ${originY}px;">${origin.label}</div>
    `;
    
    html += '</div>';
    
    // Add 3D surface plot
    html += create3DSurfacePlot(width, depth, gridSize, slopeDirection);
    
    // Render the 3D plot after DOM update
    setTimeout(() => {
        render3DPlot(width, depth, gridSize, slopeDirection);
    }, 200);
    
    return html;
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
    
    const surveyHtml = createSurveyGrid(grid, width, depth, gridSize, slopeDirection);
    elevationGrid.innerHTML = surveyHtml;
    
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

function create3DSurfacePlot(width, depth, gridSize, slopeDirection) {
    const baseElevation = parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12;
    const slopePercentage = parseFloat(document.getElementById('slopePercentage').value);
    
    // Create high-resolution surface data
    const resolution = 20; // 20x20 grid for smooth surface
    const x = [];
    const y = [];
    const z = [];
    
    for (let i = 0; i <= resolution; i++) {
        const xVal = (i / resolution) * width;
        x.push(xVal);
        
        const zRow = [];
        for (let j = 0; j <= resolution; j++) {
            const yVal = (j / resolution) * depth;
            if (i === 0) y.push(yVal); // Only add y values once
            
            const elevation = calculateElevation(xVal, yVal, width, depth, baseElevation, slopePercentage, slopeDirection);
            zRow.push(elevation);
        }
        z.push(zRow);
    }
    
    // Create the 3D surface plot
    const surfaceData = [{
        x: x,
        y: y,
        z: z,
        type: 'surface',
        colorscale: [
            [0, '#8B4513'],    // Brown (low)
            [0.3, '#DAA520'],  // Goldenrod
            [0.6, '#9ACD32'],  // Yellow-green
            [1, '#228B22']     // Forest green (high)
        ],
        contours: {
            z: {
                show: true,
                usecolormap: true,
                highlightcolor: "#42f462",
                project: { z: true }
            }
        },
        showscale: true,
        colorbar: {
            title: 'Elevation (ft)',
            titleside: 'right'
        }
    }];
    
    const layout = {
        title: '3D Tee Box Surface',
        scene: {
            xaxis: { title: 'Width (ft)' },
            yaxis: { title: 'Depth (ft)' },
            zaxis: { title: 'Elevation (ft)' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            }
        },
        width: 700,
        height: 500,
        margin: { l: 0, r: 0, b: 0, t: 30 }
    };
    
    const config = {
        displayModeBar: true,
        modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d'],
        displaylogo: false
    };
    
    // Return HTML container only
    return `
        <div style="margin-top: 30px;">
            <h4 style="margin-bottom: 15px; color: #2c3e50;">3D Surface Plot</h4>
            <div id="surface-plot" style="width: 700px; height: 500px; margin: 0 auto; border: 1px solid #ccc;"></div>
            <div style="margin-top: 10px; font-size: 12px; color: #666; text-align: center;">
                <strong>Interactive 3D Surface:</strong> Drag to rotate, scroll to zoom, hover for elevation values
            </div>
        </div>
    `;
}

function render3DPlot(width, depth, gridSize, slopeDirection) {
    const baseElevation = parseFloat(document.getElementById('baseElevationFt').value) + 
        parseFloat(document.getElementById('baseElevationIn').value) / 12;
    const slopePercentage = parseFloat(document.getElementById('slopePercentage').value);
    
    // Create high-resolution surface data
    const resolution = 20;
    const x = [];
    const y = [];
    const z = [];
    
    // Build X array (plot coordinates)
    for (let i = 0; i <= resolution; i++) {
        const gridX = (i / resolution) * width;
        const plotX = width - gridX;  // Flip for display
        x.push(plotX);
    }
    
    // Build Y array
    for (let j = 0; j <= resolution; j++) {
        const yVal = (j / resolution) * depth;
        y.push(yVal);
    }
    
    // Build Z array as [row][column] where row=Y, column=X
    for (let j = 0; j <= resolution; j++) {  // Y direction (rows)
        const yVal = (j / resolution) * depth;
        const zRow = [];
        
        for (let i = 0; i <= resolution; i++) {  // X direction (columns)
            const gridX = (i / resolution) * width;
            const elevation = calculateElevation(gridX, yVal, width, depth, baseElevation, slopePercentage, slopeDirection);
            zRow.push(elevation);
            

        }
        z.push(zRow);
    }
    
    // Calculate elevation range for scaling
    const flatZ = z.flat();
    const minZ = Math.min(...flatZ);
    const maxZ = Math.max(...flatZ);
    const zRange = maxZ - minZ;
    
    // Moderate Z-axis exaggeration to show realistic slope
    const zExaggeration = Math.max(width, depth) / (zRange * 50); // Much less exaggeration
    
    // Get the actual slope origin coordinates and transform to plot coordinates
    const origin = getOriginPoint(slopeDirection, width, depth);
    const plotOriginX = width - origin.x;  // Flip X: Grid to Plot
    const originElevation = calculateElevation(origin.x, origin.y, width, depth, baseElevation, slopePercentage, slopeDirection);
    
    const surfaceData = [{
        x: x,
        y: y,
        z: z,
        type: 'surface',
        colorscale: [
            [0, '#8B4513'],
            [0.3, '#DAA520'],
            [0.6, '#9ACD32'],
            [1, '#228B22']
        ],
        contours: {
            z: {
                show: true,
                usecolormap: true,
                project: { z: true }
            }
        },
        showscale: true,
        colorbar: {
            title: 'Elevation (ft)',
            titleside: 'right'
        }
    }, {
        x: [plotOriginX],
        y: [origin.y],
        z: [originElevation],
        type: 'scatter3d',
        mode: 'markers+text',
        marker: {
            size: 12,
            color: 'red'
        },
        text: ['ORIGIN'],
        textposition: 'top center',
        name: 'Origin Point',
        showlegend: false
    }];
    
    const layout = {
        title: `3D Tee Box Surface (Z-axis exaggerated ${zExaggeration.toFixed(1)}x)`,
        scene: {
            xaxis: { 
                title: 'Width (ft)',
                range: [0, width]
            },
            yaxis: { 
                title: 'Depth (ft)',
                range: [0, depth]
            },
            zaxis: { 
                title: 'Elevation (ft)',
                range: [minZ - zRange * 0.1, maxZ + zRange * 0.1]
            },
            aspectmode: 'manual',
            aspectratio: {
                x: 1,
                y: depth / width,
                z: zExaggeration * (zRange / width)
            },
            camera: {
                eye: { x: 1.8, y: 1.8, z: 1.5 }
            }
        },
        width: 700,
        height: 500,
        margin: { l: 0, r: 0, b: 0, t: 50 }
    };
    
    const config = {
        displayModeBar: true,
        displaylogo: false
    };
    
    // Check if Plotly is loaded and element exists
    if (typeof Plotly !== 'undefined' && document.getElementById('surface-plot')) {
        // Clear any existing plot first
        Plotly.purge('surface-plot');
        Plotly.newPlot('surface-plot', surfaceData, layout, config);
    } else {
        console.error('Plotly not loaded or element not found');
    }
}

// Initialize slope display on page load
window.onload = function() {
    updateSlopeDisplay();
};