const { PDFDocument } = PDFLib
let blankNumOfPages = 1;
let pageWidth = 210;
let pageHeight = 297;

async function createPdf() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    let page;

    //page library factor 352.8
    const pageWFactor = (pageWidth * 1000) / 352.8;
    const pageHFactor = (pageHeight * 1000) / 352.8;

    for (let i = 0; i < blankNumOfPages; i++) {
        page = pdfDoc.addPage()
        page.setMediaBox(0, 0, pageWFactor, pageHFactor)
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // Trigger the browser to download the PDF document
    download(pdfBytes, "blank_pdf.pdf", "application/pdf");
}

function saveInput() {
    if (blankNumOfPages < 5000 && blankNumOfPages > 0) {
        document.getElementById('pages').valueAsNumber = blankNumOfPages;
    } else {
        //display warning -> dialog
    }

    pageWidth = document.getElementById('width').valueAsNumber;

    //min: DIN A7, max DIN A0
    if (pageWidth >= 74 && pageWidth <= 1189) {
        document.getElementById('width').value = pageWidth;
    } else {
        //warning
    }

    pageHeight = document.getElementById('height').valueAsNumber;

    //min: DIN A7, max DIN A0
    if (pageHeight >= 74 && pageHeight <= 1189) {
        document.getElementById('height').value = pageHeight;
    } else {
        //warning window
    }
}






(function() {
    this.Widget = function() {
      // HTML source code for the widget
      this.html =
        `<div id="empty_page_dialog">` +
        `    <fieldset class="pop_up">` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="pages">Number of pages</label>` +
        `            <input id="pages" type="number" value="1" />` +
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
        `            <input id="width" type="number" value="297" />` +
        `        </div>` +
        `        <div class="pop_elem_size pop_bottom_pad">` +
        `            <label for="height">Height in mm</label>` +
        `            <input id="height" type="number" value="210" />` +
        `        </div>` +
        `        <div class="pop_elem_size">` +
        `            <button id="save" class="btn btn-success">Save</button>` +
        `            <button id="cancel" class="btn btn-success">Cancel</button>` +
        `        </div>` +
        `    </fieldset>` +  
        `</div>`;
      var defaults = {
        containerId: "blank_pdf_widget",
      };
      this.options = defaults;
  
      initializeWidget(this);
      initialiseEvents(this);
    };

    function initializeWidget(self) {
      var container = document.getElementById(self.options.containerId);
      if (container) { 
        // Appending the widget html code to the block which has the id "widget" in the demo page
        container.innerHTML = self.html;
      }
    }
    function initialiseEvents(self) {
        document.getElementById('portrait').addEventListener('click', function() {
            let width = document.getElementById('width').valueAsNumber;
            let height = document.getElementById('height').valueAsNumber;
            if (width > height) {
                pageWidth = height;
                pageHeight = width;
                document.getElementById('width').value = height;
                document.getElementById('height').value = width;
            }
        });
        
        document.getElementById('landscape').addEventListener('click', function() {
            let width = document.getElementById('width').valueAsNumber;
            let height = document.getElementById('height').valueAsNumber;
            if (width < height) {
                pageWidth = height;
                pageHeight = width;
                document.getElementById('width').value = height;
                document.getElementById('height').value = width;
            }
        });
        
        document.getElementById('quadratic').addEventListener('click', function() {
            const width = document.getElementById('width').valueAsNumber;
            const height = document.getElementById('height').valueAsNumber;
            if (width < height || width > height) {
                pageWidth = width;
                pageHeight = width;
                document.getElementById('height').value = width;
            }
        });

        const dinaSelector = document.querySelector('#dinasize');
        dinaSelector.addEventListener('click', function() {
                const dinaSizes = setDINAFormats(dinaSelector.selectedIndex);
                pageWidth = dinaSizes[0];
                pageHeight = dinaSizes[1];
                document.getElementById('width').value = dinaSizes[0];
                document.getElementById('height').value = dinaSizes[1];
            });
        
        document.getElementById('save').addEventListener('click', function() {
            saveInput();
            createPdf();
        });
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





