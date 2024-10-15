// Seleciona os elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")

// Esse evento observa quando entra o valor no input
amount.oninput = () => {
  // Formatando com regex(remove não numéricos)
  let value = amount.value.replace(/\D/g, "")
  // Transforma valor para centavos (ex: 150 = R$ 1,50)
  value = Number(value) / 100

  // Repassa o valor já formatado para value
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formata para BRL
  value = value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  })
  // Retorna o valor formatado
  return value
}
// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) => {
  // Previne o reload/recarregar tela
  event.preventDefault()
  // Cria um objeto com os detalhes da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }
  // Chama a função irá add o item na lista
  expenseAdd(newExpense)
}
// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para add o item(li) na lista(ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa

    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona name e category na div expense-info

    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa

    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o ícone de remover 
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    // Add as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    // Add o item na lista
    expenseList.append(expenseItem)

    // limpa o formulário para add um novo item
    formClear()

    // Atualiza os totais
    updateTotals()

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)

  }
}
// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children;

    // Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    // Variável para acumular o total
    let total = 0;

    // Percorre cada item (li) na lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remove caracteres não numéricos e substitui vírgula por ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

      // Converte o valor para float
      value = parseFloat(value);

      // Verifica se é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número.");
      }

      // Soma o valor ao total
      total += value;
    }

    // Exibe o total formatado em BRL no local apropriado
    displayTotal(total);

  } catch (error) {
    console.log(error);
    alert("Não foi possível atualizar os totais.");
  }
}

// Função para exibir o total no <h2> do header do aside
function displayTotal(total) {
  const totalElement = document.querySelector("aside header h2");
  totalElement.innerHTML = `<small>R$</small>${formatCurrencyBRL(total)}`;
}

// Função de formatação BRL
function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
// Verifica se o elemento clicado é o ícone de remover
if(event.target.classList.contains("remove-icon")){
// Obtem a li pai do elemento clicado
const item = event.target.closest(".expense")
// Remove o item da lista 
item.remove()
}
// Atualiza os totais
updateTotals()
})

function formClear() {
  // Limpa os imputs
  expense.value = ""
  category.value = ""
  amount.value = ""
// coloca foco no imput do amount
  expense.focus()
}
