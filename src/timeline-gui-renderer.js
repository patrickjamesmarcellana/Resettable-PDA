const pages_container = document.querySelector("#pages-container")

const set_page = (page) => {
    document.querySelector("#dynamic-styling").innerHTML = `
    /* hide pages */
    .timelines-page:not(:nth-child(${page})) {
        display: none;
    }
`
}
const page_selector = document.querySelector("#page-selector")
page_selector.addEventListener("input", (event) => {
    set_page(page_selector.value)
})
window.electronAPI.create_page((event) => {
    const page = document.createElement("div")
    page.classList.add("timelines-page")

    const indicator = document.createElement("span")
    indicator.textContent = `${pages_container.childElementCount} time units`
    page.appendChild(indicator)
    pages_container.appendChild(page)

    page_selector.min = 1
    page_selector.max = pages_container.childElementCount
})

window.electronAPI.render_timeline((event, input, timeline) => {
    console.log("recv",  event, input, timeline)

    // create a new clone of the container template
    const container = document.querySelector("#timeline-template").content.firstElementChild.cloneNode(true)
    document.querySelector("#pages-container > div:last-child").appendChild(container)

    container.querySelector(".timeline-state").innerHTML = timeline.state

    let input_conv = ""
    console.log(input, timeline.input_head)
    let left_part = input.substring(0, timeline.input_head)
    let mid_part = `<span class="input-head-mark">${input[timeline.input_head] ?? ""}</span>`
    let right_part = input.substring(timeline.input_head + 1)

    container.querySelector(".timeline-input").innerHTML = left_part + mid_part + right_part
    container.querySelector(".timeline-stack").innerHTML = timeline.stack

    if(timeline.status) {
        container.classList.add(timeline.status)
    }

})

window.electronAPI.change_file_path((event, file_path) => {
    document.querySelector("#file-path").textContent = file_path
})

const load_file_button = document.querySelector("#load-file")
load_file_button.addEventListener("dragover", (event) => {
    event.preventDefault()
});

load_file_button.addEventListener("drop", (event) => {
    event.preventDefault()

    const ret = window.electronAPI.load_file(event.dataTransfer.files[0].path)
    console.log(ret)
})
load_file_button.addEventListener("click", () => {
    window.electronAPI.load_file(null)
})
document.querySelector("#submit").addEventListener("click", () => {
    window.electronAPI.load_machine(document.querySelector("#input-string").value)
    set_page(1)
})