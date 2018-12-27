const e=window.warpview.h;class t{constructor(){this.modalTitle=""}open(){this.el.style.display="block",this.el.style.zIndex="999999"}close(){this.el.style.display="none",this.el.style.zIndex="-1"}handleKeyDown(e){if("Escape"===e.key)return e.preventDefault(),!1}handleKeyUp(e){if("Escape"===e.key)return e.preventDefault(),this.close(),!1}componentDidLoad(){this.el.addEventListener("click",e=>{"WARP-VIEW-MODAL"===e.path[0].nodeName&&this.close()})}render(){return e("div",{class:"popup"},e("div",{class:"header"},e("div",{class:"title",innerHTML:this.modalTitle}),e("div",{class:"close",onClick:()=>this.close()},"×")),e("div",{class:"body"},e("slot",null)))}static get is(){return"warp-view-modal"}static get encapsulation(){return"shadow"}static get properties(){return{close:{method:!0},el:{elementRef:!0},modalTitle:{type:String,attr:"modal-title"},open:{method:!0}}}static get listeners(){return[{name:"document:keydown",method:"handleKeyDown"},{name:"document:keyup",method:"handleKeyUp"}]}static get style(){return":host{position:fixed;top:0;left:0;z-index:0;display:none;height:100%;overflow:hidden;background-color:rgba(0,0,0,.3)}:host,:host .popup{width:100%;outline:0}:host .popup{position:relative;height:auto;background-color:var(--warpview-popup-bg-color,#fff);top:10%;z-index:999999;background-clip:padding-box;border:1px solid var(--warpview-popup-border-color,rgba(0,0,0,.2));border-radius:.3rem;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;pointer-events:auto;margin:1.75rem auto}\@media (min-width:576px){:host .popup{max-width:800px}}:host .popup .header{background-color:var(--warpview-popup-header-bg-color,#ddd);display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #e9ecef;border-top-left-radius:.3rem;border-top-right-radius:.3rem}:host .popup .header .title{margin-bottom:0;line-height:1.5;color:var(--warpview-popup-title-color,#888)}:host .popup .header .close{padding:1rem 1rem;margin:-1rem -1rem -1rem auto;cursor:pointer;color:var(--warpview-popup-close-color,#888)}:host .popup .body{position:relative;background-color:var(--warpview-popup-body-bg-color,#fff);color:var(--warpview-popup-body-color,#000);height:auto;padding:10px}"}}export{t as WarpViewModal};