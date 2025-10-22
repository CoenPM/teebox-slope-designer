# Tee Box Slope Designer

A web and iOS app for designing golf course tee box slopes with precise elevation modeling.

## Live Demo
https://coenpm.github.io/teebox-slope-designer

## Features
- **8 Slope Directions**: Front/back, left/right, and 4 diagonal options
- **Feet & Inches**: Construction-friendly input/output format
- **Real-time Calculations**: Shows slope percentages as practical measurements
- **Elevation Deltas**: Total elevation changes across all dimensions
- **Visual Grid**: Color-coded elevation display

## Quick Start
1. Open `index.html` in any browser
2. Set tee box dimensions and slope parameters
3. Click "Generate Elevation Grid"
4. View elevation measurements and deltas

## Development
- **Web**: Pure HTML/CSS/JavaScript
- **iOS**: SwiftUI (files included)
- **Updates**: Run `update.bat` to deploy to GitHub Pages

## Key Calculations
- Linear slopes: `elevation = base + (distance/total) * slope * total`
- Diagonal slopes: `distance = √(x² + y²)` along diagonal path
- Deltas: Absolute difference between min/max elevations

## Future Roadmap
- AR integration for real tee box scanning
- 3D surface modeling
- Construction export formats