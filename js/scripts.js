$(document).ready(function() {
    GUIAdministrator.resetToDefaults();
    let guiActive = false;

    document.getElementById('inputfile').onchange = function(e) {
        guiActive = GUIAdministrator.activateReaderControls(true);
        Renderer.cleanUp();

        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.onload = function() {
            const typedarray = new Uint8Array(this.result);
            const loadingTask = pdfjsLib.getDocument(typedarray);
            loadingTask.promise.then(pdf => {
                GUIAdministrator.resetToDefaults();
                const navi = new PageNavigator(pdf, []);
                const renderer = new Renderer(navi, 1, 1.0);
                renderer.getNavi.getPdf.getPage(1).then(renderer.renderAllPages);
            });

        }
        fileReader.readAsArrayBuffer(file);
    }

    if (guiActive) {
        document.getElementById('go_previous').addEventListener('click', navi.goPrevPage);
        document.getElementById('go_next').addEventListener('click', navi.goNextPage);
        document.getElementById('current_page').addEventListener('keyup', navi.enterPageNum);
        document.getElementById('zoom_in').addEventListener('click', renderer.zoomIn);
        document.getElementById('zoom_factor').addEventListener('keyup', renderer.enterZoomFactor);
        document.getElementById('zoom_out').addEventListener('click', renderer.zoomOut);
    }

});