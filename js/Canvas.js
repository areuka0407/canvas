class Canvas {
    constructor(){
        this.$header = document.querySelector("header");

        this.$aside = document.querySelector("aside");

        this.$canvas = document.querySelector("canvas");
        this.$canvas.width = window.innerWidth - this.$aside.offsetWidth;
        this.$canvas.height = window.innerHeight - this.$header.offsetHeight;


        this.history = [];

        this.canvasEvent();
        this.render();
    }

    canvasEvent(){
        window.addEventListener("resize", () => {
            this.$canvas.width = window.innerWidth - this.$aside.offsetWidth;
            this.$canvas.height = window.innerHeight - this.$header.offsetHeight;
        });
    }

    render(){
        requestAnimationFrame(() => this.render());
    }
}


window.addEventListener("load", () => {
    const app = new Canvas();
});