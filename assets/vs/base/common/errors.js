/*
 *  Copyright 2020 SenX S.A.S.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
        this.listeners = [];
        this.unexpectedErrorHandler = function (e) {
            setTimeout(function () {
                if (e.stack) {
                    throw new Error(e.message + '\n\n' + e.stack);
                }
                throw e;
            }, 0);
        };
    }
    ErrorHandler.prototype.emit = function (e) {
        this.listeners.forEach(function (listener) {
            listener(e);
        });
    };
    ErrorHandler.prototype.onUnexpectedError = function (e) {
        this.unexpectedErrorHandler(e);
        this.emit(e);
    };
    // For external errors, we don't want the listeners to be called
    ErrorHandler.prototype.onUnexpectedExternalError = function (e) {
        this.unexpectedErrorHandler(e);
    };
    return ErrorHandler;
}());
export { ErrorHandler };
export var errorHandler = new ErrorHandler();
export function onUnexpectedError(e) {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedError(e);
    }
    return undefined;
}
export function onUnexpectedExternalError(e) {
    // ignore errors from cancelled promises
    if (!isPromiseCanceledError(e)) {
        errorHandler.onUnexpectedExternalError(e);
    }
    return undefined;
}
export function transformErrorForSerialization(error) {
    if (error instanceof Error) {
        var name_1 = error.name, message = error.message;
        var stack = error.stacktrace || error.stack;
        return {
            $isError: true,
            name: name_1,
            message: message,
            stack: stack
        };
    }
    // return as is
    return error;
}
var canceledName = 'Canceled';
/**
 * Checks if the given error is a promise in canceled state
 */
export function isPromiseCanceledError(error) {
    return error instanceof Error && error.name === canceledName && error.message === canceledName;
}
/**
 * Returns an error that signals cancellation.
 */
export function canceled() {
    var error = new Error(canceledName);
    error.name = error.message;
    return error;
}
export function illegalArgument(name) {
    if (name) {
        return new Error("Illegal argument: " + name);
    }
    else {
        return new Error('Illegal argument');
    }
}
export function illegalState(name) {
    if (name) {
        return new Error("Illegal state: " + name);
    }
    else {
        return new Error('Illegal state');
    }
}
