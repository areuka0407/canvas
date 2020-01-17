class ColorPicker {
    constructor($target){
        this.status = 0;
        this.$target = $target;
        this.$target.close = this.close;
        
        this.$root = `<div class="picker">
                        <div class="main-color">
                            <div class="cursor"></div>
                            <canvas width="300" height="300"/>
                        </div>
                        <div class="sub-color">
                            <div class="cursor"></div>
                            <canvas width="10" height="300"/>
                        </div>
                      </div>`.parseHTML();
        this.$mainColor = this.$root.querySelector(".main-color canvas");
        this.$mainCursor = this.$mainColor.querySelector(".cursor");
        this.mainCtx = this.$mainColor.getContext("2d");
        
        this.$subColor = this.$root.querySelector(".sub-color canvas");
        this.$subCursor = this.$subColor.querySelector(".cursor");
        this.subCtx = this.$subColor.getContext("2d");

        this.targetEvent();
        this.init();
    }

    init(){
        this.fillSubColor();
    }

    fillSubColor(){
        const {width, height} = this.$subColor;
        let sgrd = this.subCtx.createLinearGradient(0, 0, 0, height);
        sgrd.addColorStop(0, "#f00");
        sgrd.addColorStop(0.166, "#ff0");
        sgrd.addColorStop(0.333, "#0f0");
        sgrd.addColorStop(0.5, "#0ff");
        sgrd.addColorStop(0.666, "#00f");
        sgrd.addColorStop(0.833, "#f0f");
        sgrd.addColorStop(1, "#f00");

        this.subCtx.fillStyle = sgrd;
        this.subCtx.fillRect(0, 0, width, height);
    }

    targetEvent(){
        this.$target.addEventListener("click", e => {
            let list = ".picker".selectAll();
            list.filter(x => x !== this.$root).forEach(x => x.close());
            (!list.includes(this.$root)) && this.open(e);
        });

        window.addEventListener("click", e => {
            let target = e.target;
            while(target !== null && target !== this.$root) target = target.parentElement;
            if(target !== this.$root) this.close();
        });
    }

    open(e){
        if(this.status === 1) return;
        const {pageX, pageY} = e;
        let style = this.$root.style;
        style.left = pageX + "px";
        style.top = pageY + "px";

        document.body.append(this.$root); 
        setTimeout(() => {
            this.status = 1;
            style.opacity = "1";
            style.transform = "translateY(0)";
        });
    }

    close(){
        if(this.status === 0) return;
        let style = this.$root.style;
        style.opacity = "0";
        style.transform = "translateY(-30px)";
        setTimeout(() => {
            this.$root.remove();
            this.status = 0;
        }, 300);
    }
}


window.addEventListener("load", () => {
    ".color-picker".selectAll().forEach(item => new ColorPicker(item));
});