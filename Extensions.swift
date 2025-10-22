import Foundation

extension Double {
    var feetAndInches: (feet: Int, inches: Double) {
        let feet = Int(self)
        let inches = (self - Double(feet)) * 12.0
        return (feet: feet, inches: inches)
    }
    
    var feetInchesString: String {
        let (feet, inches) = feetAndInches
        return "\(feet)'\(String(format: "%.1f", inches))\""
    }
}

extension TeeBoxModel {
    static func feetInchesToDecimal(feet: Double, inches: Double) -> Double {
        return feet + (inches / 12.0)
    }
}