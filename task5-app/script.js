const form = document.getElementById("dataForm");
const typeSelect = document.getElementById("type");
const inputsDiv = document.getElementById("inputs");
const list = document.getElementById("list");

const fields = {
    products: ["Name", "Category", "Price", "Quantity", "Description"],
    buyers: ["Name", "Email", "Phone", "Address"]
};

function renderForm(type) {
    inputsDiv.innerHTML = "";
    fields[type].forEach(f => {
        inputsDiv.innerHTML += `<input placeholder="${f}" name="${f}" required><br>`;
    });
}
renderForm("products");

typeSelect.addEventListener("change", e => {
    renderForm(e.target.value);
    loadData();
});

form.addEventListener("submit", async e => {
    e.preventDefault();
    const type = typeSelect.value;
    const formData = new FormData(form);
    const data = {};
    formData.forEach((val, key) => data[key] = val);

    await fetch(`http://localhost:3000/${type}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
    form.reset();
    renderForm(type);
    loadData();
});

async function loadData() {
    const type = typeSelect.value;
    const res = await fetch(`http://localhost:3000/${type}`);
    const items = await res.json();
    list.innerHTML = "";
    items.forEach(item => {
        list.innerHTML += `<li>${JSON.stringify(item)} 
      <button onclick="del('${type}', ${item.id})">Delete</button></li>`;
    });
}
window.del = async function(type, id) {
    await fetch(`http://localhost:3000/${type}/${id}`, {method: "DELETE"});
    loadData();
};
loadData();
