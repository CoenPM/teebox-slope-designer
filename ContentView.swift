import SwiftUI

struct ContentView: View {
    @StateObject private var teeBoxModel = TeeBoxModel()
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Text("Tee Box Slope Designer")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                // Dimensions Section
                VStack(alignment: .leading, spacing: 15) {
                    Text("Tee Box Dimensions")
                        .font(.headline)
                    
                    HStack {
                        Text("Width (ft):")
                        TextField("Width", value: $teeBoxModel.width, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                    }
                    
                    HStack {
                        Text("Depth (ft):")
                        TextField("Depth", value: $teeBoxModel.depth, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                    }
                    
                    HStack {
                        Text("Grid Size (ft):")
                        TextField("Grid Size", value: $teeBoxModel.gridSize, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
                
                // Elevation Section
                VStack(alignment: .leading, spacing: 15) {
                    Text("Elevation Settings")
                        .font(.headline)
                    
                    VStack(alignment: .leading) {
                        Text("Slope Direction:")
                        Picker("Slope Direction", selection: $teeBoxModel.slopeDirection) {
                            ForEach(SlopeDirection.allCases, id: \.self) { direction in
                                Text(direction.rawValue).tag(direction)
                            }
                        }
                        .pickerStyle(MenuPickerStyle())
                    }
                    
                    HStack {
                        Text("Base Elevation:")
                        TextField("Ft", value: $teeBoxModel.baseElevationFt, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                            .frame(width: 60)
                        Text("ft")
                        TextField("In", value: $teeBoxModel.baseElevationIn, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                            .frame(width: 60)
                        Text("in")
                    }
                    
                    HStack {
                        Text("Slope (%):")
                        TextField("Slope", value: $teeBoxModel.slopePercentage, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                    }
                    
                    Text(teeBoxModel.slopeDisplayText)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .italic()
                }
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(10)
                
                // Generate Button
                Button("Generate Elevation Grid") {
                    teeBoxModel.generateElevationGrid()
                }
                .buttonStyle(.borderedProminent)
                .font(.headline)
                
                // Grid View
                if !teeBoxModel.elevationGrid.isEmpty {
                    ScrollView([.horizontal, .vertical]) {
                        ElevationGridView(grid: teeBoxModel.elevationGrid, gridSize: teeBoxModel.gridSize)
                    }
                    .frame(maxHeight: 400)
                    
                    // Delta Display
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Elevation Deltas")
                            .font(.headline)
                        
                        HStack {
                            Text("Across Width (\(teeBoxModel.width, specifier: "%.0f") ft):")
                            Spacer()
                            Text(teeBoxModel.deltaAcrossWidth.feetInchesString)
                                .fontWeight(.semibold)
                        }
                        
                        HStack {
                            Text("Across Depth (\(teeBoxModel.depth, specifier: "%.0f") ft):")
                            Spacer()
                            Text(teeBoxModel.deltaAcrossDepth.feetInchesString)
                                .fontWeight(.semibold)
                        }
                        
                        if teeBoxModel.deltaDiagonal > 0 {
                            let diagonalDistance = sqrt(teeBoxModel.width * teeBoxModel.width + teeBoxModel.depth * teeBoxModel.depth)
                            HStack {
                                Text("Diagonal (\(diagonalDistance, specifier: "%.1f") ft):")
                                Spacer()
                                Text(teeBoxModel.deltaDiagonal.feetInchesString)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.red)
                            }
                        }
                    }
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(10)
                }
                
                Spacer()
            }
            .padding()
        }
    }
}

struct ElevationGridView: View {
    let grid: [[Double]]
    let gridSize: Double
    
    var body: some View {
        VStack(spacing: 2) {
            ForEach(0..<grid.count, id: \.self) { row in
                HStack(spacing: 2) {
                    ForEach(0..<grid[row].count, id: \.self) { col in
                        VStack {
                            Text(grid[row][col].feetInchesString)
                                .font(.caption2)
                                .fontWeight(.semibold)
                        }
                        .frame(width: 70, height: 50)
                        .background(colorForElevation(grid[row][col]))
                        .cornerRadius(4)
                    }
                }
            }
        }
        .padding()
    }
    
    private func colorForElevation(_ elevation: Double) -> Color {
        let allElevations = grid.flatMap { $0 }
        let minElevation = allElevations.min() ?? 0
        let maxElevation = allElevations.max() ?? 0
        
        if maxElevation == minElevation { return Color.blue.opacity(0.3) }
        
        let normalized = (elevation - minElevation) / (maxElevation - minElevation)
        return Color.blue.opacity(0.2 + normalized * 0.6)
    }
}

#Preview {
    ContentView()
}