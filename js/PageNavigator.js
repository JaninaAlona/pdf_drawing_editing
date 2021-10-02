let PageNavigator = class PageNavigator {
    constructor(pdf, currentPage, pageHeight) {
        this.pdf = pdf;
        this.currentPage = currentPage;
        this.pageHeight = pageHeight;
    }

    get getPdf() {
        return this.pdf;
    }

    /**
     * @param {any} pdf
     */
    set setPdf(pdf) {
        this.pdf = pdf;
    }

    /**
     * @param {any} currentPage
     */
    set setCurrentPage(currentPage) {
        this.currentPage = currentPage;
    }

    addHeight(height) {
        this.pageHeight.push(height);
    }

    resetHeights() {
        this.pageHeight = [];
    }

    goPrevPage() {
        if (this.currentPage == 1) {
            this.currentPage = 1;
            document.getElementById('current_page').value = 1;
        } else {
            this.currentPage -= 1;
            document.getElementById("current_page").value = this.currentPage;
            jumpTo(this.currentPage);
        }
    }

    goNextPage() {
        if (this.currentPage >= this.pdf._pdfInfo.numPages) {
            this.currentPage = this.pdf._pdfInfo.numPages;
            document.getElementById('current_page').value = this.pdf._pdfInfo.numPages;
        } else {
            this.currentPage += 1;
            document.getElementById("current_page").value = this.currentPage;
            jumpTo(this.currentPage);
        }
    }

    enterPageNum(e) {
        e.preventDefault;

        if (e.key == 'Enter') {
            const desiredPage = document.getElementById('current_page').valueAsNumber;

            if (desiredPage >= 1 && desiredPage <= this.pdf._pdfInfo.numPages) {
                this.currentPage = desiredPage;
                document.getElementById("current_page").value = this.currentPage;
                jumpTo(desiredPage);
            }
        }
    }

    jumpTo(pageToJump) {
        //set to pixel position below previous page of desired page
        let jumpAnchor = 0;

        if (this.currentPage == 1) {
            window.scrollTo(0, 0);
        } else {
            for (let i = 0; i < pageToJump - 1; i++) {
                jumpAnchor = jumpAnchor + this.pageHeight[i] + 20;
            }

            window.scrollTo(0, jumpAnchor, { behavior: "smooth" });
        }
    }

}