//From Here Search Box Related Functions!!
var modal = document.getElementById("searchBox");

// Content
var content = document.getElementById('item');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

content.onclick = () => {
    modal.style.display = "block";
}