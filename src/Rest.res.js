// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var S$RescriptSchema = require("rescript-schema/src/S.res.js");
var Caml_js_exceptions = require("rescript/lib/js/caml_js_exceptions.js");

async function $$default(args) {
  var result = await fetch(args.path, args);
  var contentType = result.headers.get("content-type");
  if (contentType && contentType.includes("application/") && contentType.includes("json")) {
    return {
            data: await result.json(),
            status: result.status,
            headers: result.headers
          };
  } else if (contentType && contentType.includes("text/")) {
    return {
            data: await result.text(),
            status: result.status,
            headers: result.headers
          };
  } else {
    return {
            data: await result.blob(),
            status: result.status,
            headers: result.headers
          };
  }
}

var ApiFetcher = {
  $$default: $$default
};

function register(map, status, builder) {
  if (map[status]) {
    throw new Error("[rescript-rest] " + ("Response for the \"" + status + "\" status registered multiple times"));
  }
  map[status] = builder;
}

function parsePath(_path, pathItems, pathParams) {
  while(true) {
    var path = _path;
    if (path === "") {
      return ;
    }
    var paramStartIdx = path.indexOf("{");
    if (paramStartIdx !== -1) {
      var paramEndIdx = path.indexOf("}");
      if (paramEndIdx !== -1) {
        if (paramStartIdx > paramEndIdx) {
          throw new Error("[rescript-rest] Path parameter is not enclosed in curly braces");
        }
        var paramName = path.slice(paramStartIdx + 1 | 0, paramEndIdx);
        if (paramName === "") {
          throw new Error("[rescript-rest] Path parameter name cannot be empty");
        }
        var param = {
          name: paramName
        };
        pathItems.push(path.slice(0, paramStartIdx));
        pathItems.push(param);
        pathParams[paramName] = param;
        _path = path.slice(paramEndIdx + 1 | 0);
        continue ;
      }
      throw new Error("[rescript-rest] Path contains an unclosed parameter");
    }
    pathItems.push(path);
    return ;
  };
}

function coerceSchema(schema) {
  return S$RescriptSchema.preprocess(schema, (function (s) {
                var optionalSchema = s.schema.t;
                var tagged;
                tagged = typeof optionalSchema !== "object" || optionalSchema.TAG !== "option" ? optionalSchema : optionalSchema._0.t;
                var exit = 0;
                if (typeof tagged !== "object") {
                  switch (tagged) {
                    case "int32" :
                    case "number" :
                        exit = 2;
                        break;
                    case "boolean" :
                        exit = 1;
                        break;
                    default:
                      return {};
                  }
                } else {
                  switch (tagged.TAG) {
                    case "literal" :
                        switch (tagged._0.kind) {
                          case "Number" :
                              exit = 2;
                              break;
                          case "Boolean" :
                              exit = 1;
                              break;
                          default:
                            return {};
                        }
                        break;
                    default:
                      return {};
                  }
                }
                switch (exit) {
                  case 1 :
                      return {
                              p: (function (unknown) {
                                  switch (unknown) {
                                    case "false" :
                                        return false;
                                    case "true" :
                                        return true;
                                    default:
                                      return unknown;
                                  }
                                })
                            };
                  case 2 :
                      return {
                              p: (function (unknown) {
                                  var $$float = (+unknown);
                                  if (Number.isNaN($$float)) {
                                    return unknown;
                                  } else {
                                    return $$float;
                                  }
                                })
                            };
                  
                }
              }));
}

function stripInPlace(schema) {
  schema.t.unknownKeys = "Strip";
}

function getSchemaField(schema, fieldName) {
  return schema.t.fields[fieldName];
}

function isNestedFlattenSupported(schema) {
  var match = schema.t;
  if (typeof match !== "object") {
    return false;
  }
  if (match.TAG !== "object") {
    return false;
  }
  if (match.advanced) {
    return false;
  }
  var match$1 = S$RescriptSchema.reverse(schema).t;
  if (typeof match$1 !== "object" || !(match$1.TAG === "object" && !match$1.advanced)) {
    return false;
  } else {
    return true;
  }
}

var bearerAuthSchema = S$RescriptSchema.transform(S$RescriptSchema.string, (function (s) {
        return {
                p: (function (string) {
                    var match = string.split(" ");
                    if (match.length !== 2) {
                      return s.fail("Invalid Bearer token", undefined);
                    }
                    var match$1 = match[0];
                    if (match$1 === "Bearer") {
                      return match[1];
                    } else {
                      return s.fail("Invalid Bearer token", undefined);
                    }
                  }),
                s: (function (token) {
                    return "Bearer " + token;
                  })
              };
      }));

var basicAuthSchema = S$RescriptSchema.transform(S$RescriptSchema.string, (function (s) {
        return {
                p: (function (string) {
                    var match = string.split(" ");
                    if (match.length !== 2) {
                      return s.fail("Invalid Basic token", undefined);
                    }
                    var match$1 = match[0];
                    if (match$1 === "Basic") {
                      return match[1];
                    } else {
                      return s.fail("Invalid Basic token", undefined);
                    }
                  }),
                s: (function (token) {
                    return "Basic " + token;
                  })
              };
      }));

function params(route) {
  var params$1 = route._rest;
  if (params$1 !== undefined) {
    return params$1;
  }
  var routeDefinition = route();
  var pathItems = [];
  var pathParams = {};
  parsePath(routeDefinition.path, pathItems, pathParams);
  var isRawBody = false;
  var variablesSchema = S$RescriptSchema.object(function (s) {
        return routeDefinition.variables({
                    field: (function (fieldName, schema) {
                        return s.nested("body").f(fieldName, schema);
                      }),
                    body: (function (schema) {
                        if (isNestedFlattenSupported(schema)) {
                          return s.nested("body").flatten(schema);
                        } else {
                          return s.f("body", schema);
                        }
                      }),
                    rawBody: (function (schema) {
                        var match = schema.t;
                        var isNonStringBased;
                        isNonStringBased = typeof match !== "object" ? (
                            match === "string" ? false : true
                          ) : (
                            match.TAG === "literal" && match._0.kind === "String" ? false : true
                          );
                        if (isNonStringBased) {
                          throw new Error("[rescript-rest] Only string-based schemas are allowed in rawBody");
                        }
                        ((isRawBody = true));
                        return s.f("body", schema);
                      }),
                    header: (function (fieldName, schema) {
                        return s.nested("headers").f(fieldName.toLowerCase(), coerceSchema(schema));
                      }),
                    query: (function (fieldName, schema) {
                        return s.nested("query").f(fieldName, coerceSchema(schema));
                      }),
                    param: (function (fieldName, schema) {
                        if (!pathParams[fieldName]) {
                          throw new Error("[rescript-rest] " + ("Path parameter \"" + fieldName + "\" is not defined in the path"));
                        }
                        return s.nested("params").f(fieldName, coerceSchema(schema));
                      }),
                    auth: (function (auth) {
                        var tmp;
                        tmp = auth === "Bearer" ? bearerAuthSchema : basicAuthSchema;
                        return s.nested("headers").f("authorization", tmp);
                      })
                  });
      });
  stripInPlace(variablesSchema);
  variablesSchema.f = undefined;
  var match = getSchemaField(variablesSchema, "headers");
  if (match !== undefined) {
    var schema = match.schema;
    stripInPlace(schema);
    schema.f = undefined;
  }
  var match$1 = getSchemaField(variablesSchema, "params");
  if (match$1 !== undefined) {
    match$1.schema.f = undefined;
  }
  var match$2 = getSchemaField(variablesSchema, "query");
  if (match$2 !== undefined) {
    match$2.schema.f = undefined;
  }
  var responsesMap = {};
  var responses = [];
  routeDefinition.responses.forEach(function (r) {
        var builder = {
          emptyData: true
        };
        var schema = S$RescriptSchema.object(function (s) {
              var definition = r({
                    status: (function (status) {
                        builder.status = status;
                        register(responsesMap, status, builder);
                        s.tag("status", status);
                      }),
                    description: (function (d) {
                        builder.description = d;
                      }),
                    data: (function (schema) {
                        builder.emptyData = false;
                        if (isNestedFlattenSupported(schema)) {
                          return s.nested("data").flatten(schema);
                        } else {
                          return s.f("data", schema);
                        }
                      }),
                    field: (function (fieldName, schema) {
                        builder.emptyData = false;
                        return s.nested("data").f(fieldName, schema);
                      }),
                    header: (function (fieldName, schema) {
                        return s.nested("headers").f(fieldName.toLowerCase(), coerceSchema(schema));
                      })
                  });
              if (builder.emptyData) {
                s.tag("data", null);
              }
              return definition;
            });
        if (builder.status === undefined) {
          register(responsesMap, "default", builder);
        }
        stripInPlace(schema);
        schema.f = undefined;
        var dataSchema = getSchemaField(schema, "data").schema;
        builder.dataSchema = dataSchema;
        var match = dataSchema.t;
        if (typeof match === "object" && match.TAG === "literal") {
          var dataTypeValidation = dataSchema.f;
          schema.f = (function (b, inputVar) {
              return dataTypeValidation(b, inputVar + ".data");
            });
        }
        var match$1 = getSchemaField(schema, "headers");
        if (match$1 !== undefined) {
          var schema$1 = match$1.schema;
          stripInPlace(schema$1);
          schema$1.f = undefined;
        }
        builder.schema = schema;
        responses.push(builder);
      });
  if (responses.length === 0) {
    throw new Error("[rescript-rest] At least single response should be registered");
  }
  var params$2 = {
    definition: routeDefinition,
    pathItems: pathItems,
    variablesSchema: variablesSchema,
    responses: responses,
    responsesMap: responsesMap,
    isRawBody: isRawBody
  };
  route._rest = params$2;
  return params$2;
}

function tokeniseValue(key, value, append) {
  if (Array.isArray(value)) {
    value.forEach(function (v, idx) {
          tokeniseValue(key + "[" + idx.toString() + "]", v, append);
        });
    return ;
  } else if (value === null) {
    return append(key, "");
  } else if (value === (void 0)) {
    return ;
  } else if (typeof value === "object") {
    Object.keys(value).forEach(function (k) {
          tokeniseValue(key + "[" + encodeURIComponent(k) + "]", value[k], append);
        });
    return ;
  } else {
    return append(key, value);
  }
}

function getCompletePath(baseUrl, pathItems, maybeQuery, maybeParams, jsonQuery) {
  var path = baseUrl;
  for(var idx = 0 ,idx_finish = pathItems.length; idx < idx_finish; ++idx){
    var pathItem = pathItems[idx];
    if (typeof pathItem === "string") {
      path = path + pathItem;
    } else {
      var name = pathItem.name;
      var param = maybeParams && maybeParams[name];
      if (param !== undefined) {
        path = path + param;
      } else {
        throw new Error("[rescript-rest] " + ("Path parameter \"" + name + "\" is not defined in variables"));
      }
    }
  }
  if (maybeQuery !== undefined) {
    var queryItems = [];
    var append = function (key, value) {
      queryItems.push(key + "=" + encodeURIComponent(value));
    };
    var queryNames = Object.keys(maybeQuery);
    for(var idx$1 = 0 ,idx_finish$1 = queryNames.length; idx$1 < idx_finish$1; ++idx$1){
      var queryName = queryNames[idx$1];
      var value = maybeQuery[queryName];
      var key = encodeURIComponent(queryName);
      if (value !== (void 0)) {
        if (jsonQuery) {
          append(key, typeof value === "string" && value !== "true" && value !== "false" && value !== "null" && Number.isNaN(Number(value)) ? value : JSON.stringify(value));
        } else {
          tokeniseValue(key, value, append);
        }
      }
      
    }
    if (queryItems.length > 0) {
      path = path + "?" + queryItems.join("&");
    }
    
  }
  return path;
}

function $$fetch$1(route, baseUrl, variables, fetcherOpt, jsonQueryOpt) {
  var fetcher = fetcherOpt !== undefined ? fetcherOpt : $$default;
  var jsonQuery = jsonQueryOpt !== undefined ? jsonQueryOpt : false;
  var match = params(route);
  var responsesMap = match.responsesMap;
  var data = S$RescriptSchema.reverseConvertOrThrow(variables, match.variablesSchema);
  if (data.body !== (void 0)) {
    if (!match.isRawBody) {
      data.body = (JSON.stringify(data["body"]));
    }
    if (data.headers === (void 0)) {
      data.headers = {};
    }
    data.headers["content-type"] = "application/json";
  }
  return fetcher({
                body: data.body,
                headers: data.headers,
                method: match.definition.method,
                path: getCompletePath(baseUrl, match.pathItems, data.query, data.params, jsonQuery)
              }).then(function (fetcherResponse) {
              var responseStatus = fetcherResponse.status;
              var response = responsesMap[responseStatus] || responsesMap[(responseStatus / 100 | 0) + "XX"] || responsesMap["default"];
              if (response !== undefined) {
                try {
                  return S$RescriptSchema.parseOrThrow(fetcherResponse, response.schema);
                }
                catch (raw_error){
                  var error = Caml_js_exceptions.internalToOCamlException(raw_error);
                  if (error.RE_EXN_ID === S$RescriptSchema.Raised) {
                    var error$1 = error._1;
                    var match = error$1.code;
                    if (typeof match === "object" && match.TAG === "InvalidType" && error$1.path === S$RescriptSchema.Path.empty) {
                      var message = "Failed parsing response data. Reason: Expected " + getSchemaField(match.expected, "data").schema.n() + ", received " + match.received.data;
                      throw new Error("[rescript-rest] " + message);
                    }
                    var message$1 = "Failed parsing response at " + error$1.path + ". Reason: " + S$RescriptSchema.$$Error.reason(error$1);
                    throw new Error("[rescript-rest] " + message$1);
                  }
                  throw error;
                }
              } else {
                var error$2 = "Unexpected response status \"" + fetcherResponse.status.toString() + "\"";
                if (fetcherResponse.data && typeof fetcherResponse.data.message === "string") {
                  error$2 = error$2 + ". Message: " + fetcherResponse.data.message;
                }
                throw new Error("[rescript-rest] " + error$2);
              }
            });
}

function client(baseUrl, fetcherOpt, jsonQueryOpt) {
  var fetcher = fetcherOpt !== undefined ? fetcherOpt : $$default;
  var jsonQuery = jsonQueryOpt !== undefined ? jsonQueryOpt : false;
  var call = function (route, variables) {
    return $$fetch$1(route, baseUrl, variables, fetcher, jsonQuery);
  };
  return {
          call: call,
          baseUrl: baseUrl,
          fetcher: fetcher,
          jsonQuery: jsonQuery
        };
}

var $$Response = {};

exports.ApiFetcher = ApiFetcher;
exports.$$Response = $$Response;
exports.params = params;
exports.client = client;
exports.$$fetch = $$fetch$1;
/* bearerAuthSchema Not a pure module */
