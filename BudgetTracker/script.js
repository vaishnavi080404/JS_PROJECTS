document.addEventListener('DOMContentLoaded', () => {
    const incomeForm = document.getElementById('income-form');
    const incomeSourceInput = document.getElementById('income-source');
    const incomeAmountInput = document.getElementById('income-amount');
    const incomeItems = document.getElementById('income-items');

    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseItems = document.getElementById('expense-items');

    const incomeChartCtx = document.getElementById('income-chart').getContext('2d');
    const expenseChartCtx = document.getElementById('expense-chart').getContext('2d');
    const balanceDisplay = document.getElementById('balance-display');

    let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function saveIncomes() {
        localStorage.setItem('incomes', JSON.stringify(incomes));
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function renderIncomes() {
        incomeItems.innerHTML = '';
        incomes.forEach((income, index) => {
            const li = createIncomeItem(income, index);
            incomeItems.appendChild(li);
        });
        updateIncomeChart();
        updateBalance();
    }

    function renderExpenses() {
        expenseItems.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = createExpenseItem(expense, index);
            expenseItems.appendChild(li);
        });
        updateExpenseChart();
        updateBalance();
    }

    function createIncomeItem(income, index) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${income.source} - ₹${income.amount.toFixed(2)}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openEditIncomeForm(index));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteIncome(index));
        
        return li;
    }

    function createExpenseItem(expense, index) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.name} - ₹${expense.amount.toFixed(2)}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openEditExpenseForm(index));

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteExpense(index));
        
        return li;
    }

    function openEditIncomeForm(index) {
        const income = incomes[index];
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" value="${income.source}" placeholder="Income Source" id="edit-income-source">
            <input type="number" value="${income.amount}" placeholder="Amount" id="edit-income-amount">
            <button type="submit">Update</button>
            <button type="button" class="cancel-btn">Cancel</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSource = form.querySelector('#edit-income-source').value;
            const newAmount = parseFloat(form.querySelector('#edit-income-amount').value);
            if (newSource && newAmount) {
                incomes[index].source = newSource;
                incomes[index].amount = newAmount;
                saveIncomes();
                renderIncomes();
                form.remove();
            }
        });

        const cancelBtn = form.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => form.remove());

        incomeItems.appendChild(form);
    }

    function openEditExpenseForm(index) {
        const expense = expenses[index];
        const form = document.createElement('form');
        form.innerHTML = `
            <input type="text" value="${expense.name}" placeholder="Expense Name" id="edit-expense-name">
            <input type="number" value="${expense.amount}" placeholder="Amount" id="edit-expense-amount">
            <button type="submit">Update</button>
            <button type="button" class="cancel-btn">Cancel</button>
        `;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = form.querySelector('#edit-expense-name').value;
            const newAmount = parseFloat(form.querySelector('#edit-expense-amount').value);
            if (newName && newAmount) {
                expenses[index].name = newName;
                expenses[index].amount = newAmount;
                saveExpenses();
                renderExpenses();
                form.remove();
            }
        });

        const cancelBtn = form.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => form.remove());

        expenseItems.appendChild(form);
    }

    function deleteIncome(index) {
        incomes.splice(index, 1);
        saveIncomes();
        renderIncomes();
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        saveExpenses();
        renderExpenses();
    }

    function updateIncomeChart() {
        const incomeTotal = incomes.reduce((total, income) => total + income.amount, 0);
        const incomeSources = incomes.map(income => income.source);
        const incomeAmounts = incomes.map(income => income.amount);

        new Chart(incomeChartCtx, {
            type: 'pie',
            data: {
                labels: incomeSources,
                datasets: [{
                    data: incomeAmounts,
                    backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            }
        });
    }

    function updateExpenseChart() {
        const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
        const expenseNames = expenses.map(expense => expense.name);
        const expenseAmounts = expenses.map(expense => expense.amount);

        new Chart(expenseChartCtx, {
            type: 'pie',
            data: {
                labels: expenseNames,
                datasets: [{
                    data: expenseAmounts,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            }
        });
    }

    function updateBalance() {
        const incomeTotal = incomes.reduce((total, income) => total + income.amount, 0);
        const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
        const remainingBalance = incomeTotal - expenseTotal;

        balanceDisplay.textContent = `Your Balance: ₹${remainingBalance.toFixed(2)}`;
    }

    incomeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const source = incomeSourceInput.value;
        const amount = incomeAmountInput.value;
        if (source && amount) {
            addIncome(source, amount);
            incomeSourceInput.value = '';
            incomeAmountInput.value = '';
        }
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = expenseNameInput.value;
        const amount = expenseAmountInput.value;
        if (name && amount) {
            addExpense(name, amount);
            expenseNameInput.value = '';
            expenseAmountInput.value = '';
        }
    });

    function addIncome(source, amount) {
        incomes.push({ source, amount: parseFloat(amount) });
        saveIncomes();
        renderIncomes();
    }

    function addExpense(name, amount) {
        expenses.push({ name, amount: parseFloat(amount) });
        saveExpenses();
        renderExpenses();
    }

    renderIncomes();
    renderExpenses();
});