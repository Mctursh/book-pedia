// Loaded via <script> tag, create shortcut to access PDF.js exports.
// let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
// pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1,
    canvas = document.getElementById('pdf-canva'),
    magnification = document.getElementById("magnification")

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number. 
 */
function renderPage(num) {
  ctx = canvas.getContext('2d');
  pageRendering = true;
  disableMagBtn()
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    let viewport = page.getViewport({scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // canvas.style.width = Math.floor(viewport.width) + "px";
    // canvas.style.height =  Math.floor(viewport.height) + "px";

    // Render PDF page into canvas context
    let renderContext = {
      canvasContext: ctx,
      viewport
    };
    let renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      scale < 4 && enableMagIncBtn()
      scale > 0.5 && enableMagDcrBtn()
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('curr-num').value = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
// document.getElementById('prev-page').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
// document.getElementById('next-page').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
async function preview(url) {
    $("#preview-btn")[0].disabled = true
    pdfjsLib.getDocument(url).promise.then(function (pdfDoc_) {
      setupPreview()
      pdfDoc = pdfDoc_;
      document.getElementById('total-pages').textContent = pdfDoc.numPages;
      document.getElementById("curr-num").setAttribute("max", pdfDoc.numPages)
      
      // Initial/first page rendering
      renderPage(pageNum);
    });
}


/****
 * Handle the zooming in of the current Page * 
 */

function zoomIn() {
    scale < 4 ? scale = scale + 0.25 : scale
    canvas.style.transform = `scale(${scale}) translate(37%, 38%)`
    magnification.textContent = scale * 100
    renderPage(pageNum)
}

function zoomOut() {
    scale > 0.5 ? scale = scale - 0.25 : scale
    canvas.style.transform = `scale(${scale}) translate(37%, 38%)`    
    magnification.textContent = scale * 100
    renderPage(pageNum)
}

function setupPreview() {
  $(".pdf-prev-parent").removeClass("fadeOutDownCustom animate__faster")
  $("body").addClass("blur")
  $(".pdf-prev-parent").removeClass("hide")
  $(".pdf-prev-parent").addClass("fadeInUpCustom animate__faster")
}

function closePreview() {
  $(".pdf-prev-parent").removeClass("fadeInUpCustom animate__faster")
  $(".pdf-prev-parent").addClass("fadeOutDownCustom animate__faster")
  $("body").removeClass("blur")
  setTimeout(() => {
    $(".pdf-prev-parent").addClass("hide")
    $("#preview-btn")[0].disabled = false
  }, 500)
}

function disableMagBtn() {
  $("#mag-inc")[0].disabled = true
  $("#mag-dcr")[0].disabled = true
}
function enableMagBtn() {
  $("#mag-inc")[0].disabled = false
  $("#mag-dcr")[0].disabled = false
}

function enableMagIncBtn() {
  $("#mag-inc")[0].disabled = false  
}

function enableMagDcrBtn() {
  $("#mag-dcr")[0].disabled = false 
}