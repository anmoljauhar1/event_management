import { useEffect, useState } from 'react';
import { WS_URL } from '../../api/axios';

const SeatSelector = ({
  seats,
  selected,
  onSelect,
  hallId
}) => {
  const [seatsState, setSeatsState] = useState(seats);

  useEffect(() => {
    setSeatsState(seats);
  }, [seats]);

  useEffect(() => {
    if (!hallId) return;

    const ws = new WebSocket(
      `${WS_URL}/ws/seat-availability/${hallId}/`
    );

    ws.onmessage = (event) => {
      const updatedSeats = JSON.parse(event.data);

      setSeatsState(updatedSeats);
    };

    ws.onerror = (error) => {
      console.log('WebSocket Error:', error);
    };

    return () => ws.close();
  }, [hallId]);

  const toggleSeat = (seatId) => {
    if (selected.includes(seatId)) {
      onSelect(
        selected.filter(id => id !== seatId)
      );
    } else {
      onSelect([
        ...selected,
        seatId
      ]);
    }
  };

  const rows = seatsState.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }

    acc[seat.row].push(seat);

    return acc;
  }, {});

  return (
    <div className="space-y-2">
      {Object.entries(rows).map(
        ([row, rowSeats]) => (
          <div
            key={row}
            className="flex items-center space-x-2"
          >
            <span className="w-10 font-mono text-sm">
              {row}
            </span>

            <div className="flex space-x-1">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  type="button"
                  disabled={!seat.is_active}
                  onClick={() =>
                    seat.is_active &&
                    toggleSeat(seat.id)
                  }
                  className={`w-8 h-8 rounded text-xs ${
                    !seat.is_active
                      ? 'bg-gray-300 cursor-not-allowed'
                      : selected.includes(seat.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        )
      )}

      {seatsState.length === 0 && (
        <p>
          No seats available for selection.
        </p>
      )}
    </div>
  );
};

export default SeatSelector;