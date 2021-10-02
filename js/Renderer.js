let Renderer = class Renderer {
    constructor(navi, pageCounter, zoom) {
        this.navi = navi;
        this.pageCounter = pageCounter;
        this.zoom = zoom;
    }

    get getPageCounter() {
        return this.pageCounter;
    }

    /**
     * @param {any} pageCounter
     */
    set setPageCounter(pageCounter) {
        this.pageCounter = pageCounter;
    }

    get getZoom() {
        return this.zoom;
    }

    /**
     * @param {any} zoom
     */
    set setZoom(zoom) {
        this.zoom = zoom;
    }

    get getNavi() {
        return this.navi;
    }

    renderAllPages(page) {
        let pdfViewer = document.getElementById('pdf_viewer');
        let scale = this.zoom;
        let viewport = page.getViewport({
            scale: scale
        });

        let canvas = document.createElement("canvas");
        canvas.style.display = "block";
        canvas.style.marginBottom = "20px";

        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        this.navi.addHeight(canvas.height);

        // Render PDF page into canvas context
        page.render({
            canvasContext: context,
            viewport: viewport
        });

        pdfViewer.appendChild(canvas);

        this.pageCounter++;
        if (this.navi.getPdf != null && this.pageCounter <= this.navi.getPdf._pdfInfo.numPages) {
            this.navi.getPdf.getPage(this.pageCounter).then(this.renderAllPages);
        }
    }

    static continueRendering() {
        let pdfViewer = document.getElementById('pdf_viewer');
        while (pdfViewer.firstChild) {
            pdfViewer.removeChild(pdfViewer.firstChild);
        }

        if (this.navi != null) {
            this.navi.resetHeights();
        }

    }

    static cleanUp() {
        try {
            let pdf = this.navi.getPdf;
        } catch (e) {
            if (e instanceof TypeError) {} else {
                this.navi.setPdf = null;
            }
            this.pageCounter = 1;
            this.zoom = 1.0;
            this.continueRendering();
        }
    }

    zoomIn() {
        if (this.zoom < 4.0) {
            let percent = GUIAdministrator.toPercent(this.zoom);

            percent += 20;
            if (percent < 400) {
                document.getElementById('zoom_factor').value = percent + "%";
                this.zoom = GUIAdministrator.toFactor(percent);
                this.continueRendering();
            }
        }

    }

    zoomOut() {
        if (this.zoom > 0.4) {
            let percent = GUIAdministrator.toPercent(this.zoom);

            percent -= 20;
            if (percent > 40) {
                document.getElementById('zoomfactor').value = percent + "%";
                this.zoom = GUIAdministrator.toFactor(percent);
                this.continueRendering();
            }
        }
    }

    enterZoomFactor(e) {
        e.preventDefault;

        if (e.key == 'Enter') {
            const desiredZoom = document.getElementById('zoomfactor').value;

            let zoomVal = 0;
            if (desiredZoom.charAt(desiredZoom.length - 1) == '%') {
                zoomVal = parseInt(desiredZoom.substring(0, desiredZoom.length - 1));
            } else {
                zoomVal = parseInt(desiredZoom);
            }

            if (zoomVal >= 40 && zoomVal <= 400) {

                this.zoom = GUIAdministrator.toFactor(zoomVal);
                document.getElementById("zoomfactor").value = zoomVal + "%";

                this.continueRendering();
            }
        }
    }
}