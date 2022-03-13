const { PDFDocument } = PDFLib


let blankNumOfPagesCount = 1;
let blankPageWidth = 210;
let blankPageHeight = 297;

let selectedPDF;
let selectedPDFBytes;
let splittedPDFs = [];

const splitter = Vue.createApp({
    data() {
        return {
            noCancle: true,
            pdfToSplit: null,
        }
    },

    methods: {
        toggleCancle() {
            this.noCancle = false;
        },

        selectFile(e) {
            cleanUp();
            const file = e.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = function() {
                selectedPDFBytes = new Uint8Array(this.result);
                selectedPDF = pdfjsLib.getDocument(selectedPDFBytes);
            }
            fileReader.readAsArrayBuffer(file);
            this.pdfToSplit = file.name;
        },

        selectRegularSplit(regularSplitOpt) {
            switch(regularSplitOpt) {
                case 0:
                    splittedPDFs.push(selectedPDF);
                    break;
                case 1:
                    applySplitEveryPage();
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        },
        async saveSplittedPDFs() {
            for(let i = 0; i < splittedPDFs.length; i++) {
                const pdfBytes = await splittedPDFs[i].save();
                download(pdfBytes, "split_pdf_" + i + ".pdf", "application/pdf");
            } 
            splittedPDFs = [];
            cleanUp();
            this.noCancle = false;
        }
    }
});

splitter.mount('#split_app');


async function applySplitEveryPage() {
    let srcPDFDoc = await PDFDocument.load(selectedPDFBytes);
    for(let i = 0; i < srcPDFDoc.getPages().length; i++) {
        let newPDFDoc = await PDFDocument.create();
        let newPage = await newPDFDoc.copyPages(srcPDFDoc, [i]);
        const [currentPage] = newPage;
        newPDFDoc.addPage(currentPage);
        splittedPDFs.push(newPDFDoc);
    }
}