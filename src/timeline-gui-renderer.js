const timelines_holder = document.querySelector("#timelines")

window.electronAPI.create_page((event) => {
    const page = document.createElement("div")
    page.classList.add("timelines-page")

    const indicator = document.createElement("span")
    indicator.textContent = `${timelines_holder.childElementCount} time units`
    page.appendChild(indicator)
    timelines_holder.appendChild(page)
})

window.electronAPI.render_timeline((event, input, timeline) => {
    console.log("recv",  event, input, timeline)

    // create a new clone of the container template
    const container = document.querySelector("#timeline-template").content.firstElementChild.cloneNode(true)
    document.querySelector("#timelines > div:last-child").appendChild(container)

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

const load_file_button = document.querySelector("#load-file")
load_file_button.addEventListener("dragover", (event) => {
    event.preventDefault()
});

load_file_button.addEventListener("drop", (event) => {
    event.preventDefault()

    window.electronAPI.load_file(event.dataTransfer.files[0].path)
})
load_file_button.addEventListener("click", () => {
    window.electronAPI.load_file(null)
})
document.querySelector("#submit").addEventListener("click", () => {
    window.electronAPI.load_machine(document.querySelector("#input-string").value)
})