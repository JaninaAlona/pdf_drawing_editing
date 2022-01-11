let cssBlankPDFWidget;
let jsBlankPDFWidget;

const appBlankPDFDialogue = Vue.createApp({
    methods: {
        popUpBlankPDF() {
            deactivateReaderControls();
            resetRendering();
            cleanUp();
            
            // Load css
            const css = "css/widget_style_blank_pdf.css";
            // Load js
            const js = "js/widget_blank_pdf.js";

            cssBlankPDFWidget = document.createElement("link");
            cssBlankPDFWidget.rel = "stylesheet";
            cssBlankPDFWidget.href = css;
            // Appending stylesheet in the head tag
            document.getElementsByTagName("head")[0].appendChild(cssBlankPDFWidget);

            jsBlankPDFWidget = document.createElement("script");
            jsBlankPDFWidget.async = 1;
            jsBlankPDFWidget.src = js;
            // Adding the script in the script tag
            let p = document.getElementsByTagName("script")[0];
            p.parentNode.insertBefore(jsBlankPDFWidget, p);
        }
    }
})
    
appBlankPDFDialogue.mount('#widget_blank_pdf_app');