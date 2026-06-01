import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.conf import settings

def generate_qr_code(booking):
    # Generate QR code image with booking details
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    data = f"Booking ID: {booking.booking_id}\nEvent: {booking.event.title}\nDate: {booking.event.date}"
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    filename = f"{booking.booking_id}.png"
    booking.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)

def send_booking_confirmation_email(booking):
    subject = f"Booking Confirmation - {booking.event.title}"
    message = f"Dear {booking.user.username},\n\nYour booking for {booking.event.title} is confirmed.\n"
    message += f"Booking ID: {booking.booking_id}\n"
    message += f"Total Amount: ₹{booking.total_amount}\n"
    message += "Thank you!"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [booking.user.email])