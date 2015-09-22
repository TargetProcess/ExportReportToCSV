/*! v0.1.0 Build Tue Sep 22 2015 12:55:51 GMT+0300 (MSK) */
!function(){var e={},t=function(){var t,n,r,o=Array.prototype.slice.call(arguments,0);"string"==typeof o[0]?(r=o[0],t=o[1],n=o[2]):Array.isArray(o[0])&&(t=o[0],n=o[1]);var a=t.reduce(function(e,t){return e.addDependency(t)},tau.mashups);return a=a.addDependency(r+"/config"),a=a.addMashup(function(){var o=Array.prototype.slice.call(arguments,0);if(t.length>0&&1===o.length)throw new Error("Can't properly load dependencies for mashup \""+r+'", mashup is stopped.');return e.variables=o[o.length-1],o.length-t.length===2?e.config=o[o.length-2]:e.config={},Object.freeze&&(Object.freeze(e.variables),Object.freeze(e.config),Object.freeze(e)),n.apply(null,o)})};t("ExportReportToCSV",["jQuery","Underscore","tau/configurator","tau/models/board.customize.units/const.entity.types.names","tau/models/board.customize.units/const.card.sizes","tau/models/board.customize.units/board.customize.units.interaction","tau/utils/utils.date"],function(t,n,r,o,a,i,u){return function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var r={};return n.m=t,n.c=r,n.p="",n.p=e.variables?e.variables.mashupPath:n.p,n(0)}([function(e,t,n){e.exports=n(3)},,,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}var o=n(4),a=r(o),i=n(5),u=r(i),s=n(6),c=n(8),p=r(c),d=n(14),l=r(d),f=void 0,m=function(e){return'"'+e.replace(/"/g,'""')+'"'},g=function(e){var t=arguments.length<=1||void 0===arguments[1]?",":arguments[1];return e.map(m).join(t)},v=function(e,t){var n=arguments.length<=2||void 0===arguments[2]?",":arguments[2];return[g(e,n)].concat(t.map(function(e){return g(e,n)})).join("\n")},y=function(e,t){var n="data:text/csv;charset=utf-8",r=void 0;if("function"==typeof btoa)try{r=btoa(e),n+=";base64"}catch(o){r=encodeURIComponent(e)}else r=encodeURIComponent(e);var i=a["default"]("<a />",{href:n+","+r,download:t}).css("display","none").appendTo("body");i[0].click(),i.remove()},h=function(e){return a["default"].ajax({url:p["default"].getApplicationPath()+"/slice/v1/report",type:"post",contentType:"application/json",dataType:"json",data:JSON.stringify(e)})},b=function(e){var t=e.metaInfo.dimensions,n=void 0===t?{}:t;return u["default"].flatten(u["default"].map(n,function(e,t){return"Entity"===e.type?[{selector:"."+t+" .id",title:t+".id"},{selector:"."+t+" .name",title:t+".name"}]:[{selector:"."+t,title:t,type:e.type}]}))},x=function(e,t){var n=e.data;return n.map(function(e){return t.map(function(t){var n=t.selector,r=t.type,o=u["default"].jsonSelect(e,n),a=o.length?o[0]:null,i=a;return"Date"===r&&a&&(i=l["default"].parse(a).toUTCString()),(null===i||"undefined"==typeof i)&&(i=""),String(i)})})},j=function(){var e=void 0;f.get({fields:["name","reportSettings"]}).then(function(t){var n=t.reportSettings.dataSource,r=t.name;return e=r,h(n)}).then(function(t){var n=b(t),r=x(t,n),o=n.map(function(e){return e.title}),a=v(o,r);y(a,e)})};s.addBusListener("customReport.toolbar","afterRender",function(e,t){var n=t.element,r=a["default"]('<button class="tau-btn" type="button">Export to CSV</button>');r.on("click",j),n.find(".tau-board-header__flex-elem").after(r)}),s.addBusListener("customReport","boardSettings.ready",function(e,t){var n=t.boardSettings;f=n})},function(e,n){e.exports=t},function(e,t){e.exports=n},function(e,t,n){"use strict";var r=n(7),o=n(9),a=n(10);e.exports={addBusListener:o.addBusListener,addBusListenerOnce:o.addBusListenerOnce,getAppConfigurator:r.getAppConfigurator,configurator:r,events:o,customUnits:a}},function(e,t,n){"use strict";var r=n(8),o=n(4),a=new o.Deferred;r.getGlobalBus().once("configurator.ready",function(e,t){a.resolve(t)});var i=function(){return a.promise()};e.exports={getAppConfigurator:i}},function(e,t){e.exports=r},function(e,t,n){"use strict";var r=n(8),o=r.getBusRegistry(),a=function(e){return function(){e.apply(null,Array.prototype.slice.call(arguments).slice(1))}},i=function(e,t,n,r){var i=a(function(o){var a=o.bus;a.name===e&&a[r?"once":"on"](t,n)}),u=o.addEventListener("create",i);return o.addEventListener("destroy",a(function(r){var o=r.bus;o.name===e&&o.removeListener(t,n,u)})),{remove:function(){o.removeListener("create",i,u),o.getBusRegistry().getByName(e).then(function(e){e.removeListener(t,n,u)})}}},u=function(e,t,n){return i(e,t,n,!0)};e.exports={addBusListener:i,addBusListenerOnce:u}},function(e,t,n){"use strict";var r=n(11),o=n(12),a=n(13).openUnitEditor,i=n(7),u=function(e){return e=e||{},e.types=e.types||[r.ANY_TYPE],e.sizes=e.sizes||Object.keys(o).map(function(e){return o[e]}),i.getAppConfigurator().then(function(t){var n=t.getUnitsRegistry();if(!e.id)throw new Error('Field "id" is required for custom unit config');if(n.units[e.id])throw new Error('Custom unit with id "'+e.id+'" has been already registered');e.name=e.name||e.id,e.model=e.model||e.sampleData?e.model:{dummy:1},"string"!=typeof e.model&&"object"==typeof e.model&&(e.model=Object.keys(e.model).reduce(function(t,n){return t.concat(n+":"+e.model[n])},[]).join(", ")),e.sampleData=e.sampleData||{},e.template=e.template||{markup:['<div class="tau-board-unit__value">'+e.id+"</div>"]},"string"==typeof e.template&&(e.template={markup:[e.template]}),"string"==typeof e.template.markup&&(e.template.markup=[e.template.markup]),e.outerClassName&&(e.classId=e.outerClassName),e.isEditable&&(e.interactionConfig={isEditable:e.isEditable},e.editorHandler?e.interactionConfig.handler=e.editorHandler:e.interactionConfig.handler=function(t,n){var r=t.cardDataForUnit,o=e.editorComponentName instanceof Function?e.editorComponentName(r):e.editorComponentName,i=a(o,{});if(e.editorData){var u={};Object.keys(e.editorData).forEach(function(t){var n=e.editorData[t];u[t]=n instanceof Function?n(r):r[n]}),t.cardDataForUnit=u}return i(t,n)}),n.units[e.id]=n.register([e])[e.id]})};e.exports={types:r,sizes:o,add:u}},function(e,t){e.exports=o},function(e,t){e.exports=a},function(e,t){e.exports=i},function(e,t){e.exports=u}])})}();