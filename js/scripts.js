$(document).ready(function() {
    let myState = {
        pdf: null,
        currentPage: 1,
        zoom: 1.0
    }

    let renderInProgress = false;

    //reset input fields
    myState.currentPage = 1;
    myState.zoom = 1.0;
    document.getElementById("current_page").value = myState.currentPage;
    document.getElementById('zoom_factor').value = toPercent(myState.zoom);


    function render() {

        // The document is loaded here...
        myState.pdf.getPage(myState.currentPage).then(function(page) {

            let scale = myState.zoom;
            let viewport = page.getViewport({
                scale: scale
            });

            const canvas = document.getElementById('pdf_renderer');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            if (!renderInProgress) {
                doRender(renderContext, page);
            }
        });
    }


    function doRender(renderContext, page) {
        renderInProgress = true;
        let renderOp = page.render(renderContext);
        renderOp.promise.then(function() {
            document.getElementById("canvas_container").style.visibility = "visible";
        }).finally(function() {
            renderInProgress = false;
        })
    }


    function goPrevPage() {
        if (myState.pdf == null || myState.currentPage == 1) {
            myState.currentPage = 1;
            document.getElementById('current_page').value = 1;
        } else {
            myState.currentPage -= 1;
            document.getElementById("current_page").value = myState.currentPage;
            render();
        }
    }

    function goNextPage() {
        if (myState.pdf == null || myState.currentPage >= myState.pdf._pdfInfo.numPages) {
            myState.currentPage = myState.pdf._pdfInfo.numPages;
            document.getElementById('current_page').value = myState.pdf._pdfInfo.numPages;
        } else {
            myState.currentPage += 1;
            document.getElementById("current_page").value = myState.currentPage;
            render();
        }
    }

    function scrollPage(e) {
        e.preventDefault;

        //scrolling down
        if (e.deltaY > 0) {
            goNextPage();

            //scrolling up
        } else if (e.deltaY < 0) {
            goPrevPage();
        }
    }

    function enterPageNum(e) {
        e.preventDefault;

        if (myState.pdf != null) {
            if (e.key == 'Enter') {
                const desiredPage = document.getElementById('current_page').valueAsNumber;

                if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
                    myState.currentPage = desiredPage;
                    document.getElementById("current_page").value = desiredPage;
                    render();
                }
            }
        }
    }

    function enterZoomFactor(e) {
        e.preventDefault;

        if (myState.pdf == null) {
            return;
        } else {
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

                    render();
                }
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
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = pdfjsLib.getDocument(typedarray);
            loadingTask.promise.then(pdf => {
                myState.pdf = pdf;
                myState.currentPage = 1;
                document.getElementById("current_page").value = 1;
                render();
            });

        }
        fileReader.readAsArrayBuffer(file);
    }

    document.getElementById('zoom_in').addEventListener('click', (e) => {
        if (myState.pdf == null || myState.zoom >= 4.0) {
            return;
        }

        if (myState.zoom < 4.0) {
            let percent = toPercent(myState.zoom);

            percent += 20;
            if (percent >= 400) {
                return;
            }
            document.getElementById('zoom_factor').value = percent + "%";
            myState.zoom = toFactor(percent);
        }

        render();
    });

    document.getElementById('zoom_out').addEventListener('click', (e) => {
        if (myState.pdf == null || myState.zoom <= 0.4) {
            return;
        }

        if (myState.zoom > 0.4) {
            let percent = toPercent(myState.zoom);

            percent -= 20;
            if (percent <= 40) {
                return;
            }
            document.getElementById('zoom_factor').value = percent + "%";
            myState.zoom = toFactor(percent);

        }

        render();
    });


    document.getElementById('go_previous').addEventListener('click', goPrevPage);
    document.getElementById('go_next').addEventListener('click', goNextPage);

    document.getElementById('pdf_renderer').addEventListener('wheel', scrollPage);

    document.getElementById('current_page').addEventListener('keyup', enterPageNum);
    document.getElementById('zoom_factor').addEventListener('keyup', enterZoomFactor);
});