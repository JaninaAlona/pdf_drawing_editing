$(document).ready(function() {
    const { PDFDocument } = PDFLib
    let numOfPages = 1;
    let width = 210;
    let height = 297;

    async function createPdf() {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create()

        for (let i = 0; i < numOfPages; i++) {
            pdfDoc.addPage([width, height])
        }

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()

        // Trigger the browser to download the PDF document
        download(pdfBytes, "blank_pdf.pdf", "application/pdf");
    }


    function openEmptyPageDialog() {
        $("#empty_page_dialog").dialog({
            autoOpen: false,
            dialogClass: "no-close"
        });
        $("#create_pdf").click(function() {
            $("#empty_page_dialog").dialog("open");
            $("#save").click(function() {
                saveInput();
                createPdf();
            })
        });
    }

    function saveInput() {
        numOfPages = document.getElementById('pages').valueAsNumber;
        if (numOfPages < 5000 && numOfPages > 0) {
            document.getElementById('pages').valueAsNumber = numOfPages;
        } else {
            //display warning -> dialog
        }

        width = document.getElementById('width').valueAsNumber;

        //min: DIN A7, max DIN A0
        if (width >= 74 && width <= 841) {
            document.getElementById('width').value = width;
        } else {
            //warning
        }

        height = document.getElementById('height').valueAsNumber;

        //min: DIN A7, max DIN A0
        if (height >= 74 && height <= 841) {
            document.getElementById('height').value = height;
        } else {
            //warning window
        }
    }

    openEmptyPageDialog();
});