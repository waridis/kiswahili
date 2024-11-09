const appliances = [
    { id: "church", match: "church", img: "img/church.png" },
    { id: "mosque", match: "mosque", img: "img/mosque.jpg" },
    { id: "school", match: "school", img: "img/school.png" },
    { id: "bank", match: "bank", img: "img/bank.png" },
    { id: "hotel", match: "hotel", img: "img/hotel.jpg" },
  ];

  // Shuffle appliances
  appliances.sort(() => Math.random() - 0.5);

  // Populate draggable elements
  const draggableContainer = document.getElementById('draggable-container');
  draggableContainer.innerHTML = '';
  appliances.forEach(appliance => {
    const draggableDiv = document.createElement('div');
    draggableDiv.className = 'draggable';
    draggableDiv.id = appliance.id;
    draggableDiv.setAttribute('data-match', appliance.match);
    draggableDiv.innerHTML = `<img src="${appliance.img}" alt="${appliance.match}">`;
    draggableContainer.appendChild(draggableDiv);
  });

  let matchedCount = 0;

  const draggables = document.querySelectorAll('.draggable');
  const droppables = document.querySelectorAll('.droppable');

  draggables.forEach(draggable => {
    // Touch events
    draggable.addEventListener('touchstart', handleTouchStart);
    draggable.addEventListener('touchmove', handleTouchMove);
    draggable.addEventListener('touchend', handleTouchEnd);

    // Mouse events
    draggable.addEventListener('mousedown', handleMouseDown);
  });

  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const target = e.target.closest('.draggable');
    startDragging(target, touch.pageX, touch.pageY);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    const target = e.target.closest('.draggable');
    startDragging(target, e.pageX, e.pageY);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function startDragging(target, pageX, pageY) {
    target.touchOffsetX = pageX - target.getBoundingClientRect().left;
    target.touchOffsetY = pageY - target.getBoundingClientRect().top;
    target.style.opacity = '0.5';
    target.style.zIndex = '10';
  }

  function handleMouseMove(e) {
    const target = document.querySelector('.draggable[style*="z-index: 10"]'); // Find the currently dragged element
    if (target) {
      target.style.position = 'absolute';
      target.style.left = `${e.pageX - target.touchOffsetX}px`;
      target.style.top = `${e.pageY - target.touchOffsetY}px`;
    }
  }

  function handleMouseUp(e) {
    const draggable = document.querySelector('.draggable[style*="z-index: 10"]');
    if (draggable) {
      draggable.style.opacity = '1';
      draggable.style.zIndex = '1';

      let dropped = false;

      droppables.forEach(droppable => {
        const rect = droppable.getBoundingClientRect();
        
        if (e.pageX >= rect.left && e.pageX <= rect.right &&
            e.pageY >= rect.top && e.pageY <= rect.bottom) {
          if (draggable.dataset.match === droppable.dataset.match) {
            dropped = true;
            droppable.classList.add('dropped');
            droppable.innerHTML = `<img src="${draggable.querySelector('img').src}" style="width: 100%; height: 80%; border-radius: 5px;"/><div>${droppable.innerHTML}</div>`;
            draggable.remove();
            matchedCount++;
            checkCompletion();
          }
        }
      });

      if (!dropped) {
        draggable.style.position = 'static'; // Reset position if not dropped
      }

      // Remove mouse move and up listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }

  function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.querySelector('.draggable[style*="z-index: 10"]');
    if (target) {
      target.style.position = 'absolute';
      target.style.left = `${touch.pageX - target.touchOffsetX}px`;
      target.style.top = `${touch.pageY - target.touchOffsetY}px`;
    }
  }

  function handleTouchEnd(e) {
    const draggable = document.querySelector('.draggable[style*="z-index: 10"]');
    if (draggable) {
      draggable.style.opacity = '1';
      draggable.style.zIndex = '1';

      let dropped = false;

      droppables.forEach(droppable => {
        const rect = droppable.getBoundingClientRect();
        const touch = e.changedTouches[0];

        if (touch.pageX >= rect.left && touch.pageX <= rect.right &&
            touch.pageY >= rect.top && touch.pageY <= rect.bottom) {
          if (draggable.dataset.match === droppable.dataset.match) {
            dropped = true;
            droppable.classList.add('dropped');
            droppable.innerHTML = `<img src="${draggable.querySelector('img').src}" style="width: 100%; height: 80%; border-radius: 5px;"/><div>${droppable.innerHTML}</div>`;
            draggable.remove();
            matchedCount++;
            checkCompletion();
          }
        }
      });

      if (!dropped) {
        draggable.style.position = 'static'; // Reset position if not dropped
      }
    }
  }

  function checkCompletion() {
    if (matchedCount === droppables.length) {
        document.querySelector('.completion-message').style.display = 'block';
        // Redirect to the next page after a short delay
        setTimeout(() => {
            window.location.href = 'completion.html'; // Change to your next page URL
        }, 2000); // 2000 milliseconds = 2 seconds
    }
}
