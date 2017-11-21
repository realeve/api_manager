// let rangeArr = [
//     [moment(), moment()],
//     [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//     [moment().subtract(2, 'days'), moment()],
//     [moment().subtract(6, 'days'), moment()],
//     [moment().subtract(29, 'days'), moment()],
//     [moment().startOf('month'), moment().endOf('month')],
//     [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//     [moment().subtract(1, 'year').startOf('month'), moment().subtract(1, 'year').endOf('month')],
//     [moment().startOf('quarters'), moment()],
//     [moment().subtract(1, 'quarters').startOf('quarters'), moment().subtract(1, 'quarters').endOf('quarters')],
//     [moment().quarter(1).startOf('quarters'), moment().quarter(2).endOf('quarters')],
//     [moment().quarter(3).startOf('quarters'), moment().quarter(4).endOf('quarters')],
//     [moment().quarter(1).startOf('quarters'), moment()]
// ];
// let rangeStr = ['今天', '昨天', '过去三天', '过去一周', '过去30天', '本月', '上月', '去年同期', '本季度', '上季度', '上半年', '下半年', '今年'];

let rangeArr = [
    [moment().subtract(29, 'days'), moment()],
    [moment().startOf('month'), moment().endOf('month')],
    [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    [moment().startOf('quarters'), moment()],
    [moment().subtract(1, 'quarters').startOf('quarters'), moment().subtract(1, 'quarters').endOf('quarters')],
    [moment().quarter(1).startOf('quarters'), moment().quarter(2).endOf('quarters')],
    [moment().quarter(3).startOf('quarters'), moment().quarter(4).endOf('quarters')],
    [moment().quarter(1).startOf('quarters'), moment()]
];
let rangeStr = ['过去30天', '本月', '上月', '本季度', '上季度', '上半年', '下半年', '今年'];


let ranges = {};

rangeStr.forEach(function(day, i) {
    ranges[day] = rangeArr[i];
});

let dateRange = function(mode, yearType) {
    return rangeArr[mode][0].format(yearType) + ' ~ ' + rangeArr[mode][1].format(yearType);
};

let init = (yearType = 'YYYYMMDD') => {
    let defaultRange = 3;
    let dateDom = $('#daterange');
    if (!jQuery().daterangepicker || !dateDom) {
        return;
    }

    if (typeof moment != 'undefined') {
        moment.locale('zh-cn');
    }

    dateDom.daterangepicker({
            opens: (App.isRTL() ? 'right' : 'left'),
            startDate: rangeArr[defaultRange][0],
            endDate: rangeArr[defaultRange][1],
            minDate: '01/01/2000',
            maxDate: '12/31/2099',
            dateLimit: {
                "months": 120
            },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: false,
            ranges: ranges,
            buttonClasses: ['btn btn-sm'],
            applyClass: ' green',
            cancelClass: ['btn btn-sm btn-danger'],
            format: 'MM/DD/YYYY',
            separator: ' to ',
            locale: {
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                customRangeLabel: '时间范围选择',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            }
        },
        function(start, end) {
            dateDom.find('span').html(start.format(yearType) + ' ~ ' + end.format(yearType));
        }
    );
    dateDom.find('span').html(dateRange(defaultRange, yearType));
}

export default {
    init
}