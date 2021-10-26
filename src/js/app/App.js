import getTicket from "./Ticket";
import Service from "./Service";

document.addEventListener('DOMContentLoaded', async function() {
    const service = new Service();
    let tickets = [];
    let filtered = [];
    let currentIndex = 0;
    const moreBtn = document.querySelector('button[name=more]');
    moreBtn.style.display = "none";
    async function collectTickets(response) {
        if (response.stop) {
            tickets = [...response.tickets];
        } else {
            tickets = [...response.tickets];
            await collectTickets(await service.getTickets());
        }
    }
    async function init() {
        await service.setId()
        await collectTickets(await service.getTickets());
        filtered = [...tickets];
    }
    function render(data) {
        const stopIndex = currentIndex + 5;
        for (currentIndex; currentIndex < stopIndex;) {
            renderTicket(data[currentIndex++])
        }
        const spinner = document.querySelector(".spinner");
        spinner.style.display = "none";
        moreBtn.style.display = "inline-block"
        filtered = [...data];
    }
    function renderTicket(ticket) {
        const ticketsList = document.querySelector('.tickets');
        ticketsList.innerHTML += getTicket(ticket);
    }
    function priceComparator(ticket1, ticket2) {
        return ticket1.price - ticket2.price
    }
    function durationComparator(ticket1, ticket2) {
        let duration1 = ticket1.segments.reduce(function (prev, curr) {
            return prev + curr.duration;
        }, 0);
        let duration2 = ticket2.segments.reduce(function (prev, curr) {
            return prev + curr.duration;
        }, 0);
        if (duration1 < duration2) {
            return -1;
        }
        if (duration1 > duration1) {
            return 1;
        }
        return 0;
    }
    function setHandlers() {
        moreBtn.addEventListener("click", () => {
            render(tickets)
        })
        const cheapBtn = document.querySelector('button[data-cheap]');
        cheapBtn.addEventListener("click", () => {
            if (!cheapBtn.parentElement.classList.contains('time-filter__item--active')) {
                setActiveFilter(cheapBtn);
                clear();
                render(filtered.sort(priceComparator));
            }
        })
        const fastBtn = document.querySelector('button[data-fast]');
        fastBtn.addEventListener("click", () => {
            if (!fastBtn.parentElement.classList.contains('time-filter__item--active')) {
                setActiveFilter(fastBtn);
                clear();
                render(filtered.sort(durationComparator));
            }
        })
        function setActiveFilter(item) {
            const items = document.querySelectorAll('.time-filter__item');
            items.forEach(item => item.classList.remove('time-filter__item--active'));
            item.parentElement.classList.add('time-filter__item--active');
        }
        const searchForm = document.querySelector('.search__form');
        const checkboxes = searchForm.querySelectorAll('input[type=checkbox]');
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        })
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    currentIndex = 0;
                    if (e.target.dataset.stops === 'all') {
                            clear();
                            filtered = [...tickets];
                            render(tickets);
                            checkboxes.forEach(checkbox => checkbox.checked = false);
                            checkbox.checked = true;
                    } else {
                        filterTicketsByStops(e.target.dataset.stops)
                    }
                }
            })
        })
    }
    function filterTicketsByStops(stops) {
        clear();
        const checked = document.querySelectorAll('.search__form input[type=checkbox]:checked');
        checked.forEach(checkbox => {
            if (checkbox.dataset.stops !== 'all') {
                render(tickets.filter(ticket => {
                    let ticketStops = 0
                    ticket.segments.forEach(segment => {
                        ticketStops += segment.stops.length;
                    })
                    return +stops === ticketStops;
                }))
            }
        })
    }
    function clear() {
        document.querySelector('.tickets').innerHTML = '';
        currentIndex = 0;
    }
    await init()
    render(tickets.sort(priceComparator));
    setHandlers();
})
