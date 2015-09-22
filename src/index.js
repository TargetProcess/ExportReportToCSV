import $ from 'jquery';
import _ from 'underscore';
import {addBusListener} from 'targetprocess-mashup-helper';

import configurator from 'tau/configurator';
import dateUtils from 'tau/utils/utils.date';

let boardSettings;

const escapeValue = (val) => `"${val.replace(/"/g, '""')}"`;

const generateCSVRow = (array, separator = ',') => array
    .map(escapeValue)
    .join(separator);

const generateCSV = (headerArray, dataArray, separator = ',') => [generateCSVRow(headerArray, separator)]
    .concat(dataArray.map((v) => generateCSVRow(v, separator)))
    .join('\n');

const downloadText = (text, filename) => {

    let type = 'data:text/csv;charset=utf-8';
    let data;

    if (typeof btoa === 'function') {

        try {

            data = btoa(text);
            type += ';base64';

        } catch (err) {

            data = encodeURIComponent(text);

        }

    } else {

        data = encodeURIComponent(text);

    }

    const $link = $('<a />', {
        href: `${type},${data}`,
        download: filename
    })
    .css('display', 'none')
    .appendTo('body');

    $link[0].click();

    $link.remove();

};

const fetchData = (config) => $.ajax({
    url: `${configurator.getApplicationPath()}/slice/v1/report`,
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(config)
});

const getHeaderFields = ({metaInfo: {dimensions = {}}}) => _.flatten(_.map(dimensions, (v, k) => {

    if (v.type === 'Entity') {

        return [{
            selector: `.${k} .id`,
            title: `${k}.id`
        }, {
            selector: `.${k} .name`,
            title: `${k}.name`
        }];

    } else {

        return [{
            selector: `.${k}`,
            title: k,
            type: v.type
        }];

    }

}));

const getRows = ({data}, headerFields) => {

    return data.map((sourceRow) => headerFields.map(({selector, type}) => {

        const res = _.jsonSelect(sourceRow, selector);
        const val = res.length ? res[0] : null;

        let processedVal = val;

        if (type === 'Date' && val) {

            processedVal = dateUtils.parse(val).toUTCString();

        }

        if (processedVal === null || typeof processedVal === 'undefined') {

            processedVal = '';

        }

        return String(processedVal);

    }));

};

const generateCSVFromReportAndDownload = () => {

    let reportName;

    boardSettings
        .get({
            fields: ['name', 'reportSettings']
        })
        .then(({reportSettings: {dataSource}, name: name_}) => {

            reportName = name_;

            return fetchData(dataSource);

        })
        .then((data) => {

            const headers = getHeaderFields(data);

            const arrayData = getRows(data, headers);
            const arrayHeader = headers.map((v) => v.title);

            const text = generateCSV(arrayHeader, arrayData);

            downloadText(text, reportName);

        });

};

addBusListener('customReport.toolbar', 'afterRender', (ignoreEvt, {element: $el}) => {

    var $button = $('<button class="tau-btn" type="button">Export to CSV</button>');

    $button.on('click', generateCSVFromReportAndDownload);

    $el.find('.tau-board-header__flex-elem').after($button);

});

addBusListener('customReport', 'boardSettings.ready', (ignoreEvt, {boardSettings: boardSettings_}) => {

    boardSettings = boardSettings_;

});

