import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config/config";
import { API_CONFIG } from "../../config/config";
import Swal from "sweetalert2";


type LayoutType = 'normal' | 'withbalcony' | 'reclanar' | 'centeredscreen';

type BalconyPrices = {
  normal: number | '';
  premium: number | '';
};

type ReclanarPrices = {
  reclanar: number | '';
  reclanarPlus: number | '';
};

export default function SeatLayoutCreator() {
  const [layoutType, setLayoutType] = useState<LayoutType>('normal');
  const [normalPrice, setNormalPrice] = useState<number | ''>('');
  const [balconyPrices, setBalconyPrices] = useState<BalconyPrices>({ normal: '', premium: '' });
  const [reclanarPrices, setReclanarPrices] = useState<ReclanarPrices>({ reclanar: '', reclanarPlus: '' });
  const [totalSeats, setTotalSeats] = useState<number>(40);
  const Creator = JSON.parse(localStorage.getItem("creator") || "{}");
  const creatorId = Creator._id || Creator.id;
  const navigate = useNavigate();
  const seatsPerRow = 8;

  const isPriceValid = (): boolean => {
  if (layoutType === 'normal' || layoutType === 'centeredscreen') {
    return normalPrice !== '' && normalPrice > 0;
  }
  if (layoutType === 'withbalcony') {
    if (
      balconyPrices.normal === '' ||
      balconyPrices.premium === '' ||
      balconyPrices.normal <= 0 ||
      balconyPrices.premium <= 0
    ) {
      Swal.fire("Warning", "Please enter both balcony prices greater than 0.", "warning");
      return false;
    }
    if (balconyPrices.premium <= balconyPrices.normal) {
      Swal.fire("Invalid Prices", "Premium price must be greater than Normal price.", "warning");
      return false;
    }
    return true;
  }
  if (layoutType === 'reclanar') {
    if (
      reclanarPrices.reclanar === '' ||
      reclanarPrices.reclanarPlus === '' ||
      reclanarPrices.reclanar <= 0 ||
      reclanarPrices.reclanarPlus <= 0
    ) {
      Swal.fire("Warning", "Please enter both reclanar prices greater than 0.", "warning");
      return false;
    }
    if (reclanarPrices.reclanarPlus <= reclanarPrices.reclanar) {
      Swal.fire("Invalid Prices", "Reclanar Plus price must be greater than Reclanar price.", "warning");
      return false;
    }
    return true;
  }
  return false;
};


 const saveLayout = async () => {
  if (!isPriceValid()) return;

  const layoutData: any = {
    layoutType,
    totalSeats,
  };

  if (layoutType === 'normal' || layoutType === 'centeredscreen') {
    layoutData.price = Number(normalPrice);
  } else if (layoutType === 'withbalcony') {
    layoutData.price = {
      normal: Number(balconyPrices.normal),
      premium: Number(balconyPrices.premium),
    };
  } else if (layoutType === 'reclanar') {
    layoutData.price = {
      reclanar: Number(reclanarPrices.reclanar),
      reclanarPlus: Number(reclanarPrices.reclanarPlus),
    };
  }

  try {
    const response = await fetch(`${BASE_URL}/${API_CONFIG.CREATOR.ENDPOINTS.LAYOUTS(creatorId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(layoutData),
    });

    if (response.ok) {
      Swal.fire("Success", "Layout saved successfully!", "success").then(() => {
        navigate('/creator/create-event');
      });
    } else {
      Swal.fire("Error", "Failed to save layout.", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Something went wrong while saving layout.", "error");
  }
};


  const seatBox = (label: number | string, color = 'bg-gray-400') => (
    <div
      key={String(label)}
      className={`w-10 h-10 ${color} text-white text-sm flex items-center justify-center rounded`}
    >
      {label}
    </div>
  );

  const renderNormal = () => {
    const rows = Math.ceil(totalSeats / seatsPerRow);
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center font-semibold text-white bg-black py-2 px-4 rounded mb-2">Screen</div>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-2">
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

  const renderWithBalcony = () => {
    const totalRows = Math.ceil(totalSeats / seatsPerRow);
    const normalRows = Math.round(totalRows * 0.7);
    const balconyRows = totalRows - normalRows;

    return (
      <div className="space-y-6">
        <div className="text-center font-semibold">Balcony (30%)</div>
        <div className="flex flex-col items-center gap-2">
          {Array.from({ length: balconyRows }).map((_, i) => (
            <div key={`balcony-row-${i}`} className="flex gap-2">
              {Array.from({ length: seatsPerRow }).map((_, j) => {
                const seatNumber = i * seatsPerRow + j + 1;
                return seatNumber <= totalSeats ? seatBox(seatNumber, 'bg-yellow-500') : null;
              })}
            </div>
          ))}
        </div>

        <div className="text-center font-semibold">Normal (70%)</div>
        <div className="flex flex-col items-center gap-2">
          {Array.from({ length: normalRows }).map((_, i) => (
            <div key={`normal-row-${i}`} className="flex gap-2">
              {Array.from({ length: seatsPerRow }).map((_, j) => {
                const seatNumber = balconyRows * seatsPerRow + i * seatsPerRow + j + 1;
                return seatNumber <= totalSeats ? seatBox(seatNumber, 'bg-gray-500') : null;
              })}
            </div>
          ))}
        </div>

        <div className="text-center font-bold text-white bg-black py-2 px-4 rounded">Screen</div>
      </div>
    );
  };

  const renderReclanarLayout = () => {
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

  const renderCenteredScreenLayout = () => {
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Create Seat Layout</h1>

      <div>
        <label className="block mb-2 font-semibold">Select Layout Type:</label>
        <select
          value={layoutType}
          onChange={(e) => setLayoutType(e.target.value as LayoutType)}
          className="border rounded p-2 w-full max-w-xs"
        >
          <option value="normal">Normal</option>
          <option value="withbalcony">With Balcony</option>
          <option value="reclanar">Reclanar</option>
          <option value="centeredscreen">Centered Screen</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-semibold">Total Seats:</label>
        <input
          type="number"
          min={1}
          max={300}
          value={totalSeats}
          onChange={(e) => setTotalSeats(Math.min(300, Math.max(1, Number(e.target.value))))}
          className="border rounded p-2 w-full max-w-xs"
        />
      </div>

      {layoutType === 'normal' || layoutType === 'centeredscreen' ? (
        <div>
          <label className="block mb-2 font-semibold">Price per seat:</label>
          <input
            type="number"
            min={0}
            value={normalPrice}
            onChange={(e) => setNormalPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="border rounded p-2 w-full max-w-xs"
          />
        </div>
      ) : null}

      {layoutType === 'withbalcony' && (
        <div className="space-y-4 max-w-xs">
          <div>
            <label className="block mb-2 font-semibold">Normal Price:</label>
            <input
              type="number"
              min={0}
              value={balconyPrices.normal}
              onChange={(e) =>
                setBalconyPrices((prev) => ({
                  ...prev,
                  normal: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Premium Price:</label>
            <input
              type="number"
              min={0}
              value={balconyPrices.premium}
              onChange={(e) =>
                setBalconyPrices((prev) => ({
                  ...prev,
                  premium: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      )}

      {layoutType === 'reclanar' && (
        <div className="space-y-4 max-w-xs">
          <div>
            <label className="block mb-2 font-semibold">Reclanar Price:</label>
            <input
              type="number"
              min={0}
              value={reclanarPrices.reclanar}
              onChange={(e) =>
                setReclanarPrices((prev) => ({
                  ...prev,
                  reclanar: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Reclanar Plus Price:</label>
            <input
              type="number"
              min={0}
              value={reclanarPrices.reclanarPlus}
              onChange={(e) =>
                setReclanarPrices((prev) => ({
                  ...prev,
                  reclanarPlus: e.target.value === '' ? '' : Number(e.target.value),
                }))
              }
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-6 rounded shadow">{(() => {
        switch (layoutType) {
          case 'normal':
            return renderNormal();
          case 'withbalcony':
            return renderWithBalcony();
          case 'reclanar':
            return renderReclanarLayout();
          case 'centeredscreen':
            return renderCenteredScreenLayout();
          default:
            return null;
        }
      })()}</div>

      <button
        onClick={saveLayout}
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700"
      >
        Save Layout
      </button>
    </div>
  );
}
