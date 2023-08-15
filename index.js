const svgData = document.getElementById("svg-data");
const rect = document.getElementById("rect");

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();
  rect.addEventListener("click", () => {
    const newRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    newRect.setAttribute("x", "120");
    newRect.setAttribute("y", "120");
    newRect.setAttribute("width", "40");
    newRect.setAttribute("height", "20");
    newRect.setAttribute("rx", "5");
    newRect.setAttribute("fill", "blue");

    svgData.appendChild(newRect);

    newRect.addEventListener("mousedown", startDrag);
    newRect.addEventListener("mousemove", drag);
    newRect.addEventListener("mouseup", endDrag);
    newRect.addEventListener("mouseleave", endDrag);
  });

  let selectedElement = null;
  let offset = null;

  function startDrag(evt) {
    if (evt.target === this) {
      selectedElement = this;
      offset = getMousePosition(evt);
      offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
      offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
    }
  }

  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      const coord = getMousePosition(evt);
      selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
      selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
    }
  }

  function endDrag(evt) {
    selectedElement = null;
  }

  function getMousePosition(evt) {
    const CTM = svgData.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e) / CTM.a,
      y: (evt.clientY - CTM.f) / CTM.d,
    };
  }

  const svgPan = document.getElementById("svg-pan");
  const panRect = document.getElementById("pan-rect");

  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let panOffsetX = 0;
  let panOffsetY = 0;

  svgPan.addEventListener("mousedown", startPan);
  svgPan.addEventListener("mousemove", pan);
  svgPan.addEventListener("mouseup", endPan);
  svgPan.addEventListener("mouseleave", endPan);

  function startPan(evt) {
    evt.preventDefault();
    isPanning = true;
    panStartX = evt.clientX;
    panStartY = evt.clientY;
    panOffsetX = svgPan.viewBox.baseVal.x;
    panOffsetY = svgPan.viewBox.baseVal.y;
    svgPan.style.cursor = "grabbing";
  }

  function pan(evt) {
    if (!isPanning) return;
    const deltaX = evt.clientX - panStartX;
    const deltaY = evt.clientY - panStartY;
    svgPan.viewBox.baseVal.x = panOffsetX - deltaX;
    svgPan.viewBox.baseVal.y = panOffsetY - deltaY;
  }

  function endPan() {
    isPanning = false;
    svgPan.style.cursor = "grab";
  }

  svgPan.addEventListener("wheel", zoom);

  function zoom(evt) {
    evt.preventDefault();
    const zoomFactor = Math.pow(1.2, -evt.deltaY * 0.01);
    const viewBox = svgPan.viewBox.baseVal;
    const newWidth = viewBox.width * zoomFactor;
    const newHeight = viewBox.height * zoomFactor;
    const newX =
      viewBox.x +
      (viewBox.width - newWidth) * (evt.clientX / svgPan.clientWidth);
    const newY =
      viewBox.y +
      (viewBox.height - newHeight) * (evt.clientY / svgPan.clientHeight);
    svgPan.viewBox.baseVal.x = newX;
    svgPan.viewBox.baseVal.y = newY;
    svgPan.viewBox.baseVal.width = newWidth;
    svgPan.viewBox.baseVal.height = newHeight;
  }
});
