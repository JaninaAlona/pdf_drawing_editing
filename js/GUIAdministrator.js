let GUIAdministrator = class GUIAdministrator {

    static activateReaderControls(active) {
        let prevBtn = document.querySelector("#go_previous");
        let currPageInput = document.querySelector("#current_page");
        let nextBtn = document.querySelector("#go_next");
        let zoomInBtn = document.querySelector("#zoom_in");
        let zoomFactorInput = document.querySelector("#zoom_factor");
        let zoomOutBtn = document.querySelector("#zoom_out");

        if (active) {
            prevBtn.disabled = false;
            currPageInput.disabled = false;
            nextBtn.disabled = false;
            zoomInBtn.disabled = false;
            zoomFactorInput.disabled = false;
            zoomOutBtn.disabled = false;
        } else {
            prevBtn.disabled = true;
            currPageInput.disabled = true;
            nextBtn.disabled = true;
            zoomInBtn.disabled = true;
            zoomFactorInput.disabled = true;
            zoomOutBtn.disabled = true;
        }

        return active;
    }

    static resetToDefaults() {
        document.getElementById("current_page").value = 1;
        document.getElementById("zoom_factor").value = 100 + "%";
        this.activateReaderControls(false);
        document.getElementById("pdf_viewer").style.visibility = "visible";
        document.getElementById("margin_buttons").style.visibility = "visible";
    }

    static toPercent(factor) {
        let strFloat = factor.toString();
        let strFTimes100 = "";
        let digits = strFloat.split('.');
        if (strFloat.length == 3) {
            if (digits[0] == '0') {
                strFTimes100 = digits[1] + '0';
            } else {
                strFTimes100 = digits[0] + digits[1] + '0';
            }
        } else if (strFloat.length == 4) {
            if (digits[0] == '0') {
                strFTimes100 = digits[1] + digits[2];
            } else {
                strFTimes100 = digits[0] + digits[1] + digits[2];
            }
        } else {
            strFTimes100 = strFloat + "00";
        }
        let intTimes100 = parseInt(strFTimes100);
        return intTimes100;
    }

    static toFactor(percentage) {
        let times10 = percentage * 100;
        let strDiv100 = (times10 / 100).toString();
        let strToDecimal = '';
        if (strDiv100.length == 2) {
            strToDecimal = "0." + strDiv100.substring(0, 1) + strDiv100.substring(1, 2);
        } else {
            strToDecimal = strDiv100.substring(0, 1) + '.' + strDiv100.substring(1, 2) + strDiv100.substring(2, 3);
        }

        let div100Float = parseFloat(strToDecimal);
        return div100Float;
    }
}