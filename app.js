// next steps: add filter buttons to filter expenses
// make it so that budget chart is updated on ALL changes, not just budget changes

//data for pie chart 

var data = [
    {
        x: "Housing", value: 0,
        normal: {
            fill: "var(--housing)"
        },
        hovered: {
            fill: "var(--housing-dark)",
        },
    },
    {
        x: "Insurance", value: 0,
        normal: {
            fill: "var(--insurance)"
        },
        hovered: {
            fill: "var(--insurance-dark)",
        },
    },
    {
        x: "Food", value: 0,
        normal: {
            fill: "var(--food)"
        },
        hovered: {
            fill: "var(--food-dark)",
        },
    },
    {
        x: "Transportation", value: 0,
        normal: {
            fill: "var(--transportation)"
        },
        hovered: {
            fill: "var(--transportation-dark)",
        },
    },
    {
        x: "Personal", value: 0,
        normal: {
            fill: "var(--personal)"
        },
        hovered: {
            fill: "var(--personal-dark)",
        },
    },
    {
        x: "Recreation", value: 0,
        normal: {
            fill: "var(--recreation)"
        },
        hovered: {
            fill: "var(--recreation-dark)",
        },
    },
    {
        x: "Utilities", value: 0,
        normal: {
            fill: "var(--utilities)"
        },
        hovered: {
            fill: "var(--utilities-dark)",
        },
    }
];

categoriesList = ['housing', 'insurance', 'food', 'transportation', 'personal', 'recreation', 'utilities'];

// data for budget rings chart

var names = [
    'Housing',
    'Insurance',
    'Food',
    'Transportation',
    'Personal',
    'Recreation',
    'Utilities'
];

var data2 = [0, 0, 0, 0, 0, 0, 0, 100];
var budgetsArray = [1000, 1000, 1000, 1000, 1000, 1000, 1000];

var palette = anychart.palettes
    .distinctColors()
    .items([
        '#ff3d8e',
        '#00deb1',
        '#ff8010',
        '#44caff',
        'rgb(223, 194, 0)',
        '#56c526',
        '#584eff',
    ]);

var makeBarWithBar = function (gauge, radius, i, width) {
    var stroke = null;
    gauge
        .label(i)
        .text(`<span style="color:#929292; font-size: 10px;">${names[i]}, ${data2[i]}%</span>`)
        .useHtml(true);

    gauge
        .label(i)
        .hAlign('right')
        .vAlign('middle')
        .anchor('right-center')
        .padding(0, 10)
        .height(width + '%')
        .offsetY(radius + '%')
        .offsetX(0);

    gauge
        .bar(i)
        .dataIndex(i)
        .radius(radius)
        .width(width)
        .fill(palette.itemAt(i))
        .stroke(null)
        .zIndex(5);

    gauge
        .bar(i + 100)
        .dataIndex(7)
        .radius(radius)
        .width(width)
        .fill('#F5F4F4')
        .stroke(stroke)
        .zIndex(4);

    return gauge.bar(i);
};

// buttons and functionality

window.addEventListener('load', () => {
    const form = document.querySelector('#new-expense-form');
    const input = document.querySelector('#new-expense-input');
    const expense = document.querySelector('#new-amount-input');
    const expenseListDiv = document.querySelector('#expenses');
    const category = document.getElementsByName('category');
    const budgets = document.querySelectorAll('.budget');
    let currentCategory;
    let currentIndex;
    let newPercentage;

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
                currentCategory = (category[i].value)
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

        currentIndex = categoriesList.indexOf(currentCategory);
        newPercentage = (data[currentIndex].value * 100 / budgetsArray[currentIndex])
        data2[currentIndex] = Math.round(newPercentage);
        document.querySelector('#container2').innerHTML = '';
        initChart2();

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

                newPercentage = (data[tagIndex].value * 100 / budgetsArray[tagIndex])
                data2[tagIndex] = Math.round(newPercentage);
                document.querySelector('#container2').innerHTML = '';
                initChart2();
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
            newPercentage = (data[tagIndex].value * 100 / budgetsArray[tagIndex])
            data2[tagIndex] = Math.round(newPercentage);
            document.querySelector('#container2').innerHTML = '';
            initChart2();
        });

        document.querySelector('#container').innerHTML = '';
        initChart();
    });

    initChart();
    initChart2();

    budgets.forEach((x) => {
        x.addEventListener('change', function () {
            let categoryIndex = categoriesList.indexOf(x.classList[0]);
            newPercentage = (data[categoryIndex].value * 100 / x.value)
            budgetsArray[categoryIndex] = x.value;
            data2[categoryIndex] = Math.round(newPercentage);
            document.querySelector('#container2').innerHTML = '';
            initChart2();
        })
    })
});

function initChart() {
    var chart = anychart.pie();
    //chart.title("Spending Breakdown");
    chart.data(data);
    chart.container('container');
    chart.legend().itemsLayout("vertical");
    chart.legend().position("right");
    chart.legend().align("left");
    chart.legend().padding({ top: 70, right: 3, bottom: 0, left: 6 })
    chart.draw();
}

function initChart2() {
    var gauge = anychart.gauges.circular();
    gauge.data(anychart.data.set(data2));
    gauge
        .fill('#fff')
        .stroke(null)
        .padding(0)
        .margin(100)
        .startAngle(0)
        .sweepAngle(270);

    var axis = gauge.axis().radius(100).width(1).fill(null);
    axis
        .scale()
        .minimum(0)
        .maximum(100)
        .ticks({ interval: 1 })
        .minorTicks({ interval: 1 });
    axis.labels().enabled(false);
    axis.ticks().enabled(false);
    axis.minorTicks().enabled(false);
    makeBarWithBar(gauge, 100, 0, 10);
    makeBarWithBar(gauge, 85, 1, 10);
    makeBarWithBar(gauge, 70, 2, 10);
    makeBarWithBar(gauge, 55, 3, 10);
    makeBarWithBar(gauge, 40, 4, 10);
    makeBarWithBar(gauge, 25, 5, 10);
    makeBarWithBar(gauge, 10, 6, 10);

    gauge.margin(30);
    gauge
        .title()
        .text(
            'Budget vs Spending')
        .useHtml(true);
    gauge
        .title()
        .enabled(true)
        .hAlign('center')
        .padding(0)
        .margin([0, 0, 10, 0]);

    gauge.container('container2');
    gauge.draw();
}