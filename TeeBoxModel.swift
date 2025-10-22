import Foundation

enum SlopeDirection: String, CaseIterable {
    case frontToBack = "Front to Back"
    case backToFront = "Back to Front"
    case leftToRight = "Left to Right"
    case rightToLeft = "Right to Left"
    case frontLeftToBackRight = "Front-Left to Back-Right"
    case frontRightToBackLeft = "Front-Right to Back-Left"
    case backLeftToFrontRight = "Back-Left to Front-Right"
    case backRightToFrontLeft = "Back-Right to Front-Left"
}

class TeeBoxModel: ObservableObject {
    @Published var width: Double = 30.0
    @Published var depth: Double = 100.0
    @Published var gridSize: Double = 10.0
    @Published var baseElevationFt: Double = 0.0
    @Published var baseElevationIn: Double = 0.0
    @Published var slopePercentage: Double = 1.0
    @Published var slopeDirection: SlopeDirection = .frontToBack
    @Published var elevationGrid: [[Double]] = []
    @Published var deltaAcrossWidth: Double = 0.0
    @Published var deltaAcrossDepth: Double = 0.0
    @Published var deltaDiagonal: Double = 0.0
    
    var baseElevation: Double {
        baseElevationFt + (baseElevationIn / 12.0)
    }
    
    var slopeDisplayText: String {
        let feetPer100 = slopePercentage
        let inchesPer10 = slopePercentage * 1.2
        return "\(slopePercentage, specifier: "%.1f")% equals \(feetPer100, specifier: "%.1f") Ft per 100 Ft / \(inchesPer10, specifier: "%.1f") In per 10 Ft"
    }
    
    func generateElevationGrid() {
        let cols = Int(ceil(width / gridSize))
        let rows = Int(ceil(depth / gridSize))
        
        var grid: [[Double]] = []
        
        for row in 0..<rows {
            var rowData: [Double] = []
            
            for col in 0..<cols {
                let x = Double(col) * gridSize  // Left to Right position
                let y = Double(row) * gridSize  // Front to Back position
                
                let elevation = calculateElevation(x: x, y: y)
                rowData.append(elevation)
            }
            
            grid.append(rowData)
        }
        
        elevationGrid = grid
        
        // Calculate deltas
        deltaAcrossWidth = calculateDeltaAcrossWidth()
        deltaAcrossDepth = calculateDeltaAcrossDepth()
        deltaDiagonal = calculateDeltaDiagonal()
    }
    
    private func calculateElevation(x: Double, y: Double) -> Double {
        let slopeDecimal = slopePercentage / 100.0
        
        switch slopeDirection {
        case .frontToBack:
            return baseElevation + (y / depth) * slopeDecimal * depth
            
        case .backToFront:
            return baseElevation + ((depth - y) / depth) * slopeDecimal * depth
            
        case .leftToRight:
            return baseElevation + (x / width) * slopeDecimal * width
            
        case .rightToLeft:
            return baseElevation + ((width - x) / width) * slopeDecimal * width
            
        case .frontLeftToBackRight:
            let diagonal = sqrt(width * width + depth * depth)
            let distanceAlongDiagonal = (x / width + y / depth) / 2.0
            return baseElevation + distanceAlongDiagonal * slopeDecimal * diagonal
            
        case .frontRightToBackLeft:
            let diagonal = sqrt(width * width + depth * depth)
            let distanceAlongDiagonal = ((width - x) / width + y / depth) / 2.0
            return baseElevation + distanceAlongDiagonal * slopeDecimal * diagonal
            
        case .backLeftToFrontRight:
            let diagonal = sqrt(width * width + depth * depth)
            let distanceAlongDiagonal = (x / width + (depth - y) / depth) / 2.0
            return baseElevation + distanceAlongDiagonal * slopeDecimal * diagonal
            
        case .backRightToFrontLeft:
            let diagonal = sqrt(width * width + depth * depth)
            let distanceAlongDiagonal = ((width - x) / width + (depth - y) / depth) / 2.0
            return baseElevation + distanceAlongDiagonal * slopeDecimal * diagonal
        }
    }
    
    private func calculateDeltaAcrossWidth() -> Double {
        let leftEdge = calculateElevation(x: 0, y: depth/2)
        let rightEdge = calculateElevation(x: width, y: depth/2)
        return abs(rightEdge - leftEdge)
    }
    
    private func calculateDeltaAcrossDepth() -> Double {
        let frontEdge = calculateElevation(x: width/2, y: 0)
        let backEdge = calculateElevation(x: width/2, y: depth)
        return abs(backEdge - frontEdge)
    }
    
    private func calculateDeltaDiagonal() -> Double {
        let isDiagonal = [SlopeDirection.frontLeftToBackRight, .frontRightToBackLeft, .backLeftToFrontRight, .backRightToFrontLeft].contains(slopeDirection)
        
        guard isDiagonal else { return 0.0 }
        
        let startCorner: Double
        let endCorner: Double
        
        switch slopeDirection {
        case .frontLeftToBackRight:
            startCorner = calculateElevation(x: 0, y: 0)
            endCorner = calculateElevation(x: width, y: depth)
        case .frontRightToBackLeft:
            startCorner = calculateElevation(x: width, y: 0)
            endCorner = calculateElevation(x: 0, y: depth)
        case .backLeftToFrontRight:
            startCorner = calculateElevation(x: 0, y: depth)
            endCorner = calculateElevation(x: width, y: 0)
        case .backRightToFrontLeft:
            startCorner = calculateElevation(x: width, y: depth)
            endCorner = calculateElevation(x: 0, y: 0)
        default:
            return 0.0
        }
        
        return abs(endCorner - startCorner)
    }
}