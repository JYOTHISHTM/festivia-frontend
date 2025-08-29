import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../layout/creator/SideBar'
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../../services/creator/creatorService';

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
    _id: string
    eventName: string;
    image: string;
}



function Booking() {
    const { layoutId } = useParams<{ layoutId: string }>();
    const [layout, setLayout] = useState<SeatLayout | null>(null);
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeats] = useState<number[]>([]);



    const navigate = useNavigate();



    useEffect(() => {
        async function fetchData() {
            try {
                const creator = JSON.parse(localStorage.getItem('creator') || '{}');
                const creatorId = creator?.id;
                const token = localStorage.getItem('accessToken') || '';
                // const token = localStorage.getItem('creatorToken') || '';

                if (!creatorId || !token) throw new Error('Unauthorized');
                if (!layoutId) throw new Error('Missing layout ID');

                const data = await creatorService.getLayoutById(layoutId, creatorId, token);

                setLayout(data.layout);
                setEvent(data.event);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load');
            } finally {
                setLoading(false);
            }
        }

        if (layoutId) fetchData();
    }, [layoutId]);



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



        return (
            <div
                key={seatNumber}
                className={`w-8 h-8 ${boxColor} text-white text-sm flex items-center justify-center rounded cursor-pointer relative ${isBooked ? 'cursor-not-allowed opacity-80' : 'hover:opacity-80'
                    }`}
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
                <div className="flex justify-center p-5">
                    <div className="text-center font-semibold text-white bg-black py-1 px-6 rounded w-60 ">
                        Screen
                    </div>
                </div>
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
                <div className="flex justify-center mt-10">
                    <div className="text-center font-semibold text-white bg-black py-1 px-6 rounded w-60">
                        Screen
                    </div>
                </div>
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
                        Stage/Screen
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



    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    if (!layout || !event) return <div>No data found.</div>;








    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                <div className="w-64 flex-shrink-0 sticky top-0 h-screen">
                    <SideBar />
                </div>

                <div className="flex-1 p-6">
                    <div className="bg-gray-300 rounded-xl shadow-lg p-6 max-w-7xl mx-auto mt-40">
                        <div className="flex gap-6">
                            <div className="w-1/2 space-y-6">
                                <div className="text-center border-b border-gray-200 pb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {event.eventName}
                                    </h2>
                                </div>

                                <div className="relative overflow-hidden rounded-lg shadow-md">
                                    <img
                                        src={event.image}
                                        alt={event.eventName}
                                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>

                                <div className="flex justify-center items-center space-x-8 bg-gray-100 rounded-lg p-3">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Layout</p>
                                        <p className="text-lg font-bold text-gray-800 capitalize">{layout.layoutType}</p>
                                    </div>
                                    <div className="w-px h-10 bg-gray-300"></div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Total Seats</p>
                                        <p className="text-lg font-bold text-gray-800">{layout.totalSeats}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {(layout.layoutType === 'normal' || layout.layoutType === 'centeredscreen') && (
                                        <div className="bg-gray-400 text-white p-4 rounded-lg shadow">
                                            <div className="flex justify-between">
                                                <span className="font-medium">TICKET PRICE</span>
                                                <span className="text-xl font-bold">₹{layout.normalPrice}</span>
                                            </div>
                                        </div>
                                    )}

                                    {layout.layoutType === 'withbalcony' && layout.balconyPrices && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-400 text-white p-4 rounded-lg text-center">
                                                <p className="text-sm opacity-90">Balcony Normal</p>
                                                <p className="text-lg font-bold">₹{layout.balconyPrices.normal}</p>
                                            </div>
                                            <div className="bg-gray-400 text-white p-4 rounded-lg text-center">
                                                <p className="text-sm opacity-90">Balcony Premium</p>
                                                <p className="text-lg font-bold">₹{layout.balconyPrices.premium}</p>
                                            </div>
                                        </div>
                                    )}

                                    {layout.layoutType === 'reclanar' && layout.reclanarPrices && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-400 text-white p-4 rounded-lg text-center">
                                                <p className="text-sm opacity-90">Reclanar</p>
                                                <p className="text-lg font-bold">₹{layout.reclanarPrices.reclanar}</p>
                                            </div>
                                            <div className="bg-gray-400 text-white p-4 rounded-lg text-center">
                                                <p className="text-sm opacity-90">Reclanar Plus</p>
                                                <p className="text-lg font-bold">₹{layout.reclanarPrices.reclanarPlus}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-1/2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Seat Layout</h3>
                                <div className="bg-white rounded-lg p-4 shadow-inner min-h-96 flex items-center justify-center">
                                    {renderLayout(layout.layoutType, layout.totalSeats)}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={() => navigate('/creator/account')}
                                className="bg-black text-white rounded text-sm font-semibold px-7 py-3 hover:bg-gray-800 transition"
                            >
                                See Tickets
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );







}

export default Booking;
