export default function getTicket(data) {
    const {carrier, price, segments} = data;
    const imagePath = `http://pics.avs.io/99/36/${carrier}.png`
    let content = "";
    segments.forEach(segment => {
        content += getTicketContent(
            segment.origin,
            segment.destination,
            segment.date,
            segment.duration,
            segment.stops
        );
    })
    return `
    <li class="ticket">
        ${getTicketHeader(price, imagePath)}
        <div class="ticket__content">
            <ul class="ticket__list">
                ${content}
            </ul>
        </div>
    </li>
    `
}
function getTicketHeader(price, imgPath) {
        return `
            <div class="ticket__header">
                <p class="ticket__price">${price} ₽</p>
                <img class="ticket__img" src=${imgPath} width="99" height="36">
            </div>
        `
    }
function getTicketContent(origin, dest, date, duration, stops) {
        return `
            <li class="ticket__item">
                ${getTicketRoute(origin, dest, date, duration)}
                ${getTicketLength(duration)}
                ${getTicketStops(stops)}
            </li>
        `
    }
function getTicketRoute(origin, dest, date, duration) {
    const timeFrom = getTime(date)
    const timeTo = getTime(date, duration);
    return `
        <div class="ticket__data" data-route>
            <p>${origin} - ${dest}</p>
            <p>${timeFrom} - ${timeTo}</p>
        </div>
        `
}
function getTicketLength(duration) {
    return`
        <div class="ticket__data" data-lenght>
            <p>В пути</p>
            ${getDuration(duration)}
        </div>
    `
}
function getTicketStops(stops) {
    if (stops.length > 0) {
        return `
            <div class="ticket__data" data-stops>
                <p>${stops.length} ${getStopsPostfix(stops.length)}</p>
                <p>${stops.join(", ")}</p>
            </div>
            `
    } else {
        return `
            <div class="ticket__data" data-stops>
                <p>Без пересадок</p>
            </div>
            `
    }
}
function getStopsPostfix(length) {
        const n = length % 10;
        if (n > 10 && n < 20) {
            return 'пересадок';
        }
        if (n > 1 && n < 5) {
            return 'пересадки';
        }
        if (n === 1) {
            return 'пересадка';
        }
        return 'пересадок';
}
function getDuration(duration) {
        let hours = setTimeFormat(Math.floor(duration / 60));
        let minutes = setTimeFormat(duration % 60);
        return `
            <p>${hours}ч ${minutes}м</p>
        `
    }
function getTime(time, duration = 0) {
    const date = new Date(time);
    date.setMinutes(date.getMinutes() + duration);
    const hours = setTimeFormat(date.getHours());
    const minutes = setTimeFormat(date.getMinutes());
    return `${hours}:${minutes}`
}
function setTimeFormat(value) {
    if (value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}
