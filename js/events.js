window.addEventListener('load', function () {

    function sendNotification(title, options) {
        // Поддерживает ли браузер HTML5 Notifications
        if (!("Notification" in window)) {
            alert('Ваш браузер не поддерживает Notifications, обновите браузер до последней версии.');
        }

        // Eсть ли права на отправку уведомлений
        else if (Notification.permission === "granted") {
            // Если права есть, отправим уведомление
            var notification = new Notification(title, options);

            function clickFunc() {
                notification.close();
            }

            notification.addEventListener('click', clickFunc);
        }

        // Если прав нет, пытаемся их получить
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // Если права успешно получены, отправляем уведомление
                if (permission === "granted") {
                    var notification = new Notification(title, options);

                } else {
                    alert('Вы запретили показывать уведомления'); // Юзер отклонил наш запрос на показ уведомлений
                }
            });
        }
    }

    var eventsContainer = document.querySelector('.events-list'), //Куда будет вывоиться список
        requestURL = './events.json',
        request = new XMLHttpRequest();

    // Получаем данные из файла
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();
    request.onload = () => {
        var eventsList = request.response;
        showEvents(eventsList,sendRemind);
    };

    function showEvents(jsonObj, callback) {
        var events = jsonObj['events'];

        // Отрисовываем список событий
        for (var i = 0; i < events.length; i++) {
            var eventItem = document.createElement('div');

            var evt = {
                'eventFullDate':  new Date(events[i].date),
                'eventDate': new Date(events[i].date).getDate(),
                'eventDay': dayName(new Date(events[i].date).getDay()),
                'eventId': events[i].id,
                'eventName': events[i].name,
                'eventLink': events[i].link,
                'eventTags': events[i].tags,
                'eventDescription': events[i].description
            };
            eventItem.id = evt.eventId;
            eventItem.classList.add("events-list__item");
            eventItem.classList.add("event");
            eventItem.innerHTML = `<div class="event__wrapper">
                                <div class="event__info">
                                    <div class="event__date">
                                        <span class="event__day">${evt.eventDay}</span>
                                        <span class="event__number">${evt.eventDate}</span>
                                    </div>
                                    <div class="event__description">
                                        <a href="${evt.eventLink}" target="_blank" rel="noreferrer" class="event__name">
                                          ${evt.eventName}
                                        </a>
                                        <div class="event__tags">
                                           ${evt.eventTags}
                                        </div>
                                        <span class="event__text">
                                            ${evt.eventDescription}
                                        </span>
                                    </div>
                                </div>
                                <div class="event__remind">
                                    <div class="event__remind-header">
                                       Remind
                                    </div>
                                    <div class="event__push-btns">
                                        <button class="event__push">Before 3 Days</button>
                                        <button class="event__push">Before 7 Days</button>
                                        <button class="event__push">Before 14 Days</button>                     
                                </div>
                            </div>`

            eventsContainer.appendChild(eventItem);
        }

        callback();
    }

    function sendRemind() {
        var pushBtn = document.querySelectorAll('.event .event__push');

        for (let i = 0, length = pushBtn.length; i<length; i++) {
            pushBtn[i].addEventListener('click', function () {
                var event = closestParent(pushBtn[i], 'event'),
                    eventName = document.querySelector('#'+event.id + ' .event__name'),
                    remindCount = pushBtn[i].innerText;

                sendNotification('Remind set succes', {
                    body: 'Remind about ' +eventName.innerText+ ' '+remindCount,
                    icon: 'images/icon.png',
                });
            });
        }
    }

    function closestParent(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }
    function dayName(day) {
        switch(day) {
            case 0: return 'Sun';
                break;
            case 1: return 'Mon';
                break;
            case 2: return 'Tue';
                break;
            case 3: return 'Wed';
                break;
            case 4: return 'Thur';
                break;
            case 5: return 'Fri';
                break;
            case 6: return 'Sat';
                break;
            default: console.log('Такого дня недели не существует');
                break;
        }
    }
});







