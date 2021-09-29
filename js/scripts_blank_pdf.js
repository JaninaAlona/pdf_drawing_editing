$(document).ready(function() {
    const { PDFDocument } = PDFLib
    let numOfPages = 1;
    let pageWidth = 210;
    let pageHeight = 297;

    async function createPdf() {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create()

        let page;

        //page library factor 352.8
        const pageWFactor = (pageWidth * 1000) / 352.8;
        const pageHFactor = (pageHeight * 1000) / 352.8;

        for (let i = 0; i < numOfPages; i++) {
            page = pdfDoc.addPage()
            page.setMediaBox(0, 0, pageWFactor, pageHFactor)
        }

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()

        // Trigger the browser to download the PDF document
        download(pdfBytes, "blank_pdf.pdf", "application/pdf");
    }

    function saveInput() {
        numOfPages = document.getElementById('pages').valueAsNumber;
        if (numOfPages < 5000 && numOfPages > 0) {
            document.getElementById('pages').valueAsNumber = numOfPages;
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

    function openEmptyPageDialog() {
        $("#empty_page_dialog").dialog({
            autoOpen: false,
            dialogClass: "no-close"
        });
        $("#create_pdf").on("click", function() {
            $("#empty_page_dialog").dialog("open");

            //reset input values
            document.getElementById('pages').value = 1;
            document.getElementById('width').value = 210;
            document.getElementById('height').value = 297;
            document.getElementById('landscape').checked = false;
            document.getElementById('portrait').checked = true;

            //initialize widget
            $("orientation").checkboxradio();


            $("#portrait").on("click", function() {
                let width = document.getElementById('width').valueAsNumber;
                let height = document.getElementById('height').valueAsNumber;
                if (width > height) {
                    document.getElementById('width').value = height;
                    document.getElementById('height').value = width;
                }
            });

            $("#landscape").on("click", function() {
                let width = document.getElementById('width').valueAsNumber;
                let height = document.getElementById('height').valueAsNumber;
                if (width < height) {
                    document.getElementById('width').value = height;
                    document.getElementById('height').value = width;
                }
            });

            $("#quadratic").on("click", function() {
                let width = document.getElementById('width').valueAsNumber;
                let height = document.getElementById('height').valueAsNumber;
                if (width < height || width > height) {
                    document.getElementById('height').value = width;
                }
            });

            $("#save").on("click", function() {
                saveInput();
                createPdf();
            });

            $("#cancel").on("click", function() {
                $("#empty_page_dialog").dialog("close");
            });
        });
    }

    openEmptyPageDialog();

});