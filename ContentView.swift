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
                        TextField("Elevation", value: $teeBoxModel.baseElevation, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                        Text("ft")
                    }
                    
                    HStack {
                        Text("Slope (%):")
                        TextField("Slope", value: $teeBoxModel.slopePercentage, format: .number)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .keyboardType(.decimalPad)
                    }
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
                            Text(String(format: "%.1f", grid[row][col]))
                                .font(.caption2)
                                .fontWeight(.semibold)
                            Text("ft")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                        .frame(width: 60, height: 50)
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