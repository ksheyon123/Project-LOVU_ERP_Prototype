//From Here Search Box Related Functions!!
var inventModal = document.getElementById("inventoryBox");

// Content
var inventContent = document.getElementById('inventory');

// Get the <span> element that closes the modal
var inventorySpan = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
inventorySpan.onclick = () => {
    inventModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal) {
        inventModal.style.display = "none";
    }
}

inventContent.onclick = () => {
    inventModal.style.display = "block";
}