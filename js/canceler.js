let noCancle = true;

const canceler = Vue.createApp({
    data() {
        return {
            noCancle: true
        }
    },
    methods: {
        toggleCancle() {
            this.noCancle = false
        }
    }
});

canceler.mount('#canceler');