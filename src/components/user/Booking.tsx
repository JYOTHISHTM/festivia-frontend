import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from '../layout/user/HomeNavbar'

import { userService } from '../../services/user/userService';
import Swal from 'sweetalert2';

interface SeatLayout {
  layoutType: string;
  totalSeats: number;
  normalPrice?: number;
  balconyPrices?: {
    normal: number;
    premium: number;
  };
  reclanarPrices?: {
    reclanar: number;
    reclanarPlus: number;
  };
  seats: Array<{
    seatNumber: string;
    type: 'normal' | 'premium' | 'reclanar' | 'reclanarPlus';
    isBooked: boolean;
  }>;
}

interface EventData {
  _id:string
  eventName: string;
  image: string;
}

function Booking() {
  const { layoutId } = useParams<{ layoutId: string }>();
  const [layout, setLayout] = useState<SeatLayout | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe' | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

console.log("user frin t",user);


 useEffect(() => {
  const fetchData = async () => {
    const response = await userService.getLayoutWithEvent(layoutId as any);
    if (response.success) {
      setLayout(response.data.layout);
      setEvent(response.data.event);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  if (layoutId) fetchData();
}, [layoutId]);


  const navigate = useNavigate();


const handleWalletBooking = async () => {
  const payload = {
    userId: user._id || user.id,
    totalAmount: calculateTotalPrice(),
    bookingDetails: {
      eventId: event?._id,
      eventName: event?.eventName,
      selectedSeats,
      seatLayoutId: layoutId,
      date: new Date(),
    },
  };

  const response = await userService.walletTicketBooking(payload as any);

  if (response.success) {
    navigate('/user/tickets', { state: response.data.data });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Insufficient Balance',
      text: response.error || 'You do not have enough money in your wallet!',
    });
  }
};



const handleBooking = async () => {
  if (!selectedSeats.length) {
    return Swal.fire('No seats selected', 'Please select at least one seat to proceed.', 'warning');
  }

  const confirmation = await Swal.fire({
    title: 'Confirm Booking',
    html: `You selected <strong>${selectedSeats.length}</strong> seat(s) for <strong>₹${calculateTotalPrice()}</strong>. Proceed?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Book Now',
  });

  if (!confirmation.isConfirmed) return;

  if (paymentMethod === 'wallet') {
    handleWalletBooking();
  } else if (paymentMethod === 'stripe') {
    
  } else {
    Swal.fire('Select Payment Method', 'Please choose a payment method to continue.', 'info');
  }
};

  const isSeatBooked = (seatNumber: number): boolean => {
    if (!layout?.seats) return false;
    const seat = layout.seats.find(s => s.seatNumber === seatNumber.toString());
    return seat?.isBooked || false;
  };

  const seatBox = (seatNumber: number, color = 'bg-gray-400') => {
    const isSelected = selectedSeats.includes(seatNumber);
    const isBooked = isSeatBooked(seatNumber);

    let boxColor: string;
    if (isBooked) {
      boxColor = 'bg-black';
    } else if (isSelected) {
      boxColor = 'bg-green-500';
    } else {
      boxColor = color;
    }

   const toggleSeat = () => {
  if (isBooked) {
    Swal.fire({
      icon: 'warning',
      title: 'Seat Already Booked',
      text: `Seat ${seatNumber} is already booked!`,
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  const isAlreadySelected = selectedSeats.includes(seatNumber);

  if (!isAlreadySelected && selectedSeats.length >= 10) {
    Swal.fire({
      icon: 'info',
      title: 'Limit Reached',
      text: 'You can only select up to 10 seats at a time.',
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

  setSelectedSeats((prev) =>
    isAlreadySelected
      ? prev.filter((s) => s !== seatNumber)
      : [...prev, seatNumber]
  );
};


    return (
      <div
        key={seatNumber}
        className={`w-8 h-8 ${boxColor} text-white text-sm flex items-center justify-center rounded cursor-pointer relative ${isBooked ? 'cursor-not-allowed opacity-80' : 'hover:opacity-80'
          }`}
        onClick={toggleSeat}
        title={isBooked ? 'This seat is already booked' : `Seat ${seatNumber}`}
      >
        {seatNumber}
        {isBooked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-red-500">✗</span>
          </div>
        )}
      </div>
    );
  };




  const renderNormal = (totalSeats: number) => {
    const seatsPerRow = 8;
    const rows = Math.ceil(totalSeats / seatsPerRow);
    return (
      <div className="space-y-2">
        <div className="font-semibold text-center">Screen</div>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 justify-center">
            {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
              const seatNumber = rowIdx * seatsPerRow + colIdx + 1;
              if (seatNumber > totalSeats) return null;
              return seatBox(seatNumber);
            })}
          </div>
        ))}
      </div>
    );
  };


  const renderWithBalcony = (totalSeats: number) => {
    const seatsPerRow = 8;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);
    const normalRows = Math.round(totalRows * 0.7);
    const balconyRows = totalRows - normalRows;

    return (
      <div className="space-y-4">

        <div>
          <div className="text-center font-semibold">Balcony</div>
          {Array.from({ length: balconyRows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
                const seatNumber = rowIdx * seatsPerRow + colIdx + 1;
                { seatBox(seatNumber, 'premium') } // Balcony
                return seatNumber <= totalSeats ? seatBox(seatNumber, 'bg-yellow-500') : null;

              })}
            </div>
          ))}
        </div>
        <div>
          <div className="text-center font-semibold">Normal</div>
          {Array.from({ length: normalRows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-1 justify-center">
              {Array.from({ length: seatsPerRow }).map((_, colIdx) => {
                const seatNumber = balconyRows * seatsPerRow + rowIdx * seatsPerRow + colIdx + 1;
                { seatBox(seatNumber, 'normal') } // Normal
                return seatNumber <= totalSeats ? seatBox(seatNumber, 'bg-gray-500') : null;
              })}
            </div>
          ))}
        </div>
        <div className="text-center font-semibold text-white bg-black py-1 px-4  rounded"> Screen</div>
      </div>
    );
  };



  const renderReclanarLayout = (totalSeats: number) => {
    const seatsPerSet = 2;
    const setsPerRow = 4;
    const seatsPerRowLocal = seatsPerSet * setsPerRow;
    const rows = Math.ceil(totalSeats / seatsPerRowLocal);
    let seatNumber = 1;

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center font-semibold text-white bg-black py-2 px-4 rounded">Reclanar Layout - Screen</div>
        {Array.from({ length: rows }).map((_, rowIdx) => {
          const isLastRow = rowIdx >= rows - 2;
          const color = isLastRow ? 'bg-green-400' : 'bg-blue-600';
          return (
            <div key={`row-${rowIdx}`} className="flex gap-6">
              {Array.from({ length: setsPerRow }).map((_, setIdx) => {
                const setSeats = [];
                for (let i = 0; i < seatsPerSet; i++) {
                  if (seatNumber <= totalSeats) {
                    setSeats.push(seatBox(seatNumber++, color));
                  }
                }
                return (
                  <div key={`set-${rowIdx}-${setIdx}`} className="flex gap-2">
                    {setSeats}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };


  const renderCenteredScreenLayout = (totalSeats: number) => {
    const totalSides = 4;
    const seatsPerSide = totalSeats / totalSides;
    const sideSize = Math.sqrt(seatsPerSide);

    if (!Number.isInteger(sideSize)) {
      return (
        <div className="text-red-500 text-center font-semibold">
          Total seats must be a square number divisible by 4 (e.g. 64, 100, 144).
        </div>
      );
    }

    let counter = 1;

    const renderGrid = (rows: number, cols: number, color: string) => (
      Array.from({ length: rows }).map((_, i) => (
        <div key={`grid-row-${i}`} className="flex p-1 gap-2 justify-center">
          {Array.from({ length: cols }).map((_) => {
            if (counter > totalSeats) return null;
            return seatBox(counter++, color);
          })}
        </div>
      ))
    );

    const renderVerticalGrid = (rows: number, cols: number, color: string) => (
      <div
        key="vertical-grid"
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          if (counter > totalSeats) return null;
          return (
            <div key={`vertical-grid-item-${i}`} className="p-1 flex justify-center">
              {seatBox(counter++, color)}
            </div>
          );
        })}
      </div>
    );

    const side = sideSize;

    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div>{renderGrid(side, side, 'bg-blue-500')}</div>
        <div className="flex gap-4">
          <div>{renderVerticalGrid(side, side, 'bg-blue-500')}</div>
          <div
            className="flex items-center justify-center bg-black text-white font-bold rounded text-center"
            style={{ width: `${2.5 * side}rem`, height: `${2.5 * side}rem`, minWidth: '80px', minHeight: '80px' }}
          >
            Center Screen
          </div>
          <div>{renderVerticalGrid(side, side, 'bg-blue-500')}</div>
        </div>
        <div>{renderGrid(side, side, 'bg-blue-500')}</div>
      </div>
    );
  };



  const renderLayout = (layoutType: string, totalSeats: number) => {
    switch (layoutType) {
      case 'normal':
        return renderNormal(totalSeats);
      case 'withbalcony':
        return renderWithBalcony(totalSeats);
      case 'reclanar':
        return renderReclanarLayout(totalSeats);
      case 'centeredscreen':
        return renderCenteredScreenLayout(totalSeats);
      default:
        return <p>Unknown layout type</p>;
    }
  };

  const getSeatPrice = (seatNumber: number, layoutType: string) => {
    if (!layout) return 0;

    switch (layoutType) {
      case 'normal':
      case 'centeredscreen':
        return layout.normalPrice || 0;

      case 'withbalcony':
        if (!layout.balconyPrices) return 0;

        const balconyNormalSeats = Math.floor(layout.totalSeats * 0.3);

        if (seatNumber <= balconyNormalSeats) {
          return layout.balconyPrices.premium;
        } else {
          return layout.balconyPrices.normal;
        }


      case 'reclanar':
        if (!layout.reclanarPrices) return 0;

        const seatsPerRowReclanar = 8;
        // const rows = Math.ceil(layout.totalSeats / seatsPerRowReclanar);
        // const lastTwoRows = rows - 2;
        const reclanarPlusSeats = 2 * seatsPerRowReclanar;

        if (seatNumber > layout.totalSeats - reclanarPlusSeats) {
          return layout.reclanarPrices.reclanarPlus;
        } else {
          return layout.reclanarPrices.reclanar;
        }

      default:
        return 0;
    }
  };
  
  const calculateTotalPrice = () => {
    if (!layout) return 0;

    return selectedSeats.reduce((total, seatNumber) => {
      return total + getSeatPrice(seatNumber, layout.layoutType);
    }, 0);
  };


  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!layout || !event) return <div>No data found.</div>;










  
  return (


    <div className="max-w-md mx-auto p-4 text-center space-y-4">
      <HomeNavbar />
      <h2 className="text-2xl font-bold">Booking: {event.eventName}</h2>
      <img
        src={event.image}
        alt={event.eventName}
        className="w-full h-40 object-cover rounded"
      />

      <p>
        <strong>Layout:</strong> {layout.layoutType} |{' '}
        <strong>Total Seats:</strong> {layout.totalSeats}

      </p>

      {layout.layoutType === 'normal' || layout.layoutType === 'centeredscreen' ? (
        <div className="bg-gray-300 p-2 rounded-lg text-center">
          TICKET PRICE: ₹{layout.normalPrice}
        </div>
      ) : null}

      {layout.layoutType === 'withbalcony' && layout.balconyPrices && (
        <>
          <div className="bg-gray-300 p-2 rounded-lg text-center">
            Balcony Normal: ₹{layout.balconyPrices.normal}
          </div>
          <div className="bg-gray-300 p-2 rounded-lg text-center">
            Balcony Premium: ₹{layout.balconyPrices.premium}
          </div>
        </>
      )}

      {layout.layoutType === 'reclanar' && layout.reclanarPrices && (
        <>
          <div className="bg-gray-300 p-2 rounded-lg text-center">
            Reclanar: ₹{layout.reclanarPrices.reclanar}
          </div>
          <div className="bg-gray-300 p-2 rounded-lg text-center">
            Reclanar Plus: ₹{layout.reclanarPrices.reclanarPlus}
          </div>
        </>
      )}

      {renderLayout(layout.layoutType, layout.totalSeats)}
      <div className="bg-gray-200 p-6">

        <div className="text-center mt-4 font-semibold text-lg">
          Selected Seats: {selectedSeats.join(', ') || ''}
        </div>

        <div className="text-center text-xl font-bold text-green-600">
          Total Price: ₹{calculateTotalPrice()}
        </div>

        {/* Payment method checkboxes */}
        <div className="flex justify-center gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={paymentMethod === 'wallet'}
              onChange={() => setPaymentMethod(paymentMethod === 'wallet' ? null : 'wallet')}
            />
            Wallet
          </label>

        
        </div>

       
        <div className="mt-6 text-center">
          <button
            className={`px-6 py-2 rounded text-white ${paymentMethod ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            disabled={!paymentMethod}
            onClick={handleBooking}
          >
            Book Selected Seats
          </button>
        </div>
      </div>
    </div>
  );




}

export default Booking;
