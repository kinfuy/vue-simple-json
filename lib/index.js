import { defineComponent, ref, watch, nextTick, openBlock, createElementBlock, createElementVNode, normalizeClass, withKeys, Fragment, createTextVNode, toDisplayString, createCommentVNode, computed, inject, resolveComponent, normalizeStyle, createVNode, createBlock, renderSlot, withDirectives, renderList, vModelSelect, withCtx, provide, toRef } from 'vue';
import clonedeep from 'lodash.clonedeep';

var runtime = {exports: {}};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

(function (module) {
var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
}(runtime));

var regenerator = runtime.exports;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var typeOf = function typeOf(obj) {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
};
var _UUID = function _UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
};
var deepAnalysisJson = function deepAnalysisJson(json) {
  var jsonResult = [];

  for (var key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeOf(json[key]) === 'object') {
        var item = deepAnalysisJson(json[key]);
        var jsonItem = {
          id: _UUID(),
          key: key,
          value: item,
          type: typeOf(json[key])
        };
        jsonResult.push(jsonItem);
      } else if (typeOf(json[key]) === 'array') {
        (function () {
          var arr = [];
          json[key].forEach(function (x, index) {
            if (typeOf(x) === 'object') {
              var _item = deepAnalysisJson(x);

              var _jsonItem = {
                id: _UUID(),
                key: index,
                value: _item,
                type: typeOf(x)
              };
              arr.push(_jsonItem);
            } else if (typeOf(x) === 'array') {
              x.forEach(function (val) {
                var item = deepAnalysisJson(val);
                var jsonItem = {
                  id: _UUID(),
                  key: index,
                  value: item,
                  type: typeOf(val)
                };
                arr.push(jsonItem);
              });
            } else {
              var _jsonItem2 = {
                id: _UUID(),
                key: index,
                value: x,
                type: typeOf(x)
              };
              arr.push(_jsonItem2);
            }
          });
          var jsonItem = {
            id: _UUID(),
            key: key,
            value: arr,
            type: typeOf(json[key])
          };
          jsonResult.push(jsonItem);
        })();
      } else {
        var _jsonItem3 = {
          id: _UUID(),
          key: key,
          value: json[key],
          type: typeOf(json[key])
        };
        jsonResult.push(_jsonItem3);
      }
    }
  }

  return jsonResult;
};
var deepReductionJson = function deepReductionJson(json) {
  var jsonResult = {};
  json.forEach(function (x) {
    if (x.type === 'array') {
      var item = [];
      x.value.forEach(function (val) {
        if (val.type === 'object') {
          item.push(deepReductionJson(val.value));
        } else if (val.type === 'array') {
          item.push(deepReductionJson(val.value));
        } else {
          item.push(val.value);
        }
      });
      jsonResult[x.key] = item;
    } else if (x.type === 'object') {
      var _item2 = {};
      x.value.forEach(function (val) {
        if (val.type === 'object') {
          _item2[val.key] = deepReductionJson(val.value);
        } else if (val.type === 'array') {
          var arr = [];
          val.value.forEach(function (value, index) {
            if (value.type === 'object' || value.type === 'array') {
              arr[index] = deepReductionJson(value.value);
            } else {
              arr[index] = value.value;
            }
          });
          _item2[val.key] = arr;
        } else {
          _item2[val.key] = val.value;
        }
      });
      jsonResult[x.key] = _item2;
    } else {
      jsonResult[x.key] = x.value;
    }
  });
  return jsonResult;
};
var deepDeleteJson = function deepDeleteJson(json, tempId) {
  if (json.type === 'array' || json.type === 'object') {
    for (var i = 0; i < json.value.length; i++) {
      deepDeleteJson(json.value[i], tempId);

      if (json.value[i].id === tempId) {
        json.value.splice(i, 1);
        updataArrIndex(json);
        i--;
      }
    }
  }
};
var updataArrIndex = function updataArrIndex(json) {
  if (json.type === 'array') {
    json.value.forEach(function (x, index) {
      x.key = index;
    });
  }
};
var deepUpdataJson = function deepUpdataJson(json, tempId, key, value) {
  if (json.id === tempId) {
    json.key = key;
    json.value = value;
    return;
  }

  if (json.type === 'array' || json.type === 'object') {
    for (var i = 0; i < json.value.length; i++) {
      deepUpdataJson(json.value[i], tempId, key, value);
    }
  }
};
var mergeArray = function mergeArray(target, scoure) {
  var rst = target.map(function (x) {
    var _a, _b, _c;

    var configType = typeof x === 'string';
    return {
      type: configType ? x : x.type,
      desc: configType ? findAllowType(x, scoure) : x.desc || ((_a = findAllowType(x.type, scoure)) === null || _a === void 0 ? void 0 : _a.desc),
      "default": configType ? findAllowType(x, scoure) : x["default"] || ((_b = findAllowType(x.type, scoure)) === null || _b === void 0 ? void 0 : _b["default"]),
      slot: configType ? findAllowType(x, scoure) : x.slot || ((_c = findAllowType(x.type, scoure)) === null || _c === void 0 ? void 0 : _c.slot)
    };
  });
  return rst;
};

function findAllowType(type, scoure) {
  for (var i = 0; i < scoure.length; i++) {
    if (scoure[i].type === type) {
      return scoure[i];
    }
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var script$4 = defineComponent({
  name: 'ValueEditor',
  props: {
    type: {
      type: String,
      "default": 'string'
    },
    value: {
      type: [String, Number, Boolean],
      "default": ''
    },
    disabled: {
      type: Boolean,
      "default": true
    }
  },
  emits: ['update:value', 'change', 'focus', 'blur'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var valueEditorRef = ref(null);
    var stateValue = ref('');
    var isRefresh = ref(false);
    var isEdit = ref(false);
    watch(function () {
      return props.value;
    }, function (val) {
      stateValue.value = val;
    }, {
      immediate: true
    });

    var handleClick = function handleClick() {
      if (!props.disabled) {
        isEdit.value = true;
        nextTick(function () {
          if (valueEditorRef.value) {
            valueEditorRef.value.focus();
            emit('focus');
          }
        });
        stateValue.value = props.value;
      } else {
        isEdit.value = false;
      }
    };

    var edited = ref(false);

    var handleBlur = function handleBlur() {
      isEdit.value = false;

      if (valueEditorRef.value && edited.value) {
        var value = valueEditorRef.value.innerText.replace(/^"|"$/g, '');

        if (props.type === 'number') {
          value = Number(value) === Number(value) ? Number(value) : 0;
        }

        if (props.type === 'boolean') value = !!value;
        emit('update:value', value);
        emit('change', value);
        isRefresh.value = true;
        setTimeout(function () {
          isRefresh.value = false;
        }, 0);
      }

      emit('blur');
    };

    var handleInput = function handleInput() {
      edited.value = true;
    };

    var handleEnter = function handleEnter(e) {
      e.preventDefault();
    };

    return {
      isEdit: isEdit,
      stateValue: stateValue,
      handleClick: handleClick,
      handleBlur: handleBlur,
      handleEnter: handleEnter,
      valueEditorRef: valueEditorRef,
      handleInput: handleInput,
      isRefresh: isRefresh
    };
  }
});

function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return !_ctx.isRefresh ? (openBlock(), createElementBlock("div", {
    key: 0,
    "class": "value-editor",
    spellcheck: "false",
    onClick: _cache[3] || (_cache[3] = function () {
      return _ctx.handleClick && _ctx.handleClick.apply(_ctx, arguments);
    })
  }, [createElementVNode("span", {
    ref: "valueEditorRef",
    "class": normalizeClass(['value-editor-text', {
      'value-editor-input': _ctx.isEdit
    }]),
    onBlur: _cache[0] || (_cache[0] = function () {
      return _ctx.handleBlur && _ctx.handleBlur.apply(_ctx, arguments);
    }),
    onInput: _cache[1] || (_cache[1] = function () {
      return _ctx.handleInput && _ctx.handleInput.apply(_ctx, arguments);
    }),
    onKeydown: _cache[2] || (_cache[2] = withKeys(function () {
      return _ctx.handleEnter && _ctx.handleEnter.apply(_ctx, arguments);
    }, ["enter"]))
  }, [_ctx.type === 'number' || _ctx.type === 'boolean' ? (openBlock(), createElementBlock(Fragment, {
    key: 0
  }, [createTextVNode(toDisplayString(_ctx.stateValue), 1
  /* TEXT */
  )], 2112
  /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
  )) : _ctx.type === 'string' ? (openBlock(), createElementBlock(Fragment, {
    key: 1
  }, [createTextVNode(toDisplayString("\"".concat(_ctx.stateValue, "\"")), 1
  /* TEXT */
  )], 2112
  /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
  )) : createCommentVNode("v-if", true)], 34
  /* CLASS, HYDRATE_EVENTS */
  )])) : createCommentVNode("v-if", true);
}

script$4.render = render$4;
script$4.__file = "src/package/components/ValueEditor.vue";

var script$3 = defineComponent({
  name: 'IconSvg',
  props: {
    name: {
      type: String,
      required: true
    },
    fixClass: {
      type: String,
      "default": undefined
    }
  },
  setup: function setup(props) {
    var iconName = computed(function () {
      return "#".concat(props.name);
    });
    return {
      iconName: iconName
    };
  }
});

var _hoisted_1$1 = ["xlink:href"];
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    "class": normalizeClass(['svg-icon', _ctx.fixClass]),
    "aria-hidden": "true"
  }, [createElementVNode("use", {
    "xlink:href": _ctx.iconName
  }, null, 8
  /* PROPS */
  , _hoisted_1$1)], 2
  /* CLASS */
  );
}

script$3.render = render$3;
script$3.__file = "src/package/components/Icon/IconSvg.vue";

var defaultConfig = {
  keyColor: {
    string: '#71aff1',
    object: '#71aff1',
    array: '#71aff1',
    number: '#71aff1',
    "function": '#71aff1',
    "boolean": '#71aff1',
    "null": '#71aff1',
    undefined: '#71aff1',
    date: '#71aff1',
    regExp: '#71aff1'
  },
  allowType: [{
    type: 'boolean',
    desc: '布尔值',
    "default": false,
    slot: false
  }, {
    type: 'number',
    desc: '数字',
    "default": 0,
    slot: false
  }, {
    type: 'string',
    desc: '字符串',
    "default": '',
    slot: false
  }, {
    type: 'array',
    desc: '数组',
    "default": function _default() {
      return [];
    },
    slot: false
  }, {
    type: 'date',
    desc: '时间',
    "default": new Date(),
    slot: false
  }, {
    type: 'object',
    desc: '对象',
    "default": function _default() {
      return [];
    },
    slot: false
  }, {
    type: 'null',
    desc: 'null',
    "default": 'null',
    slot: false
  }, {
    type: 'undefined',
    desc: 'undefined',
    "default": 'undefined',
    slot: false
  }, {
    type: 'function',
    desc: 'function',
    "default": function _default() {},
    slot: false
  }],
  showHover: true,
  addType: true
};

var Render = function Render(props) {
  return props.render();
};

Render.props = {
  render: {
    type: Function
  }
};

var script$2 = defineComponent({
  name: 'JsonNode',
  components: {
    ValueEditor: script$4,
    IconSvg: script$3,
    Render: Render
  },
  props: {
    json: {
      type: Object,
      required: true
    },
    currectLevel: {
      type: Number,
      "default": 0
    }
  },
  setup: function setup(props) {
    var stateData = ref();

    var _inject = inject('JsonEditorContext'),
        extendLevel = _inject.extendLevel,
        extendAll = _inject.extendAll,
        extendCatchKey = _inject.extendCatchKey,
        disabled = _inject.disabled,
        jsonConfig = _inject.jsonConfig;

    watch(function () {
      return props.json;
    }, function (val) {
      stateData.value = val;
    }, {
      immediate: true
    });
    var allowType = computed(function () {
      if (jsonConfig.value && jsonConfig.value.allowType) return mergeArray(jsonConfig.value.allowType, defaultConfig.allowType);
      return defaultConfig.allowType;
    });
    var customAppendOperate = computed(function () {
      var rst = [];

      if (jsonConfig.value && jsonConfig.value.appendOperate) {
        rst = jsonConfig.value.appendOperate;
      }

      return rst;
    });
    var isSub = computed(function () {
      return stateData.value && (stateData.value.type === 'array' || stateData.value.type === 'object');
    });
    var isExtend = ref(false);
    var eventTrigger = inject('eventTrigger');
    watch(function () {
      return extendLevel.value;
    }, function (val) {
      var _a;

      var extend = extendCatchKey.value.some(function (x) {
        var _a;

        return x.id === ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id);
      });

      if (val >= props.currectLevel || extendAll.value || extend) {
        isExtend.value = true;
        eventTrigger('extend', {
          isExtend: isExtend.value,
          id: (_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id
        });
      }
    }, {
      immediate: true
    });

    var handleExtend = function handleExtend() {
      var _a;

      isExtend.value = !isExtend.value;
      eventTrigger('extend', {
        isExtend: isExtend.value,
        id: (_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id
      });
    };

    var handleSwitch = function handleSwitch(item) {
      var _a, _b;

      if (item.type === 'array' || item.type === 'object') {
        item.value = [];
      } else {
        allowType.value.forEach(function (x) {
          if (x.type === item.type) {
            item.value = x["default"];
          }
        });
      }

      eventTrigger('type-switch', {
        level: props.currectLevel,
        key: (_a = stateData.value) === null || _a === void 0 ? void 0 : _a.key,
        value: (_b = stateData.value) === null || _b === void 0 ? void 0 : _b.value
      });
    };

    var hoverNodeId = ref('');

    var handleMouseEnter = function handleMouseEnter() {
      var _a;

      hoverNodeId.value = ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id) || '';
    };

    var handleMouseLeave = function handleMouseLeave() {
      hoverNodeId.value = '';
    };

    var isHover = computed(function () {
      var _a;

      return hoverNodeId.value === ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id);
    });

    var handleValueChange = function handleValueChange(value, item) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';
      item[type] = value;
      if (eventTrigger) eventTrigger('change', clonedeep(stateData.value));
    };

    var handleSlotValueChange = function handleSlotValueChange(value) {
      if (stateData.value) stateData.value.value = value;
      if (eventTrigger) eventTrigger('change', clonedeep(stateData.value));
    };

    var currectEditId = ref();

    var handleValueFocus = function handleValueFocus() {
      var _a;

      currectEditId.value = (_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id;
    };

    var isEdit = computed(function () {
      var _a;

      return currectEditId.value === ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id);
    });

    var handleValueBlur = function handleValueBlur() {
      currectEditId.value = undefined;
    };

    var handleAddAttr = function handleAddAttr() {
      var _a, _b;

      var key = ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.type) === 'array' ? stateData.value.value.length : 'defalut';
      var neWAttr = {
        id: _UUID(),
        key: key,
        value: 'new attr',
        type: 'string'
      };
      var addType = jsonConfig.value.addType !== undefined ? jsonConfig.value.addType : defaultConfig.addType;

      if (addType && stateData.value) {
        stateData.value.value.unshift(neWAttr);
        updataArrIndex(stateData.value);
      } else {
        (_b = stateData.value) === null || _b === void 0 ? void 0 : _b.value.push(neWAttr);
      }

      if (eventTrigger) eventTrigger('change', clonedeep(stateData.value));
    };

    var handleAttrDelete = function handleAttrDelete() {
      var _a;

      if (eventTrigger) eventTrigger('delete', clonedeep(stateData.value));
      eventTrigger('extend', {
        isExtend: false,
        id: (_a = stateData.value) === null || _a === void 0 ? void 0 : _a.id
      });
    };

    var keyColor = computed(function () {
      var rst = '';

      if (stateData.value) {
        rst = defaultConfig.keyColor[stateData.value.type];
      }

      if (jsonConfig.value && jsonConfig.value.keyColor && stateData.value) {
        if (jsonConfig.value.keyColor[stateData.value.type]) {
          rst = jsonConfig.value.keyColor[stateData.value.type];
        }
      }

      return rst;
    });

    var handleCustom = function handleCustom(operate) {
      if (stateData.value) {
        var currect = {
          key: stateData.value.key,
          value: isSub.value ? deepReductionJson(stateData.value.value) : clonedeep(stateData.value.value)
        };
        operate.clickEvent(currect).then(function (customValue) {
          if (customValue && stateData.value) {
            stateData.value.type = customValue.type;

            if (customValue.type === 'array' || customValue.type === 'object') {
              stateData.value.value = deepAnalysisJson(_defineProperty({}, stateData.value.key, customValue))[0].value;
            } else {
              stateData.value.value = customValue.value;
            }
          }
        });
      }
    };

    var valueSlot = computed(function () {
      var isSlot = false;
      allowType.value.forEach(function (x) {
        var _a;

        if (x.type === ((_a = stateData.value) === null || _a === void 0 ? void 0 : _a.type)) {
          isSlot = x.slot;
        }
      });
      if (stateData.value) return isSlot && !stateData.value.root;
      return isSlot;
    });
    return {
      stateData: stateData,
      isSub: isSub,
      isEdit: isEdit,
      isExtend: isExtend,
      extendLevel: extendLevel,
      extendAll: extendAll,
      keyColor: keyColor,
      extendCatchKey: extendCatchKey,
      disabled: disabled,
      handleExtend: handleExtend,
      handleSwitch: handleSwitch,
      isHover: isHover,
      jsonConfig: jsonConfig,
      handleMouseEnter: handleMouseEnter,
      handleMouseLeave: handleMouseLeave,
      handleValueChange: handleValueChange,
      handleSlotValueChange: handleSlotValueChange,
      handleAddAttr: handleAddAttr,
      handleAttrDelete: handleAttrDelete,
      handleValueFocus: handleValueFocus,
      handleValueBlur: handleValueBlur,
      handleCustom: handleCustom,
      allowType: allowType,
      customAppendOperate: customAppendOperate,
      valueSlot: valueSlot
    };
  }
});

var _hoisted_1 = {
  key: 1,
  "class": "json-node-separator"
};
var _hoisted_2 = {
  "class": /*#__PURE__*/normalizeClass(['json-node-value'])
};
var _hoisted_3 = {
  key: 1
};
var _hoisted_4 = {
  key: 3
};
var _hoisted_5 = {
  key: 7,
  "class": "json-operate-warper"
};
var _hoisted_6 = ["value"];
var _hoisted_7 = ["title", "onClick"];
var _hoisted_8 = {
  key: 1
};
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_ValueEditor = resolveComponent("ValueEditor");

  var _component_IconSvg = resolveComponent("IconSvg");

  var _component_Render = resolveComponent("Render");

  return _ctx.stateData ? (openBlock(), createElementBlock("div", {
    key: 0,
    "class": normalizeClass(['json-node', {
      'node-active': (_ctx.isHover || _ctx.isEdit) && !_ctx.isExtend
    }]),
    onMouseenter: _cache[7] || (_cache[7] = function () {
      return _ctx.handleMouseEnter && _ctx.handleMouseEnter.apply(_ctx, arguments);
    }),
    onMouseleave: _cache[8] || (_cache[8] = function () {
      return _ctx.handleMouseLeave && _ctx.handleMouseLeave.apply(_ctx, arguments);
    })
  }, [!_ctx.stateData.root ? (openBlock(), createElementBlock("span", {
    key: 0,
    "class": "json-node-key",
    style: normalizeStyle({
      color: _ctx.keyColor
    })
  }, [createVNode(_component_ValueEditor, {
    disabled: typeof _ctx.stateData.key === 'number' || _ctx.disabled,
    value: _ctx.stateData.key,
    onChange: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.handleValueChange($event, _ctx.json, 'key');
    }),
    onFocus: _ctx.handleValueFocus,
    onBlur: _ctx.handleValueBlur
  }, null, 8
  /* PROPS */
  , ["disabled", "value", "onFocus", "onBlur"])], 4
  /* STYLE */
  )) : createCommentVNode("v-if", true), !_ctx.stateData.root ? (openBlock(), createElementBlock("span", _hoisted_1, ":")) : createCommentVNode("v-if", true), createElementVNode("span", _hoisted_2, [_ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", {
    key: 0,
    "class": "hidden-separator",
    onClick: _cache[1] || (_cache[1] = function ($event) {
      return _ctx.handleExtend();
    })
  }, [_ctx.isExtend ? (openBlock(), createBlock(_component_IconSvg, {
    key: 0,
    "fix-class": "json-node-icon json-node-icon-blue",
    "if": "isExtend",
    name: "icon-zhankai"
  })) : (openBlock(), createBlock(_component_IconSvg, {
    key: 1,
    "fix-class": "json-node-icon json-node-icon-blue",
    name: "icon-zhankai-copy"
  }))])) : createCommentVNode("v-if", true), _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.stateData.type === 'object' ? '{' : '['), 1
  /* TEXT */
  )) : createCommentVNode("v-if", true), _ctx.isSub && _ctx.isExtend && !_ctx.disabled && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", {
    key: 2,
    "class": "json-node-icon-add",
    onClick: _cache[2] || (_cache[2] = function ($event) {
      return _ctx.handleAddAttr();
    })
  }, [createVNode(_component_IconSvg, {
    "fix-class": "json-node-operate-icon",
    name: "icon-tianjia"
  })])) : createCommentVNode("v-if", true), _ctx.isSub && !_ctx.isExtend && !_ctx.valueSlot ? (openBlock(), createElementBlock("span", _hoisted_4, "......")) : createCommentVNode("v-if", true), _ctx.valueSlot ? renderSlot(_ctx.$slots, "node-value", {
    key: 4,
    nodeValue: _ctx.stateData,
    handleChange: _ctx.handleSlotValueChange
  }) : createCommentVNode("v-if", true), !_ctx.isSub && !_ctx.valueSlot ? (openBlock(), createBlock(_component_ValueEditor, {
    key: _ctx.stateData.id,
    type: _ctx.stateData.type,
    value: _ctx.stateData.value,
    disabled: _ctx.disabled,
    onChange: _cache[3] || (_cache[3] = function ($event) {
      return _ctx.handleValueChange($event, _ctx.json, 'value');
    }),
    onFocus: _ctx.handleValueFocus,
    onBlur: _ctx.handleValueBlur
  }, null, 8
  /* PROPS */
  , ["type", "value", "disabled", "onFocus", "onBlur"])) : createCommentVNode("v-if", true), _ctx.isSub && !_ctx.valueSlot ? (openBlock(), createElementBlock(Fragment, {
    key: 6
  }, [_ctx.isExtend ? renderSlot(_ctx.$slots, "sub-node", {
    key: 0,
    node: _ctx.json.value
  }) : createCommentVNode("v-if", true), createElementVNode("span", null, toDisplayString(_ctx.json.type === 'object' ? '}' : ']'), 1
  /* TEXT */
  )], 64
  /* STABLE_FRAGMENT */
  )) : createCommentVNode("v-if", true), !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", _hoisted_5, [renderSlot(_ctx.$slots, "type-switch", {
    allowType: _ctx.allowType,
    nodeValue: _ctx.stateData
  }, function () {
    return [withDirectives(createElementVNode("select", {
      id: "dataType",
      "onUpdate:modelValue": _cache[4] || (_cache[4] = function ($event) {
        return _ctx.stateData.type = $event;
      }),
      name: "dataType",
      onChange: _cache[5] || (_cache[5] = function ($event) {
        return _ctx.handleSwitch(_ctx.stateData);
      })
    }, [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.allowType, function (datatype) {
      return openBlock(), createElementBlock("option", {
        key: datatype.type,
        value: datatype.type
      }, toDisplayString(datatype.desc), 9
      /* TEXT, PROPS */
      , _hoisted_6);
    }), 128
    /* KEYED_FRAGMENT */
    ))], 544
    /* HYDRATE_EVENTS, NEED_PATCH */
    ), [[vModelSelect, _ctx.stateData.type]])];
  })])) : createCommentVNode("v-if", true), !_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", {
    key: 8,
    "class": "json-node-icon-delete",
    title: "删除",
    onClick: _cache[6] || (_cache[6] = function ($event) {
      return _ctx.handleAttrDelete();
    })
  }, [createVNode(_component_IconSvg, {
    "fix-class": "json-node-operate-icon",
    name: "icon-delete"
  })])) : createCommentVNode("v-if", true), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.customAppendOperate, function (operate) {
    return openBlock(), createElementBlock(Fragment, {
      key: operate.key
    }, [!_ctx.disabled && !_ctx.isExtend && !_ctx.stateData.root && _ctx.isHover ? (openBlock(), createElementBlock("span", {
      key: 0,
      title: operate.title,
      "class": normalizeClass(['json-custom-warper', operate.className]),
      onClick: function onClick($event) {
        return _ctx.handleCustom(operate);
      }
    }, [operate.render ? (openBlock(), createBlock(_component_Render, {
      key: 0,
      render: operate.render
    }, null, 8
    /* PROPS */
    , ["render"])) : (openBlock(), createElementBlock("span", _hoisted_8, toDisplayString(operate.text), 1
    /* TEXT */
    ))], 10
    /* CLASS, PROPS */
    , _hoisted_7)) : createCommentVNode("v-if", true)], 64
    /* STABLE_FRAGMENT */
    );
  }), 128
  /* KEYED_FRAGMENT */
  ))])], 34
  /* CLASS, HYDRATE_EVENTS */
  )) : createCommentVNode("v-if", true);
}

script$2.render = render$2;
script$2.__file = "src/package/components/JsonNode.vue";

var script$1 = defineComponent({
  name: 'SubJsonNode',
  components: {
    JsonNode: script$2
  },
  props: {
    json: {
      type: Object,
      required: true
    },
    currectLevel: {
      type: Number,
      "default": 0
    }
  }
});

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SubJsonNode = resolveComponent("SubJsonNode", true);

  var _component_JsonNode = resolveComponent("JsonNode");

  return openBlock(), createBlock(_component_JsonNode, {
    json: _ctx.json,
    "currect-level": _ctx.currectLevel
  }, {
    "sub-node": withCtx(function (_ref) {
      var node = _ref.node;
      return [(openBlock(true), createElementBlock(Fragment, null, renderList(node, function (item) {
        return openBlock(), createBlock(_component_SubJsonNode, {
          key: item.id,
          json: item,
          "currect-level": _ctx.currectLevel + 1
        }, {
          "type-switch": withCtx(function (_ref2) {
            var nodeValue = _ref2.nodeValue,
                allowType = _ref2.allowType;
            return [renderSlot(_ctx.$slots, "type-switch", {
              allowType: allowType,
              nodeValue: nodeValue
            })];
          }),
          "node-value": withCtx(function (_ref3) {
            var nodeValue = _ref3.nodeValue,
                handleChange = _ref3.handleChange;
            return [renderSlot(_ctx.$slots, "node-value", {
              nodeValue: nodeValue,
              handleChange: handleChange
            })];
          }),
          _: 2
          /* DYNAMIC */

        }, 1032
        /* PROPS, DYNAMIC_SLOTS */
        , ["json", "currect-level"]);
      }), 128
      /* KEYED_FRAGMENT */
      ))];
    }),
    "type-switch": withCtx(function (_ref4) {
      var nodeValue = _ref4.nodeValue,
          allowType = _ref4.allowType;
      return [renderSlot(_ctx.$slots, "type-switch", {
        allowType: allowType,
        nodeValue: nodeValue
      })];
    }),
    "node-value": withCtx(function (_ref5) {
      var nodeValue = _ref5.nodeValue,
          handleChange = _ref5.handleChange;
      return [renderSlot(_ctx.$slots, "node-value", {
        nodeValue: nodeValue,
        handleChange: handleChange
      })];
    }),
    _: 3
    /* FORWARDED */

  }, 8
  /* PROPS */
  , ["json", "currect-level"]);
}

script$1.render = render$1;
script$1.__file = "src/package/components/SubJsonNode.vue";

var script = defineComponent({
  name: 'SimpleJson',
  components: {
    SubJsonNode: script$1
  },
  props: {
    json: {
      type: Array,
      required: true
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    extendAll: {
      type: Boolean,
      "default": false
    },
    extendLevel: {
      type: Number,
      "default": 0
    },
    speciallyKey: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    config: {
      type: Object,
      "default": function _default() {}
    }
  },
  emits: ['update:value', 'change', 'extend', 'delete', 'type-switch'],
  setup: function setup(props, _ref) {
    var _this = this;

    var emit = _ref.emit;
    var stateData = ref({
      id: 'root',
      key: '',
      value: '',
      type: 'object',
      root: true
    });
    var extendCatchKey = ref([]);
    watch(function () {
      return props.json;
    }, function (val) {
      if (val) stateData.value.value = val;
    }, {
      immediate: true,
      deep: true
    });

    var handleChange = function handleChange(name, value) {
      return __awaiter(_this, void 0, void 0, /*#__PURE__*/regenerator.mark(function _callee() {
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (value.root) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return deepUpdataJson(stateData.value, value.id, value.key, value.value);

              case 3:
                _context.next = 5;
                return emit(name, stateData.value.value);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    };

    var handleExtend = function handleExtend(value) {
      var exist = extendCatchKey.value.some(function (x) {
        return value.id === x.id;
      });

      if (exist) {
        if (!value.isExtend) {
          for (var i = 0; i < extendCatchKey.value.length; i++) {
            if (value.id === extendCatchKey.value[i].id) {
              extendCatchKey.value.splice(i, 1);
              i--;
            }
          }
        }
      } else if (value.isExtend) {
        extendCatchKey.value.push({
          id: value.id
        });
      }

      emit('extend', extendCatchKey.value);
    };

    var handleAttrDelete = function handleAttrDelete(name, value) {
      return __awaiter(_this, void 0, void 0, /*#__PURE__*/regenerator.mark(function _callee2() {
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return deepDeleteJson(stateData.value, value.id);

              case 2:
                _context2.next = 4;
                return emit('change', stateData.value.value);

              case 4:
                emit('delete', value);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    };

    var eventTrigger = function eventTrigger(name, value) {
      if (name === 'change') handleChange(name, value);
      if (name === 'delete') handleAttrDelete(name, value);
      if (name === 'extend') handleExtend(value);
      if (name === 'type-switch') emit(name, value);
    };

    provide('eventTrigger', eventTrigger);
    provide('JsonEditorContext', {
      extendCatchKey: extendCatchKey,
      disabled: toRef(props, 'disabled'),
      extendAll: toRef(props, 'extendAll'),
      extendLevel: toRef(props, 'extendLevel'),
      jsonConfig: toRef(props, 'config')
    });
    return {
      stateData: stateData,
      extendCatchKey: extendCatchKey
    };
  }
});

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_SubJsonNode = resolveComponent("SubJsonNode");

  return openBlock(), createBlock(_component_SubJsonNode, {
    json: _ctx.stateData,
    "currect-level": 1
  }, {
    "type-switch": withCtx(function (_ref) {
      var nodeValue = _ref.nodeValue,
          allowType = _ref.allowType;
      return [renderSlot(_ctx.$slots, "type-switch", {
        allowType: allowType,
        nodeValue: nodeValue
      })];
    }),
    "node-value": withCtx(function (_ref2) {
      var nodeValue = _ref2.nodeValue,
          handleChange = _ref2.handleChange;
      return [renderSlot(_ctx.$slots, "node-value", {
        nodeValue: nodeValue,
        handleChange: handleChange
      })];
    }),
    _: 3
    /* FORWARDED */

  }, 8
  /* PROPS */
  , ["json"]);
}

script.render = render;
script.__file = "src/package/JsonEditor.vue";

/* eslint-disable indent */
!function (a) {
  var l,
      _t,
      c,
      e,
      i,
      n = '<svg><symbol id="icon-shujukaifagongzuoliushujutansuozuijindakai" viewBox="0 0 1024 1024"><path d="M237.348571 123.611429l-7.094857 8.996571c3.072-10.971429 5.339429-19.602286 6.875429-26.112l6.875428-29.257143c7.021714-21.211429 2.486857-33.865143-18.651428-40.96-15.945143-2.706286-29.988571-0.365714-37.010286 13.750857l-33.792 142.482286c-4.681143 16.822857-6.290286 29.403429 14.848 36.498286l132.461714 33.645714c21.211429 7.021714 36.352-1.901714 42.422858-19.456 5.924571-17.627429-7.021714-34.962286-22.820572-38.180571l-56.100571-14.482286c5.193143-3.730286 4.827429-5.997714 12.214857-11.849143 83.968-65.828571 156.672-101.522286 248.32-101.522286 211.382857 0 396.8 190.317714 396.8 401.700572 0 211.456-185.417143 398.116571-396.8 398.116571-211.382857 0-396.8-186.660571-396.8-398.116571 0-21.138286-13.897143-38.034286-35.108572-38.034286-21.138286 0-34.011429 16.896-34.011428 38.034286 0 253.805714 212.187429 467.821714 465.92 467.821714 253.659429 0 467.675429-214.674286 467.675428-468.406857S790.966857 11.264 526.774857 11.264a437.540571 437.540571 0 0 0-289.426286 112.274286zM470.308571 329.216v222.427429c0 21.211429 14.116571 35.254857 35.254858 35.254857h160.036571c21.211429 0 34.377143-14.116571 34.377143-35.254857s-13.165714-31.012571-34.377143-31.012572H539.062857V329.289143c0-21.138286-11.995429-35.620571-33.206857-35.620572-21.138286 0-35.474286 14.482286-35.474286 35.620572z" fill="#000000" ></path></symbol><symbol id="icon-icon_xinyong_xianxing_jijin-" viewBox="0 0 1024 1024"><path d="M512 230.4c-63.5136 0-115.2-51.6864-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6864 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM512 1024c-63.5136 0-115.2-51.6736-115.2-115.2s51.6864-115.2 115.2-115.2c63.5264 0 115.2 51.6736 115.2 115.2s-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM908.8 627.2c-63.5264 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6736-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6736 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64zM115.2 627.2c-63.5136 0-115.2-51.6736-115.2-115.2 0-63.5136 51.6864-115.2 115.2-115.2s115.2 51.6864 115.2 115.2c0 63.5264-51.6864 115.2-115.2 115.2z m0-179.2c-35.2896 0-64 28.7104-64 64s28.7104 64 64 64 64-28.7104 64-64-28.7104-64-64-64z" fill="#333333" ></path><path d="M320.5376 219.392a25.6 25.6 0 0 1-13.184-47.5648 392.256 392.256 0 0 1 116.5184-46.6688 25.6 25.6 0 0 1 11.1488 49.984 341.5552 341.5552 0 0 0-101.3376 40.6016 25.6384 25.6384 0 0 1-13.1456 3.648zM703.4624 219.4048c-4.4928 0-9.024-1.1776-13.1456-3.6608a341.2736 341.2736 0 0 0-101.3248-40.6016 25.6256 25.6256 0 0 1-19.4176-30.5664 25.664 25.664 0 0 1 30.5664-19.4176 392.3968 392.3968 0 0 1 116.5312 46.6688 25.6128 25.6128 0 0 1-13.2096 47.5776zM429.4656 899.456c-1.8432 0-3.7248-0.2048-5.5936-0.6144a392.64 392.64 0 0 1-116.5184-46.656 25.6 25.6 0 0 1 26.3296-43.9296 341.2096 341.2096 0 0 0 101.3376 40.6016 25.6 25.6 0 0 1-5.5552 50.5984zM594.5344 899.456a25.6 25.6 0 0 1-5.5424-50.5856 341.1712 341.1712 0 0 0 101.3248-40.6144 25.6 25.6 0 1 1 26.3424 43.904 392.0256 392.0256 0 0 1-116.5312 46.6816 26.0864 26.0864 0 0 1-5.5936 0.6144zM150.1696 455.04a25.6256 25.6256 0 0 1-25.024-31.1808 391.808 391.808 0 0 1 46.6816-116.5184 25.6 25.6 0 0 1 43.904 26.3424 341.184 341.184 0 0 0-40.6144 101.3376 25.5872 25.5872 0 0 1-24.9472 20.0192zM193.8176 729.088c-8.704 0-17.1776-4.4288-21.9776-12.4288a392.1664 392.1664 0 0 1-46.6816-116.5312 25.6 25.6 0 0 1 49.984-11.1488 341.0304 341.0304 0 0 0 40.6144 101.3248 25.6 25.6 0 0 1-21.9392 38.784zM830.1952 729.088a25.5744 25.5744 0 0 1-21.9392-38.7584 341.2096 341.2096 0 0 0 40.6016-101.3248 25.6768 25.6768 0 0 1 30.5536-19.4304 25.6 25.6 0 0 1 19.4304 30.5536 392.512 392.512 0 0 1-46.656 116.5312 25.6256 25.6256 0 0 1-21.9904 12.4288zM873.8304 455.04a25.6128 25.6128 0 0 1-24.96-20.032 341.4912 341.4912 0 0 0-40.6016-101.3376 25.6128 25.6128 0 0 1 43.9296-26.3296 392.64 392.64 0 0 1 46.656 116.5184 25.6 25.6 0 0 1-25.024 31.1808z" fill="#333333" ></path><path d="M231.424 913.0496a102.016 102.016 0 0 1-72.3712-29.9264l-18.176-18.176c-39.9104-39.9104-39.9104-104.832 0-144.7552l34.816-34.816a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.816a51.2256 51.2256 0 0 0 0 72.3456l18.176 18.176a51.2256 51.2256 0 0 0 72.3456 0l34.816-34.8288a25.6 25.6 0 0 1 36.2112 36.1984l-34.816 34.8288a102.0928 102.0928 0 0 1-72.3968 29.9392zM830.1952 346.112a25.6 25.6 0 0 1-18.0992-43.712l34.8288-34.816a50.7648 50.7648 0 0 0 14.9632-36.16 50.8416 50.8416 0 0 0-14.9632-36.1856l-18.176-18.176a51.2256 51.2256 0 0 0-72.3456 0l-34.816 34.816a25.6 25.6 0 1 1-36.1984-36.2112l34.816-34.816c39.8976-39.9104 104.8448-39.9104 144.7552 0l18.176 18.176a101.6832 101.6832 0 0 1 29.9648 72.384 101.632 101.632 0 0 1-29.9648 72.3712l-34.8288 34.816a25.4848 25.4848 0 0 1-18.112 7.5136zM792.576 913.0624a101.952 101.952 0 0 1-72.3712-29.9392l-34.816-34.8288a25.6 25.6 0 1 1 36.1984-36.1984l34.816 34.8288c19.3024 19.3024 53.056 19.3024 72.3456 0l18.176-18.176c9.6512-9.6512 14.9632-22.5024 14.9632-36.1728s-5.312-26.5216-14.9632-36.1728l-34.8288-34.816a25.6 25.6 0 1 1 36.1984-36.1984l34.8288 34.816c39.9104 39.9104 39.9104 104.832 0 144.7552l-18.176 18.176a101.9904 101.9904 0 0 1-72.3712 29.9264zM193.792 346.112a25.472 25.472 0 0 1-18.0992-7.5008l-34.816-34.816c-19.328-19.3152-29.9648-45.0304-29.9648-72.3712s10.6496-53.056 29.9648-72.3712l18.176-18.1632c39.9104-39.8976 104.8576-39.8976 144.7424 0l34.816 34.816a25.6 25.6 0 1 1-36.1984 36.1984l-34.816-34.816a51.2256 51.2256 0 0 0-72.3456 0l-18.176 18.1632c-9.6512 9.6512-14.9632 22.4896-14.9632 36.1728s5.312 26.5216 14.9632 36.1728l34.816 34.816a25.6 25.6 0 0 1-18.0992 43.6992zM512 665.6c-84.6976 0-153.6-68.9024-153.6-153.6s68.9024-153.6 153.6-153.6 153.6 68.9024 153.6 153.6-68.9024 153.6-153.6 153.6z m0-256c-56.4608 0-102.4 45.9392-102.4 102.4s45.9392 102.4 102.4 102.4 102.4-45.9392 102.4-102.4-45.9392-102.4-102.4-102.4z" fill="#333333" ></path></symbol><symbol id="icon-01zhushuju_shujuquanxian" viewBox="0 0 1024 1024"><path d="M905.671111 545.564444v-341.333333a23.324444 23.324444 0 0 0-16.497778-21.617778l-370.346666-113.777777a27.875556 27.875556 0 0 0-13.653334 0l-370.346666 113.777777a23.324444 23.324444 0 0 0-16.497778 21.617778v341.333333a307.768889 307.768889 0 0 0 121.173333 243.484445l258.844445 196.266667a22.755556 22.755556 0 0 0 27.306666 0l258.844445-196.266667a307.768889 307.768889 0 0 0 121.173333-243.484445z m-148.48 207.075556L512 938.666667l-245.191111-186.026667a261.688889 261.688889 0 0 1-102.968889-207.075556V221.866667L512 113.777778l348.16 108.088889v323.697777a261.688889 261.688889 0 0 1-102.968889 207.075556z"  ></path><path d="M650.808889 362.382222a138.808889 138.808889 0 1 0-161.564445 136.533334v284.444444a22.755556 22.755556 0 0 0 45.511112 0v-153.6h64.853333a22.755556 22.755556 0 0 0 0-45.511111H534.755556v-85.333333a138.808889 138.808889 0 0 0 116.053333-136.533334zM512 455.111111a93.297778 93.297778 0 1 1 93.297778-93.297778A93.866667 93.866667 0 0 1 512 455.111111z"  ></path></symbol><symbol id="icon-shujushujudian" viewBox="0 0 1024 1024"><path d="M661.333333 128a128 128 0 0 1 82.773334 225.621333l56.832 117.482667a117.333333 117.333333 0 1 1-57.578667 27.882667l-56.832-117.461334a128.618667 128.618667 0 0 1-43.52 1.173334l-133.546667 266.368a128 128 0 1 1-182.186666 16.938666l-103.445334-137.514666a106.666667 106.666667 0 1 1 52.48-36.48l102.293334 135.978666a128.597333 128.597333 0 0 1 73.578666-6.784l131.861334-263.168A128 128 0 0 1 661.333333 128zM426.666667 688.490667a58.176 58.176 0 1 0 0 116.352 58.176 58.176 0 0 0 0-116.352zM821.333333 533.333333a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667zM192 378.176a48.490667 48.490667 0 1 0 0 96.981333 48.490667 48.490667 0 0 0 0-96.981333z m469.333333-180.352a58.176 58.176 0 1 0 0 116.352 58.176 58.176 0 0 0 0-116.352z" fill="#000000" ></path></symbol><symbol id="icon-yangshi_icon_tongyong_swap" viewBox="0 0 1024 1024"><path d="M851.512889 673.393778l-204.8 233.671111c-7.111111 7.68-20.366222 2.844444-20.366222-7.452445V199.480889 142.506667a28.444444 28.444444 0 0 1 28.444444-28.444445h28.444445a28.444444 28.444444 0 0 1 28.444444 28.444445v56.888889c0 1.137778-0.512 2.104889-0.654222 3.214222V654.791111h131.783111c10.040889 0 15.388444 11.377778 8.704 18.602667zM370.346667 910.506667h-28.444445a28.444444 28.444444 0 0 1-28.444444-28.444445v-56.888889c0-1.137778 0.512-2.104889 0.654222-3.214222V369.834667H182.328889c-10.040889 0-15.36-11.406222-8.704-18.602667l204.8-233.671111c7.111111-7.68 20.366222-2.844444 20.366222 7.395555V882.062222a28.444444 28.444444 0 0 1-28.444444 28.444445z"  ></path><path d="M851.512889 673.393778l-204.8 233.671111c-7.111111 7.68-20.366222 2.844444-20.366222-7.452445V199.480889 142.506667a28.444444 28.444444 0 0 1 28.444444-28.444445h28.444445a28.444444 28.444444 0 0 1 28.444444 28.444445v56.888889c0 1.137778-0.512 2.104889-0.654222 3.214222V654.791111h131.783111c10.040889 0 15.388444 11.377778 8.704 18.602667zM370.346667 910.506667h-28.444445a28.444444 28.444444 0 0 1-28.444444-28.444445v-56.888889c0-1.137778 0.512-2.104889 0.654222-3.214222V369.834667H182.328889c-10.040889 0-15.36-11.406222-8.704-18.602667l204.8-233.671111c7.111111-7.68 20.366222-2.844444 20.366222 7.395555v757.134223a28.444444 28.444444 0 0 1-28.444444 28.444444z"  ></path></symbol><symbol id="icon-delete" viewBox="0 0 1024 1024"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zM864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"  ></path></symbol><symbol id="icon-zhankai" viewBox="0 0 1024 1024"><path d="M818.393225 300.939003c12.824073-14.09502 34.658358-15.126512 48.752354-2.303462 14.09502 12.843516 15.126512 34.678824 2.302439 48.752354l-332.676845 364.835266c-12.844539 14.114462-34.659381 15.127536-48.753377 2.302439-0.815575-0.733711-1.588171-1.486864-2.302439-2.302439l-0.080841-0.078795-0.13917-0.13917L153.018046 347.388918c-12.824073-14.074553-11.791557-35.909861 2.302439-48.752354 14.09502-12.824073 35.930327-11.792581 48.753377 2.303462l307.168891 336.845795 307.149449-336.845795L818.393225 300.939003 818.393225 300.939003z"  ></path></symbol><symbol id="icon-tianjia" viewBox="0 0 1024 1024"><path d="M801.171 483.589H544V226.418c0-17.673-14.327-32-32-32s-32 14.327-32 32v257.171H222.83c-17.673 0-32 14.327-32 32s14.327 32 32 32H480v257.17c0 17.673 14.327 32 32 32s32-14.327 32-32v-257.17h257.171c17.673 0 32-14.327 32-32s-14.327-32-32-32z" fill="" ></path></symbol><symbol id="icon-zhuanhuan" viewBox="0 0 1024 1024"><path d="M113.664 444.16h798.72c11.264 0 20.48-9.216 20.48-20.48s-9.216-20.48-20.48-20.48H158.0032l192.4608-192.4608a20.52096 20.52096 0 0 0 0-28.9792 20.52096 20.52096 0 0 0-28.9792 0L97.024 406.2208c-7.6288 7.6288-7.8848 19.8656-0.8704 27.904 3.584 5.9904 10.0864 10.0352 17.5104 10.0352zM912.384 582.4h-798.72c-11.264 0-20.48 9.216-20.48 20.48s9.216 20.48 20.48 20.48h749.2608l-189.9008 189.9008a20.52096 20.52096 0 0 0 0 28.9792 20.52096 20.52096 0 0 0 28.9792 0l224.4608-224.4608c0.1024-0.1024 0.1536-0.2048 0.256-0.3072a20.3776 20.3776 0 0 0 6.144-14.592c0-11.264-9.216-20.48-20.48-20.48z" fill="#666666" ></path></symbol><symbol id="icon-zhankai-copy" viewBox="0 0 1024 1024"><path d="M300.939003 205.606775c-14.09502-12.824073-15.126512-34.658358-2.303462-48.752354 12.843516-14.09502 34.67882399-15.126512 48.752354-2.302439l364.835266 332.676845c14.114462 12.844539 15.127536 34.659381 2.302439 48.753377-0.733711 0.815575-1.486864 1.588171-2.302439 2.302439l-0.078795 0.080841-0.13917 0.13917L347.388918 870.981954c-14.074553 12.824073-35.909861 11.791557-48.752354-2.302439-12.824073-14.09502-11.792581-35.930327 2.303462-48.753377l336.845795-307.16889101-336.845795-307.14944899L300.939003 205.606775 300.939003 205.606775z"  ></path></symbol></svg>',
      o = (o = document.getElementsByTagName('script'))[o.length - 1].getAttribute('data-injectcss'),
      d = function d(a, l) {
    l.parentNode.insertBefore(a, l);
  };

  if (o && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = !0;

    try {
      document.write('<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>');
    } catch (a) {
      console && console.log(a);
    }
  }

  function s() {
    i || (i = !0, c());
  }

  function h() {
    try {
      e.documentElement.doScroll('left');
    } catch (a) {
      return void setTimeout(h, 50);
    }

    s();
  }

  l = function l() {
    var a,
        l = document.createElement('div');
    l.innerHTML = n, n = null, (l = l.getElementsByTagName('svg')[0]) && (l.setAttribute('aria-hidden', 'true'), l.style.position = 'absolute', l.style.width = 0, l.style.height = 0, l.style.overflow = 'hidden', l = l, (a = document.body).firstChild ? d(l, a.firstChild) : a.appendChild(l));
  }, document.addEventListener ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState) ? setTimeout(l, 0) : (_t = function t() {
    document.removeEventListener('DOMContentLoaded', _t, !1), l();
  }, document.addEventListener('DOMContentLoaded', _t, !1)) : document.attachEvent && (c = l, e = a.document, i = !1, h(), e.onreadystatechange = function () {
    'complete' == e.readyState && (e.onreadystatechange = null, s());
  });
}(window);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".svg-icon {\n  width: 1em;\n  height: 1em;\n  font-size: 20px;\n  vertical-align: -0.15em;\n  fill: currentColor;\n  overflow: hidden;\n  pointer-events: none;\n}\n.cursor {\n  cursor: pointer;\n}\n.margin {\n  margin: 0 8px;\n}\n.json-node {\n  min-height: 30px;\n}\n.json-node .json-node {\n  padding-left: 40px;\n}\n.json-node .json-node-key {\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 600;\n  color: #179af1;\n  text-align: left;\n  min-width: 20px;\n}\n.json-node .json-node-value .json-node-icon-delete {\n  margin-left: 5px;\n  display: inline-block;\n  cursor: pointer;\n  color: red;\n}\n.json-node .json-node-value .json-node-icon {\n  padding: 2px;\n  border-radius: 2px;\n  width: 16px;\n  height: 16px;\n  color: #fff;\n}\n.json-node .json-node-value .json-node-icon-blue {\n  background-color: #71aff1;\n}\n.json-node .json-node-value .json-node-icon-add {\n  cursor: pointer;\n  color: #71aff1;\n}\n.json-node .json-node-value .json-node-icon-add:hover {\n  color: red;\n}\n.json-node .json-node-value .hidden-separator {\n  cursor: pointer;\n  margin: 0 5px;\n  font-weight: 600;\n}\n.json-node .json-node-value .hidden-separator:hover {\n  color: red;\n}\n.json-node .json-node-value .json-node-operate-icon {\n  width: 16px;\n  height: 16px;\n  margin-left: 2px;\n  cursor: pointer;\n}\n.json-node .json-node-value .json-custom-warper {\n  display: inline-block;\n}\n.json-node .json-node-value .json-operate-warper {\n  margin-left: 8px;\n}\n.json-node .json-node-separator {\n  margin: 0 4px;\n  font-weight: 600;\n}\n.node-active {\n  position: initial;\n}\n.node-active::before {\n  position: absolute;\n  right: 0;\n  left: 0;\n  height: 24px;\n  transition: all 0.3s;\n  content: '';\n  background-color: #dbebfc;\n  z-index: -1;\n}\n.value-editor {\n  display: inline-block;\n  height: 100%;\n}\n.value-editor .value-editor-text {\n  display: inline-block;\n  outline: none;\n  box-sizing: border-box;\n  border: none;\n  min-width: 20px;\n  height: 100%;\n}\n.value-editor .value-editor-input {\n  -webkit-user-modify: read-write-plaintext-only;\n}\n";
styleInject(css_248z);

var install = function install(app) {
  app.component('SimpleJson', script);
  return app;
};

var index = {
  install: install
};

export { index as SimpleJson, deepAnalysisJson, deepReductionJson };
