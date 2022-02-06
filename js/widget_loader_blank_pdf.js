const { PDFDocument } = PDFLib;

let cssBlankPDFWidget;
let jsBlankPDFWidget;
let blankNumOfPages = 1;
let blankPageWidth = 210;
let blankPageHeight = 297;

const appBlankPDFDialogue = Vue.createApp({
    methods: {
        popUpBlankPDF() {
            deactivateReaderControls();
            document.getElementById("inputfile").disabled = true;
            
            // Load css
            const css = "css/widget_style_blank_pdf.css";
            
            // Load js
            const js = "js/widget_blank_pdf.js";

            let tab = window.open("", "_blank");
            tab.document.write(readerInstance);
            cssBlankPDFWidget = tab.document.createElement("link");
            cssBlankPDFWidget.rel = "stylesheet";
            cssBlankPDFWidget.href = css;
            
            // Appending stylesheet in the head tag
            tab.document.getElementsByTagName("head")[0].appendChild(cssBlankPDFWidget);

            jsBlankPDFWidget = tab.document.createElement("script");
            jsBlankPDFWidget.async = 1;
            jsBlankPDFWidget.src = js;
            
            // Adding the script in the script tag
            let p = tab.document.getElementsByTagName("script")[0];
            p.parentNode.insertBefore(jsBlankPDFWidget, p);
        }
    }
})
    
appBlankPDFDialogue.mount('#widget_blank_pdf_app');


var readerInstance = 
'<!DOCTYPE html>' +
'<html lang="en">' +
'<head>' +
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
    '<meta name="Author" content="Janina Schroeder">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Javascript PDF Editor</title>' +
    '<link rel="stylesheet" type="text/css" href="css/style.css">' +
    '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">' +    
    '<script type="text/javascript" src="js/pdf.min.js"></script>' +
    '<script type="text/javascript" src="js/pdf.worker.min.js"></script>' +
    '<script type="text/javascript" src="js/pdf-lib.min.js"></script>' +
    '<script type="text/javascript" src="js/download.min.js"></script>' +
    '<script type="text/javascript" src="js/jquery-3.6.0.min.js"></script>' +
    '<script src="https://unpkg.com/vue@3.0.2"></script>' +

    '<body>' +
        '<header id="buttons">' +
            '<div id="start_menu">' +
                '<div class="file_manip">' +
                    '<input type="file" id="inputfile" class="filestyle" data-btnClass="btn-success" data-input="false" accept=".pdf">' +
                '</div>' +
                '<div id="widget_blank_pdf_app">' +
                    '<button @click="popUpBlankPDF" id="create_pdf" class="btn btn-success">Create</button>' +
                    '<div id="blank_pdf_widget"></div>' +
                '</div>' +
            '</div>' +
            '<div id="reader_controls">' +
                '<button id="go_previous" class="pages btn btn-success file_manip">Previous</button>' +
                '<input id="current_page" class="file_manip" value="1" type="number">' +
                '<button id="go_next" class="pages btn btn-success file_manip">Next</button>' +
                '<button id="zoom_in" class="zoom btn btn-success file_manip">+</button>' +
                '<input id="zoom_factor" class="file_manip" value="100%" type="text">' +
                '<button id="zoom_out" class="zoom btn btn-success file_manip">-</button>' +
            '</div>' +
        '</header>' +
        '<div id="pdf_viewer_con">' +
            '<div id="pdf_viewer"></div>' +
        '</div>' +
        '<script type="text/javascript" src="js/bootstrap-filestyle.min.js"></script>' +
        '<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>' +
        '<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>' +
        '<script src="js/widget_loader_blank_pdf.js"></script>' +
        '<script type="text/javascript" src="js/scripts.js"></script>' +
    '</body>' +
'</html>';