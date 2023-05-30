globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, assertMethod, readBody, setCookie, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _runtimeConfig = {"app":{"baseURL":"./","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=31536000, immutable"}}}},"public":{"supabase":{"url":"https://ulghhgjrbswyeeojlhwc.supabase.co","key":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZ2hoZ2pyYnN3eWVlb2psaHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM3MjAzNjQsImV4cCI6MTk5OTI5NjM2NH0.RXK2GaxWFG3nnPxO5vOl1FBzJZMCRTzHArgIkWYkgYY","client":{},"redirect":false,"cookies":{"name":"sb","lifetime":28800,"domain":"","path":"/","sameSite":"lax"}}},"supabase":{"serviceKey":""}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
overrideConfig(_runtimeConfig);
const runtimeConfig = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => runtimeConfig;
deepFreeze(appConfig);
function getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

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
    const { template } = await import('./error-500.mjs');
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
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-n8egyE9tcb7sKGr/pYCaQ4uWqxI\"",
    "mtime": "2023-04-21T03:02:53.000Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/fr-flag.gif": {
    "type": "image/gif",
    "etag": "\"1414-/U67uQkb2zUlsSN+Diby7D6yFnA\"",
    "mtime": "2023-04-21T03:02:53.000Z",
    "size": 5140,
    "path": "../public/fr-flag.gif"
  },
  "/gm-flag.gif": {
    "type": "image/gif",
    "etag": "\"1516-Rrhnl3eUZvU70JlfGPYCtOQPGl0\"",
    "mtime": "2023-04-21T03:02:53.000Z",
    "size": 5398,
    "path": "../public/gm-flag.gif"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"59d-0PEwM/ExaZ191tVV8N1ZZGCxi0Q\"",
    "mtime": "2023-05-30T23:54:56.682Z",
    "size": 1437,
    "path": "../public/index.html"
  },
  "/it-flag.gif": {
    "type": "image/gif",
    "etag": "\"16d4-pC8vp8lQa4B54nY3TFxL/RCMUno\"",
    "mtime": "2023-04-21T03:02:53.000Z",
    "size": 5844,
    "path": "../public/it-flag.gif"
  },
  "/us-flag.gif": {
    "type": "image/gif",
    "etag": "\"695c-Aure0CfctxyFwgsKe2dTbVaAtcw\"",
    "mtime": "2023-04-21T03:02:53.000Z",
    "size": 26972,
    "path": "../public/us-flag.gif"
  },
  "/_nuxt/affiliation.59883a5f.png": {
    "type": "image/png",
    "etag": "\"379b-I/2TH4e7V5w/1g/K+0AI2owghZ8\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 14235,
    "path": "../public/_nuxt/affiliation.59883a5f.png"
  },
  "/_nuxt/ages.ada6a369.js": {
    "type": "application/javascript",
    "etag": "\"52e-0nrnOg2WSdjHoFF0+nmAgrTPAvQ\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1326,
    "path": "../public/_nuxt/ages.ada6a369.js"
  },
  "/_nuxt/arrow-up.26e35ba2.svg": {
    "type": "image/svg+xml",
    "etag": "\"10a-PvGnkzugI0TKvT1h8eDTpAdt39U\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 266,
    "path": "../public/_nuxt/arrow-up.26e35ba2.svg"
  },
  "/_nuxt/assistant.d55bacad.png": {
    "type": "image/png",
    "etag": "\"8556-M6p5al/cExqg+1jAkWxDxuT8TQ8\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 34134,
    "path": "../public/_nuxt/assistant.d55bacad.png"
  },
  "/_nuxt/CreateAffiliation.683861db.js": {
    "type": "application/javascript",
    "etag": "\"fb9-XtV59NnrnRzvuwsin423kW8QyFE\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 4025,
    "path": "../public/_nuxt/CreateAffiliation.683861db.js"
  },
  "/_nuxt/CreateAssistant.9899e8b8.js": {
    "type": "application/javascript",
    "etag": "\"786-nulr0xNpwcNKUUTZjkiFYUgfhNk\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 1926,
    "path": "../public/_nuxt/CreateAssistant.9899e8b8.js"
  },
  "/_nuxt/CreateGroup.016c34bd.js": {
    "type": "application/javascript",
    "etag": "\"c25-vFlQlEKM3REknikSzB5/h2IusdU\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 3109,
    "path": "../public/_nuxt/CreateGroup.016c34bd.js"
  },
  "/_nuxt/CreateSalary.76c4552b.js": {
    "type": "application/javascript",
    "etag": "\"13a8-ljfGJdQX/5t6okot7qW6MHX6CgQ\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 5032,
    "path": "../public/_nuxt/CreateSalary.76c4552b.js"
  },
  "/_nuxt/CreateStudent.fa1fbf6c.js": {
    "type": "application/javascript",
    "etag": "\"83e-muWhbmf+vvJJy8jg6E+XXaaLohY\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 2110,
    "path": "../public/_nuxt/CreateStudent.fa1fbf6c.js"
  },
  "/_nuxt/CreateTeacher.13d44ec3.js": {
    "type": "application/javascript",
    "etag": "\"770-dr+3wO9+YvM6js60RUl2eGqv5fI\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1904,
    "path": "../public/_nuxt/CreateTeacher.13d44ec3.js"
  },
  "/_nuxt/default.18280754.js": {
    "type": "application/javascript",
    "etag": "\"16cd-jAze9S/0f2cElWWcTHnoIihULbA\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 5837,
    "path": "../public/_nuxt/default.18280754.js"
  },
  "/_nuxt/Delete.83528ac4.js": {
    "type": "application/javascript",
    "etag": "\"347-dFo36wSUzv9TZtfhb0nsxUCrb34\"",
    "mtime": "2023-05-30T23:54:54.801Z",
    "size": 839,
    "path": "../public/_nuxt/Delete.83528ac4.js"
  },
  "/_nuxt/entry.8092a1e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5000-qxHbB7vhHi1oto/OG/e9tYbOnTA\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 20480,
    "path": "../public/_nuxt/entry.8092a1e3.css"
  },
  "/_nuxt/entry.b7c96027.js": {
    "type": "application/javascript",
    "etag": "\"5061d-o6g5XdhWnq92iERsZBVVUqNUXQs\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 329245,
    "path": "../public/_nuxt/entry.b7c96027.js"
  },
  "/_nuxt/error-component.cb7a64d0.js": {
    "type": "application/javascript",
    "etag": "\"199-6IJ29w+R6kijdBfnmjXGKoFx/Mg\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 409,
    "path": "../public/_nuxt/error-component.cb7a64d0.js"
  },
  "/_nuxt/eye.9380e5f7.svg": {
    "type": "image/svg+xml",
    "etag": "\"366-3awiu2FF9XAtY1aXRthbPBIqKDg\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 870,
    "path": "../public/_nuxt/eye.9380e5f7.svg"
  },
  "/_nuxt/FilterGroups.vue.d2e46dec.js": {
    "type": "application/javascript",
    "etag": "\"8c3-IcLO5cdxH4ruN4FnCJA453B0oR0\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 2243,
    "path": "../public/_nuxt/FilterGroups.vue.d2e46dec.js"
  },
  "/_nuxt/getRightPath.afc8b8c9.js": {
    "type": "application/javascript",
    "etag": "\"91-x8s8r9IKXDdPeTD9KVUcvWy35jg\"",
    "mtime": "2023-05-30T23:54:54.795Z",
    "size": 145,
    "path": "../public/_nuxt/getRightPath.afc8b8c9.js"
  },
  "/_nuxt/groups.0239ccdf.png": {
    "type": "image/png",
    "etag": "\"5775-mAwlplupbuhqj4QIcLt/rZWMjiI\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 22389,
    "path": "../public/_nuxt/groups.0239ccdf.png"
  },
  "/_nuxt/groups.3cf52295.js": {
    "type": "application/javascript",
    "etag": "\"6ab-Z9BNc0rBK4pDEbFnJhGUxUuNtXI\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 1707,
    "path": "../public/_nuxt/groups.3cf52295.js"
  },
  "/_nuxt/ImageUploader.vue.6272832d.js": {
    "type": "application/javascript",
    "etag": "\"88f-ZnI+vvJcCSzxUbmKVtN7JsRQapk\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 2191,
    "path": "../public/_nuxt/ImageUploader.vue.6272832d.js"
  },
  "/_nuxt/inbox.d3c7c522.svg": {
    "type": "image/svg+xml",
    "etag": "\"278-2TVWVjo7Avil16z26fVu/AdzeiM\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 632,
    "path": "../public/_nuxt/inbox.d3c7c522.svg"
  },
  "/_nuxt/index.0622e99b.js": {
    "type": "application/javascript",
    "etag": "\"568-XbaLvH7ubNAD+BN2QG/MlE+CkbQ\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1384,
    "path": "../public/_nuxt/index.0622e99b.js"
  },
  "/_nuxt/index.3d0faa4b.js": {
    "type": "application/javascript",
    "etag": "\"589-wG74NaDVakTEYp4HdjMlr9pvAS4\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 1417,
    "path": "../public/_nuxt/index.3d0faa4b.js"
  },
  "/_nuxt/index.53121e99.js": {
    "type": "application/javascript",
    "etag": "\"10d-GQCzhREMMdNleZvg5z4wGvhgyUo\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 269,
    "path": "../public/_nuxt/index.53121e99.js"
  },
  "/_nuxt/index.5974c64a.js": {
    "type": "application/javascript",
    "etag": "\"564-0vAw6KsZJwS9EWfUgICBecvyW8A\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 1380,
    "path": "../public/_nuxt/index.5974c64a.js"
  },
  "/_nuxt/index.6a6654cd.js": {
    "type": "application/javascript",
    "etag": "\"b4b-VXB7oyWTnjT+nxR9zGzAomwznUU\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 2891,
    "path": "../public/_nuxt/index.6a6654cd.js"
  },
  "/_nuxt/index.8219e7d7.js": {
    "type": "application/javascript",
    "etag": "\"594-RBsgXPfieh7ClXz/SfzhX8wnYZw\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1428,
    "path": "../public/_nuxt/index.8219e7d7.js"
  },
  "/_nuxt/index.a0e6578e.js": {
    "type": "application/javascript",
    "etag": "\"531-f2znBQ5QU6RlYmwzRlEsWLmfQL4\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 1329,
    "path": "../public/_nuxt/index.a0e6578e.js"
  },
  "/_nuxt/index.a37ac19a.js": {
    "type": "application/javascript",
    "etag": "\"59d-0bo5lc00Bm7CkioUlbLCKLUkqpk\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1437,
    "path": "../public/_nuxt/index.a37ac19a.js"
  },
  "/_nuxt/index.ad5bce7b.js": {
    "type": "application/javascript",
    "etag": "\"10e1-RP6aB+Y/t+BMEKdz7qEKJfVM0Os\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 4321,
    "path": "../public/_nuxt/index.ad5bce7b.js"
  },
  "/_nuxt/kebab.5c7a363f.svg": {
    "type": "image/svg+xml",
    "etag": "\"f7-hyT8Gl0E1A/AMkFhsPd0FGjTD/A\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 247,
    "path": "../public/_nuxt/kebab.5c7a363f.svg"
  },
  "/_nuxt/levels.2fd54a17.js": {
    "type": "application/javascript",
    "etag": "\"536-+eFsOMFFxTG1JZ7rndF6ddWh7s4\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 1334,
    "path": "../public/_nuxt/levels.2fd54a17.js"
  },
  "/_nuxt/login.ce226664.js": {
    "type": "application/javascript",
    "etag": "\"4de-lBjPWyIHPHoJpLQFANwhiaHx+Qc\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 1246,
    "path": "../public/_nuxt/login.ce226664.js"
  },
  "/_nuxt/modules.7737b953.js": {
    "type": "application/javascript",
    "etag": "\"537-a4tpt51LVjoCdGg+mgR54KMwoR8\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1335,
    "path": "../public/_nuxt/modules.7737b953.js"
  },
  "/_nuxt/nuxt-link.7ddfebed.js": {
    "type": "application/javascript",
    "etag": "\"10e1-LOPO4gMJjDb9IdLr4U4v0YYA5Vs\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 4321,
    "path": "../public/_nuxt/nuxt-link.7ddfebed.js"
  },
  "/_nuxt/register.3bb6fb7c.js": {
    "type": "application/javascript",
    "etag": "\"4dc-YJhj3GsX7XNJoZ/t2LngWKRdiPE\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 1244,
    "path": "../public/_nuxt/register.3bb6fb7c.js"
  },
  "/_nuxt/salary.58df766f.png": {
    "type": "image/png",
    "etag": "\"6987-JFenrz+5MihJIhwzomAOzyU0XGw\"",
    "mtime": "2023-05-30T23:54:54.793Z",
    "size": 27015,
    "path": "../public/_nuxt/salary.58df766f.png"
  },
  "/_nuxt/student.8edde172.png": {
    "type": "image/png",
    "etag": "\"4dea-ue8KIgOkjdC+bNZaGKX/kOxqtqA\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 19946,
    "path": "../public/_nuxt/student.8edde172.png"
  },
  "/_nuxt/teacher.679a5f6a.png": {
    "type": "image/png",
    "etag": "\"530e-KqIJ/fCFNEvq4M9QkoyS7KqNaSI\"",
    "mtime": "2023-05-30T23:54:54.790Z",
    "size": 21262,
    "path": "../public/_nuxt/teacher.679a5f6a.png"
  },
  "/_nuxt/trash.58097607.svg": {
    "type": "image/svg+xml",
    "etag": "\"2d3-ZI7C0O94QclMFHsgjGHySZt3oh4\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 723,
    "path": "../public/_nuxt/trash.58097607.svg"
  },
  "/_nuxt/UiButton.vue.38b710ee.js": {
    "type": "application/javascript",
    "etag": "\"31d-9gV53EyvEwQd5WkBN6NxA737B0I\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 797,
    "path": "../public/_nuxt/UiButton.vue.38b710ee.js"
  },
  "/_nuxt/UiCard.vue.ccb148d1.js": {
    "type": "application/javascript",
    "etag": "\"5a2-GcEI+hVFybF5k0RiVoSjulmDkmk\"",
    "mtime": "2023-05-30T23:54:54.799Z",
    "size": 1442,
    "path": "../public/_nuxt/UiCard.vue.ccb148d1.js"
  },
  "/_nuxt/UiInput.vue.3287b1e6.js": {
    "type": "application/javascript",
    "etag": "\"27b-OOSaEclf+n8lS04jIwxul7uSOnY\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 635,
    "path": "../public/_nuxt/UiInput.vue.3287b1e6.js"
  },
  "/_nuxt/UiSelect.vue.4e470735.js": {
    "type": "application/javascript",
    "etag": "\"590-ieA2Vq2gTXJFUT9akE5zMNhJcoo\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1424,
    "path": "../public/_nuxt/UiSelect.vue.4e470735.js"
  },
  "/_nuxt/UiTable.vue.34810681.js": {
    "type": "application/javascript",
    "etag": "\"dd7-g/8exbP4iEhjmk3WmklvMW9yNyc\"",
    "mtime": "2023-05-30T23:54:54.799Z",
    "size": 3543,
    "path": "../public/_nuxt/UiTable.vue.34810681.js"
  },
  "/_nuxt/useAuth.028e7283.js": {
    "type": "application/javascript",
    "etag": "\"1a6-3ngtEG9IDpif4zb3vk8MOfCCuaw\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 422,
    "path": "../public/_nuxt/useAuth.028e7283.js"
  },
  "/_nuxt/useGlobalState.6c89f999.js": {
    "type": "application/javascript",
    "etag": "\"18c-y8jY5rM71DndqqagVA2JPfKTFhA\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 396,
    "path": "../public/_nuxt/useGlobalState.6c89f999.js"
  },
  "/_nuxt/useLanguagesStore.8319741b.js": {
    "type": "application/javascript",
    "etag": "\"42e-oazZnDKRa2eTZ43lW9CQfUGh+qU\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 1070,
    "path": "../public/_nuxt/useLanguagesStore.8319741b.js"
  },
  "/_nuxt/useToast.f617896e.js": {
    "type": "application/javascript",
    "etag": "\"11e-et5yaijFZB1yRcr+crs/Ejd51d4\"",
    "mtime": "2023-05-30T23:54:54.799Z",
    "size": 286,
    "path": "../public/_nuxt/useToast.f617896e.js"
  },
  "/_nuxt/_id_.199582ff.js": {
    "type": "application/javascript",
    "etag": "\"1fb-FrUTcZ5R7FfLG6ngcDNKZ+thCXU\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 507,
    "path": "../public/_nuxt/_id_.199582ff.js"
  },
  "/_nuxt/_id_.877662e7.js": {
    "type": "application/javascript",
    "etag": "\"f0-S/uHUwR7MMSWBiWGpqj6j7G5ucM\"",
    "mtime": "2023-05-30T23:54:54.794Z",
    "size": 240,
    "path": "../public/_nuxt/_id_.877662e7.js"
  },
  "/_nuxt/_id_.87d6e294.js": {
    "type": "application/javascript",
    "etag": "\"f0-S/uHUwR7MMSWBiWGpqj6j7G5ucM\"",
    "mtime": "2023-05-30T23:54:54.798Z",
    "size": 240,
    "path": "../public/_nuxt/_id_.87d6e294.js"
  },
  "/_nuxt/_id_.c3ecaf99.js": {
    "type": "application/javascript",
    "etag": "\"701-0hQolMWheTGJxGg0ZSGqXyT1W0I\"",
    "mtime": "2023-05-30T23:54:54.804Z",
    "size": 1793,
    "path": "../public/_nuxt/_id_.c3ecaf99.js"
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
const _txdpmN = defineEventHandler(async (event) => {
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

const _lazy_pqegNT = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_pqegNT, lazy: true, middleware: false, method: undefined },
  { route: '/api/_supabase/session', handler: _txdpmN, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_pqegNT, lazy: true, middleware: false, method: undefined }
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
