const { PDFDocument } = PDFLib


let blankNumOfPagesCount = 1;
let blankPageWidth = 210;
let blankPageHeight = 297;

//let selectedPDF;
let selectedPDFBytes;
let splittedPDFs = [];
let splitMethod = 0;

const splitter = Vue.createApp({
    data() {
        return {
            noCancle: true,
            pdfToSplit: null,
            afterNPages: 2,
            maxPages: 3
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
                //selectedPDF = pdfjsLib.getDocument(selectedPDFBytes);
            }
            fileReader.readAsArrayBuffer(file);
            this.pdfToSplit = file.name;
            document.getElementById('split_after').disabled = false;
        },

        selectRegularSplit(regularSplitOpt) {
            splitMethod = regularSplitOpt;
            switch(regularSplitOpt) {
                case 0:
                    document.getElementById('n_page_slider').disabled = true;
                    document.getElementById('save_split').disabled = true;
                    break;
                case 1:
                    document.getElementById('n_page_slider').disabled = true;
                    document.getElementById('save_split').disabled = false;
                    break;
                case 2:
                    document.getElementById('n_page_slider').disabled = true;
                    document.getElementById('save_split').disabled = false;
                    break;
                case 3:
                    document.getElementById('n_page_slider').disabled = true;
                    document.getElementById('save_split').disabled = false;
                    break;
                case 4:
                    document.getElementById('n_page_slider').disabled = false;
                    document.getElementById('save_split').disabled = false;
                    break;
            }
        },

        async updateSlider() {
            let srcPDFDoc = await PDFDocument.load(selectedPDFBytes);
            this.maxPages = srcPDFDoc.getPages().length;
            let slider = document.getElementById('n_page_slider');
            this.afterNPages = slider.value;
        },

        async saveSplittedPDFs() {
            await computeSplitOptions(this.afterNPages);

            let outputName = this.pdfToSplit;
            outputName = outputName.substring(0, outputName.length - 4);
            for(let i = 0; i < splittedPDFs.length; i++) {
                const pdfBytes = await splittedPDFs[i].save();
                download(pdfBytes, outputName + "_" + i + ".pdf", "application/pdf");
            } 
            splittedPDFs = [];
            cleanUp();
            this.noCancle = false;
        }
    }
});

splitter.mount('#split_app');



async function computeSplitOptions(n) {
    switch(splitMethod) {
        case 0:
            break;
        case 1:
            await applySplitAfterEvery();
            break;
        case 2:
            await splitAfter(2, 1);
            break;
        case 3:
            await splitAfter(2, 0);
            break;
        case 4:
            await splitAfterN(n);
            break;
    }
}


async function applySplitAfterEvery() {
    let srcPDFDoc = await PDFDocument.load(selectedPDFBytes);
    for(let i = 0; i < srcPDFDoc.getPages().length; i++) {
        let newPDFDoc = await PDFDocument.create();
        let newPage = await newPDFDoc.copyPages(srcPDFDoc, [i]);
        const [currentPage] = newPage;
        newPDFDoc.addPage(currentPage);
        splittedPDFs.push(newPDFDoc);
    }
}

async function splitAfter(n, nRest) {
    let firstPage = true;
    let srcPDFDoc = await PDFDocument.load(selectedPDFBytes);
    for(let i = 0; i < srcPDFDoc.getPages().length; i++) {
        if (i % n == nRest) {
            if (firstPage) {
                firstPage = false;
                if (nRest == 1) {
                    let newPDFDoc = await PDFDocument.create();
                    let newPage = await newPDFDoc.copyPages(srcPDFDoc, [0]);
                    const [currentPage] = newPage;
                    newPDFDoc.addPage(currentPage);
                    splittedPDFs.push(newPDFDoc);
                }
            }
            let newPDFDoc = await PDFDocument.create();
            for (let j = i; j < i + n; j++) {
                let newPage = await newPDFDoc.copyPages(srcPDFDoc, [j]);
                const [currentPage] = newPage;
                newPDFDoc.addPage(currentPage);
            }
            splittedPDFs.push(newPDFDoc);
        }
    }
}

async function splitAfterN(n) {
    let srcPDFDoc = await PDFDocument.load(selectedPDFBytes);
    let allPages = srcPDFDoc.getPages().length;

    let newPDFDoc;
    let i = 0;
    do {
        if (i % n == 0) {
            if (i > 0) {
                splittedPDFs.push(newPDFDoc);
            }
            newPDFDoc = await PDFDocument.create();
        }

        if (i >= allPages - n) {
            newPDFDoc = await PDFDocument.create();
        }

        if (i == allPages - 1) {
            splittedPDFs.push(newPDFDoc);
        }

        let newPage = await newPDFDoc.copyPages(srcPDFDoc, [i]);
        const [currentPage] = newPage;
        newPDFDoc.addPage(currentPage);
        
        i++;
    } while(i < allPages);
}