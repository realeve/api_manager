/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FileSaver.js dependency
 */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
import lib from './lib';

var _saveAs = (function(view) {
    // IE <10 is explicitly unsupported
    if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        ,
        get_URL = function() {
            return view.URL || view.webkitURL || view;
        },
        save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        can_use_save_link = "download" in save_link,
        click = function(node) {
            var event = doc.createEvent("MouseEvents");
            event.initMouseEvent(
                "click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null
            );
            node.dispatchEvent(event);
        },
        webkit_req_fs = view.webkitRequestFileSystem,
        req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
        throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        },
        force_saveable_type = "application/octet-stream",
        fs_min_size = 0
        // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
        // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
        // for the reasoning behind the timeout and revocation flow
        ,
        arbitrary_revoke_timeout = 500 // in ms
        ,
        revoke = function(file) {
            var revoker = function() {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            if (view.chrome) {
                revoker();
            } else {
                setTimeout(revoker, arbitrary_revoke_timeout);
            }
        },
        dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        },
        auto_bom = function(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob(["\ufeff", blob], { type: blob.type });
            }
            return blob;
        },
        FileSaver = function(blob, name) {
            blob = auto_bom(blob);
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this,
                type = blob.type,
                blob_changed = false,
                object_url, target_view, dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
                // on any filesys errors revert to saving with object URLs
                ,
                fs_error = function() {
                    // don't create more object URLs than needed
                    if (blob_changed || !object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (target_view) {
                        target_view.location.href = object_url;
                    } else {
                        var new_tab = view.open(object_url, "_blank");
                        if (new_tab === undefined && typeof safari !== "undefined") {
                            //Apple do not allow window.open, see http://bit.ly/1kZffRI
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                },
                abortable = function(func) {
                    return function() {
                        if (filesaver.readyState !== filesaver.DONE) {
                            return func.apply(this, arguments);
                        }
                    };
                },
                create_if_not_found = { create: true, exclusive: false },
                slice;
            filesaver.readyState = filesaver.INIT;
            if (!name) {
                name = "download";
            }
            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                save_link.href = object_url;
                save_link.download = name;
                click(save_link);
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
                revoke(object_url);
                return;
            }
            // Object and web filesystem URLs have a problem saving in Google Chrome when
            // viewed in a tab, so I force save with application/octet-stream
            // http://code.google.com/p/chromium/issues/detail?id=91158
            // Update: Google errantly closed 91158, I submitted it again:
            // https://code.google.com/p/chromium/issues/detail?id=389642
            if (view.chrome && type && type !== force_saveable_type) {
                slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
                blob_changed = true;
            }
            // Since I can't be sure that the guessed media type will trigger a download
            // in WebKit, I append .download to the filename.
            // https://bugs.webkit.org/show_bug.cgi?id=65440
            if (webkit_req_fs && name !== "download") {
                name += ".download";
            }
            if (type === force_saveable_type || webkit_req_fs) {
                target_view = view;
            }
            if (!req_fs) {
                fs_error();
                return;
            }
            fs_min_size += blob.size;
            req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
                fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                    var save = function() {
                        dir.getFile(name, create_if_not_found, abortable(function(file) {
                            file.createWriter(abortable(function(writer) {
                                writer.onwriteend = function(event) {
                                    target_view.location.href = file.toURL();
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch(filesaver, "writeend", event);
                                    revoke(file);
                                };
                                writer.onerror = function() {
                                    var error = writer.error;
                                    if (error.code !== error.ABORT_ERR) {
                                        fs_error();
                                    }
                                };
                                "writestart progress write abort".split(" ").forEach(function(event) {
                                    writer["on" + event] = filesaver["on" + event];
                                });
                                writer.write(blob);
                                filesaver.abort = function() {
                                    writer.abort();
                                    filesaver.readyState = filesaver.DONE;
                                };
                                filesaver.readyState = filesaver.WRITING;
                            }), fs_error);
                        }), fs_error);
                    };
                    dir.getFile(name, { create: false }, abortable(function(file) {
                        // delete file if it already exists
                        file.remove();
                        save();
                    }), abortable(function(ex) {
                        if (ex.code === ex.NOT_FOUND_ERR) {
                            save();
                        } else {
                            fs_error();
                        }
                    }));
                }), fs_error);
            }), fs_error);
        },
        FS_proto = FileSaver.prototype,
        saveAs = function(blob, name) {
            return new FileSaver(blob, name);
        };
    // IE 10+ (native saveAs)
    if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
        return function(blob, name) {
            return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
        };
    }

    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
        FS_proto.onprogress =
        FS_proto.onwrite =
        FS_proto.onabort =
        FS_proto.onerror =
        FS_proto.onwriteend =
        null;

    return saveAs;
}(window));



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local (private) functions
 */

/**
 * Get the file name for an exported file.
 *
 * @param {object}  config       Button configuration
 * @param {boolean} incExtension Include the file name extension
 */
var _filename = function(config, incExtension) {
    // Backwards compatibility
    var filename = config.filename === '*' && config.title !== '*' && config.title !== undefined ?
        config.title :
        config.filename;

    if (filename.includes('*')) {
        filename = filename.replace('*', document.title);
    }

    // Strip characters which the OS will object to
    filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, "");

    return incExtension === undefined || incExtension === true ?
        filename + config.extension :
        filename;
};

/**
 * Get the title for an exported file.
 *
 * @param {object}  config  Button configuration
 */
var _title = function(config) {
    var title = config.title;

    return title.indexOf('*') !== -1 ?
        title.replace('*', document.title) :
        title;
};

/**
 * Get the newline character(s)
 *
 * @param {object}  config Button configuration
 * @return {string}        Newline character
 */
var _newLine = function(config) {
    return config.newline ?
        config.newline :
        navigator.userAgent.match(/Windows/) ?
        '\r\n' :
        '\n';
};

/**
 * Safari's data: support for creating and downloading files is really poor, so
 * various options need to be disabled in it. See
 * https://bugs.webkit.org/show_bug.cgi?id=102914
 *
 * @return {Boolean} `true` if Safari
 */
var _isSafari = function() {
    return navigator.userAgent.indexOf('Safari') !== -1 &&
        navigator.userAgent.indexOf('Chrome') === -1 &&
        navigator.userAgent.indexOf('Opera') === -1;
};

var pdf = (config, download = true) => {
    let defaultConfig = {
        orientation: 'portrait',
        pageSize: 'A4',
        download: 'open',
        title: document.title,
        extension: '.pdf',
        filename: '*'
    }

    config = Object.assign(defaultConfig, config);
    config.extension = '.pdf';
    var newLine = _newLine(config);
    var data = config;
    var rows = [];

    if (config.header) {
        rows.push(data.header.map(d => {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableHeader'
            };
        }))
    }

    data.body.forEach((item, i) => {
        rows.push(item.map(d => {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
            };
        }))
    });

    if (config.footer) {
        rows.push(data.footer.map(d => {
            return {
                text: typeof d === 'string' ? d : d + '',
                style: 'tableFooter'
            };
        }));
    }

    var doc = {
        pageSize: config.pageSize,
        pageOrientation: config.orientation,
        content: [{
            table: {
                headerRows: 1,
                body: rows
            },
            layout: 'headerLineOnly'
        }],
        styles: {
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: '#2d4154', //'white',
                fillColor: 'white', //'#2d4154',
                alignment: 'center',
                margin: [8, 3, 8, 3]
            },
            tableBodyEven: {
                fontSize: 10,
                margin: [8, 3, 8, 3]
            },
            tableBodyOdd: {
                fontSize: 10,
                fillColor: '#f3f3f3',
                margin: [8, 3, 8, 3]
            },
            tableFooter: {
                bold: true,
                fontSize: 12,
                color: 'white',
                fillColor: '#2d4154',
                margin: [8, 3, 8, 3]
            },
            title: {
                alignment: 'center',
                fontSize: 20
            },
            message: {}
        },
        defaultStyle: {
            fontSize: 10
        }
    };

    if (config.message) {
        doc.content.push({
            text: config.message,
            style: 'message',
            alignment: 'left',
            margin: [0, 20, 0, 6]
        });
    }

    if (config.title && config.showTitle) {
        doc.content.unshift({
            text: _title(config, false),
            style: 'title',
            margin: [0, 0, 0, 6]
        });
    }

    if (config.customize) {
        config.customize(doc);
    }

    var pdf = window.pdfMake.createPdf(doc);

    // if (config.download === 'open' && !_isSafari()) {
    //     pdf.open();
    // } else {
    //     pdf.getBuffer(function(buffer) {
    //         var blob = new Blob([buffer], { type: 'application/pdf' });
    //         _saveAs(blob, _filename(config));
    //     });
    // }

    pdf.getBuffer(function(buffer) {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        if (!download && !_isSafari()) {
            let src = URL.createObjectURL(blob);
            lib.openUrl(src, false);
        } else {
            _saveAs(blob, _filename(config));
        }
    });

}

let xlsx = config => {
    // Excel - Pre-defined strings to build a minimal XLSX file
    var excelStrings = {
        "_rels/.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>\
</Relationships>',

        "xl/_rels/workbook.xml.rels": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>\
</Relationships>',

        "[Content_Types].xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">\
  <Default Extension="xml" ContentType="application/xml"/>\
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>\
  <Default Extension="jpeg" ContentType="image/jpeg"/>\
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>\
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>\
</Types>',

        "xl/workbook.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\
  <fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/>\
  <workbookPr showInkAnnotation="0" autoCompressPictures="0"/>\
  <bookViews>\
    <workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/>\
  </bookViews>\
  <sheets>\
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>\
  </sheets>\
</workbook>',

        "xl/worksheets/sheet1.xml": '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">\
  <sheetData>\
    __DATA__\
  </sheetData>\
</worksheet>'
    };


    // Set the text
    var xml = '';
    var data = config;
    config.filename = '*';
    config.extension = '.xlsx';

    var addRow = function(row) {
        var cells = [];

        for (var i = 0, ien = row.length; i < ien; i++) {
            if (row[i] === null || row[i] === undefined) {
                row[i] = '';
            }

            // Don't match numbers with leading zeros or a negative anywhere
            // but the start
            cells.push(typeof row[i] === 'number' || (row[i].match && row[i].match(/^-?[0-9\.]+$/) && row[i].charAt(0) !== '0') ?
                '<c t="n"><v>' + row[i] + '</v></c>' :
                '<c t="inlineStr"><is><t>' + (!row[i].replace ?
                    row[i] :
                    row[i]
                    .replace(/&(?!amp;)/g, '&amp;')
                    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')) + // remove control characters
                '</t></is></c>' // they are not valid in XML
            );
        }

        return '<row>' + cells.join('') + '</row>';
    };

    if (config.header) {
        xml += addRow(data.header);
    }

    for (var i = 0, ien = data.body.length; i < ien; i++) {
        xml += addRow(data.body[i]);
    }

    if (config.footer) {
        xml += addRow(data.footer);
    }

    var zip = new window.JSZip();
    var _rels = zip.folder("_rels");
    var xl = zip.folder("xl");
    var xl_rels = zip.folder("xl/_rels");
    var xl_worksheets = zip.folder("xl/worksheets");

    zip.file('[Content_Types].xml', excelStrings['[Content_Types].xml']);
    _rels.file('.rels', excelStrings['_rels/.rels']);
    xl.file('workbook.xml', excelStrings['xl/workbook.xml']);
    xl_rels.file('workbook.xml.rels', excelStrings['xl/_rels/workbook.xml.rels']);
    xl_worksheets.file('sheet1.xml', excelStrings['xl/worksheets/sheet1.xml'].replace('__DATA__', xml));

    _saveAs(
        zip.generate({ type: "blob" }),
        _filename(config)
    );
}

export default {
    pdf,
    xlsx
}