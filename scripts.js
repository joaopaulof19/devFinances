const Modal = {
    open() {
        // abrir modal
        // adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')
    },

    close() {
        // fechar o modal
        // remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    },
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },

    set(transaction) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
    }
}


// const transactions = [
//     {

//         description: 'luz',
//         amount: -50000,
//         date: '23/01/2021'
//     },
//     {

//         description: 'website',
//         amount: 500000,
//         date: '23/01/2021'
//     },
//     {

//         description: 'Internet',
//         amount: -20000,
//         date: '23/01/2021'
//     },
//     {

//         description: 'App',
//         amount: 20000,
//         date: '23/01/2021'
//     },
// ]

const Transaction = {
    all: Storage.get(),


    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
        // console.log(Transaction.all);
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        // somar as entradas
        let income = 0;

        Transaction.all.forEach((transaction) => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income
    },
    expenses() {
        // somar as saídas
        let expense = 0;

        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        return expense
    },
    total() {
        // entradas - saídas
        return Transaction.incomes() + Transaction.expenses()
    }

}


const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        // console.log(transaction)
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },


    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class='descripion'>${transaction.description}</td>
            <td class='${CSSclass}'>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}


const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return (signal + value);
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value

        }
    },


    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === '') {
            throw new Error('Por favor, preencha todos os campos')
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    // saveTransaction(transaction) {
    //     Transaction.add(transaction)
    // },

    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault() //interrompendo comportamento padrão
        // para fazer o que deve ser feito
        try {

            // verificar se todas as informações foram preenchidas
            Form.validateFields()

            // formatar os dados para salvar
            const transaction = Form.formatValues()

            // salvar
            // Form.saveTransaction()
            Transaction.add(transaction)
            // apagar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.close()

            // atualizar a aplicação
            // App.reload()

        } catch (error) {
            alert(error.message)
        }
    }
}



// Storage.set('Alooou')
// Storage.get()


const App = {
    init() {
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        });

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}


App.init()


// Atalho para fechar primeiro nivel: ctrl + A -> ctrl + k -> ctrl + 1 