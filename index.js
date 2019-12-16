let tasks = {
  "data": [
    {
      "id": "4bd9d1c5-2c58-4376-a3b7-445c0fc5b958",
      "start_date": "2019-08-02",
      "text": "<a href=/action/4bd9d1c5-2c58-4376-a3b7-445c0fc5b958>Action 1</a>",
      "duration": "3"
    },
    {
      "id": "34eaf54e-51f4-4bec-8be9-cfe41266d21f",
      "start_date": "2019-08-02",
      "text": "<a href=/action/34eaf54e-51f4-4bec-8be9-cfe41266d21f>Action 2</a>",
      "duration": "3"
    },
    {
      "id": "b0efe0d4-d06a-48f3-a486-93f7ceab502f",
      "start_date": "2019-08-02",
      "text": "<a href=/action/b0efe0d4-d06a-48f3-a486-93f7ceab502f>Action 3</a>",
      "duration": "9"
    },
    {
      "id": "291ee8b2-ba85-4b83-920c-31971eb0e315",
      "start_date": "2019-08-03",
      "text": "<a href=/action/291ee8b2-ba85-4b83-920c-31971eb0e315>Action 3</a>",
      "duration": "6"
    },
    {
      "id": "f70e6cc9-4ea4-43aa-b1ee-8c4b038c49d6",
      "start_date": "2019-08-04",
      "text": "<a href=/action/f70e6cc9-4ea4-43aa-b1ee-8c4b038c49d6>Action 4</a>",
      "duration": "2"
    },
    {
      "id": "0baaf031-6aff-4d69-ae47-c7456b0e6b49",
      "start_date": "2019-08-05",
      "text": "<a href=/action/0baaf031-6aff-4d69-ae47-c7456b0e6b49>Action 5</a>",
      "duration": "2"
    },
    {
      "id": "e15017c4-ff9b-4d2e-bbc5-1c9b24942ede",
      "start_date": "2019-08-30",
      "text": "<a href=/action/e15017c4-ff9b-4d2e-bbc5-1c9b24942ede>Action 6</a>",
      "duration": "8"
    }
  ]
};

let defaultOrderTasks = tasks.data.map(function(task) {
    return task.id;
});

tasks.data.sort(function(a, b){
    return new Date(a.start_date) - new Date(b.start_date);
});

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Returns an array of dates between the two dates
function getDates(startDate, endDate) {
    let datesAll = [],
    currentDate = startDate,
    addDays = function(days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    while (currentDate <= endDate) {
        datesAll.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return datesAll;
};

let firstDate = tasks.data[0];
let lastDate = tasks.data[tasks.data.length - 1];

// We need this decrement [parseInt(lastDate.duration) - 1], because we are taking into consideration the start date
let datesAll = getDates(new Date(firstDate.start_date), new Date(lastDate.start_date).addDays(parseInt(lastDate.duration) - 1));

let months = new Array();
months[0] = "January";
months[1] = "February";
months[2] = "March";
months[3] = "April";
months[4] = "May";
months[5] = "June";
months[6] = "July";
months[7] = "August";
months[8] = "September";
months[9] = "October";
months[10] = "November";
months[11] = "December";

let monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getWeekNumber(d) {
    if(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        let weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNumber;
    }
}

const ganttviewHzheaderYears = $('.ganttview-hzheader-years');
const ganttviewHzheaderMonths = $('.ganttview-hzheader-months');
const ganttviewHzheaderWeeks = $('.ganttview-hzheader-weeks');
const ganttviewHzheaderDays = $('.ganttview-hzheader-days');

const ganttviewVtheader = $('.ganttview-vtheader');
const ganttviewGrid = $('.ganttview-grid');
const ganttviewBlocks = $('.ganttview-blocks');

const daily = 1;
const weekly = 2;
const monthly = 3;
const annually = 4;

let dayWidth;

$('.scale-gantt').change(function() {
    ganttviewHzheaderYears.html('');
    ganttviewHzheaderMonths.html('');
    ganttviewHzheaderWeeks.html('');
    ganttviewHzheaderDays.html('');

    ganttviewVtheader.html('');
    ganttviewGrid.html('');
    ganttviewBlocks.html('');

    let period = $(this).val();

    if(period == daily) dayWidth = 20;
    if(period == weekly) dayWidth = 15;
    if(period == monthly) dayWidth = 10;
    if(period == annually) dayWidth = 5;

    drawTimeline(period);
    drawTasks(period);
});
$('.scale-gantt:checked').change();


function drawTimeline(period) {

    let prevYear;
    let prevMonth;
    let prevWeek;
    let daysInYearCounter = 1;
    let daysInMonthCounter = 1;
    let daysInWeekCounter = 1;
    let prevDaysInWeekCounter;
    let weekDatesStartEnd = [];
    let chooseMonths = (period == monthly || period == annually) ? monthsShort : months;
    datesAll.forEach(function(date, index) {
        daysInYearCounter++;

        daysInMonthCounter++;

        prevDaysInWeekCounter = daysInWeekCounter;
        daysInWeekCounter++;


        /* Draw months for EACH period */
        if(prevMonth == undefined || prevMonth != date.getMonth()) {
            daysInMonthCounter = 1;
            ganttviewHzheaderMonths.append('<div class="ganttview-hzheader-month">' + chooseMonths[date.getMonth()] + '</div>');
        }
        $('.ganttview-hzheader-month').last().css('width', dayWidth * daysInMonthCounter + 'px');
        prevMonth = date.getMonth();


        if(period == daily) {
            /* DAYS */
            ganttviewHzheaderDays.append('<div class="ganttview-hzheader-day">' + date.getDate() + '</div>'); 
        }


        if(period == weekly) {
            /* WEEKS */
            if(prevWeek == undefined || prevWeek != getWeekNumber(date)) {
                weekDatesStartEnd[0] = date;
                weekDatesStartEnd[1] = date;
                daysInWeekCounter = 1;
                ganttviewHzheaderWeeks.append('<div class="ganttview-hzheader-week">' + getWeekNumber(date) + '</div>');
            }
            weekDatesStartEnd[1] = datesAll[index];
            $('.ganttview-hzheader-week').last().css('width', dayWidth * daysInWeekCounter + 'px');
            $('.ganttview-hzheader-week').last().text(weekDatesStartEnd[0].getDate() + '/' + (weekDatesStartEnd[0].getMonth() + 1) + ' - ' + weekDatesStartEnd[1].getDate() + '/' + (weekDatesStartEnd[1].getMonth() + 1));
            prevWeek = getWeekNumber(date);
        }

        if(period == monthly || period == annually) {
            /* Draw years for MONTHS and YEARS */
            if(prevYear == undefined || prevYear != date.getFullYear()) {
                daysInYearCounter = 1;
                ganttviewHzheaderYears.append('<div class="ganttview-hzheader-year">' + date.getFullYear() + '</div>');
            }
            $('.ganttview-hzheader-year').last().css('width', dayWidth * daysInYearCounter + 'px');
            prevYear = date.getFullYear();
        }
    });
}


function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

function getDiffDaysBetweenTwoDates(date) {
    let date1 = new Date(firstDate.start_date);
    let date2 = new Date(date);
    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}


function drawTasks(period) {

    defaultOrderTasks.forEach(function(taskID, index) {
        let currentTask = findObjectByKey(tasks.data, 'id', taskID);

        ganttviewVtheader.append('<div class="ganttview-vtheader-item">' + currentTask.text + '</div>');


        let ganttviewGridRow = $('<div class="ganttview-grid-row"></div>');


        if(period == daily) {
            /*** GRIDS BY DAYS START ***/
            for(let i = 1; i <= datesAll.length; i++){
                ganttviewGridRow.append('<div class="ganttview-grid-row-cell"></div>');
            }
            /*** GRIDS BY DAYS END ***/
        }

        ganttviewGrid.append(ganttviewGridRow);


        if(period == weekly) {
            /*** GRIDS BY WEEKS START ***/
            let prevWeek;
            let daysInWeekCounter = 1;
            let countWeeks = -1;
            datesAll.forEach(function(date, indexDate) {
                daysInWeekCounter++;
                if(prevWeek == undefined || prevWeek != getWeekNumber(date)) {
                    countWeeks++;
                    daysInWeekCounter = 1;
                    ganttviewGridRow.append('<div class="ganttview-grid-row-cell"></div>');
                }
                $('.ganttview-grid-row').eq(index).find(('.ganttview-grid-row-cell')).eq(countWeeks).css('width', dayWidth * daysInWeekCounter + 'px');
                prevWeek = getWeekNumber(date);
            });
            /*** GRIDS BY WEEKS END ***/
        }


        if(period == monthly) {
            /*** GRIDS BY MONTHS START ***/
            let prevMonth;
            let daysInMonthCounter = 1;
            let countMonths = -1;
            datesAll.forEach(function(date, indexDate) {
                daysInMonthCounter++;
                if(prevMonth == undefined || prevMonth != date.getMonth()) {
                    countMonths++;
                    daysInMonthCounter = 1;
                    ganttviewGridRow.append('<div class="ganttview-grid-row-cell"></div>');
                }
                $('.ganttview-grid-row').eq(index).find(('.ganttview-grid-row-cell')).eq(countMonths).css('width', dayWidth * daysInMonthCounter + 'px');
                prevMonth = date.getMonth();
            });
            /*** GRIDS BY MONTHS END ***/
        }


        if(period == annually) {
            /*** GRIDS BY YEARS END ***/
            let prevYear;
            let daysInYearCounter = 1;
            let countYears = -1;
            datesAll.forEach(function(date, indexDate) {
                daysInYearCounter++;
                if(prevYear == undefined || prevYear != date.getFullYear()) {
                    countYears++;
                    daysInYearCounter = 1;
                    ganttviewGridRow.append('<div class="ganttview-grid-row-cell"></div>');
                }
                $('.ganttview-grid-row').eq(index).find(('.ganttview-grid-row-cell')).eq(countYears).css('width', dayWidth * daysInYearCounter + 'px');
                prevYear = date.getFullYear();
            });
            /*** GRIDS BY YEARS END ***/
        }


        let ganttviewBlockContainer = $('<div>', {
            'class' : 'ganttview-block-container',
            'css' : {
                'padding-top' : (index * 2 + 3) + 'px'
            }
        });

        let ganttviewBlock = $('<div>', {
            'class' : 'ganttview-block ui-resizable ui-draggable',
            'css' : {
                'width' : (currentTask.duration * dayWidth) + 'px',
                'left' : (getDiffDaysBetweenTwoDates(currentTask.start_date) * dayWidth) + 'px'
            }
        });

        ganttviewBlockContainer.append(ganttviewBlock);
        ganttviewBlocks.append(ganttviewBlockContainer);



        /* Make scale of the gantt and draggable/resizable for tasks */
        $('.ganttview-hzheader-months, .ganttview-hzheader-days, .ganttview-hzheader-weeks, .ganttview-grid').css('width', dayWidth * datesAll.length + 'px');

        $(".ui-draggable").draggable({
            axis: 'x',
            grid: [dayWidth]
        });

        $(".ui-resizable").resizable({
            handles: 'e, w',
            grid: [dayWidth]
        });

    });

}
