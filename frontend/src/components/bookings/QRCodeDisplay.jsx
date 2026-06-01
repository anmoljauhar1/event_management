import { QRCodeCanvas } from 'qrcode.react';

const QRCodeDisplay = ({ value, size = 200 }) => {
  return (
    <div className="flex justify-center">
      <QRCodeCanvas value={value} size={size} />
    </div>
  );
};

export default QRCodeDisplay;