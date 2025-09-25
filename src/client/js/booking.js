document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const film = urlParams.get('film') || 'Фильм не указан';
    const time = urlParams.get('time') || 'Время не указано';
    const hall = urlParams.get('hall') || 'Зал не указан';

    document.querySelector('.movie__title').textContent = decodeURIComponent(film);
    document.querySelector('.movie__start').textContent = `Начало сеанса: ${decodeURIComponent(time)}`;
    document.querySelector('.movie__hall').textContent = `Зал ${decodeURIComponent(hall)}`;

    document.querySelectorAll('[class^="seat-row-"]').forEach(row => {
        const rowNumber = row.className.match(/seat-row-(\d+)/)[1];
        const seats = row.querySelectorAll('.seat');
        seats.forEach((seat, index) => {

            seat.dataset.originalNumber = seat.textContent;

            seat.textContent = `${rowNumber}-${index + 1}`;
        });
    });

    const seats = document.querySelectorAll('.seat:not(.occupied)');
    const bookButton = document.getElementById('bookButton');

    seats.forEach(seat => {
        seat.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateBookButton();
        });
    });

    function updateBookButton() {
        bookButton.disabled = document.querySelectorAll('.seat.selected').length === 0;
    }

    bookButton.addEventListener('click', function() {
        const selectedSeats = Array.from(document.querySelectorAll('.seat.selected'));
        const seatsNumbers = selectedSeats.map(seat => seat.textContent).join(', ');
        const totalPrice = selectedSeats.reduce((sum, seat) => sum + parseInt(seat.dataset.price), 0);

        const ticketData = {
            film: decodeURIComponent(film),
            seats: seatsNumbers,
            hall: decodeURIComponent(hall),
            time: decodeURIComponent(time),
            price: totalPrice
        };
        
        localStorage.setItem('ticketData', JSON.stringify(ticketData));
        window.location.href = 'payment.html';
    });
});