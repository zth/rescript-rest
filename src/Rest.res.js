// Generated by ReScript, PLEASE EDIT WITH CARE
'use strict';

var S$RescriptSchema = require("rescript-schema/src/S.res.js");

async function $$default(args) {
  var match = args.body;
  var body = match !== undefined ? JSON.stringify(args.body) : undefined;
  var match$1 = args.body;
  var headers;
  if (match$1 !== undefined) {
    var contentHeaders = {
      "content-type": "application/json"
    };
    headers = args.headers === undefined ? contentHeaders : Object.assign(contentHeaders, args.headers);
  } else {
    headers = args.headers;
  }
  var result = await fetch(args.path, {
        method: args.method,
        body: body,
        headers: headers
      });
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
                var optionalSchema = S$RescriptSchema.classify(s.schema);
                var tagged;
                tagged = typeof optionalSchema !== "object" || optionalSchema.TAG !== "Option" ? optionalSchema : S$RescriptSchema.classify(optionalSchema._0);
                var exit = 0;
                if (typeof tagged !== "object") {
                  switch (tagged) {
                    case "Int" :
                    case "Float" :
                        exit = 2;
                        break;
                    case "Bool" :
                        exit = 1;
                        break;
                    default:
                      return {};
                  }
                } else {
                  switch (tagged.TAG) {
                    case "Literal" :
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

function params(route) {
  var params$1 = route._rest;
  if (params$1 !== undefined) {
    return params$1;
  }
  var routeDefinition = route();
  var pathItems = [];
  var pathParams = {};
  parsePath(routeDefinition.path, pathItems, pathParams);
  var variablesSchema = S$RescriptSchema.object(function (s) {
        return routeDefinition.variables({
                    field: (function (fieldName, schema) {
                        return s.nestedField("body", fieldName, schema);
                      }),
                    body: (function (schema) {
                        return s.f("body", schema);
                      }),
                    header: (function (fieldName, schema) {
                        return s.nestedField("headers", fieldName.toLowerCase(), coerceSchema(schema));
                      }),
                    query: (function (fieldName, schema) {
                        return s.nestedField("query", fieldName, schema);
                      }),
                    param: (function (fieldName, schema) {
                        if (!pathParams[fieldName]) {
                          throw new Error("[rescript-rest] " + ("Path parameter \"" + fieldName + "\" is not defined in the path"));
                        }
                        return s.nestedField("params", fieldName, schema);
                      })
                  });
      });
  variablesSchema.f = undefined;
  var responses = {};
  routeDefinition.responses.forEach(function (r) {
        var builder = {
          statuses: []
        };
        var schema = S$RescriptSchema.object(function (s) {
              return r({
                          status: (function (status) {
                              register(responses, status, builder);
                              builder.statuses.push(status);
                            }),
                          description: (function (d) {
                              builder.description = d;
                            }),
                          data: (function (schema) {
                              return s.f("data", schema);
                            }),
                          field: (function (fieldName, schema) {
                              return s.nestedField("data", fieldName, schema);
                            }),
                          header: (function (fieldName, schema) {
                              return s.nestedField("headers", fieldName.toLowerCase(), coerceSchema(schema));
                            })
                        });
            });
        if (builder.statuses.length === 0) {
          register(responses, "default", builder);
        }
        builder.schema = schema;
      });
  var params$2 = {
    definition: routeDefinition,
    pathItems: pathItems,
    variablesSchema: variablesSchema,
    responses: responses
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
  var responses = match.responses;
  var data = S$RescriptSchema.serializeToUnknownOrRaiseWith(variables, match.variablesSchema);
  return fetcher({
                body: data.body,
                headers: data.headers,
                method: match.definition.method,
                path: getCompletePath(baseUrl, match.pathItems, data.query, data.params, jsonQuery)
              }).then(function (fetcherResponse) {
              var responseStatus = fetcherResponse.status;
              var response = responses[responseStatus] || responses[(responseStatus / 100 | 0) + "XX"] || responses["default"];
              if (response !== undefined) {
                return S$RescriptSchema.parseAnyOrRaiseWith(fetcherResponse, response.schema);
              }
              var error = "Server returned unexpected response \"" + fetcherResponse.status.toString() + "\"";
              if (fetcherResponse.data && typeof fetcherResponse.data.message === "string") {
                error = error + ". Message: " + fetcherResponse.data.message;
              }
              throw new Error("[rescript-rest] " + error);
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
/* S-RescriptSchema Not a pure module */
