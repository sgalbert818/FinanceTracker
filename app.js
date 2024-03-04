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
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector('#new-task-input');
    const expense = document.querySelector('#new-amount-input');
    const taskListDiv = document.querySelector('#tasks');
    const category = document.getElementsByName('category');

    form.addEventListener('submit', (e) => { //e represents each instance of the action (submit button click)
        e.preventDefault(); //prevents page from refreshing on submit (default action)

        const task = input.value;
        const amount = expense.value;

        if (!task) { // if user has not typed anything into box
            alert('Please fill out the task box');
            return;
        }

        if (!amount) { // if user has not typed anything into box
            alert('Please enter amount spent');
            return;
        }

        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        let check = 0;

        for (i = 0; i < category.length; i++) {
            if (category[i].checked) {
                taskDiv.classList.add(category[i].value);
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

        taskDiv.appendChild(contentDiv);

        const textDiv = document.createElement("input");
        textDiv.classList.add('text');
        textDiv.type = 'text'
        textDiv.value = task;
        textDiv.setAttribute("readonly", "readonly");

        contentDiv.appendChild(textDiv);

        const numberDiv = document.createElement("input");
        numberDiv.classList.add('text');
        numberDiv.type = 'number'
        numberDiv.value = amount;
        numberDiv.setAttribute("readonly", "readonly");
        
        contentDiv.appendChild(numberDiv);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add("actions");

        const editDiv = document.createElement('button');
        editDiv.classList.add('edit');
        editDiv.innerHTML = 'Edit';

        const deleteDiv = document.createElement('button');
        deleteDiv.classList.add('delete');
        deleteDiv.innerHTML = 'Delete';

        actionsDiv.appendChild(editDiv);
        actionsDiv.appendChild(deleteDiv);
        taskDiv.appendChild(actionsDiv);
        taskListDiv.appendChild(taskDiv);

        input.value = '';
        expense.value = '';
        for (i = 0; i < category.length; i++) {
            category[i].checked = false;
        }

        let prevCount = 0;
        let tag;

        editDiv.addEventListener('click', () => {
            if (editDiv.innerText.toLowerCase() == 'edit') {
                textDiv.removeAttribute("readonly");
                numberDiv.removeAttribute("readonly");
                textDiv.focus();
                editDiv.innerText = 'Save';
                prevCount = numberDiv.value;
            } else {
                numberDiv.setAttribute('readonly', 'readonly');
                textDiv.setAttribute('readonly', 'readonly');
                editDiv.innerText = 'Edit';
                let difference = (numberDiv.value - prevCount);

                categoriesList.forEach((y) => {
                    if (taskDiv.classList.contains(y.toLowerCase())) {
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
            taskListDiv.removeChild(taskDiv);
            categoriesList.forEach((y) => {
                if (taskDiv.classList.contains(y.toLowerCase())) {
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
    chart.title("Spending Breakdown");
    chart.data(data);
    chart.container('container');
    chart.draw();
}
