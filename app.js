// next steps: add filter buttons to filter expenses

var data = [
    {
        x: "Housing", value: 0,
        normal: {
            fill: "var(--housing)" },
        hovered: {
            fill: "var(--housing-dark)",
        },
    },
    {
        x: "Insurance", value: 0,
        normal: { 
            fill: "var(--insurance)" },
        hovered: {
            fill: "var(--insurance-dark)",
        },
    },
    {
        x: "Food", value: 0,
        normal: { 
            fill: "var(--food)" },
        hovered: {
            fill: "var(--food-dark)",
        },
    },
    {
        x: "Transportation", value: 0,
        normal: { 
            fill: "var(--transportation)" },
        hovered: {
            fill: "var(--transportation-dark)",
        },
    },
    {
        x: "Personal", value: 0,
        normal: { 
            fill: "var(--personal)" },
        hovered: {
            fill: "var(--personal-dark)",
        },
    },
    {
        x: "Recreation", value: 0,
        normal: { 
            fill: "var(--recreation)" },
        hovered: {
            fill: "var(--recreation-dark)",
        },
    },
    {
        x: "Utilities", value: 0,
        normal: { 
            fill: "var(--utilities)" },
        hovered: {
            fill: "var(--utilities-dark)",
        },
    }
];

var categoriesList = ['housing', 'insurance', 'food', 'transportation', 'recreation', 'personal', 'utilities'];

window.addEventListener('load', () => {
    const form = document.querySelector('#new-expense-form');
    const input = document.querySelector('#new-expense-input');
    const expense = document.querySelector('#new-amount-input');
    const expenseListDiv = document.querySelector('#expenses');
    const category = document.getElementsByName('category');

    form.addEventListener('submit', (e) => { //e represents each instance of the action (submit button click)
        e.preventDefault(); //prevents page from refreshing on submit (default action)

        const item = input.value;
        const amount = expense.value;

        if (!item) { // if user has not typed anything into box
            alert('Please fill out the expense box');
            return;
        }

        if (!amount) { // if user has not typed anything into box
            alert('Please enter amount spent');
            return;
        }

        const expenseDiv = document.createElement("div");
        expenseDiv.classList.add("expense");

        let check = 0;

        for (i = 0; i < category.length; i++) {
            if (category[i].checked) {
                expenseDiv.classList.add(category[i].value);
                let objIndex = data.findIndex(
                    (temp) => temp['x'].toLowerCase() === category[i].value.toLowerCase()
                );
                data[objIndex].value = Number(data[objIndex].value);
                data[objIndex].value += Number(amount);
                check++
            }
        }

        if (check == 0) { // if user has not typed anything into box
            alert('Please select a category');
            return;
        }

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");

        expenseDiv.appendChild(contentDiv);

        const textDiv = document.createElement("input");
        textDiv.classList.add('text');
        textDiv.type = 'text'
        textDiv.value = item;
        textDiv.setAttribute("readonly", "readonly");

        contentDiv.appendChild(textDiv);

        const dollarDiv = document.createElement("div");
        dollarDiv.classList.add('dollar-sign');

        contentDiv.appendChild(dollarDiv);

        const dollarSign = document.createElement("p");
        dollarSign.textContent = '$'
        dollarDiv.appendChild(dollarSign);

        const numberDiv = document.createElement("input");
        numberDiv.classList.add('text');
        numberDiv.classList.add('text-number');
        numberDiv.type = 'number'
        numberDiv.value = amount;
        numberDiv.setAttribute("readonly", "readonly");
        
        dollarDiv.appendChild(numberDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add("actions");

        const editDiv = document.createElement('button');
        editDiv.classList.add('edit');

        const editIcon = document.createElement('i');
        editIcon.classList.add('fa-solid');
        editIcon.classList.add('fa-pen-to-square');

        const deleteDiv = document.createElement('button');
        deleteDiv.classList.add('delete');

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-solid');
        deleteIcon.classList.add('fa-xmark');

        editDiv.appendChild(editIcon);
        deleteDiv.appendChild(deleteIcon);

        actionsDiv.appendChild(deleteDiv);
        actionsDiv.appendChild(editDiv);
        expenseDiv.appendChild(actionsDiv);
        expenseListDiv.appendChild(expenseDiv);

        input.value = '';
        expense.value = '';
        for (i = 0; i < category.length; i++) {
            category[i].checked = false;
        }

        let prevCount = 0;
        let tag;

        editDiv.addEventListener('click', () => {
            if (editIcon.classList.contains('fa-pen-to-square')) {
                editIcon.classList.remove('fa-pen-to-square');
                editIcon.classList.add('fa-floppy-disk')
                textDiv.removeAttribute("readonly");
                numberDiv.removeAttribute("readonly");
                textDiv.focus();
                prevCount = numberDiv.value;
            } else {
                numberDiv.setAttribute('readonly', 'readonly');
                textDiv.setAttribute('readonly', 'readonly');
                editIcon.classList.remove('fa-floppy-disk');
                editIcon.classList.add('fa-pen-to-square'); 
                let difference = (numberDiv.value - prevCount);

                categoriesList.forEach((y) => {
                    if (expenseDiv.classList.contains(y.toLowerCase())) {
                        tag = y;
                    }
                })

                let tagIndex = data.findIndex(
                    (temp) => temp['x'].toLowerCase() === tag.toLowerCase()
                );                
                
                data[tagIndex].value = Number(data[tagIndex].value);
                data[tagIndex].value += Number(difference);

                document.querySelector('#container').innerHTML = '';
                initChart();
            }
        });

        deleteDiv.addEventListener('click', () => {
            expenseListDiv.removeChild(expenseDiv);
            categoriesList.forEach((y) => {
                if (expenseDiv.classList.contains(y.toLowerCase())) {
                    tag = y;
                }
            })

            let tagIndex = data.findIndex(
                (temp) => temp['x'].toLowerCase() === tag.toLowerCase()
            );                
            
            data[tagIndex].value = Number(data[tagIndex].value);
            data[tagIndex].value -= Number(numberDiv.value);

            document.querySelector('#container').innerHTML = '';
            initChart();
        });

        document.querySelector('#container').innerHTML = '';
        initChart();

    });

    initChart()

});

function initChart() {
    var chart = anychart.pie();
    //chart.title("Spending Breakdown");
    chart.data(data);
    chart.container('container');
    chart.legend().itemsLayout("vertical");
    chart.legend().position("right");
    chart.legend().align("left");
    chart.legend().padding({top: 70, right: 3, bottom: 0, left: 6})
    chart.draw();
}
