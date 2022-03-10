const { PDFDocument } = PDFLib

let blankNumOfPagesCount = 1;
let blankPageWidth = 210;
let blankPageHeight = 297;

let splitIndexes = [];
let selectedPDF = null;

const splitter = Vue.createApp({
    data() {
        return {
            noCancle: true,
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
                selectedPDF = new Uint8Array(this.result);
            }
            fileReader.readAsArrayBuffer(file);
        },

        selectRegularSplit(regularSplitOpt) {
            switch(regularSplitOpt) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        },
        async saveSplittedPDFs() {

            cleanUp();
            this.noCancle = false;
        }
    }
});

splitter.mount('#split_app');


function applyRegularSplit(runningIndex) {

}


function applySplit() {

}