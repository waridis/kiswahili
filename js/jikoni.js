$(function () {
    let matchedCount = 0; // Count matched items

    // Shuffle function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Shuffle the draggable elements
    const draggables = $('#draggable-container .draggable').toArray();
    const shuffledDraggables = shuffleArray(draggables);

    // Empty the container and append shuffled elements
    $('#draggable-container').empty().append(shuffledDraggables);

    // Make the elements draggable
    $(".draggable").draggable({
        revert: "invalid", // Return to original position if not dropped
        helper: "clone", // Create a clone of the element to drag
        start: function(event, ui) {
            $(this).addClass("dragged"); // Add dragged class for styling
        },
        stop: function(event, ui) {
            $(this).removeClass("dragged"); // Remove dragged class on stop
        }
    });

    // Make the droppable areas droppable
    $(".droppable").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            const draggableId = ui.draggable.attr("id");
            const droppableId = $(this).data("draggable-id");

            if (draggableId === droppableId) {
                $(this).addClass("dropped");
                // Place the image inside the droppable area
                const imageClone = ui.draggable.clone().css({
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%', // Adjust to fit droppable area
                    height: '100%', // Adjust to fit droppable area
                    zIndex: 5 // Ensure the image appears in front
                });
                $(this).append(imageClone); // Add the image clone to the droppable area
                ui.draggable.hide(); // Hide the original dragged image
                matchedCount++; // Increment matched count

                // Check if all items are matched
                if (matchedCount === 5) {
                    $(".completion-message").fadeIn(); // Show completion message
                    setTimeout(() => {
                        // Redirect to the next page after 3 seconds
                        window.location.href = "jikoni2.html"; // Change to your next page URL
                    }, 3000);
                }
            } else {
                $(this).removeClass("dropped"); // Remove drop class if incorrect
            }
        }
    });
});