const app = Vue.createApp({
    methods: {
        popUpBlankPDF() {
            deactivateReaderControls();
            resetRendering();
            cleanUp();
            
            // Load css
            const css = "css/widget_style_blank_pdf.css";
            // Load js
            const js = "js/widget_blank_pdf.js";

            link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = css;
            // Appending stylesheet in the head tag
            document.getElementsByTagName("head")[0].appendChild(link);

            script = document.createElement("script");
            script.async = 1;
            script.src = js;
            // Adding the script in the script tag
            let p = document.getElementsByTagName("script")[0];
            p.parentNode.insertBefore(script, p);
        }
    }
})
    
app.mount('#widget_blank_pdf_app')