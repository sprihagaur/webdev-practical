const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const filterInput = document.getElementById("filter");
const addBtn = document.getElementById("add-btn");
const errorMsg = document.getElementById("error");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const totalLabel = document.getElementById("total-label");

let expenses = [];
let nextId = 1;

function formatMoney(value) {
  return "₹" + value.toFixed(2);
}

function addExpense() {
  const name = nameInput.value.trim();
  const amountText = amountInput.value.trim();
  const amount = parseFloat(amountText);

  // Validation
  if (name === "" || amountText === "") {
    errorMsg.textContent = "Please fill in both the expense name and the amount.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    errorMsg.textContent = "Amount must be a number greater than 0.";
    return;
  }

  errorMsg.textContent = "";
  expenses.push({ id: nextId++, name, amount, category: categoryInput.value });

  nameInput.value = "";
  amountInput.value = "";
  nameInput.focus();
  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(function (e) { return e.id !== id; });
  render();
}

function render() {
  const selected = filterInput.value;
  const visible = selected === "All"
    ? expenses
    : expenses.filter(function (e) { return e.category === selected; });

  list.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = expenses.length === 0
      ? "No expenses yet. Add your first one above."
      : "No expenses in this category.";
    list.appendChild(empty);
  }

  visible.forEach(function (e) {
    const li = document.createElement("li");
    li.className = "expense-item";

    const nameEl = document.createElement("span");
    nameEl.className = "expense-name";
    nameEl.textContent = e.name;

    const tag = document.createElement("span");
    tag.className = "tag " + e.category;
    tag.textContent = e.category;

    const amountEl = document.createElement("span");
    amountEl.className = "expense-amount";
    amountEl.textContent = formatMoney(e.amount);

    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "Delete";
    del.addEventListener("click", function () { deleteExpense(e.id); });

    li.append(nameEl, tag, amountEl, del);
    list.appendChild(li);
  });

  // Total follows the current filter
  const total = visible.reduce(function (sum, e) { return sum + e.amount; }, 0);
  totalEl.textContent = formatMoney(total);
  totalLabel.textContent = selected === "All" ? "Total spent" : "Total spent on " + selected;
}

addBtn.addEventListener("click", addExpense);
filterInput.addEventListener("change", render);
[nameInput, amountInput].forEach(function (input) {
  input.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter") addExpense();
  });
});

render();
