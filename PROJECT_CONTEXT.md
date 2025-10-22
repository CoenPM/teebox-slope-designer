# Tee Box Slope Designer - Project Context

## Project Overview
iPad app for golf course construction - design tee box slopes with visual elevation modeling.

## Current Status
- **Web prototype**: https://coenpm.github.io/teebox-slope-designer
- **iOS app**: Swift files created (ContentView.swift, TeeBoxModel.swift, TeeBoxApp.swift)
- **Repository**: https://github.com/CoenPM/teebox-slope-designer.git

## Key Features Implemented
- Configurable tee box dimensions (width × depth)
- 8 slope directions (4 linear + 4 diagonal)
- Feet/inches input and display
- Dynamic slope calculator (% to ft/in conversions)
- Elevation deltas across width, depth, and diagonal
- Color-coded grid visualization

## Technical Architecture
- **Web**: Pure HTML/CSS/JavaScript (no dependencies)
- **iOS**: SwiftUI + ObservableObject pattern
- **Calculations**: Linear interpolation for slopes, diagonal distance calculations
- **Hosting**: GitHub Pages with automated deployment

## Default Values
- Width: 30 ft, Depth: 100 ft, Grid: 10 ft
- Base elevation: 0 ft 0 in, Slope: 1%

## Future Vision
- AR/LiDAR integration for real tee box scanning
- 3D surface modeling with camera input
- Export to construction formats

## Development Setup
- Local: d:\TeeBoxMap\
- Updates: Run update.bat to deploy
- Remote development: Mac mini + VS Code SSH for iOS

## Key Learnings
- Diagonal slopes need proper distance calculations along diagonal path
- Construction industry prefers feet/inches over decimal feet
- Visual heat maps were too complex - simple grid works better
- Delta calculations essential for practical construction use