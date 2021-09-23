let myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1.0
}

let renderInProgress = false;


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
        return;
    }
    myState.currentPage -= 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
}

function goNextPage() {
    if (myState.pdf == null || myState.currentPage > myState.pdf._pdfInfo.numPages) {
        return;
    }
    myState.currentPage += 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
}

function scrollPage(event) {
    event.preventDefault;

    //scrolling down
    if (event.deltaY > 0) {
        goNextPage();

        //scrolling up
    } else if (event.deltaY < 0) {
        goPrevPage();
    }
}

function enterPageNum(event) {
    event.preventDefault;

    if (myState.pdf == null) {
        return;
    }

    if (event.key == 'Enter') {
        const desiredPage = document.getElementById('current_page').valueAsNumber;

        if (desiredPage >= 1 && desiredPage <= myState.pdf._pdfInfo.numPages) {
            myState.currentPage = desiredPage;
            document.getElementById("current_page").value = desiredPage;
            render();
        }
    }
}


function toPercent(factor) {
    let strFloat = factor.toString();
    console.log("input" + strFloat);
    let strFTimes100 = "";
    if (strFloat.length == 3) {
        let digits = strFloat.split('.');
        strFTimes100 = digits[0] + digits[1] + '0';
    } else {
        strFTimes100 = strFloat + "00";
    }
    console.log("str" + strFTimes100);
    let intTimes100 = parseInt(strFTimes100);
    return intTimes100;
}

function toFactor(percentage) {
    let times10 = percentage * 10;
    let strDiv100 = (times10 / 100).toString();
    let strDecimal = "";
    if (strDiv100.length == 1) {
        strDecimal = "0." + strDiv100;
    } else {
        strDecimal = strDiv100.substring(0, 1) + '.' + strDiv100.substring(1, 2);
    }

    let div100Float = parseFloat(strDecimal);
    return div100Float;
}


document.getElementById('inputfile').onchange = function(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
        //pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
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
        document.getElementById('zoom_factor').value = percent;
        myState.zoom = toFactor(percent);
    }

    render();
});

document.getElementById('zoom_out').addEventListener('click', (e) => {
    if (myState.pdf == null || myState.zoom <= 0.4) {
        return;
    }

    if (myState.zoom > 0.4) {
        console.log("zoom" + myState.zoom);
        let percent = toPercent(myState.zoom);
        percent -= 20;
        document.getElementById('zoom_factor').value = percent;
        myState.zoom = toFactor(percent);

    }
    render();
});

document.getElementById('go_previous').addEventListener('click', goPrevPage);
document.getElementById('go_next').addEventListener('click', goNextPage);

document.getElementById('pdf_renderer').addEventListener('wheel', scrollPage);

document.getElementById('current_page').addEventListener('keyup', enterPageNum);