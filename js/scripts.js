var myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1.5
}


function render() {
    // The document is loaded here...
    myState.pdf.getPage(myState.currentPage).then(function(page) {
        console.log('Page loaded');

        var scale = myState.zoom;
            var viewport = page.getViewport({
            scale: scale
        });

        var canvas = document.getElementById('pdf_renderer');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
}



document.getElementById('inputfile').onchange = function(event) {
  var file = event.target.files[0];
  var fileReader = new FileReader();
  fileReader.onload = function() {
    var typedarray = new Uint8Array(this.result);
    console.log(typedarray);
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadingTask.promise.then(pdf => {
        myState.pdf = pdf;
        render();
    });

  }
  fileReader.readAsArrayBuffer(file);
}