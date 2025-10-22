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
    @Published var width: Double = 60.0
    @Published var depth: Double = 40.0
    @Published var gridSize: Double = 10.0
    @Published var baseElevation: Double = 100.0
    @Published var slopePercentage: Double = 2.0
    @Published var slopeDirection: SlopeDirection = .frontToBack
    @Published var elevationGrid: [[Double]] = []
    
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
}