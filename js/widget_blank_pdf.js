async function createPdf() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    let page;

    //page library factor 352.8
    const pageWFactor = (blankPageWidth * 1000) / 352.8;
    const pageHFactor = (blankPageHeight * 1000) / 352.8;

    for (let i = 0; i < blankNumOfPages; i++) {
        page = pdfDoc.addPage()
        page.setMediaBox(0, 0, pageWFactor, pageHFactor)
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    cleanUp();
    loadPDFInViewer(pdfBytes);

    // Trigger the browser to download the PDF document
    download(pdfBytes, "blank_pdf.pdf", "application/pdf");
}

function blankSaveInput() {
    blankNumOfPages = document.getElementById('blank_pages').valueAsNumber;
    document.getElementById('blank_pages').value = blankNumOfPages;

    blankPageWidth = document.getElementById('blank_width').valueAsNumber;
    document.getElementById('blank_width').value = blankPageWidth;

    blankPageHeight = document.getElementById('blank_height').valueAsNumber;
    document.getElementById('blank_height').value = blankPageHeight;
}

(function() {
    this.Widget = function() {
      // HTML source code for the widget
      this.html =
        `<div id="empty_page_dialog">` +
        `    <fieldset class="pop_up">` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="pages">Number of pages</label>` +
        `            <input id="blank_pages" type="number" value="1" />` +
        `        </div>` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="size">DIN A page sizes</label>` +
        `            <select class="btn btn-success" name="size" id="dinasize">` +
        `                    <option id="a1" class="dinaSel">DIN A1</option>` +
        `                    <option id="a2" class="dinaSel">DIN A2</option>` +
        `                    <option id="a3" class="dinaSel">DIN A3</option>` +
        `                    <option id="a4" selected="selected" class="dinaSel">DIN A4</option>` +
        `                    <option id="a5" class="dinaSel">DIN A5</option>` +
        `                    <option id="a6" class="dinaSel">DIN A6</option>` +
        `                    <option id="a7" class="dinaSel">DIN A7</option>` +
        `                </select>` +
        `        </div>` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <legend>Orientation</legend>` +
        `            <div>` +
        `                <label for="portrait">Portrait</label>` +
        `                <input type="radio" name="orientation" id="portrait" checked class="space_btw_radio">` +
        `                <label for="landscape">Landscape</label>` +
        `                <input type="radio" name="orientation" id="landscape">` +
        `            </div>` +
        `            <div>` +
        `                <label for="quadratic">Quadratic</label>` +
        `                <input type="radio" name="orientation" id="quadratic">` +
        `            </div>` +
        `        </div>` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="width">Width in mm</label>` +
        `            <input id="blank_width" type="number" value="297" />` +
        `        </div>` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="height">Height in mm</label>` +
        `            <input id="blank_height" type="number" value="210" />` +
        `        </div>` +
        `        <div class="pop_elem_size">` +
        `            <button id="blank_save" class="btn btn-success">Save</button>` +
        `            <button id="blank_cancel" class="btn btn-success">Cancel</button>` +
        `        </div>` +
        `    </fieldset>` +  
        `</div>`;
      let defaults = {
        containerId: "blank_pdf_widget",
      };

      this.options = defaults;
      initializeWidget(this);
      initialiseEvents(this);
    };

    function initializeWidget(self) {
      let container = document.getElementById(self.options.containerId);
      if (container) { 
        container.innerHTML = self.html;
      }
    }

    function restrictInputValues(inputId, valToRestrict, min, max) {
        valToRestrict = document.getElementById(inputId).valueAsNumber;
        if (valToRestrict >= min && valToRestrict <= max) {
            document.getElementById(inputId).value = valToRestrict;
        } else {
            if (valToRestrict < min) {
                document.getElementById(inputId).value = min;
            } else if (valToRestrict > max) {
                document.getElementById(inputId).value = max;
            }
        }
    }

    function initRestrictInputEvents(inputId, valToRestrict, min, max) {
        const inputElem = document.getElementById(inputId);
        inputElem.addEventListener('change', () => restrictInputValues(inputId, valToRestrict, min, max));
        const changeEvent = new Event('change');
        inputElem.dispatchEvent(changeEvent);
    }

    function initialiseEvents(self) {
        initRestrictInputEvents('blank_pages', blankNumOfPages, 1, 1999);
        initRestrictInputEvents('blank_width', blankPageWidth, 74, 1189);
        initRestrictInputEvents('blank_height', blankPageHeight, 74, 1189);

        const dinaSelector = document.querySelector('#dinasize');
        dinaSelector.addEventListener('click', function() {
            const dinaSizes = setDINAFormats(dinaSelector.selectedIndex);
            blankPageWidth = dinaSizes[0];
            blankPageHeight = dinaSizes[1];
            document.getElementById('blank_width').value = dinaSizes[0];
            document.getElementById('blank_height').value = dinaSizes[1];
        });

        document.getElementById('portrait').addEventListener('click', function() {
            let width = document.getElementById('blank_width').valueAsNumber;
            let height = document.getElementById('blank_height').valueAsNumber;
            if (width > height) {
                blankPageWidth = height;
                blankPageHeight = width;
                document.getElementById('blank_width').value = height;
                document.getElementById('blank_height').value = width;
            }
        });
        
        document.getElementById('landscape').addEventListener('click', function() {
            let width = document.getElementById('blank_width').valueAsNumber;
            let height = document.getElementById('blank_height').valueAsNumber;
            if (width < height) {
                blankPageWidth = height;
                blankPageHeight = width;
                document.getElementById('blank_width').value = height;
                document.getElementById('blank_height').value = width;
            }
        });
        
        document.getElementById('quadratic').addEventListener('click', function() {
            const width = document.getElementById('blank_width').valueAsNumber;
            const height = document.getElementById('blank_height').valueAsNumber;
            if (width < height || width > height) {
                blankPageWidth = width;
                blankPageHeight = width;
                document.getElementById('blank_height').value = width;
            }
        });
        
        document.getElementById('blank_save').addEventListener('click', function() {
            blankSaveInput();
            createPdf();
            cleanUp();
            closeBlankPDFWidget();
        });

        document.getElementById('blank_cancel').addEventListener('click', function() {
            closeBlankPDFWidget();
        });
    }

    function closeBlankPDFWidget() {
        document.getElementsByTagName("script")[0].parentNode.removeChild(jsBlankPDFWidget);
        document.getElementsByTagName("head")[0].removeChild(cssBlankPDFWidget);
        document.getElementById("empty_page_dialog").remove();
        document.getElementById("inputfile").disabled = false;
    }

    function setDINAFormats(dinaID) {
        let dinaSizes = [];
        let w = 0;
        let h = 0;
        switch(dinaID) {
            case 0:
                w = 594;
                h = 841;
                break;
            case 1:
                w = 420;
                h = 594;
                break;
            case 2:
                w = 297;
                h = 420;
                break;
            case 3:
                w = 210;
                h = 297;
                break;
            case 4:
                w = 148;
                h = 210;
                break;
            case 5:
                w = 105;
                h = 148;
                break;
            case 6:
                w = 74;
                h = 105;
                break;
            default:
                w = 210;
                h = 297;
        }
        dinaSizes[0] = w;
        dinaSizes[1] = h;
        return dinaSizes;
    }
})();
  
new Widget({});





