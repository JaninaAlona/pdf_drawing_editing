const { PDFDocument } = PDFLib;
//import { PDFDocument} from 'pdf-lib'

let blankNumOfPagesCount = 1;
let blankPageWidth = 210;
let blankPageHeight = 297;

async function createPdf() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create()

    let page;

    //page library factor 352.8
    const pageWFactor = (blankPageWidth * 1000) / 352.8;
    const pageHFactor = (blankPageHeight * 1000) / 352.8;

    for (let i = 0; i < blankNumOfPagesCount; i++) {
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
    blankNumOfPagesCount = document.getElementById('blank_pages').valueAsNumber;
    document.getElementById('blank_pages').value = blankNumOfPagesCount;

    blankPageWidth = document.getElementById('blank_width').valueAsNumber;
    document.getElementById('blank_width').value = blankPageWidth;

    blankPageHeight = document.getElementById('blank_height').valueAsNumber;
    document.getElementById('blank_height').value = blankPageHeight;
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
    initRestrictInputEvents('blank_pages', blankNumOfPagesCount, 1, 1999);
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

initialiseEvents(self);
