globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, assertMethod, readBody, setCookie, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "supabase": {
      "url": "https://ulghhgjrbswyeeojlhwc.supabase.co",
      "key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2hoZ2pyYnN3eWVlb2psaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM3MjAzNjQsImV4cCI6MTk5OTI5NjM2NH0.RXK2GaxWFG3nnPxO5vOl1FBzJZMCRTzHArgIkWYkgYY",
      "client": {},
      "redirect": false,
      "cookies": {
        "name": "sb",
        "lifetime": 28800,
        "domain": "",
        "path": "/",
        "sameSite": "lax"
      }
    }
  },
  "supabase": {
    "serviceKey": ""
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config$1 = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config$1.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/adults.png": {
    "type": "image/png",
    "etag": "\"c5ef7-5m0pEiub/JAqdDhoDe4K7NaH8hs\"",
    "mtime": "2023-04-08T16:19:08.201Z",
    "size": 810743,
    "path": "../public/adults.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-03-24T19:13:58.000Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/fr-flag.gif": {
    "type": "image/gif",
    "etag": "\"1414-/U67uQkb2zUlsSN+Diby7D6yFnA\"",
    "mtime": "2023-04-06T20:04:31.767Z",
    "size": 5140,
    "path": "../public/fr-flag.gif"
  },
  "/gm-flag.gif": {
    "type": "image/gif",
    "etag": "\"1516-Rrhnl3eUZvU70JlfGPYCtOQPGl0\"",
    "mtime": "2023-04-06T20:05:47.638Z",
    "size": 5398,
    "path": "../public/gm-flag.gif"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"5d9-H3JsXywV9LW/P9glJB53swqTKPU\"",
    "mtime": "2023-05-29T15:16:14.919Z",
    "size": 1497,
    "path": "../public/index.html"
  },
  "/it-flag.gif": {
    "type": "image/gif",
    "etag": "\"16d4-pC8vp8lQa4B54nY3TFxL/RCMUno\"",
    "mtime": "2023-04-06T20:03:39.012Z",
    "size": 5844,
    "path": "../public/it-flag.gif"
  },
  "/junior.jpg": {
    "type": "image/jpeg",
    "etag": "\"4a552-0sNbp3b5eUcfTm4XwRVqs2ITvQo\"",
    "mtime": "2023-04-08T15:42:54.144Z",
    "size": 304466,
    "path": "../public/junior.jpg"
  },
  "/us-flag.gif": {
    "type": "image/gif",
    "etag": "\"695c-Aure0CfctxyFwgsKe2dTbVaAtcw\"",
    "mtime": "2023-04-06T20:05:22.288Z",
    "size": 26972,
    "path": "../public/us-flag.gif"
  },
  "/youth.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c8fc-AltcFZfTeTxypYla/rB26qkKnfQ\"",
    "mtime": "2023-04-08T16:17:34.778Z",
    "size": 116988,
    "path": "../public/youth.jpg"
  },
  "/Icons/affiliation.png": {
    "type": "image/png",
    "etag": "\"379b-I/2TH4e7V5w/1g/K+0AI2owghZ8\"",
    "mtime": "2023-04-22T14:21:03.544Z",
    "size": 14235,
    "path": "../public/Icons/affiliation.png"
  },
  "/Icons/assistant.png": {
    "type": "image/png",
    "etag": "\"8556-M6p5al/cExqg+1jAkWxDxuT8TQ8\"",
    "mtime": "2023-04-22T14:21:03.544Z",
    "size": 34134,
    "path": "../public/Icons/assistant.png"
  },
  "/Icons/groups.png": {
    "type": "image/png",
    "etag": "\"5775-mAwlplupbuhqj4QIcLt/rZWMjiI\"",
    "mtime": "2023-04-22T14:21:03.544Z",
    "size": 22389,
    "path": "../public/Icons/groups.png"
  },
  "/Icons/pedagogy.png": {
    "type": "image/png",
    "etag": "\"6c19-05xXiMVbo6iGbKLisH5U57pUIVE\"",
    "mtime": "2023-04-22T14:21:03.544Z",
    "size": 27673,
    "path": "../public/Icons/pedagogy.png"
  },
  "/Icons/salary.png": {
    "type": "image/png",
    "etag": "\"6987-JFenrz+5MihJIhwzomAOzyU0XGw\"",
    "mtime": "2023-04-22T14:21:03.555Z",
    "size": 27015,
    "path": "../public/Icons/salary.png"
  },
  "/Icons/student.png": {
    "type": "image/png",
    "etag": "\"4dea-ue8KIgOkjdC+bNZaGKX/kOxqtqA\"",
    "mtime": "2023-04-22T14:21:03.556Z",
    "size": 19946,
    "path": "../public/Icons/student.png"
  },
  "/Icons/students.png": {
    "type": "image/png",
    "etag": "\"4398-NJoFI8UVbHK6QgH5cwobxiP09Ao\"",
    "mtime": "2023-04-22T14:21:03.556Z",
    "size": 17304,
    "path": "../public/Icons/students.png"
  },
  "/Icons/teacher.png": {
    "type": "image/png",
    "etag": "\"530e-KqIJ/fCFNEvq4M9QkoyS7KqNaSI\"",
    "mtime": "2023-04-22T14:21:03.558Z",
    "size": 21262,
    "path": "../public/Icons/teacher.png"
  },
  "/_nuxt/affiliation.59883a5f.png": {
    "type": "image/png",
    "etag": "\"379b-I/2TH4e7V5w/1g/K+0AI2owghZ8\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 14235,
    "path": "../public/_nuxt/affiliation.59883a5f.png"
  },
  "/_nuxt/ages.b6e241a1.js": {
    "type": "application/javascript",
    "etag": "\"52e-IgK60bpnX3pcfJzhR4crFUTsSrw\"",
    "mtime": "2023-05-29T15:16:13.679Z",
    "size": 1326,
    "path": "../public/_nuxt/ages.b6e241a1.js"
  },
  "/_nuxt/arrow-up.26e35ba2.svg": {
    "type": "image/svg+xml",
    "etag": "\"10a-PvGnkzugI0TKvT1h8eDTpAdt39U\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 266,
    "path": "../public/_nuxt/arrow-up.26e35ba2.svg"
  },
  "/_nuxt/assistant.d55bacad.png": {
    "type": "image/png",
    "etag": "\"8556-M6p5al/cExqg+1jAkWxDxuT8TQ8\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 34134,
    "path": "../public/_nuxt/assistant.d55bacad.png"
  },
  "/_nuxt/CreateAffiliation.f7dbe26b.js": {
    "type": "application/javascript",
    "etag": "\"fb9-X0HurhtKGZbKgZIzhXsb6DFUyXs\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 4025,
    "path": "../public/_nuxt/CreateAffiliation.f7dbe26b.js"
  },
  "/_nuxt/CreateAssistant.6723b934.js": {
    "type": "application/javascript",
    "etag": "\"786-29Bx5Hgn2wTMlSY0oy/Flksqqw0\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 1926,
    "path": "../public/_nuxt/CreateAssistant.6723b934.js"
  },
  "/_nuxt/CreateGroup.aec96862.js": {
    "type": "application/javascript",
    "etag": "\"c25-T3osUVg3ToxEb/AVT940JRmT0HM\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 3109,
    "path": "../public/_nuxt/CreateGroup.aec96862.js"
  },
  "/_nuxt/CreateSalary.f4195a6a.js": {
    "type": "application/javascript",
    "etag": "\"13a8-AFlVNE/AAE6ENEANh70xv2Xq5qM\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 5032,
    "path": "../public/_nuxt/CreateSalary.f4195a6a.js"
  },
  "/_nuxt/CreateStudent.c6315916.js": {
    "type": "application/javascript",
    "etag": "\"83e-7bSxJrf0KyiTWbU/HO7hxUm0Xdw\"",
    "mtime": "2023-05-29T15:16:13.683Z",
    "size": 2110,
    "path": "../public/_nuxt/CreateStudent.c6315916.js"
  },
  "/_nuxt/CreateTeacher.8c370c89.js": {
    "type": "application/javascript",
    "etag": "\"770-TeQEXP997+h0P22vZtVoavFpsUY\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1904,
    "path": "../public/_nuxt/CreateTeacher.8c370c89.js"
  },
  "/_nuxt/default.89694c21.js": {
    "type": "application/javascript",
    "etag": "\"16cb-ysAOKz+hcNoLGypPlU5vabo3rro\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 5835,
    "path": "../public/_nuxt/default.89694c21.js"
  },
  "/_nuxt/Delete.5869f6dc.js": {
    "type": "application/javascript",
    "etag": "\"347-9Xyqi3EtjMXhy2XF0IMBIq7Wa+A\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 839,
    "path": "../public/_nuxt/Delete.5869f6dc.js"
  },
  "/_nuxt/entry.1b4632b8.js": {
    "type": "application/javascript",
    "etag": "\"51711-SnQDq3uxRQXDIb422BbbBn6Vc+U\"",
    "mtime": "2023-05-29T15:16:13.685Z",
    "size": 333585,
    "path": "../public/_nuxt/entry.1b4632b8.js"
  },
  "/_nuxt/entry.e33ab215.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4e96-Zcf934fH8RA+fT4Q6cdEfjhasaA\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 20118,
    "path": "../public/_nuxt/entry.e33ab215.css"
  },
  "/_nuxt/error-component.c8c3b4d8.js": {
    "type": "application/javascript",
    "etag": "\"199-iuqIks6rekuWON1vAXYjfgnwDCc\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 409,
    "path": "../public/_nuxt/error-component.c8c3b4d8.js"
  },
  "/_nuxt/eye.9380e5f7.svg": {
    "type": "image/svg+xml",
    "etag": "\"366-3awiu2FF9XAtY1aXRthbPBIqKDg\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 870,
    "path": "../public/_nuxt/eye.9380e5f7.svg"
  },
  "/_nuxt/FilterGroups.vue.499daa25.js": {
    "type": "application/javascript",
    "etag": "\"8c3-u5ltQFqbFBqrnez4gc9dyVK3T0s\"",
    "mtime": "2023-05-29T15:16:13.663Z",
    "size": 2243,
    "path": "../public/_nuxt/FilterGroups.vue.499daa25.js"
  },
  "/_nuxt/getRightPath.3ee11a98.js": {
    "type": "application/javascript",
    "etag": "\"91-V7g/CKSIQ0RnO6h8B6QPU6+gR6s\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 145,
    "path": "../public/_nuxt/getRightPath.3ee11a98.js"
  },
  "/_nuxt/groups.0239ccdf.png": {
    "type": "image/png",
    "etag": "\"5775-mAwlplupbuhqj4QIcLt/rZWMjiI\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 22389,
    "path": "../public/_nuxt/groups.0239ccdf.png"
  },
  "/_nuxt/groups.4abddc11.js": {
    "type": "application/javascript",
    "etag": "\"6ab-TWe7hK3z5/SwLwuSfJuFtDbvFZw\"",
    "mtime": "2023-05-29T15:16:13.675Z",
    "size": 1707,
    "path": "../public/_nuxt/groups.4abddc11.js"
  },
  "/_nuxt/ImageUploader.vue.71b3de40.js": {
    "type": "application/javascript",
    "etag": "\"88f-YCBCMmGVe7376NTwpftq4GeZUCk\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 2191,
    "path": "../public/_nuxt/ImageUploader.vue.71b3de40.js"
  },
  "/_nuxt/inbox.d3c7c522.svg": {
    "type": "image/svg+xml",
    "etag": "\"278-2TVWVjo7Avil16z26fVu/AdzeiM\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 632,
    "path": "../public/_nuxt/inbox.d3c7c522.svg"
  },
  "/_nuxt/index.27692dae.js": {
    "type": "application/javascript",
    "etag": "\"568-5OT6pxlAI9+fApeUEZosgaQvQNc\"",
    "mtime": "2023-05-29T15:16:13.677Z",
    "size": 1384,
    "path": "../public/_nuxt/index.27692dae.js"
  },
  "/_nuxt/index.38a80b5d.js": {
    "type": "application/javascript",
    "etag": "\"589-+0mNVrg7CTimXHh0u1eg8YSQBnc\"",
    "mtime": "2023-05-29T15:16:13.685Z",
    "size": 1417,
    "path": "../public/_nuxt/index.38a80b5d.js"
  },
  "/_nuxt/index.4543905e.js": {
    "type": "application/javascript",
    "etag": "\"531-h4u+m7DqMmbkYVsRXu+1/2PLCUg\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1329,
    "path": "../public/_nuxt/index.4543905e.js"
  },
  "/_nuxt/index.933bc1a0.js": {
    "type": "application/javascript",
    "etag": "\"564-TrUBLMi26lkWDpXFXg/MMPuduP0\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1380,
    "path": "../public/_nuxt/index.933bc1a0.js"
  },
  "/_nuxt/index.9d1f7e1d.js": {
    "type": "application/javascript",
    "etag": "\"10d-deOelhdFbbYvezixrU1GPU9Kf5Y\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 269,
    "path": "../public/_nuxt/index.9d1f7e1d.js"
  },
  "/_nuxt/index.ab007f25.js": {
    "type": "application/javascript",
    "etag": "\"594-IbGTeaiEPsVlN3SGDdBFlf2NZiM\"",
    "mtime": "2023-05-29T15:16:13.677Z",
    "size": 1428,
    "path": "../public/_nuxt/index.ab007f25.js"
  },
  "/_nuxt/index.ae6ca3cd.js": {
    "type": "application/javascript",
    "etag": "\"59d-QGzhkRUf6pJILfmHNMLXdNJ6q5s\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 1437,
    "path": "../public/_nuxt/index.ae6ca3cd.js"
  },
  "/_nuxt/index.b363d6dc.js": {
    "type": "application/javascript",
    "etag": "\"b46-5OkXhr59oFVX74GWw8Pfvp0kiOs\"",
    "mtime": "2023-05-29T15:16:13.645Z",
    "size": 2886,
    "path": "../public/_nuxt/index.b363d6dc.js"
  },
  "/_nuxt/index.b5a6c453.js": {
    "type": "application/javascript",
    "etag": "\"10e5-zmZVxQbMZJoPb+D8mbO24ZEOAaY\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 4325,
    "path": "../public/_nuxt/index.b5a6c453.js"
  },
  "/_nuxt/kebab.5c7a363f.svg": {
    "type": "image/svg+xml",
    "etag": "\"f7-hyT8Gl0E1A/AMkFhsPd0FGjTD/A\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 247,
    "path": "../public/_nuxt/kebab.5c7a363f.svg"
  },
  "/_nuxt/levels.90b7849e.js": {
    "type": "application/javascript",
    "etag": "\"536-aWbX32m3wVulcsZ82tKKBcbCKYo\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1334,
    "path": "../public/_nuxt/levels.90b7849e.js"
  },
  "/_nuxt/login.375971d7.js": {
    "type": "application/javascript",
    "etag": "\"4de-6Ufupf4Kk+eaPvhqg+7WQt7qGaw\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 1246,
    "path": "../public/_nuxt/login.375971d7.js"
  },
  "/_nuxt/modules.77f4f32e.js": {
    "type": "application/javascript",
    "etag": "\"537-y3KcaW1X9xd063YOX6yBoHT8HG4\"",
    "mtime": "2023-05-29T15:16:13.663Z",
    "size": 1335,
    "path": "../public/_nuxt/modules.77f4f32e.js"
  },
  "/_nuxt/nuxt-link.cdc55fd2.js": {
    "type": "application/javascript",
    "etag": "\"10e1-tmPlz9Pbgy7eoeLcon+LWNdqacE\"",
    "mtime": "2023-05-29T15:16:13.685Z",
    "size": 4321,
    "path": "../public/_nuxt/nuxt-link.cdc55fd2.js"
  },
  "/_nuxt/register.792edb39.js": {
    "type": "application/javascript",
    "etag": "\"4dc-Mat8z9b9rOigo6HuEVbELRdM6Zc\"",
    "mtime": "2023-05-29T15:16:13.674Z",
    "size": 1244,
    "path": "../public/_nuxt/register.792edb39.js"
  },
  "/_nuxt/salary.58df766f.png": {
    "type": "image/png",
    "etag": "\"6987-JFenrz+5MihJIhwzomAOzyU0XGw\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 27015,
    "path": "../public/_nuxt/salary.58df766f.png"
  },
  "/_nuxt/student.8edde172.png": {
    "type": "image/png",
    "etag": "\"4dea-ue8KIgOkjdC+bNZaGKX/kOxqtqA\"",
    "mtime": "2023-05-29T15:16:13.660Z",
    "size": 19946,
    "path": "../public/_nuxt/student.8edde172.png"
  },
  "/_nuxt/teacher.679a5f6a.png": {
    "type": "image/png",
    "etag": "\"530e-KqIJ/fCFNEvq4M9QkoyS7KqNaSI\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 21262,
    "path": "../public/_nuxt/teacher.679a5f6a.png"
  },
  "/_nuxt/trash.58097607.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d3-ZI7C0O94QclMFHsgjGHySZt3oh4\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 723,
    "path": "../public/_nuxt/trash.58097607.svg"
  },
  "/_nuxt/UiButton.vue.e4d74fdb.js": {
    "type": "application/javascript",
    "etag": "\"31b-0QCbap06RT9X0YaCoVEsNgvKsKk\"",
    "mtime": "2023-05-29T15:16:13.675Z",
    "size": 795,
    "path": "../public/_nuxt/UiButton.vue.e4d74fdb.js"
  },
  "/_nuxt/UiCard.vue.de9e9fa0.js": {
    "type": "application/javascript",
    "etag": "\"596-KxIv2ik+FM09mtTMelydccLBLVw\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1430,
    "path": "../public/_nuxt/UiCard.vue.de9e9fa0.js"
  },
  "/_nuxt/UiInput.vue.f82dde06.js": {
    "type": "application/javascript",
    "etag": "\"27a-VdzNYwvNP4KrlfiU41GQj57Be0g\"",
    "mtime": "2023-05-29T15:16:13.674Z",
    "size": 634,
    "path": "../public/_nuxt/UiInput.vue.f82dde06.js"
  },
  "/_nuxt/UiSelect.vue.78363163.js": {
    "type": "application/javascript",
    "etag": "\"58c-aQAQPH5KFVwfi4Vaa0iEWLTDR7Q\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 1420,
    "path": "../public/_nuxt/UiSelect.vue.78363163.js"
  },
  "/_nuxt/UiTable.vue.109b2e7c.js": {
    "type": "application/javascript",
    "etag": "\"dc6-RMrKcunTJMV7ZzgRi7kVUrnzXak\"",
    "mtime": "2023-05-29T15:16:13.674Z",
    "size": 3526,
    "path": "../public/_nuxt/UiTable.vue.109b2e7c.js"
  },
  "/_nuxt/useAuth.0a9685b0.js": {
    "type": "application/javascript",
    "etag": "\"1a6-XaOxZQ55sMzsi65LLBPc8pxkRR8\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 422,
    "path": "../public/_nuxt/useAuth.0a9685b0.js"
  },
  "/_nuxt/useGlobalState.05eb19db.js": {
    "type": "application/javascript",
    "etag": "\"18c-Ww8RaQqMUT4vxsTuDA44z3gv2C4\"",
    "mtime": "2023-05-29T15:16:13.662Z",
    "size": 396,
    "path": "../public/_nuxt/useGlobalState.05eb19db.js"
  },
  "/_nuxt/useLanguagesStore.4ee7b7fd.js": {
    "type": "application/javascript",
    "etag": "\"42e-NTiWrn//rczt+0W0QBNUHE552ho\"",
    "mtime": "2023-05-29T15:16:13.683Z",
    "size": 1070,
    "path": "../public/_nuxt/useLanguagesStore.4ee7b7fd.js"
  },
  "/_nuxt/useToast.0d39c995.js": {
    "type": "application/javascript",
    "etag": "\"11e-XhpoSKhtm11wepMXrmCimWQP7HQ\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 286,
    "path": "../public/_nuxt/useToast.0d39c995.js"
  },
  "/_nuxt/_id_.6825dd48.js": {
    "type": "application/javascript",
    "etag": "\"f0-f9ep5uGH8o4+2GUzrQcILBMatjA\"",
    "mtime": "2023-05-29T15:16:13.676Z",
    "size": 240,
    "path": "../public/_nuxt/_id_.6825dd48.js"
  },
  "/_nuxt/_id_.8cbe0deb.js": {
    "type": "application/javascript",
    "etag": "\"1fb-Ly8hOgstCMmod9SLNhzwHOTBJjw\"",
    "mtime": "2023-05-29T15:16:13.677Z",
    "size": 507,
    "path": "../public/_nuxt/_id_.8cbe0deb.js"
  },
  "/_nuxt/_id_.99057ac5.js": {
    "type": "application/javascript",
    "etag": "\"f0-f9ep5uGH8o4+2GUzrQcILBMatjA\"",
    "mtime": "2023-05-29T15:16:13.683Z",
    "size": 240,
    "path": "../public/_nuxt/_id_.99057ac5.js"
  },
  "/_nuxt/_id_.f2973b75.js": {
    "type": "application/javascript",
    "etag": "\"701-WfZKsKHgfFVC0VQQ1JMu70jDvxM\"",
    "mtime": "2023-05-29T15:16:13.684Z",
    "size": 1793,
    "path": "../public/_nuxt/_id_.f2973b75.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const config = useRuntimeConfig().public;
const _wYHOLD = defineEventHandler(async (event) => {
  assertMethod(event, "POST");
  const body = await readBody(event);
  const cookieOptions = config.supabase.cookies;
  const { event: signEvent, session } = body;
  if (!event) {
    throw new Error("Auth event missing!");
  }
  if (signEvent === "SIGNED_IN" || signEvent === "TOKEN_REFRESHED") {
    if (!session) {
      throw new Error("Auth session missing!");
    }
    setCookie(
      event,
      `${cookieOptions.name}-access-token`,
      session.access_token,
      {
        domain: cookieOptions.domain,
        maxAge: cookieOptions.lifetime ?? 0,
        path: cookieOptions.path,
        sameSite: cookieOptions.sameSite
      }
    );
    setCookie(event, `${cookieOptions.name}-refresh-token`, session.refresh_token, {
      domain: cookieOptions.domain,
      maxAge: cookieOptions.lifetime ?? 0,
      path: cookieOptions.path,
      sameSite: cookieOptions.sameSite
    });
  }
  if (signEvent === "SIGNED_OUT") {
    setCookie(event, `${cookieOptions.name}-access-token`, "", {
      maxAge: -1,
      path: cookieOptions.path
    });
    setCookie(event, `${cookieOptions.name}-refresh-token`, "", {
      maxAge: -1,
      path: cookieOptions.path
    });
  }
  return "auth cookie set";
});

const _lazy_l72v43 = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_l72v43, lazy: true, middleware: false, method: undefined },
  { route: '/api/_supabase/session', handler: _wYHOLD, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_l72v43, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
