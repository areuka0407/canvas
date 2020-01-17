class Canvas {
    constructor(){
        this.$aside = document.querySelector("aside");

        this.$canvas = document.querySelector("canvas");
        this.$canvas.width = window.innerWidth - this.$aside.offsetWidth;
        this.$canvas.height = window.innerHeight;


        this.history = [];

        this.canvasEvent();
        this.render();
    }

    canvasEvent(){
        window.addEventListener("resize", () => {
            this.$canvas.width = window.innerWidth - this.$aside.offsetWidth;
            this.$canvas.height = window.innerHeight;
        });
    }

    render(){
        requestAnimationFrame(() => this.render());
    }
}


window.addEventListener("load", () => {
    const app = new Canvas();
});