import React from 'react';
import type { BoardingPoint, DroppingPoint } from '../../types/seatSelection';
import { useSeatSelectionStore } from '../../store/seatSelectionStore';
import { MapPin, Clock } from 'lucide-react';

interface PointsSelectionProps {
  boardingPoints: BoardingPoint[];
  droppingPoints: DroppingPoint[];
}

export const PointsSelection: React.FC<PointsSelectionProps> = ({ 
  boardingPoints, 
  droppingPoints 
}) => {
  const { selectedBoardingPoint, selectedDroppingPoint, setBoardingPoint, setDroppingPoint } = useSeatSelectionStore();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
        Boarding & Dropping Points
      </h2>

      <div className="space-y-6">
        {/* Boarding Points */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Boarding Points</h3>
          <div className="space-y-2">
            {boardingPoints.map((point) => (
              <label key={point.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="boarding"
                  value={point.id}
                  checked={selectedBoardingPoint?.id === point.id}
                  onChange={() => setBoardingPoint(point)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{point.name}</span>
                    <span className="text-sm text-blue-600 font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {point.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Dropping Points */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-3">Dropping Points</h3>
          <div className="space-y-2">
            {droppingPoints.map((point) => (
              <label key={point.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="dropping"
                  value={point.id}
                  checked={selectedDroppingPoint?.id === point.id}
                  onChange={() => setDroppingPoint(point)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{point.name}</span>
                    <span className="text-sm text-blue-600 font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {point.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{point.address}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};