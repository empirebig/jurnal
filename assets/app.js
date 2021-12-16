`use strict`;

let filename = "";
let TransformedArray;
let builderDiagramAll = false;
let builderDiagramOne = false;
let thisSelectedAll = 0;
let thisSelectedOne = 0;
let thisClassName = "";

// Ищем элемент с классом "inputFile" и добавляем слушатель ивента типа "change"
// при каждом изменении файла мы изменяем текст "Choose a file…" на название файла
document.querySelector(".inputFile").addEventListener('change', function (event) {
    if (this.files && this.files.length > 1) {
        filename = (this.getAttribute('data-multiple-caption' ) || '').replace('{count}', this.files.length);
    } else {
        filename = event.target.value.split('\\').pop();
    }

    if (filename) {
        document.querySelector(".inputFile").nextElementSibling.querySelector('span').innerHTML = filename;
    }
});

//Ищем элемент с классом "inputFile" и добавляем слушатель ивента типа "change"
// при каждом изменении файла читаем загруженный файл и преобразуем его содержимое в массив
// а затем создаем таблицу из данного массива
document.querySelector(".inputFile").addEventListener('change', function (event) {
    const f = event.target.files[0];
    if (f) {
        const r = new FileReader();
        r.onload = e => {
            TransformedArray = CSVToArray(e.target.result, ";")
            //patchMatrix(TransformedArray, 0)
            CreateTableFromArray(TransformedArray)
            generateInputButtons(TransformedArray)
            generateClassButtons(TransformedArray)
            document.querySelector(".downloadSection").classList.remove("disabled")
            document.querySelectorAll(".disabledLink").forEach(function (e) {
                e.classList.remove("disabled")
            })
            generateButtons(TransformedArray)
            document.querySelector(".TableBox").classList.remove("disabled")
        }
        r.readAsText(f)
    } else {
        console.log("Failed to load file")
    }
});

// Ищем элемент с классом "downloadBtn" и добавляем слушатель ивента типа "click"
// преобразуем массив в CSV формат
document.querySelector(".downloadBtn").addEventListener('click', function () {
    const CSV = ArrToCSV(TransformedArray)
    const pom = document.createElement('a');
    pom.setAttribute('href', CSV);
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
});

// Ищем элемент с классом "AddBtn" и добавляем слушатель ивента типа "click"
// при нажании добавляем строку состоящую из массива
document.querySelector(".AddBtn").addEventListener('click', function () {
    let newArr = []

    document.querySelectorAll(".inputField").forEach(function (e) {
        newArr.push(e.value)
        e.value = "";
    });
    TransformedArray.push(patchMatrix(newArr, 1))
    CreateTableFromArray(TransformedArray)
    generateInputButtons(TransformedArray)
});

// Переключатель между отображением всех и определенного
document.querySelector(".AllClassesBtn").addEventListener('click', function () {
    document.querySelector(".AllClass").classList.remove("disabled")
    document.querySelector(".OneClass").classList.add("disabled")
});

// Переключатель между отображением определенного и всех
document.querySelector(".OneClassesBtn").addEventListener('click', function () {
    document.querySelector(".OneClass").classList.remove("disabled")
    document.querySelector(".AllClass").classList.add("disabled")
});

// Заменяем пустые элементы массива на "0"
// Если mode = 0 - работаем в режиме матрицы
// Если mode = 1 - работаем в режиме массива
function patchMatrix(Arr, mode) {
    if (mode === 0) {
        let NewMatrix = [[]];
        let NewArr = [];

        for (let i = 0; i < Arr.length; i++) {
            for (let j = 0; j < Arr[i].length; j++) {
                if (Arr[i][j] === "") {
                    NewArr.push(0);
                } else {
                    NewArr.push(Arr[i][j]);
                }
            }
            NewMatrix.push(NewArr);
            NewArr = [];
        }
        return NewMatrix;
    }
    if (mode === 1) {
        let NewArr = [];

        for (let i = 0; i < Arr.length; i++) {
            if (Arr[i] === "") {
                NewArr.push(0);
            } else {
                NewArr.push(Arr[i]);
            }
        }
        return NewArr;
    }
}

// Создаем таблицу из массива
function CreateTableFromArray(Arr) {
    document.querySelectorAll(".fileTableBody").forEach(function (e) {
        e.textContent = "";

        for (let i = 0; i < Arr.length; i++) {
            let tr = document.createElement("TR")
            e.appendChild(tr); {
                for (let j = 0; j < Arr[i].length; j++) {
                    let td = document.createElement("TD")
                    td.innerHTML = Arr[i][j];
                    tr.appendChild(td)
                }
            }
        }
    });
    classesButtons()
    if (builderDiagramAll) {
        buildStatsTables(getColumnInt(Arr, thisSelectedAll))
    }
    if (builderDiagramOne) {
        buildStatsOneClassTables(getColumnInt(getClassArr(Arr, thisClassName), thisSelectedOne))
    }
}

// преобразуем CSV строку в матрицу
function CSVToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");

    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );

    const arrData = [[]];

    let arrMatches = null;

    while (arrMatches = objPattern.exec(strData)) {
        const strMatchedDelimiter = arrMatches[1];

        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {
            arrData.push([]);
        }

        let strMatchedValue;

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }
    return(patchMatrix(arrData, 0));
}

// Преобразуем матрицу в CSV строку
function ArrToCSV(Arr) {
    let content = "data:text/csv;charset=utf-8,";

    Arr.forEach(function (row) {
        content += row.join(";") + "\n";
    });

    return content
}

// Создаем поля для добавления строк в таблицу
function generateInputButtons(Arr) {
    document.querySelector(".inputs").textContent = "";
    for (let i = 0; i < Arr[1].length; i++) {
        let input = document.createElement("input")
        let br = document.createElement("br")
        input.classList.add("input")
        input.classList.add("inputField")
        input.placeholder = Arr[1][i]
        document.querySelector(".inputs").appendChild(input)
        document.querySelector(".inputs").appendChild(br)
    }
    document.querySelector(".AddBtn").classList.remove("noLoadFile")
}

// Считаем медианное значение из мессива
function calcMedian(Arr) {
    const half = Math.floor(Arr.length / 2);
    Arr.sort(function(a, b) { return a - b;});

    if (Arr.length % 2) {
        return Arr[half];
    } else {
        return (Arr[half] + Arr[half] + 1) / 2.0;
    }
}

// Считаем среднее значение из массива
function calcAverageCost(Arr) {
    return Arr.reduce((partial_sum, a) => partial_sum + a, 0) / Arr.length;
}

// Считаем процентное соотношение элементов массива
function calcPercentage(Arr) {
    const data = {};

    Arr.map(el=>{
        if(!data[el]){
            return data[el]=parseFloat((Arr.filter(ob=>ob===el).length*100/Arr.length).toFixed(2))
        }
    })

    return [data, Arr.length]
}

// Получаем колонку из массива в формате int
function getColumnInt(Arr, colNum) {
    let col = [];
    for (let i = 1; i < Arr.length; i++) {
        col.push(parseInt(Arr[i][colNum]));
    }
    return col
}

// Получаем колонку из массива в формате string
function getColumnString(Arr, colNum) {
    let col = [];
    for (let i = 1; i < Arr.length; i++) {
        col.push(Arr[i][colNum]);
    }
    return col
}

// Создаем новый массив исключая повторяющиеся значения
function getUniqueArr(Arr) {
    return Array.from(new Set(Arr))
}

// Создаем кнопки из массива и вешаем на них слушатели событий
function generateButtons(Arr) {
    document.querySelector(".inputsStats").textContent = "";
    for (let i = 2; i < Arr[1].length; i++) {
        let button = document.createElement("label")
        let br = document.createElement("br")
        button.classList.add("btn")
        button.addEventListener('click', function () {
            document.querySelector(".statsHead").textContent = Arr[1][i]
            thisSelectedAll = i
            buildStatsTables(getColumnInt(Arr, i))
            document.querySelector(".statsDisabled").classList.remove("disabled")
        })
        button.textContent = Arr[1][i]
        document.querySelector(".inputsStats").appendChild(button)
        document.querySelector(".inputsStats").appendChild(br)
    }
}

// Получаем массив классов
function getClassArr(Arr, className) {
    let ClassArr = [[]]
    for (let i = 0; i < Arr.length; i++ ) {
        if (Arr[i][1] === className) {
            ClassArr.push(Arr[i])
        }
    }
    return ClassArr
}

// Создем кнопки выбора предмета
function generateOneClassButtons(Arr, className) {
    document.querySelector(".statsOneBtn").textContent = "";
    for (let i = 2; i < Arr[1].length; i++) {
        let button = document.createElement("label")
        let br = document.createElement("br")
        button.classList.add("btn")
        button.addEventListener('click', function () {
            document.querySelector(".statsOneLHead").textContent = Arr[1][i]
            thisSelectedOne = i;
            thisClassName = className;
            buildStatsOneClassTables(getColumnInt(getClassArr(Arr, className), i))
            document.querySelector(".statsOneClassDisabled").classList.remove("disabled")
        })
        button.textContent = Arr[1][i]
        document.querySelector(".statsOneBtn").appendChild(button)
        document.querySelector(".statsOneBtn").appendChild(br)
    }
}

// Выводим статистику для одного класса
function buildStatsOneClassTables(Arr) {
    document.querySelector(".statsOneTables").textContent = "";
    let median = calcMedian(Arr);
    let averageCost = calcAverageCost(Arr);
    let [Percentage, length] = calcPercentage(Arr);
    buildOneClassDiagram(Percentage, length)
    let br = document.createElement("br")
    let AVC = document.createElement("div")
    let M = document.createElement("div")
    AVC.textContent = "Медианное значение " + median.toFixed(2)
    M.textContent = "Среднее значение " + averageCost.toFixed(2)
    document.querySelector(".statsOneTables").appendChild(br)
    document.querySelector(".statsOneTables").appendChild(AVC)
    document.querySelector(".statsOneTables").appendChild(br)
    document.querySelector(".statsOneTables").appendChild(M)
    builderDiagramOne = true
}

// Строим круговую диаграмму процентного состава оценок для определенного класса
function buildOneClassDiagram(Arr, length) {
    let canvas = document.createElement("canvas")
    let Legend = document.createElement("div")
    Legend.classList.add("legend")
    canvas.width = 300
    canvas.height = 300

    Diagram({canvas: canvas, data: Arr, length: length, colors: ["#fe0000", "#ff4001", "#ff7f00", "#ffbe00", "#ffff01", "#c0ff00", "#80ff00", "#40ff01", "#01ff01", "#01ff41", "#01ff7f", "#02ffbf", "#02ffff", "#00bffe", "#0080ff", "#0140ff", "#0000fe", "#3f00ff", "#7f00ff", "#bf00fe", "#ff00ff", "#ff00c0", "#ff0080", "#ff0141"], doughnutHoleSize:0.5, legend:Legend});
    document.querySelector(".statsOneTables").appendChild(canvas)
    document.querySelector(".statsOneTables").appendChild(Legend)
}

// Создем кнопки выбора класса
function generateClassButtons(Arr) {
    document.querySelector(".oneStats").textContent = "";
    let unique = getUniqueArr(getColumnString(Arr, 1))

    for (let i = 0; i < unique.length; i++) {
        let button = document.createElement("label")
        let br = document.createElement("br")
        button.classList.add("btn")
        button.addEventListener('click', function () {
            document.querySelector(".statsOneHead").textContent = unique[i]

            document.querySelector(".statsOneDisabled").classList.remove("disabled")
            generateOneClassButtons(Arr, unique[i])
            document.querySelector(".statsOneClassDisabled").classList.add("disabled")
        })
        button.textContent = unique[i]
        document.querySelector(".oneStats").appendChild(button)
        document.querySelector(".oneStats").appendChild(br)
    }
}

// Создаем статистику для всех классов
function buildStatsTables(Arr) {
    document.querySelector(".statsTables").textContent = "";
    let median = calcMedian(Arr);
    let averageCost = calcAverageCost(Arr);
    let [Percentage, length] = calcPercentage(Arr);
    buildDiagram(Percentage, length)
    let br = document.createElement("br")
    let AVC = document.createElement("div")
    let M = document.createElement("div")
    AVC.textContent = "Медианное значение " + median.toFixed(2)
    M.textContent = "Среднее значение " + averageCost.toFixed(2)
    document.querySelector(".statsTables").appendChild(br)
    document.querySelector(".statsTables").appendChild(AVC)
    document.querySelector(".statsTables").appendChild(br)
    document.querySelector(".statsTables").appendChild(M)
    builderDiagramAll = true
}

// Построеное кроговой диаграммы
const Diagram = function(options){
    let slice_angle;
    let val;
    let category;
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    let total_value = 0;
    let color_index = 0;
    for (category in this.options.data){
        val = this.options.data[category];
        total_value += val;
    }

    // Рисуем части "Пирога" в соответствии с процентами
    let start_angle = 0;
    for (category in this.options.data){
        val = this.options.data[category];
        slice_angle = 2 * Math.PI * val / total_value;

        drawPieSlice(
            this.ctx,
            this.canvas.width/2,
            this.canvas.height/2,
            Math.min(this.canvas.width/2,this.canvas.height/2),
            start_angle,
            start_angle+slice_angle,
            this.colors[color_index%this.colors.length]
        );

        start_angle += slice_angle;
        color_index++;
    }

    // Добавляем подписи под диаграммой
    if (this.options.legend){
        color_index = 0;
        let legendHTML = "";
        for (category in this.options.data){
            legendHTML += "<div><span style='text-align:center;display:inline-block;min-width:20px;background-color:"+this.colors[color_index++]+";'>"+category+"</span> "+(this.options.length*(this.options.data[category]/100)).toFixed(0)+"</div>";
            if (this.colors.length === color_index) {
                color_index = 0;
            }
        }
        this.options.legend.innerHTML = legendHTML;
    }

    if (this.options.doughnutHoleSize){
        drawPieSlice(
            this.ctx,
            this.canvas.width/2,
            this.canvas.height/2,
            this.options.doughnutHoleSize * Math.min(this.canvas.width/2,this.canvas.height/2),
            0,
            2 * Math.PI,
            "#fff"
        );
    }

    // Добавляем подписи на диаграмме
    start_angle = 0;
    for (category in this.options.data){
        val = this.options.data[category];
        slice_angle = 2 * Math.PI * val / total_value;
        const pieRadius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        let labelX = this.canvas.width / 2 + (pieRadius / 2) * Math.cos(start_angle + slice_angle / 2);
        let labelY = this.canvas.height / 2 + (pieRadius / 2) * Math.sin(start_angle + slice_angle / 2);

        if (this.options.doughnutHoleSize){
            const offset = (pieRadius * this.options.doughnutHoleSize) / 2;
            labelX = this.canvas.width/2 + (offset + pieRadius / 2) * Math.cos(start_angle + slice_angle/2);
            labelY = this.canvas.height/2 + (offset + pieRadius / 2) * Math.sin(start_angle + slice_angle/2);
        }

        const labelText = Math.round(100 * val / total_value);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 16px Arial";
        this.ctx.fillText(labelText+"%", labelX,labelY);
        start_angle += slice_angle;
    }
};

// Создаем диаграмму для всех классов
function buildDiagram(Arr, length) {
    let canvas = document.createElement("canvas")
    let Legend = document.createElement("div")
    Legend.classList.add("legend")
    canvas.width = 300
    canvas.height = 300
    Diagram({canvas: canvas, data: Arr, length: length, colors: ["#fe0000", "#ff4001", "#ff7f00", "#ffbe00", "#ffff01", "#c0ff00", "#80ff00", "#40ff01", "#01ff01", "#01ff41", "#01ff7f", "#02ffbf", "#02ffff", "#00bffe", "#0080ff", "#0140ff", "#0000fe", "#3f00ff", "#7f00ff", "#bf00fe", "#ff00ff", "#ff00c0", "#ff0080", "#ff0141"], doughnutHoleSize:0.5, legend:Legend});
    document.querySelector(".statsTables").appendChild(canvas)
    document.querySelector(".statsTables").appendChild(Legend)
}

// Рисуем часть "пирога"
function drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}

// Скрываем кнопки выбота всех / определенного, если у нас всего один класс
function classesButtons() {
    let classes = getUniqueArr(getColumnString(TransformedArray, 1))
    if (classes.length > 1) {
        document.querySelector(".QClasses").classList.remove("disabled")
    } else {
        document.querySelector(".AllClass").classList.remove("disabled")
    }
}

// Добавляем слушатель события для удаления определенных записей из таблицы
document.querySelector(".deleteFieldBtn").addEventListener('click', function () {
    let NewMatrix = [[]]
    let Deleted = document.querySelector(".deleteField").value;
    for (let i = 0; i < TransformedArray.length; i++) {
        if (TransformedArray[i][0] !== Deleted) {
            NewMatrix.push(TransformedArray[i])
        }
    }
    TransformedArray = NewMatrix
    CreateTableFromArray(TransformedArray)
    document.querySelector(".deleteField").value = "";
});