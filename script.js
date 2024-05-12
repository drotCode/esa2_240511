const toggleHidden = (element) => { element.classList.toggle("hidden") }
let blurAnim = {
    args: [[{ filter: "blur(2px)" }, { filter: "blur(0px)" },], { duration: 200 }],
    playOn(element) { element.animate(...this.args) }
}


const names = {
    hgb: {
        wrap: {
            header: 0,
            input: { range: 0, number: 0, },
            unit: 0,
        },
        form: { date: 0, },
        text: { value: 0, date: 0, }
    },

    kg: {
        wrap: {
            header: 0,
            input: { range: 0, number: 0, },
            unit: 0,
        },
        text: { value: 0, }
    },

    ertrptn: {
        wrap: {
            header: 0,
            input: { range: 0, number: 0, },
            unit: 0,
        },
        text: { perKg: 0, }
    },

    drbptn: {
        wrap: {
            header: 0,
            input: { range: 0, number: 0, },
            unit: 0,
        },
        text: { perKg: 0, }
    },

    ferritin: {
        form: { value: 0, date: 0, },
        text: {
            span: { value: 0, date: 0, },
        }
    },
test: 0
}



class Parameter {
    constructor(name, value, decimals, options = {}) {
        this.name = name;
        this.value = value
        this.decimals = decimals
        this.options = options
        this.textElements = document.querySelectorAll("." + name + "Span")
        this.wrap = document.getElementById(name + "Wrap")
        this.rangeInput = document.getElementById(name + "Range")
        this.numberInput = document.getElementById(name + "Number")
        this.inputs = [this.numberInput, this.rangeInput]
    }
    setValue(x) {
        if (x > this.options.max) { return; }
        x = (+x).toFixed(this.decimals);
        if (this.value != x) {
            this.value = x;
            blurAnim.playOn(this.numberInput)
        }
        this.inputs.forEach((input) => input.value = x)
        this.textElements.forEach((textElement) => textElement.innerText = x)
    }
}

const perKg = {
    get ertrptn() { return hgb.value <= 11 ? 150 : hgb.value <= 12 ? 75 : 0 },
    get drbptn() { return hgb.value <= 11 ? 0.75 : hgb.value <= 12 ? 0.35 : 0 },
    // type: // 0 1 2
}

let hgb = new Parameter("hgb", 10, 2)
let kg = new Parameter("kg", 50, 1, { max: 100 })
let ertrptn = new Parameter("ertrptn", 7500, 0)
let drbptn = new Parameter("drbptn", 37.5, 1)


const updateDoses = () => {
    ertrptn.setValue(perKg.ertrptn * kg.value)
    drbptn.setValue(perKg.drbptn * kg.value)

}

hgb.inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        hgb.setValue(e.target.value)

        updateDoses()



        let val = e.target.value
        let cont = hgb.wrap
        val > 12 ? cont.classList.add("noDose")
            : val > 11 ? cont.classList.add("lowDose") : null;
        val < 11 ? cont.classList.remove("lowDose")
            : val < 12 ? cont.classList.remove("noDose") : null;

        document.querySelectorAll(".perKgErtrptnSpan").forEach((span) => {
            span.innerText = perKg.ertrptn
        });
        document.querySelectorAll(".perKgDrbptnSpan").forEach((span) => {
            span.innerText = perKg.drbptn
        });


    })
})
kg.inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        kg.setValue(e.target.value)
        updateDoses()


    })
})

ertrptn.inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        ertrptn.setValue(e.target.value)
        kg.setValue(ertrptn.value / perKg.ertrptn)
        updateDoses()
    })
})
drbptn.inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        drbptn.setValue(e.target.value)
        kg.setValue(drbptn.value / perKg.drbptn)
        updateDoses()
    })
})

let nonparam = {
    dates: ["hgb", "ferritin"],
    numbers: ["ferritin"]
}

nonparam.dates.map(word => word + "Date").forEach((word) => {
    document.getElementById(word + "Form").addEventListener("input", ({ target: { value: dateString } }) => {
        document.querySelectorAll("." + word + "Span").forEach((span) => {
            let dateStringTr = dateString.split("-").toReversed().join(".")
            span.innerText = dateStringTr

        })
    })
})

