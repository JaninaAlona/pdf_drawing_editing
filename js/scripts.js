let myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1.5
}


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
        page.render(renderContext);
        document.getElementById("canvas_container").style.visibility = "visible";
    });
}


function goPrevPage() {
    if(myState.pdf == null || myState.currentPage == 1) {
        return;
    }    
    myState.currentPage -= 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
}

function goNextPage() {
    if(myState.pdf == null || myState.currentPage > myState.pdf._pdfInfo.numPages) {
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



document.getElementById('inputfile').onchange = function(event) {
    const file = event.target.files[0];
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
    if(myState.pdf == null || myState.zoom > 4.5) {
        return;
    }
    myState.zoom += 0.2;
    render();
});

document.getElementById('zoom_out').addEventListener('click', (e) => {
    if(myState.pdf == null || myState.zoom < 0.5) {
        return;
    }
    myState.zoom -= 0.2;
    render();
});

document.getElementById('go_previous').addEventListener('click', goPrevPage);
document.getElementById('go_next').addEventListener('click', goNextPage);

document.getElementById('pdf_renderer').addEventListener('wheel', scrollPage);