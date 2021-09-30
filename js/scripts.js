$(document).ready(function() {
    let myState = {
        pdf: null,
        currentPage: 1,
        zoom: 1.0
    }

    let numPages = 0;
    let currentPage = 1;

    //reset input fields
    myState.currentPage = 1;
    myState.zoom = 1.0;
    document.getElementById("current_page").value = myState.currentPage;
    document.getElementById('zoom_factor').value = toPercent(myState.zoom);
    const fileManipButtons = document.querySelector('.file_manip');
    fileManipButtons.disabled = true;



    function renderAllPages(page) {

        let pdfViewer = document.getElementById('pdf_viewer');

        let scale = myState.zoom;
        let viewport = page.getViewport({
            scale: scale
        });

        let canvas = document.createElement("canvas");
        canvas.style.display = "block";
        canvas.style.marginBottom = "20px";

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        page.render({
            canvasContext: context,
            viewport: viewport
        });

        pdfViewer.appendChild(canvas);

        currentPage++;
        if (myState.pdf != null && currentPage <= numPages) {
            myState.pdf.getPage(currentPage).then(renderAllPages);
        }
    }

    function RErenderAllPages() {
        currentPage = 1;
        let pdfViewer = document.getElementById('pdf_viewer');
        while (pdfViewer.firstChild) {
            pdfViewer.removeChild(pdfViewer.firstChild);
        }
        myState.pdf.getPage(1).then(renderAllPages);
    }

    function goPrevPage() {
        if (myState.currentPage == 1) {
            myState.currentPage = 1;
            document.getElementById('current_page').value = 1;
        } else {
            myState.currentPage -= 1;
            document.getElementById("current_page").value = myState.currentPage;
        }
    }

    function goNextPage() {
        if (myState.currentPage >= myState.pdf._pdfInfo.numPages) {
            myState.currentPage = myState.pdf._pdfInfo.numPages;
            document.getElementById('current_page').value = myState.pdf._pdfInfo.numPages;
        } else {
            myState.currentPage += 1;
            document.getElementById("current_page").value = myState.currentPage;
        }
    }

    function enterPageNum(e) {
        e.preventDefault;

        if (e.key == 'Enter') {
            const desiredPage = document.getElementById('current_page').valueAsNumber;

            if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
                myState.currentPage = desiredPage;
                document.getElementById("current_page").value = desiredPage;
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

                myState.zoom = toFactor(zoomVal);
                document.getElementById("zoom_factor").value = zoomVal + "%";

                RErenderAllPages();
            }
        }
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
        myState.pdf = null;
        currentPage = 1;
        let pdfViewer = document.getElementById('pdf_viewer');
        while (pdfViewer.firstChild) {
            pdfViewer.removeChild(pdfViewer.firstChild);
        }
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = pdfjsLib.getDocument(typedarray);
            loadingTask.promise.then(pdf => {
                myState.pdf = pdf;
                myState.currentPage = 1;
                currentPage = 1;
                myState.zoom = 1;
                numPages = myState.pdf._pdfInfo.numPages;
                document.getElementById("current_page").value = 1;
                fileManipButtons.disabled = false;
                document.getElementById("pdf_viewer").style.visibility = "visible";
                document.getElementById("margin_buttons").style.visibility = "visible";
                myState.pdf.getPage(1).then(renderAllPages);
            });

        }
        fileReader.readAsArrayBuffer(file);
    }

    document.getElementById('zoom_in').addEventListener('click', (e) => {
        if (myState.zoom < 4.0) {
            let percent = toPercent(myState.zoom);

            percent += 20;
            if (percent >= 400) {
                return;
            }
            document.getElementById('zoom_factor').value = percent + "%";
            myState.zoom = toFactor(percent);
        }
        RErenderAllPages();
    });

    document.getElementById('zoom_out').addEventListener('click', (e) => {
        if (myState.zoom > 0.4) {
            let percent = toPercent(myState.zoom);

            percent -= 20;
            if (percent <= 40) {
                return;
            }
            document.getElementById('zoom_factor').value = percent + "%";
            myState.zoom = toFactor(percent);

        }
        RErenderAllPages();
    });

    document.getElementById('go_previous').addEventListener('click', goPrevPage);
    document.getElementById('go_next').addEventListener('click', goNextPage);
    document.getElementById('current_page').addEventListener('keyup', enterPageNum);
    document.getElementById('zoom_factor').addEventListener('keyup', enterZoomFactor);
});