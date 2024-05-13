const toggleHidden = (element) => { element.classList.toggle("hidden") }
const blurItem = (el) => { el.animate([{ filter: "blur(2px) brightness(1.1)" }, { filter: "blur(0px)" },], { duration: 100 }) }

class Parameter {
    constructor(name, value, decimals, option = {}) {
        this.name = name;
        this.value = value
        this.decimals = decimals
        this.option = option

        this.element = {
            section: document.querySelector(`.article1 > .${name}`),
            input: {
                number: document.querySelector(`.article1 > .${name} input[type=number]`),
                range: document.querySelector(`.article1 > .${name} input[type=range]`),
            },
            text:{
               valueText: document.querySelectorAll(`.article3 .${name}.value`),
               date: document.querySelectorAll(`.article3 .${name}.date`),

            } 
        };
        this.afterSet = []
    }
    setValue(x) {
        x = (+x).toFixed(this.decimals);
        if (x > this.option.max || x == this.value) { return; } else { this.value = x; }
        let element = this.element;
        [element.input.number, element.input.range, ...element.text.valueText].forEach((el) => {
            if(el){
                el.innerText = el.value = x;
                blurItem(el)
            } 
        })
        this.afterSet.forEach((fn) => fn())
    }
}

let hgb = new Parameter("hgb", 10, 2)
let kg = new Parameter("kg", 50, 1, { max: 100 })
let ertrptn = new Parameter("ertrptn", 7500, 0)
let drbptn = new Parameter("drbptn", 37.5, 1)

hgb.setPerKg = () => {
    let ertEl  = document.querySelectorAll(".perKg.ertrptn");
    let  drbEl  = document.querySelectorAll(".perKg.drbptn");
    if (hgb.value < 11) {
        [ertrptn.perKg, drbptn.perKg] = [150, 0.75];
        hgb.element.section.classList.add("low")
    } else {
        [ertrptn.perKg, drbptn.perKg] = [75, 0.35];
        hgb.element.section.classList.remove("low")
    }
    ertEl.forEach((el) => el.innerText = ertrptn.perKg)
    drbEl.forEach((el) => el.innerText = drbptn.perKg)

}
hgb.date = {
    inputElement : document.querySelector(".article2 .hgb"),
    article3Elements: document.querySelectorAll(".article3 .hgb.date"),
    init() {
        this.inputElement.addEventListener("input", ({target:{value}}) => {
            for (const article3Element of this.article3Elements) {
                article3Element.innerText = value
            }
            
        })
        delete this.init
    }
}
hgb.date.init()

const ferritin = {
    input: {
        date:document.querySelector(".article2 .ferritin.date"),
        value:document.querySelector(".article2 .ferritin.value"),
    },
    article3: {
        date:document.querySelectorAll(".article3 .ferritin.date"),
        value:document.querySelectorAll(".article3 .ferritin.value"),
     },
     init() {
        for (const key in this.input) {
            let inputElement = this.input[key]
            let article3Elements = this.article3[key]
            inputElement.addEventListener("input", ({target:{value}}) => {
                for (const element of article3Elements) {
                    element.innerText = value
                }
            })
        }
        delete this.init
     }
}
ferritin.init()
const updateDoses = () => {
    [ertrptn, drbptn].forEach((param) => {
        param.setValue(param.perKg * kg.value)
    })
}

hgb.afterSet.push(hgb.setPerKg, updateDoses,)
kg.afterSet.push(updateDoses)

ertrptn.afterSet.push(() => kg.setValue(ertrptn.value / ertrptn.perKg))
drbptn.afterSet.push(() => kg.setValue(drbptn.value / drbptn.perKg))

let allParams = [hgb, kg, ertrptn, drbptn];
allParams.forEach((param) => {
    Object.values(param.element.input).forEach((input) => {
        input.addEventListener("input", ({ target: { value } }) => {
            param.setValue(value)
        })
    })
})



