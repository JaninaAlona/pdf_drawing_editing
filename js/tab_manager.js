var tabs = {
    // (A) INIT
    nav : null, // HTML tabs
    con : null, // HTML containers
    allTabs : null,
    allSecs : null,

    init : function () {
        // (A1) GET ALL TABS & SECTIONS
        tabs.nav = document.getElementById("open_pdf_tab_nav");
        tabs.con = document.getElementsById("reader_tab_con");
    
        //initialize tabs and sections
        tabs.allTabs = document.getElementsByClassName("open_pdf_tab_elem");
        tabs.allSecs = document.getElementsByClassName("reader_tab_sec");

        for (let i = 0; i < tabs.allTabs.length; i++) {
            tabs.allTabs[i].addEventListener('click', tabs.show);
        }

        tabs.allTabs[0].click();
    },
  
    /////////Continue working here:
    // (B) SHOW SELECTED TAB
    show : function () {
        // (B1) GET TAB ITEMS & SECTIONS
        let allTabs = tabs.nav[this.dataset.i].getElementsByClassName("open_pdf_tab_elem"),
            thisCon = tabs.con[this.dataset.i],
            allSecs = thisCon.getElementsByClassName("reader_tab_sec");
  
        // (B2) UPDATE SELECTED TAB
        for (let i=0; i<allTabs.length; i++) {
            allTabs[i].classList.remove("active");
        }
        this.classList.add("active");

        // (B3) HIDE SECTIONS
        if (allSecs.length != 0) {
            for (let j=0; j<allSecs.length; j++) {
                allSecs[j].classList.remove("active");
            }
        }

        // (B4) "NORMAL TAB" - SHOW SELECTED SECTION
        allSecs[this.dataset.j].classList.add("active");
    }
};