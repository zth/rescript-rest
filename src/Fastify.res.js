// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var Rest = require("./Rest.res.js");
var S$RescriptSchema = require("rescript-schema/src/S.res.js");
var Caml_js_exceptions = require("rescript/lib/js/caml_js_exceptions.js");

function route(app, restRoute, fn) {
  var match = Rest.params(restRoute);
  var parseVariables = match.parseVariables;
  var responseToData = match.responseToData;
  var pathItems = match.pathItems;
  var url = "";
  for(var idx = 0 ,idx_finish = pathItems.length; idx < idx_finish; ++idx){
    var pathItem = pathItems[idx];
    url = typeof pathItem === "string" ? url + pathItem : url + ":" + pathItem.name;
  }
  var routeOptions_method = match.definition.method;
  var routeOptions_handler = function (request, reply) {
    var variables;
    try {
      variables = parseVariables(request);
    }
    catch (raw_error){
      var error = Caml_js_exceptions.internalToOCamlException(raw_error);
      if (error.RE_EXN_ID === S$RescriptSchema.Raised) {
        reply.status(400);
        reply.send({
              statusCode: 400,
              error: "Bad Request",
              message: S$RescriptSchema.$$Error.message(error._1)
            });
        throw 0;
      }
      throw error;
    }
    fn(variables).then(function (handlerReturn) {
          var data = responseToData(handlerReturn);
          var headers = data.headers;
          if (headers) {
            reply.headers(headers);
          }
          reply.status((data.status || 200));
          reply.send(data.data);
        });
  };
  var routeOptions = {
    method: routeOptions_method,
    url: url,
    handler: routeOptions_handler
  };
  if (match.isRawBody) {
    app.register(function (app, param, done) {
          app.addContentTypeParser("application/json", {
                parseAs: "string"
              }, (function (_req, data, done) {
                  done(null, data);
                }));
          app.route(routeOptions);
          done();
        });
  } else {
    app.route(routeOptions);
  }
}

exports.route = route;
/* Rest Not a pure module */
