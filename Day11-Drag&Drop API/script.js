const dragStart = (event) => {
  event.currentTarget.classList.add("dragging");
};

const dragEnd = (event) => {
  event.currentTarget.classList.remove("dragging");
};

Array.from(document.querySelectorAll(".card")).forEach((card) => {
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);
});

// Drag
const drag = (event) => {
  event.dataTransfer.setData("text/html", event.currentTarget.outerHTML);
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.id);
};

const dragEnter = (event) => {
  event.currentTarget.classList.add("drop");
};

const dragLeave = (event) => {
  event.currentTarget.classList.remove("drop");
};

Array.from(document.querySelectorAll(".col")).forEach((col) => {
  col.addEventListener("dragenter", dragEnter);
  col.addEventListener("dragleave", dragLeave);
});

// Drop
const drop = (event) => {
  Array.from(document.querySelectorAll(".col")).forEach((col) =>
    col.classList.remove("drop")
  );

  document
    .querySelector(`[data-id="${event.dataTransfer.getData("text/plain")}"]`)
    .remove();

  event.currentTarget.innerHTML =
    event.currentTarget.innerHTML + event.dataTransfer.getData("text/html");
};

const allowDrop = (event) => {
  event.preventDefault();
};
