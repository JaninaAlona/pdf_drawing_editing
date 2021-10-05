let pdfState = {
    pdf: null,
    currentPage: 1,
    zoom: 1,
    pageHeight: []
}

let pageCounter = 1;


function jumpTo(pageToJump) {

    //set to pixel position below previous page of desired page
    let jumpAnchor = 0;

    if (pdfState.currentPage == 1) {
        window.scrollTo(0, 0);
    } else {
        for (let i = 0; i < pageToJump - 1; i++) {
            jumpAnchor = jumpAnchor + pdfState.pageHeight[i] + 20;
        }

        window.scrollTo(0, jumpAnchor, { behavior: "smooth" });
    }
}

function goPrevPage() {
    if (pdfState.currentPage == 1) {
        pdfState.currentPage = 1;
        document.getElementById('current_page').value = 1;
    } else {
        pdfState.currentPage -= 1;
        document.getElementById("current_page").value = pdfState.currentPage;
        jumpTo(pdfState.currentPage);
    }
}

function goNextPage() {
    if (pdfState.currentPage >= pdfState.pdf._pdfInfo.numPages) {
        pdfState.currentPage = pdfState.pdf._pdfInfo.numPages;
        document.getElementById('current_page').value = pdfState.pdf._pdfInfo.numPages;
    } else {
        pdfState.currentPage += 1;
        document.getElementById("current_page").value = pdfState.currentPage;
        jumpTo(pdfState.currentPage);
    }
}

function enterPageNum(e) {
    e.preventDefault;

    if (e.key == 'Enter') {
        const desiredPage = document.getElementById('current_page').valueAsNumber;

        if (desiredPage >= 1 && desiredPage <= pdfState.pdf._pdfInfo.numPages) {
            pdfState.currentPage = desiredPage;
            document.getElementById("current_page").value = pdfState.currentPage;
            jumpTo(desiredPage);
        }
    }
}

function renderAllPages(page) {
    let pdfViewer = document.getElementById('pdf_viewer');
    let viewport = page.getViewport({
        scale: pdfState.zoom
    });

    let canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.marginBottom = "20px";

    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    pdfState.pageHeight.push(canvas.height);

    // Render PDF page into canvas context
    page.render({
        canvasContext: context,
        viewport: viewport
    });

    pdfViewer.appendChild(canvas);

    pageCounter++;
    if (pdfState.pdf != null && pageCounter <= pdfState.pdf._pdfInfo.numPages) {
        pdfState.pdf.getPage(pageCounter).then(renderAllPages);
    }
}

function resetRendering() {
    let pdfViewer = document.getElementById('pdf_viewer');
    while (pdfViewer.firstChild) {
        pdfViewer.removeChild(pdfViewer.firstChild);
    }
    pdfState.pageHeight = [];
    pageCounter = 1;
}

function cleanUp() {
    try {
        let pdf = pdfState.pdf;
    } catch (e) {
        if (e instanceof TypeError) {} else {
            pdfState.pdf = null;
        }
    } finally {
        pdfState.zoom = 1.0;
        resetRendering();
    }
}

function zoomIn() {
    if (pdfState.zoom < 4.0) {
        let percent = toPercent(pdfState.zoom);
        percent += 20;
        if (percent < 400) {
            document.getElementById('zoom_factor').value = percent + "%";
            pdfState.zoom = toFactor(percent);
            resetRendering();
            pdfState.pdf.getPage(1).then(renderAllPages);
        }
    }

}

function zoomOut() {
    if (pdfState.zoom > 0.4) {
        let percent = toPercent(pdfState.zoom);
        percent -= 20;
        if (percent > 40) {
            document.getElementById('zoom_factor').value = percent + "%";
            pdfState.zoom = toFactor(percent);
            resetRendering();
            pdfState.pdf.getPage(1).then(renderAllPages);
        }
    }
}

function enterZoomFactor(e) {
    e.preventDefault;

    if (e.key == 'Enter') {
        const desiredZoom = document.getElementById('zoom_factor').value;

        let zoomVal = 0;
        if (desiredZoom.charAt(desiredZoom.length - 1) == '%') {
            zoomVal = parseInt(desiredZoom.substring(0, desiredZoom.length - 1));
        } else {
            zoomVal = parseInt(desiredZoom);
        }

        if (zoomVal >= 40 && zoomVal <= 400) {

            pdfState.zoom = toFactor(zoomVal);
            document.getElementById("zoom_factor").value = zoomVal + "%";

            resetRendering();
            pdfState.pdf.getPage(1).then(renderAllPages);
        }
    }
}

function resetToDefaults() {
    document.getElementById("current_page").value = 1;
    document.getElementById("zoom_factor").value = 100 + "%";
    document.getElementById("pdf_viewer").style.visibility = "visible";
    document.getElementById("margin_buttons").style.visibility = "visible";
    document.getElementById("reader_controls").style.visibility = "visible";
}

function toPercent(factor) {
    let strFloat = factor.toString();
    let strFTimes100 = "";
    let digits = strFloat.split('.');
    if (strFloat.length == 3) {
        if (digits[0] == '0') {
            strFTimes100 = digits[1] + '0';
        } else {
            strFTimes100 = digits[0] + digits[1] + '0';
        }
    } else if (strFloat.length == 4) {
        if (digits[0] == '0') {
            strFTimes100 = digits[1] + digits[2];
        } else {
            strFTimes100 = digits[0] + digits[1] + digits[2];
        }
    } else {
        strFTimes100 = strFloat + "00";
    }
    let intTimes100 = parseInt(strFTimes100);
    return intTimes100;
}

function toFactor(percentage) {
    let times10 = percentage * 100;
    let strDiv100 = (times10 / 100).toString();
    let strToDecimal = '';
    if (strDiv100.length == 2) {
        strToDecimal = "0." + strDiv100.substring(0, 1) + strDiv100.substring(1, 2);
    } else {
        strToDecimal = strDiv100.substring(0, 1) + '.' + strDiv100.substring(1, 2) + strDiv100.substring(2, 3);
    }

    let div100Float = parseFloat(strToDecimal);
    return div100Float;
}

document.getElementById('inputfile').onchange = function(e) {
    cleanUp();

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument(typedarray);
        loadingTask.promise.then(pdf => {
            resetToDefaults();
            pdfState.pdf = pdf;
            pdfState.pdf.getPage(1).then(renderAllPages);
        });

    }
    fileReader.readAsArrayBuffer(file);
}

document.getElementById('go_previous').addEventListener('click', goPrevPage);
document.getElementById('go_next').addEventListener('click', goNextPage);
document.getElementById('current_page').addEventListener('keyup', enterPageNum);
document.getElementById('zoom_in').addEventListener('click', zoomIn);
document.getElementById('zoom_factor').addEventListener('keyup', enterZoomFactor);
document.getElementById('zoom_out').addEventListener('click', zoomOut);