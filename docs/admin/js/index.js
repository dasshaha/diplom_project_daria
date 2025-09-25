// JavaScript для конфигурации залов и управления сеансами
document.addEventListener('DOMContentLoaded', function() {
  // Конфигурация залов
  const hallNumbers = document.querySelectorAll('.list-hall-num');
  const seats = document.querySelectorAll('.seat');
  
  // Управление сеансами
  const trashIcons = document.querySelectorAll('.mysorka-box');

  // Инициализация конфигурации залов
  initHallConfiguration();

  // Инициализация управления сеансами
  initSessionManagement();

  function initHallConfiguration() {
    // Обработчики для выбора зала
    hallNumbers.forEach(hall => {
      hall.addEventListener('click', function() {
        selectHall(this);
      });
    });

    // Обработчики для мест
    seats.forEach(seat => {
      seat.addEventListener('click', function() {
        changeSeatType(this);
      });
    });

    // Обработчики для кнопок в каждой секции
    document.querySelectorAll('.index-container').forEach(container => {
      const saveBtn = container.querySelector('.index-button:not(#loginButton)');
      const cancelBtn = container.querySelector('.index-button-no:not(#loginButton)');
      
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          // Находим ближайший контейнер с залом
          const hallContainer = this.closest('.index-container');
          saveConfiguration(hallContainer);
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelChanges);
      }
    });
  }

  function initSessionManagement() {
    // Обработчики для мусорок (удаление фильмов)
    trashIcons.forEach(trash => {
      trash.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteFilm(this);
      });
    });
  }

  function selectHall(hallElement) {
    // Снимаем выделение со всех залов в текущем контейнере
    const container = hallElement.closest('.index-container');
    container.querySelectorAll('.list-hall-num').forEach(h => h.classList.remove('active'));
    
    // Выделяем выбранный зал
    hallElement.classList.add('active');
    console.log('Выбран зал:', hallElement.textContent);
  }

  function changeSeatType(seatElement) {
    // Получаем текущий тип места
    const currentType = getCurrentSeatType(seatElement);
    
    // Определяем порядок смены типов: free → vip → blocked → free
    let nextType;
    
    switch(currentType) {
      case 'free':
        nextType = 'vip';
        break;
      case 'vip':
        nextType = 'blocked';
        break;
      case 'blocked':
        nextType = 'free';
        break;
      default:
        nextType = 'free';
    }

    // Удаляем все классы типов
    seatElement.classList.remove('free', 'vip', 'blocked');
    
    // Добавляем новый класс типа
    seatElement.classList.add(nextType);
    
    // Обновляем цену в зависимости от типа
    if (nextType === 'vip') {
      seatElement.dataset.price = '350';
    } else if (nextType === 'free') {
      seatElement.dataset.price = '250';
    } else {
      delete seatElement.dataset.price; // у заблокированных нет цены
    }
    
    console.log('Тип места изменен на:', nextType);
  }

  function getCurrentSeatType(seatElement) {
    if (seatElement.classList.contains('vip')) return 'vip';
    if (seatElement.classList.contains('blocked')) return 'blocked';
    return 'free';
  }

  function deleteFilm(trashElement) {
    // Ищем родительский элемент фильма или зала
    const filmElement = trashElement.closest('.free-hall, .film-seans');
    if (filmElement && confirm('Удалить этот элемент?')) {
      filmElement.remove();
      console.log('Элемент удален');
    }
  }

  function saveConfiguration(hallContainer) {
    const selectedHall = hallContainer.querySelector('.list-hall-num.active');
    if (!selectedHall) {
      alert('Пожалуйста, выберите зал для конфигурации');
      return;
    }

    const configuration = {
      hall: selectedHall.textContent,
      seats: []
    };

    // Собираем информацию только о местах в текущем зале
    const hallSeats = hallContainer.querySelectorAll('.seat');
    hallSeats.forEach(seat => {
      configuration.seats.push({
        type: getCurrentSeatType(seat),
        price: seat.dataset.price || '0',
        number: seat.textContent,
        row: seat.parentElement.className.replace('seat-row-', '')
      });
    });

    console.log('Конфигурация сохранена:', configuration);
    alert('Конфигурация успешно сохранена!');
  }

  function cancelChanges() {
    if (confirm('Отменить все изменения?')) {
      // Восстанавливаем исходное состояние всех мест
      seats.forEach(seat => {
        seat.classList.remove('vip', 'blocked');
        seat.classList.add('free');
        seat.dataset.price = '250';
      });
      console.log('Изменения отменены');
    }
  }
});