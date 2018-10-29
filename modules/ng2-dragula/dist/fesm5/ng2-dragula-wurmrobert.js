import * as dragulaExpt from 'dragula';
import dragulaExpt__default, {  } from 'dragula';
import { __spread, __read } from 'tslib';
import { Injectable, Optional, Directive, Input, Output, ElementRef, EventEmitter, NgModule } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var Group = /** @class */ (function () {
    function Group(name, drake, options) {
        this.name = name;
        this.drake = drake;
        this.options = options;
        this.initEvents = false;
    }
    return Group;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
var EventTypes = {
    Cancel: "cancel",
    Cloned: "cloned",
    Drag: "drag",
    DragEnd: "dragend",
    Drop: "drop",
    Out: "out",
    Over: "over",
    Remove: "remove",
    Shadow: "shadow",
    DropModel: "dropModel",
    RemoveModel: "removeModel",
};
/** @type {?} */
var AllEvents = Object.keys(EventTypes).map(function (k) { return (EventTypes[/** @type {?} */ (k)]); });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @type {?} */
var dragula = dragulaExpt__default || dragulaExpt;
var DrakeFactory = /** @class */ (function () {
    function DrakeFactory(build) {
        if (build === void 0) { build = dragula; }
        this.build = build;
    }
    return DrakeFactory;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @type {?} */
var filterEvent = function (eventType, filterDragType, projector) { return function (input) {
    return input.pipe(filter(function (_a) {
        var event = _a.event, name = _a.name;
        return event === eventType
            && (filterDragType === undefined || name === filterDragType);
    }), map(function (_a) {
        var name = _a.name, args = _a.args;
        return projector(name, args);
    }));
}; };
/** @type {?} */
var elContainerSourceProjector = function (name, _a) {
    var _b = __read(_a, 3), el = _b[0], container = _b[1], source = _b[2];
    return ({ name: name, el: el, container: container, source: source });
};
var DragulaService = /** @class */ (function () {
    function DragulaService(drakeFactory) {
        if (drakeFactory === void 0) { drakeFactory = null; }
        var _this = this;
        this.drakeFactory = drakeFactory;
        this.dispatch$ = new Subject();
        this.drag = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Drag, groupName, function (name, _a) {
            var _b = __read(_a, 2), el = _b[0], source = _b[1];
            return ({ name: name, el: el, source: source });
        })); };
        this.dragend = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.DragEnd, groupName, function (name, _a) {
            var _b = __read(_a, 1), el = _b[0];
            return ({ name: name, el: el });
        })); };
        this.drop = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Drop, groupName, function (name, _a) {
            var _b = __read(_a, 4), el = _b[0], target = _b[1], source = _b[2], sibling = _b[3];
            return { name: name, el: el, target: target, source: source, sibling: sibling };
        })); };
        this.elContainerSource = function (eventType) {
            return function (groupName) {
                return _this.dispatch$.pipe(filterEvent(eventType, groupName, elContainerSourceProjector));
            };
        };
        this.cancel = this.elContainerSource(EventTypes.Cancel);
        this.remove = this.elContainerSource(EventTypes.Remove);
        this.shadow = this.elContainerSource(EventTypes.Shadow);
        this.over = this.elContainerSource(EventTypes.Over);
        this.out = this.elContainerSource(EventTypes.Out);
        this.cloned = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.Cloned, groupName, function (name, _a) {
            var _b = __read(_a, 3), clone = _b[0], original = _b[1], cloneType = _b[2];
            return { name: name, clone: clone, original: original, cloneType: cloneType };
        })); };
        this.dropModel = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.DropModel, groupName, function (name, _a) {
            var _b = __read(_a, 9), el = _b[0], target = _b[1], source = _b[2], sibling = _b[3], item = _b[4], sourceModel = _b[5], targetModel = _b[6], sourceIndex = _b[7], targetIndex = _b[8];
            return { name: name, el: el, target: target, source: source, sibling: sibling, item: item, sourceModel: sourceModel, targetModel: targetModel, sourceIndex: sourceIndex, targetIndex: targetIndex };
        })); };
        this.removeModel = function (groupName) { return _this.dispatch$.pipe(filterEvent(EventTypes.RemoveModel, groupName, function (name, _a) {
            var _b = __read(_a, 6), el = _b[0], container = _b[1], source = _b[2], item = _b[3], sourceModel = _b[4], sourceIndex = _b[5];
            return { name: name, el: el, container: container, source: source, item: item, sourceModel: sourceModel, sourceIndex: sourceIndex };
        })); };
        this.groups = {};
        if (this.drakeFactory === null) {
            this.drakeFactory = new DrakeFactory();
        }
    }
    /**
     * Public mainly for testing purposes. Prefer `createGroup()`.
     * @param {?} group
     * @return {?}
     */
    DragulaService.prototype.add = /**
     * Public mainly for testing purposes. Prefer `createGroup()`.
     * @param {?} group
     * @return {?}
     */
    function (group) {
        /** @type {?} */
        var existingGroup = this.find(group.name);
        if (existingGroup) {
            throw new Error('Group named: "' + group.name + '" already exists.');
        }
        this.groups[group.name] = group;
        this.handleModels(group);
        this.setupEvents(group);
        return group;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaService.prototype.find = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this.groups[name];
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaService.prototype.destroy = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var group = this.find(name);
        if (!group) {
            return;
        }
        group.drake && group.drake.destroy();
        delete this.groups[name];
    };
    /**
     * Creates a group with the specified name and options.
     *
     * Note: formerly known as `setOptions`
     * @template T
     * @param {?} name
     * @param {?} options
     * @return {?}
     */
    DragulaService.prototype.createGroup = /**
     * Creates a group with the specified name and options.
     *
     * Note: formerly known as `setOptions`
     * @template T
     * @param {?} name
     * @param {?} options
     * @return {?}
     */
    function (name, options) {
        return this.add(new Group(name, this.drakeFactory.build([], options), options));
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    DragulaService.prototype.handleModels = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _this = this;
        var name = _a.name, drake = _a.drake, options = _a.options;
        /** @type {?} */
        var dragElm;
        /** @type {?} */
        var dragIndex;
        /** @type {?} */
        var dropIndex;
        drake.on('remove', function (el, container, source) {
            if (!drake.models) {
                return;
            }
            /** @type {?} */
            var sourceModel = drake.models[drake.containers.indexOf(source)];
            sourceModel = sourceModel.slice(0);
            /** @type {?} */
            var item = sourceModel.splice(dragIndex, 1)[0];
            // console.log('REMOVE');
            // console.log(sourceModel);
            // console.log('REMOVE');
            // console.log(sourceModel);
            _this.dispatch$.next({
                event: EventTypes.RemoveModel,
                name: name,
                args: [el, container, source, item, sourceModel, dragIndex]
            });
        });
        drake.on('drag', function (el, source) {
            if (!drake.models) {
                return;
            }
            dragElm = el;
            dragIndex = _this.domIndexOf(el, source);
        });
        drake.on('drop', function (dropElm, target, source, sibling) {
            if (!drake.models || !target) {
                return;
            }
            dropIndex = _this.domIndexOf(dropElm, target);
            /** @type {?} */
            var sourceModel = drake.models[drake.containers.indexOf(source)];
            /** @type {?} */
            var targetModel = drake.models[drake.containers.indexOf(target)];
            /** @type {?} */
            var item;
            if (target === source) {
                sourceModel = sourceModel.slice(0);
                item = sourceModel.splice(dragIndex, 1)[0];
                sourceModel.splice(dropIndex, 0, item);
                // this was true before we cloned and updated sourceModel,
                // but targetModel still has the old value
                targetModel = sourceModel;
            }
            else {
                /** @type {?} */
                var isCopying = dragElm !== dropElm;
                item = sourceModel[dragIndex];
                if (isCopying) {
                    if (!options.copyItem) {
                        throw new Error("If you have enabled `copy` on a group, you must provide a `copyItem` function.");
                    }
                    item = options.copyItem(item);
                }
                if (!isCopying) {
                    sourceModel = sourceModel.slice(0);
                    sourceModel.splice(dragIndex, 1);
                }
                targetModel = targetModel.slice(0);
                targetModel.splice(dropIndex, 0, item);
                if (isCopying) {
                    try {
                        target.removeChild(dropElm);
                    }
                    catch (e) { }
                }
            }
            _this.dispatch$.next({
                event: EventTypes.DropModel,
                name: name,
                args: [dropElm, target, source, sibling, item, sourceModel, targetModel, dragIndex, dropIndex]
            });
        });
    };
    /**
     * @param {?} group
     * @return {?}
     */
    DragulaService.prototype.setupEvents = /**
     * @param {?} group
     * @return {?}
     */
    function (group) {
        var _this = this;
        if (group.initEvents) {
            return;
        }
        group.initEvents = true;
        /** @type {?} */
        var name = group.name;
        /** @type {?} */
        var emitter = function (event) {
            group.drake.on(event, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.dispatch$.next({ event: event, name: name, args: args });
            });
        };
        AllEvents.forEach(emitter);
    };
    /**
     * @param {?} child
     * @param {?} parent
     * @return {?}
     */
    DragulaService.prototype.domIndexOf = /**
     * @param {?} child
     * @param {?} parent
     * @return {?}
     */
    function (child, parent) {
        return Array.prototype.indexOf.call(parent.children, child);
    };
    DragulaService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    DragulaService.ctorParameters = function () { return [
        { type: DrakeFactory, decorators: [{ type: Optional }] }
    ]; };
    return DragulaService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DragulaDirective = /** @class */ (function () {
    function DragulaDirective(el, dragulaService) {
        this.el = el;
        this.dragulaService = dragulaService;
        this.dragulaModelChange = new EventEmitter();
    }
    Object.defineProperty(DragulaDirective.prototype, "container", {
        get: /**
         * @return {?}
         */
        function () {
            return this.el && this.el.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    DragulaDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes && changes.dragula) {
            var _a = changes.dragula, prev = _a.previousValue, current = _a.currentValue, firstChange = _a.firstChange;
            /** @type {?} */
            var hadPreviousValue = !!prev;
            /** @type {?} */
            var hasNewValue = !!current;
            // something -> null       =>  teardown only
            // something -> something  =>  teardown, then setup
            //      null -> something  =>  setup only
            //
            //      null -> null (precluded by fact of change being present)
            if (hadPreviousValue) {
                this.teardown(prev);
            }
            if (hasNewValue) {
                this.setup();
            }
        }
        else if (changes && changes.dragulaModel) {
            var _b = changes.dragulaModel, prev = _b.previousValue, current = _b.currentValue, firstChange = _b.firstChange;
            var drake = this.group.drake;
            if (this.dragula && drake) {
                drake.models = drake.models || [];
                /** @type {?} */
                var prevIndex = drake.models.indexOf(prev);
                if (prevIndex !== -1) {
                    // delete the previous
                    drake.models.splice(prevIndex, 1);
                    // maybe insert a new one at the same spot
                    if (!!current) {
                        drake.models.splice(prevIndex, 0, current);
                    }
                }
                else if (!!current) {
                    // no previous one to remove; just push this one.
                    drake.models.push(current);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    DragulaDirective.prototype.setup = /**
     * @return {?}
     */
    function () {
        var _this = this;
        /** @type {?} */
        var checkModel = function (group) {
            if (_this.dragulaModel) {
                if (group.drake.models) {
                    group.drake.models.push(_this.dragulaModel);
                }
                else {
                    group.drake.models = [_this.dragulaModel];
                }
            }
        };
        /** @type {?} */
        var group = this.dragulaService.find(this.dragula);
        if (!group) {
            /** @type {?} */
            var options = {};
            group = this.dragulaService.createGroup(this.dragula, options);
        }
        // ensure model and container element are pushed
        checkModel(group);
        group.drake.containers.push(this.container);
        this.subscribe(this.dragula);
        this.group = group;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    DragulaDirective.prototype.subscribe = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var _this = this;
        this.subs = new Subscription();
        this.subs.add(this.dragulaService
            .dropModel(name)
            .subscribe(function (_a) {
            var source = _a.source, target = _a.target, sourceModel = _a.sourceModel, targetModel = _a.targetModel;
            if (source === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(sourceModel);
            }
            else if (target === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(targetModel);
            }
        }));
        this.subs.add(this.dragulaService
            .removeModel(name)
            .subscribe(function (_a) {
            var source = _a.source, sourceModel = _a.sourceModel;
            if (source === _this.el.nativeElement) {
                _this.dragulaModelChange.emit(sourceModel);
            }
        }));
    };
    /**
     * @param {?} groupName
     * @return {?}
     */
    DragulaDirective.prototype.teardown = /**
     * @param {?} groupName
     * @return {?}
     */
    function (groupName) {
        if (this.subs) {
            this.subs.unsubscribe();
        }
        /** @type {?} */
        var group = this.dragulaService.find(groupName);
        if (group) {
            /** @type {?} */
            var itemToRemove = group.drake.containers.indexOf(this.el.nativeElement);
            if (itemToRemove !== -1) {
                group.drake.containers.splice(itemToRemove, 1);
            }
            if (this.dragulaModel && group.drake && group.drake.models) {
                /** @type {?} */
                var modelIndex = group.drake.models.indexOf(this.dragulaModel);
                if (modelIndex !== -1) {
                    group.drake.models.splice(modelIndex, 1);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    DragulaDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.teardown(this.dragula);
    };
    DragulaDirective.decorators = [
        { type: Directive, args: [{ selector: '[dragula]' },] }
    ];
    /** @nocollapse */
    DragulaDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DragulaService }
    ]; };
    DragulaDirective.propDecorators = {
        dragula: [{ type: Input }],
        dragulaModel: [{ type: Input }],
        dragulaModelChange: [{ type: Output }]
    };
    return DragulaDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DragulaModule = /** @class */ (function () {
    function DragulaModule() {
    }
    /**
     * @return {?}
     */
    DragulaModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: DragulaModule,
            providers: [DragulaService]
        };
    };
    DragulaModule.decorators = [
        { type: NgModule, args: [{
                    exports: [DragulaDirective],
                    declarations: [DragulaDirective],
                },] }
    ];
    return DragulaModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @type {?} */
var MockDrakeFactory = new DrakeFactory(function (containers, options) {
    return new MockDrake(containers, options);
});
/**
 * You can use MockDrake to simulate Drake events.
 *
 * The three methods that actually do anything are `on(event, listener)`,
 * `destroy()`, and a new method, `emit()`. Use `emit()` to manually emit Drake
 * events, and if you injected MockDrake properly with MockDrakeFactory or
 * mocked the DragulaService.find() method, then you can make ng2-dragula think
 * drags and drops are happening.
 *
 * Caveats:
 *
 * 1. YOU MUST MAKE THE DOM CHANGES YOURSELF.
 * 2. REPEAT: YOU MUST MAKE THE DOM CHANGES YOURSELF.
 *    That means `source.removeChild(el)`, and `target.insertBefore(el)`.
 * 3. None of the other methods do anything.
 *    That's ok, because ng2-dragula doesn't use them.
 */
var  /**
 * You can use MockDrake to simulate Drake events.
 *
 * The three methods that actually do anything are `on(event, listener)`,
 * `destroy()`, and a new method, `emit()`. Use `emit()` to manually emit Drake
 * events, and if you injected MockDrake properly with MockDrakeFactory or
 * mocked the DragulaService.find() method, then you can make ng2-dragula think
 * drags and drops are happening.
 *
 * Caveats:
 *
 * 1. YOU MUST MAKE THE DOM CHANGES YOURSELF.
 * 2. REPEAT: YOU MUST MAKE THE DOM CHANGES YOURSELF.
 *    That means `source.removeChild(el)`, and `target.insertBefore(el)`.
 * 3. None of the other methods do anything.
 *    That's ok, because ng2-dragula doesn't use them.
 */
MockDrake = /** @class */ (function () {
    /**
     * @param containers A list of container elements.
     * @param options These will NOT be used. At all.
     * @param models Nonstandard, but useful for testing using `new MockDrake()` directly.
     *               Note, default value is undefined, like a real Drake. Don't change that.
     */
    function MockDrake(containers, options, models) {
        if (containers === void 0) { containers = []; }
        if (options === void 0) { options = {}; }
        this.containers = containers;
        this.options = options;
        this.models = models;
        /* Doesn't represent anything meaningful. */
        this.dragging = false;
        this.emitter$ = new Subject();
        this.subs = new Subscription();
    }
    /* Does nothing useful. */
    /**
     * @param {?} item
     * @return {?}
     */
    MockDrake.prototype.start = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        this.dragging = true;
    };
    /* Does nothing useful. */
    /**
     * @return {?}
     */
    MockDrake.prototype.end = /**
     * @return {?}
     */
    function () {
        this.dragging = false;
    };
    /**
     * @param {?=} revert
     * @return {?}
     */
    MockDrake.prototype.cancel = /**
     * @param {?=} revert
     * @return {?}
     */
    function (revert) {
        this.dragging = false;
    };
    /* Does nothing useful. */
    /**
     * @return {?}
     */
    MockDrake.prototype.remove = /**
     * @return {?}
     */
    function () {
        this.dragging = false;
    };
    /**
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    MockDrake.prototype.on = /**
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    function (event, callback) {
        this.subs.add(this.emitter$
            .pipe(filter(function (_a) {
            var eventType = _a.eventType;
            return eventType === event;
        }))
            .subscribe(function (_a) {
            var args = _a.args;
            callback.apply(void 0, __spread(args));
        }));
    };
    /**
     * @return {?}
     */
    MockDrake.prototype.destroy = /**
     * @return {?}
     */
    function () {
        this.subs.unsubscribe();
    };
    /**
     * This is the most useful method. You can use it to manually fire events that would normally
     * be fired by a real drake.
     *
     * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
     * DragulaService uses to implement [dragulaModel].
     *
     * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
     *
     * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
     */
    /**
     * This is the most useful method. You can use it to manually fire events that would normally
     * be fired by a real drake.
     *
     * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
     * DragulaService uses to implement [dragulaModel].
     *
     * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
     *
     * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
     * @param {?} eventType
     * @param {...?} args
     * @return {?}
     */
    MockDrake.prototype.emit = /**
     * This is the most useful method. You can use it to manually fire events that would normally
     * be fired by a real drake.
     *
     * You're likely most interested in firing `drag`, `remove` and `drop`, the three events
     * DragulaService uses to implement [dragulaModel].
     *
     * See https://github.com/bevacqua/dragula#drakeon-events for what you should emit (and in what order).
     *
     * (Note also, firing dropModel and removeModel won't work. You would have to mock DragulaService for that.)
     * @param {?} eventType
     * @param {...?} args
     * @return {?}
     */
    function (eventType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.emitter$.next({ eventType: eventType, args: args });
    };
    return MockDrake;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { DragulaDirective, DragulaService, DragulaModule, dragula, DrakeFactory, Group, EventTypes, MockDrake, MockDrakeFactory };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLWRyYWd1bGEtd3VybXJvYmVydC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vbmcyLWRyYWd1bGEtd3VybXJvYmVydC9Hcm91cC50cyIsIm5nOi8vbmcyLWRyYWd1bGEtd3VybXJvYmVydC9FdmVudFR5cGVzLnRzIiwibmc6Ly9uZzItZHJhZ3VsYS13dXJtcm9iZXJ0L0RyYWtlRmFjdG9yeS50cyIsIm5nOi8vbmcyLWRyYWd1bGEtd3VybXJvYmVydC9jb21wb25lbnRzL2RyYWd1bGEuc2VydmljZS50cyIsIm5nOi8vbmcyLWRyYWd1bGEtd3VybXJvYmVydC9jb21wb25lbnRzL2RyYWd1bGEuZGlyZWN0aXZlLnRzIiwibmc6Ly9uZzItZHJhZ3VsYS13dXJtcm9iZXJ0L2NvbXBvbmVudHMvZHJhZ3VsYS5tb2R1bGUudHMiLCJuZzovL25nMi1kcmFndWxhLXd1cm1yb2JlcnQvTW9ja0RyYWtlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERyYWtlV2l0aE1vZGVscyB9IGZyb20gXCIuL0RyYWtlV2l0aE1vZGVsc1wiO1xuaW1wb3J0IHsgRHJhZ3VsYU9wdGlvbnMgfSBmcm9tIFwiLi9EcmFndWxhT3B0aW9uc1wiO1xuXG5leHBvcnQgY2xhc3MgR3JvdXAge1xuICBwdWJsaWMgaW5pdEV2ZW50czogYm9vbGVhbiA9IGZhbHNlO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyBkcmFrZTogRHJha2VXaXRoTW9kZWxzLFxuICAgIHB1YmxpYyBvcHRpb25zOiBEcmFndWxhT3B0aW9uc1xuICApIHt9XG59XG4iLCJleHBvcnQgZW51bSBFdmVudFR5cGVzIHtcbiAgICBDYW5jZWwgPSBcImNhbmNlbFwiLFxuICAgIENsb25lZCA9IFwiY2xvbmVkXCIsXG4gICAgRHJhZyA9IFwiZHJhZ1wiLFxuICAgIERyYWdFbmQgPSBcImRyYWdlbmRcIixcbiAgICBEcm9wID0gXCJkcm9wXCIsXG4gICAgT3V0ID0gXCJvdXRcIixcbiAgICBPdmVyID0gXCJvdmVyXCIsXG4gICAgUmVtb3ZlID0gXCJyZW1vdmVcIixcbiAgICBTaGFkb3cgPSBcInNoYWRvd1wiLFxuICAgIERyb3BNb2RlbCA9IFwiZHJvcE1vZGVsXCIsXG4gICAgUmVtb3ZlTW9kZWwgPSBcInJlbW92ZU1vZGVsXCIsXG59XG5cbmV4cG9ydCBjb25zdCBBbGxFdmVudHM6IEV2ZW50VHlwZXNbXSA9IE9iamVjdC5rZXlzKEV2ZW50VHlwZXMpLm1hcChrID0+IEV2ZW50VHlwZXNbayBhcyBhbnldIGFzIEV2ZW50VHlwZXMpO1xuXG5cbiIsImltcG9ydCB7IERyYWd1bGFPcHRpb25zIH0gZnJvbSAnLi9EcmFndWxhT3B0aW9ucyc7XG5pbXBvcnQgeyBEcmFrZVdpdGhNb2RlbHMgfSBmcm9tICcuL0RyYWtlV2l0aE1vZGVscyc7XG5pbXBvcnQgKiBhcyBkcmFndWxhRXhwdCBmcm9tICdkcmFndWxhJztcbmV4cG9ydCBjb25zdCBkcmFndWxhOiAoY29udGFpbmVycz86IGFueSwgb3B0aW9ucz86IGFueSkgPT4gYW55ID0gKGRyYWd1bGFFeHB0IGFzIGFueSkuZGVmYXVsdCB8fCBkcmFndWxhRXhwdDtcblxuZXhwb3J0IHR5cGUgRHJha2VCdWlsZGVyID0gKGNvbnRhaW5lcnM6IGFueVtdLCBvcHRpb25zOiBEcmFndWxhT3B0aW9ucykgPT4gRHJha2VXaXRoTW9kZWxzO1xuXG5leHBvcnQgY2xhc3MgRHJha2VGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IgKHB1YmxpYyBidWlsZDogRHJha2VCdWlsZGVyID0gZHJhZ3VsYSkge31cbn1cblxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSAnLi4vR3JvdXAnO1xuaW1wb3J0IHsgRHJhZ3VsYU9wdGlvbnMgfSBmcm9tICcuLi9EcmFndWxhT3B0aW9ucyc7XG5pbXBvcnQgeyBTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEV2ZW50VHlwZXMsIEFsbEV2ZW50cyB9IGZyb20gJy4uL0V2ZW50VHlwZXMnO1xuaW1wb3J0IHsgRHJha2VGYWN0b3J5IH0gZnJvbSAnLi4vRHJha2VGYWN0b3J5JztcblxudHlwZSBGaWx0ZXJQcm9qZWN0b3I8VCBleHRlbmRzIHsgbmFtZTogc3RyaW5nOyB9PiA9IChuYW1lOiBzdHJpbmcsIGFyZ3M6IGFueVtdKSA9PiBUO1xudHlwZSBEaXNwYXRjaCA9IHsgZXZlbnQ6IEV2ZW50VHlwZXM7IG5hbWU6IHN0cmluZzsgYXJnczogYW55W107IH07XG5cbmNvbnN0IGZpbHRlckV2ZW50ID0gPFQgZXh0ZW5kcyB7IG5hbWU6IHN0cmluZzsgfT4oXG4gIGV2ZW50VHlwZTogRXZlbnRUeXBlcyxcbiAgZmlsdGVyRHJhZ1R5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgcHJvamVjdG9yOiBGaWx0ZXJQcm9qZWN0b3I8VD5cbikgPT4gKGlucHV0OiBPYnNlcnZhYmxlPERpc3BhdGNoPik6IE9ic2VydmFibGU8VD4gPT4ge1xuICByZXR1cm4gaW5wdXQucGlwZShcbiAgICBmaWx0ZXIoKHsgZXZlbnQsIG5hbWUgfSkgPT4ge1xuICAgICAgcmV0dXJuIGV2ZW50ID09PSBldmVudFR5cGVcbiAgICAgICAgICAmJiAoZmlsdGVyRHJhZ1R5cGUgPT09IHVuZGVmaW5lZCB8fCBuYW1lID09PSBmaWx0ZXJEcmFnVHlwZSk7XG4gICAgfSksXG4gICAgbWFwKCh7IG5hbWUsIGFyZ3MgfSkgPT4gcHJvamVjdG9yKG5hbWUsIGFyZ3MpKVxuICApO1xufVxuXG5jb25zdCBlbENvbnRhaW5lclNvdXJjZVByb2plY3RvciA9XG4gIChuYW1lOiBzdHJpbmcsIFtlbCwgY29udGFpbmVyLCBzb3VyY2VdOiBbRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudF0pID0+XG4gICAgKHsgbmFtZSwgZWwsIGNvbnRhaW5lciwgc291cmNlIH0pO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRHJhZ3VsYVNlcnZpY2Uge1xuXG4gIC8qIGh0dHBzOi8vZ2l0aHViLmNvbS9iZXZhY3F1YS9kcmFndWxhI2RyYWtlb24tZXZlbnRzICovXG5cbiAgcHJpdmF0ZSBkaXNwYXRjaCQgPSBuZXcgU3ViamVjdDxEaXNwYXRjaD4oKTtcblxuICBwdWJsaWMgZHJhZyA9IChncm91cE5hbWU/OiBzdHJpbmcpID0+IHRoaXMuZGlzcGF0Y2gkLnBpcGUoXG4gICAgZmlsdGVyRXZlbnQoXG4gICAgICBFdmVudFR5cGVzLkRyYWcsXG4gICAgICBncm91cE5hbWUsXG4gICAgICAobmFtZSwgW2VsLCBzb3VyY2VdOiBbRWxlbWVudCwgRWxlbWVudF0pID0+ICh7IG5hbWUsIGVsLCBzb3VyY2UgfSlcbiAgICApXG4gICk7XG5cbiAgcHVibGljIGRyYWdlbmQgPSAoZ3JvdXBOYW1lPzogc3RyaW5nKSA9PiB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgIGZpbHRlckV2ZW50KFxuICAgICAgRXZlbnRUeXBlcy5EcmFnRW5kLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtlbF06IFtFbGVtZW50XSkgPT4gKHsgbmFtZSwgZWwgfSlcbiAgICApXG4gICk7XG5cbiAgcHVibGljIGRyb3AgPSAoZ3JvdXBOYW1lPzogc3RyaW5nKSA9PiB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgIGZpbHRlckV2ZW50KFxuICAgICAgRXZlbnRUeXBlcy5Ecm9wLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nXG4gICAgICBdOiBbRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudCwgRWxlbWVudF0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nIH07XG4gICAgICB9KVxuICApO1xuXG4gIHByaXZhdGUgZWxDb250YWluZXJTb3VyY2UgPVxuICAgIChldmVudFR5cGU6IEV2ZW50VHlwZXMpID0+XG4gICAgKGdyb3VwTmFtZT86IHN0cmluZykgPT5cbiAgICB0aGlzLmRpc3BhdGNoJC5waXBlKFxuICAgICAgZmlsdGVyRXZlbnQoZXZlbnRUeXBlLCBncm91cE5hbWUsIGVsQ29udGFpbmVyU291cmNlUHJvamVjdG9yKVxuICAgICk7XG5cbiAgcHVibGljIGNhbmNlbCA9IHRoaXMuZWxDb250YWluZXJTb3VyY2UoRXZlbnRUeXBlcy5DYW5jZWwpO1xuICBwdWJsaWMgcmVtb3ZlID0gdGhpcy5lbENvbnRhaW5lclNvdXJjZShFdmVudFR5cGVzLlJlbW92ZSk7XG4gIHB1YmxpYyBzaGFkb3cgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuU2hhZG93KTtcbiAgcHVibGljIG92ZXIgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuT3Zlcik7XG4gIHB1YmxpYyBvdXQgPSB0aGlzLmVsQ29udGFpbmVyU291cmNlKEV2ZW50VHlwZXMuT3V0KTtcblxuICBwdWJsaWMgY2xvbmVkID0gKGdyb3VwTmFtZT86IHN0cmluZykgPT4gdGhpcy5kaXNwYXRjaCQucGlwZShcbiAgICBmaWx0ZXJFdmVudChcbiAgICAgIEV2ZW50VHlwZXMuQ2xvbmVkLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgY2xvbmUsIG9yaWdpbmFsLCBjbG9uZVR5cGVcbiAgICAgIF06IFtFbGVtZW50LCBFbGVtZW50LCAnbWlycm9yJyB8ICdjb3B5J10pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgY2xvbmUsIG9yaWdpbmFsLCBjbG9uZVR5cGUgfVxuICAgICAgfSlcbiAgKTtcblxuICBwdWJsaWMgZHJvcE1vZGVsID0gPFQgPSBhbnk+KGdyb3VwTmFtZT86IHN0cmluZykgPT4gdGhpcy5kaXNwYXRjaCQucGlwZShcbiAgICBmaWx0ZXJFdmVudChcbiAgICAgIEV2ZW50VHlwZXMuRHJvcE1vZGVsLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIHNvdXJjZUluZGV4LCB0YXJnZXRJbmRleFxuICAgICAgXTogW0VsZW1lbnQsIEVsZW1lbnQsIEVsZW1lbnQsIEVsZW1lbnQsIFQsIFRbXSwgVFtdLCBudW1iZXIsIG51bWJlcl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIHNvdXJjZUluZGV4LCB0YXJnZXRJbmRleCB9XG4gICAgICB9KVxuICApO1xuXG4gIHB1YmxpYyByZW1vdmVNb2RlbCA9IDxUID0gYW55Pihncm91cE5hbWU/OiBzdHJpbmcpID0+IHRoaXMuZGlzcGF0Y2gkLnBpcGUoXG4gICAgZmlsdGVyRXZlbnQoXG4gICAgICBFdmVudFR5cGVzLlJlbW92ZU1vZGVsLFxuICAgICAgZ3JvdXBOYW1lLFxuICAgICAgKG5hbWUsIFtcbiAgICAgICAgZWwsIGNvbnRhaW5lciwgc291cmNlLCBpdGVtLCBzb3VyY2VNb2RlbCwgc291cmNlSW5kZXhcbiAgICAgIF06IFtFbGVtZW50LCBFbGVtZW50LCBFbGVtZW50LCBULCBUW10sIG51bWJlcl0pID0+IHtcbiAgICAgICAgcmV0dXJuIHsgbmFtZSwgZWwsIGNvbnRhaW5lciwgc291cmNlLCBpdGVtLCBzb3VyY2VNb2RlbCwgc291cmNlSW5kZXggfVxuICAgICAgfVxuICAgIClcbiAgKTtcblxuICBwcml2YXRlIGdyb3VwczogeyBbazogc3RyaW5nXTogR3JvdXAgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yIChAT3B0aW9uYWwoKSBwcml2YXRlIGRyYWtlRmFjdG9yeTogRHJha2VGYWN0b3J5ID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmRyYWtlRmFjdG9yeSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5kcmFrZUZhY3RvcnkgPSBuZXcgRHJha2VGYWN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFB1YmxpYyBtYWlubHkgZm9yIHRlc3RpbmcgcHVycG9zZXMuIFByZWZlciBgY3JlYXRlR3JvdXAoKWAuICovXG4gIHB1YmxpYyBhZGQoZ3JvdXA6IEdyb3VwKTogR3JvdXAge1xuICAgIGxldCBleGlzdGluZ0dyb3VwID0gdGhpcy5maW5kKGdyb3VwLm5hbWUpO1xuICAgIGlmIChleGlzdGluZ0dyb3VwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dyb3VwIG5hbWVkOiBcIicgKyBncm91cC5uYW1lICsgJ1wiIGFscmVhZHkgZXhpc3RzLicpO1xuICAgIH1cbiAgICB0aGlzLmdyb3Vwc1tncm91cC5uYW1lXSA9IGdyb3VwO1xuICAgIHRoaXMuaGFuZGxlTW9kZWxzKGdyb3VwKTtcbiAgICB0aGlzLnNldHVwRXZlbnRzKGdyb3VwKTtcbiAgICByZXR1cm4gZ3JvdXA7XG4gIH1cblxuICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBzW25hbWVdO1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3kobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGdyb3VwID0gdGhpcy5maW5kKG5hbWUpO1xuICAgIGlmICghZ3JvdXApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZ3JvdXAuZHJha2UgJiYgZ3JvdXAuZHJha2UuZGVzdHJveSgpO1xuICAgIGRlbGV0ZSB0aGlzLmdyb3Vwc1tuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgZ3JvdXAgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIE5vdGU6IGZvcm1lcmx5IGtub3duIGFzIGBzZXRPcHRpb25zYFxuICAgKi9cbiAgcHVibGljIGNyZWF0ZUdyb3VwPFQgPSBhbnk+KG5hbWU6IHN0cmluZywgb3B0aW9uczogRHJhZ3VsYU9wdGlvbnM8VD4pOiBHcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuYWRkKG5ldyBHcm91cChcbiAgICAgIG5hbWUsXG4gICAgICB0aGlzLmRyYWtlRmFjdG9yeS5idWlsZChbXSwgb3B0aW9ucyksXG4gICAgICBvcHRpb25zXG4gICAgKSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZU1vZGVscyh7IG5hbWUsIGRyYWtlLCBvcHRpb25zIH06IEdyb3VwKTogdm9pZCB7XG4gICAgbGV0IGRyYWdFbG06IGFueTtcbiAgICBsZXQgZHJhZ0luZGV4OiBudW1iZXI7XG4gICAgbGV0IGRyb3BJbmRleDogbnVtYmVyO1xuICAgIGRyYWtlLm9uKCdyZW1vdmUnLCAoZWw6IGFueSwgY29udGFpbmVyOiBhbnksIHNvdXJjZTogYW55KSA9PiB7XG4gICAgICBpZiAoIWRyYWtlLm1vZGVscykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQgc291cmNlTW9kZWwgPSBkcmFrZS5tb2RlbHNbZHJha2UuY29udGFpbmVycy5pbmRleE9mKHNvdXJjZSldO1xuICAgICAgc291cmNlTW9kZWwgPSBzb3VyY2VNb2RlbC5zbGljZSgwKTsgLy8gY2xvbmUgaXRcbiAgICAgIGNvbnN0IGl0ZW0gPSBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKVswXTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdSRU1PVkUnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvdXJjZU1vZGVsKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2gkLm5leHQoe1xuICAgICAgICBldmVudDogRXZlbnRUeXBlcy5SZW1vdmVNb2RlbCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgYXJnczogWyBlbCwgY29udGFpbmVyLCBzb3VyY2UsIGl0ZW0sIHNvdXJjZU1vZGVsLCBkcmFnSW5kZXggXVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgZHJha2Uub24oJ2RyYWcnLCAoZWw6IGFueSwgc291cmNlOiBhbnkpID0+IHtcbiAgICAgIGlmICghZHJha2UubW9kZWxzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRyYWdFbG0gPSBlbDtcbiAgICAgIGRyYWdJbmRleCA9IHRoaXMuZG9tSW5kZXhPZihlbCwgc291cmNlKTtcbiAgICB9KTtcbiAgICBkcmFrZS5vbignZHJvcCcsIChkcm9wRWxtOiBhbnksIHRhcmdldDogRWxlbWVudCwgc291cmNlOiBFbGVtZW50LCBzaWJsaW5nPzogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCFkcmFrZS5tb2RlbHMgfHwgIXRhcmdldCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkcm9wSW5kZXggPSB0aGlzLmRvbUluZGV4T2YoZHJvcEVsbSwgdGFyZ2V0KTtcbiAgICAgIGxldCBzb3VyY2VNb2RlbCA9IGRyYWtlLm1vZGVsc1tkcmFrZS5jb250YWluZXJzLmluZGV4T2Yoc291cmNlKV07XG4gICAgICBsZXQgdGFyZ2V0TW9kZWwgPSBkcmFrZS5tb2RlbHNbZHJha2UuY29udGFpbmVycy5pbmRleE9mKHRhcmdldCldO1xuICAgICAgLy8gY29uc29sZS5sb2coJ0RST1AnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHNvdXJjZU1vZGVsKTtcbiAgICAgIGxldCBpdGVtOiBhbnk7XG4gICAgICBpZiAodGFyZ2V0ID09PSBzb3VyY2UpIHtcbiAgICAgICAgc291cmNlTW9kZWwgPSBzb3VyY2VNb2RlbC5zbGljZSgwKVxuICAgICAgICBpdGVtID0gc291cmNlTW9kZWwuc3BsaWNlKGRyYWdJbmRleCwgMSlbMF07XG4gICAgICAgIHNvdXJjZU1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICAvLyB0aGlzIHdhcyB0cnVlIGJlZm9yZSB3ZSBjbG9uZWQgYW5kIHVwZGF0ZWQgc291cmNlTW9kZWwsXG4gICAgICAgIC8vIGJ1dCB0YXJnZXRNb2RlbCBzdGlsbCBoYXMgdGhlIG9sZCB2YWx1ZVxuICAgICAgICB0YXJnZXRNb2RlbCA9IHNvdXJjZU1vZGVsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGlzQ29weWluZyA9IGRyYWdFbG0gIT09IGRyb3BFbG07XG4gICAgICAgIGl0ZW0gPSBzb3VyY2VNb2RlbFtkcmFnSW5kZXhdO1xuICAgICAgICBpZiAoaXNDb3B5aW5nKSB7XG4gICAgICAgICAgaWYgKCFvcHRpb25zLmNvcHlJdGVtKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJZiB5b3UgaGF2ZSBlbmFibGVkIGBjb3B5YCBvbiBhIGdyb3VwLCB5b3UgbXVzdCBwcm92aWRlIGEgYGNvcHlJdGVtYCBmdW5jdGlvbi5cIilcbiAgICAgICAgICB9XG4gICAgICAgICAgaXRlbSA9IG9wdGlvbnMuY29weUl0ZW0oaXRlbSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQ29weWluZykge1xuICAgICAgICAgIHNvdXJjZU1vZGVsID0gc291cmNlTW9kZWwuc2xpY2UoMClcbiAgICAgICAgICBzb3VyY2VNb2RlbC5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXRNb2RlbCA9IHRhcmdldE1vZGVsLnNsaWNlKDApXG4gICAgICAgIHRhcmdldE1vZGVsLnNwbGljZShkcm9wSW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgICBpZiAoaXNDb3B5aW5nKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChkcm9wRWxtKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRpc3BhdGNoJC5uZXh0KHtcbiAgICAgICAgZXZlbnQ6IEV2ZW50VHlwZXMuRHJvcE1vZGVsLFxuICAgICAgICBuYW1lLFxuICAgICAgICBhcmdzOiBbIGRyb3BFbG0sIHRhcmdldCwgc291cmNlLCBzaWJsaW5nLCBpdGVtLCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwsIGRyYWdJbmRleCwgZHJvcEluZGV4IF1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cEV2ZW50cyhncm91cDogR3JvdXApOiB2b2lkIHtcbiAgICBpZiAoZ3JvdXAuaW5pdEV2ZW50cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBncm91cC5pbml0RXZlbnRzID0gdHJ1ZTtcbiAgICBjb25zdCBuYW1lID0gZ3JvdXAubmFtZTtcbiAgICBsZXQgdGhhdDogYW55ID0gdGhpcztcbiAgICBsZXQgZW1pdHRlciA9IChldmVudDogRXZlbnRUeXBlcykgPT4ge1xuICAgICAgZ3JvdXAuZHJha2Uub24oZXZlbnQsICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICB0aGlzLmRpc3BhdGNoJC5uZXh0KHsgZXZlbnQsIG5hbWUsIGFyZ3MgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIEFsbEV2ZW50cy5mb3JFYWNoKGVtaXR0ZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb21JbmRleE9mKGNoaWxkOiBhbnksIHBhcmVudDogYW55KTogYW55IHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChwYXJlbnQuY2hpbGRyZW4sIGNoaWxkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgT3V0cHV0LCBFbGVtZW50UmVmLCBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBTaW1wbGVDaGFuZ2UsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRHJhZ3VsYVNlcnZpY2UgfSBmcm9tICcuL2RyYWd1bGEuc2VydmljZSc7XG5pbXBvcnQgeyBEcmFrZVdpdGhNb2RlbHMgfSBmcm9tICcuLi9EcmFrZVdpdGhNb2RlbHMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBHcm91cCB9IGZyb20gJy4uL0dyb3VwJztcblxuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZHJhZ3VsYV0nfSlcbmV4cG9ydCBjbGFzcyBEcmFndWxhRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBwdWJsaWMgZHJhZ3VsYTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgZHJhZ3VsYU1vZGVsOiBhbnlbXTtcbiAgQE91dHB1dCgpIHB1YmxpYyBkcmFndWxhTW9kZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueVtdPigpO1xuXG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uO1xuXG4gIHByaXZhdGUgZ2V0IGNvbnRhaW5lcigpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuZWwgJiYgdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG4gIHByaXZhdGUgZ3JvdXA6IEdyb3VwO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIGRyYWd1bGFTZXJ2aWNlOiBEcmFndWxhU2VydmljZSkge1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IHtkcmFndWxhPzogU2ltcGxlQ2hhbmdlLCBkcmFndWxhTW9kZWw/OiBTaW1wbGVDaGFuZ2V9KTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMgJiYgY2hhbmdlcy5kcmFndWxhKSB7XG4gICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWU6IHByZXYsIGN1cnJlbnRWYWx1ZTogY3VycmVudCwgZmlyc3RDaGFuZ2UgfSA9IGNoYW5nZXMuZHJhZ3VsYTtcbiAgICAgIGxldCBoYWRQcmV2aW91c1ZhbHVlID0gISFwcmV2O1xuICAgICAgbGV0IGhhc05ld1ZhbHVlID0gISFjdXJyZW50O1xuICAgICAgLy8gc29tZXRoaW5nIC0+IG51bGwgICAgICAgPT4gIHRlYXJkb3duIG9ubHlcbiAgICAgIC8vIHNvbWV0aGluZyAtPiBzb21ldGhpbmcgID0+ICB0ZWFyZG93biwgdGhlbiBzZXR1cFxuICAgICAgLy8gICAgICBudWxsIC0+IHNvbWV0aGluZyAgPT4gIHNldHVwIG9ubHlcbiAgICAgIC8vXG4gICAgICAvLyAgICAgIG51bGwgLT4gbnVsbCAocHJlY2x1ZGVkIGJ5IGZhY3Qgb2YgY2hhbmdlIGJlaW5nIHByZXNlbnQpXG4gICAgICBpZiAoaGFkUHJldmlvdXNWYWx1ZSkge1xuICAgICAgICB0aGlzLnRlYXJkb3duKHByZXYpO1xuICAgICAgfVxuICAgICAgaWYgKGhhc05ld1ZhbHVlKSB7XG4gICAgICAgIHRoaXMuc2V0dXAoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoYW5nZXMgJiYgY2hhbmdlcy5kcmFndWxhTW9kZWwpIHtcbiAgICAgIC8vIHRoaXMgY29kZSBvbmx5IHJ1bnMgd2hlbiB5b3UncmUgbm90IGNoYW5naW5nIHRoZSBncm91cCBuYW1lXG4gICAgICAvLyBiZWNhdXNlIGlmIHlvdSdyZSBjaGFuZ2luZyB0aGUgZ3JvdXAgbmFtZSwgeW91J2xsIGJlIGRvaW5nIHNldHVwIG9yIHRlYXJkb3duXG4gICAgICAvLyBpdCBhbHNvIG9ubHkgcnVucyBpZiB0aGVyZSBpcyBhIGdyb3VwIG5hbWUgdG8gYXR0YWNoIHRvLlxuICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlOiBwcmV2LCBjdXJyZW50VmFsdWU6IGN1cnJlbnQsIGZpcnN0Q2hhbmdlIH0gPSBjaGFuZ2VzLmRyYWd1bGFNb2RlbDtcbiAgICAgIGNvbnN0IHsgZHJha2UgfSA9IHRoaXMuZ3JvdXA7XG4gICAgICBpZiAodGhpcy5kcmFndWxhICYmIGRyYWtlKSB7XG4gICAgICAgIGRyYWtlLm1vZGVscyA9IGRyYWtlLm1vZGVscyB8fCBbXTtcbiAgICAgICAgbGV0IHByZXZJbmRleCA9IGRyYWtlLm1vZGVscy5pbmRleE9mKHByZXYpO1xuICAgICAgICBpZiAocHJldkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgcHJldmlvdXNcbiAgICAgICAgICBkcmFrZS5tb2RlbHMuc3BsaWNlKHByZXZJbmRleCwgMSk7XG4gICAgICAgICAgLy8gbWF5YmUgaW5zZXJ0IGEgbmV3IG9uZSBhdCB0aGUgc2FtZSBzcG90XG4gICAgICAgICAgaWYgKCEhY3VycmVudCkge1xuICAgICAgICAgICAgZHJha2UubW9kZWxzLnNwbGljZShwcmV2SW5kZXgsIDAsIGN1cnJlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghIWN1cnJlbnQpIHtcbiAgICAgICAgICAvLyBubyBwcmV2aW91cyBvbmUgdG8gcmVtb3ZlOyBqdXN0IHB1c2ggdGhpcyBvbmUuXG4gICAgICAgICAgZHJha2UubW9kZWxzLnB1c2goY3VycmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBjYWxsIG5nT25Jbml0ICdzZXR1cCcgYmVjYXVzZSB3ZSB3YW50IHRvIGNhbGwgaXQgaW4gbmdPbkNoYW5nZXNcbiAgLy8gYW5kIGl0IHdvdWxkIG90aGVyd2lzZSBydW4gdHdpY2VcbiAgcHVibGljIHNldHVwKCk6IHZvaWQge1xuICAgIGxldCBjaGVja01vZGVsID0gKGdyb3VwOiBHcm91cCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZHJhZ3VsYU1vZGVsKSB7XG4gICAgICAgIGlmIChncm91cC5kcmFrZS5tb2RlbHMpIHtcbiAgICAgICAgICBncm91cC5kcmFrZS5tb2RlbHMucHVzaCh0aGlzLmRyYWd1bGFNb2RlbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JvdXAuZHJha2UubW9kZWxzID0gW3RoaXMuZHJhZ3VsYU1vZGVsXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBmaW5kIG9yIGNyZWF0ZSBhIGdyb3VwXG4gICAgbGV0IGdyb3VwID0gdGhpcy5kcmFndWxhU2VydmljZS5maW5kKHRoaXMuZHJhZ3VsYSk7XG4gICAgaWYgKCFncm91cCkge1xuICAgICAgbGV0IG9wdGlvbnMgPSB7fTtcbiAgICAgIGdyb3VwID0gdGhpcy5kcmFndWxhU2VydmljZS5jcmVhdGVHcm91cCh0aGlzLmRyYWd1bGEsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGVuc3VyZSBtb2RlbCBhbmQgY29udGFpbmVyIGVsZW1lbnQgYXJlIHB1c2hlZFxuICAgIGNoZWNrTW9kZWwoZ3JvdXApO1xuICAgIGdyb3VwLmRyYWtlLmNvbnRhaW5lcnMucHVzaCh0aGlzLmNvbnRhaW5lcik7XG4gICAgdGhpcy5zdWJzY3JpYmUodGhpcy5kcmFndWxhKTtcblxuICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcbiAgfVxuXG4gIHB1YmxpYyBzdWJzY3JpYmUobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIHRoaXMuc3Vicy5hZGQoXG4gICAgICB0aGlzLmRyYWd1bGFTZXJ2aWNlXG4gICAgICAuZHJvcE1vZGVsKG5hbWUpXG4gICAgICAuc3Vic2NyaWJlKCh7IHNvdXJjZSwgdGFyZ2V0LCBzb3VyY2VNb2RlbCwgdGFyZ2V0TW9kZWwgfSkgPT4ge1xuICAgICAgICBpZiAoc291cmNlID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLmRyYWd1bGFNb2RlbENoYW5nZS5lbWl0KHNvdXJjZU1vZGVsKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgIHRoaXMuZHJhZ3VsYU1vZGVsQ2hhbmdlLmVtaXQodGFyZ2V0TW9kZWwpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdWJzLmFkZChcbiAgICAgIHRoaXMuZHJhZ3VsYVNlcnZpY2VcbiAgICAgIC5yZW1vdmVNb2RlbChuYW1lKVxuICAgICAgLnN1YnNjcmliZSgoeyBzb3VyY2UsIHNvdXJjZU1vZGVsIH0pID0+IHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgdGhpcy5kcmFndWxhTW9kZWxDaGFuZ2UuZW1pdChzb3VyY2VNb2RlbCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyB0ZWFyZG93bihncm91cE5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnMpIHtcbiAgICAgIHRoaXMuc3Vicy51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBjb25zdCBncm91cCA9IHRoaXMuZHJhZ3VsYVNlcnZpY2UuZmluZChncm91cE5hbWUpO1xuICAgIGlmIChncm91cCkge1xuICAgICAgY29uc3QgaXRlbVRvUmVtb3ZlID0gZ3JvdXAuZHJha2UuY29udGFpbmVycy5pbmRleE9mKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICBpZiAoaXRlbVRvUmVtb3ZlICE9PSAtMSkge1xuICAgICAgICBncm91cC5kcmFrZS5jb250YWluZXJzLnNwbGljZShpdGVtVG9SZW1vdmUsIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZHJhZ3VsYU1vZGVsICYmIGdyb3VwLmRyYWtlICYmIGdyb3VwLmRyYWtlLm1vZGVscykge1xuICAgICAgICBsZXQgbW9kZWxJbmRleCA9IGdyb3VwLmRyYWtlLm1vZGVscy5pbmRleE9mKHRoaXMuZHJhZ3VsYU1vZGVsKTtcbiAgICAgICAgaWYgKG1vZGVsSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgZ3JvdXAuZHJha2UubW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnRlYXJkb3duKHRoaXMuZHJhZ3VsYSk7XG4gIH1cblxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERyYWd1bGFEaXJlY3RpdmUgfSBmcm9tICcuL2RyYWd1bGEuZGlyZWN0aXZlJztcbmltcG9ydCB7IERyYWd1bGFTZXJ2aWNlIH0gZnJvbSAnLi9kcmFndWxhLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBleHBvcnRzOiBbRHJhZ3VsYURpcmVjdGl2ZV0sXG4gIGRlY2xhcmF0aW9uczogW0RyYWd1bGFEaXJlY3RpdmVdLFxufSlcbmV4cG9ydCBjbGFzcyBEcmFndWxhTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBEcmFndWxhTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbRHJhZ3VsYVNlcnZpY2VdXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IERyYWtlV2l0aE1vZGVscyB9IGZyb20gJy4vRHJha2VXaXRoTW9kZWxzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEV2ZW50VHlwZXMgfSBmcm9tICcuL0V2ZW50VHlwZXMnO1xuaW1wb3J0IHsgRHJhZ3VsYU9wdGlvbnMgfSBmcm9tICcuL0RyYWd1bGFPcHRpb25zJztcbmltcG9ydCB7IERyYWtlRmFjdG9yeSB9IGZyb20gJy4vRHJha2VGYWN0b3J5JztcblxuZXhwb3J0IGNvbnN0IE1vY2tEcmFrZUZhY3RvcnkgPSBuZXcgRHJha2VGYWN0b3J5KChjb250YWluZXJzLCBvcHRpb25zKSA9PiB7XG4gIHJldHVybiBuZXcgTW9ja0RyYWtlKGNvbnRhaW5lcnMsIG9wdGlvbnMpO1xufSk7XG5cbi8qKiBZb3UgY2FuIHVzZSBNb2NrRHJha2UgdG8gc2ltdWxhdGUgRHJha2UgZXZlbnRzLlxuICpcbiAqIFRoZSB0aHJlZSBtZXRob2RzIHRoYXQgYWN0dWFsbHkgZG8gYW55dGhpbmcgYXJlIGBvbihldmVudCwgbGlzdGVuZXIpYCxcbiAqIGBkZXN0cm95KClgLCBhbmQgYSBuZXcgbWV0aG9kLCBgZW1pdCgpYC4gVXNlIGBlbWl0KClgIHRvIG1hbnVhbGx5IGVtaXQgRHJha2VcbiAqIGV2ZW50cywgYW5kIGlmIHlvdSBpbmplY3RlZCBNb2NrRHJha2UgcHJvcGVybHkgd2l0aCBNb2NrRHJha2VGYWN0b3J5IG9yXG4gKiBtb2NrZWQgdGhlIERyYWd1bGFTZXJ2aWNlLmZpbmQoKSBtZXRob2QsIHRoZW4geW91IGNhbiBtYWtlIG5nMi1kcmFndWxhIHRoaW5rXG4gKiBkcmFncyBhbmQgZHJvcHMgYXJlIGhhcHBlbmluZy5cbiAqXG4gKiBDYXZlYXRzOlxuICpcbiAqIDEuIFlPVSBNVVNUIE1BS0UgVEhFIERPTSBDSEFOR0VTIFlPVVJTRUxGLlxuICogMi4gUkVQRUFUOiBZT1UgTVVTVCBNQUtFIFRIRSBET00gQ0hBTkdFUyBZT1VSU0VMRi5cbiAqICAgIFRoYXQgbWVhbnMgYHNvdXJjZS5yZW1vdmVDaGlsZChlbClgLCBhbmQgYHRhcmdldC5pbnNlcnRCZWZvcmUoZWwpYC5cbiAqIDMuIE5vbmUgb2YgdGhlIG90aGVyIG1ldGhvZHMgZG8gYW55dGhpbmcuXG4gKiAgICBUaGF0J3Mgb2ssIGJlY2F1c2UgbmcyLWRyYWd1bGEgZG9lc24ndCB1c2UgdGhlbS5cbiAqL1xuZXhwb3J0IGNsYXNzIE1vY2tEcmFrZSBpbXBsZW1lbnRzIERyYWtlV2l0aE1vZGVscyB7XG4gIC8qKlxuICAgKiBAcGFyYW0gY29udGFpbmVycyBBIGxpc3Qgb2YgY29udGFpbmVyIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBUaGVzZSB3aWxsIE5PVCBiZSB1c2VkLiBBdCBhbGwuXG4gICAqIEBwYXJhbSBtb2RlbHMgTm9uc3RhbmRhcmQsIGJ1dCB1c2VmdWwgZm9yIHRlc3RpbmcgdXNpbmcgYG5ldyBNb2NrRHJha2UoKWAgZGlyZWN0bHkuXG4gICAqICAgICAgICAgICAgICAgTm90ZSwgZGVmYXVsdCB2YWx1ZSBpcyB1bmRlZmluZWQsIGxpa2UgYSByZWFsIERyYWtlLiBEb24ndCBjaGFuZ2UgdGhhdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBjb250YWluZXJzOiBFbGVtZW50W10gPSBbXSxcbiAgICBwdWJsaWMgb3B0aW9uczogRHJhZ3VsYU9wdGlvbnMgPSB7fSxcbiAgICBwdWJsaWMgbW9kZWxzPzogYW55W11bXVxuICApIHt9XG5cbiAgLyogRG9lc24ndCByZXByZXNlbnQgYW55dGhpbmcgbWVhbmluZ2Z1bC4gKi9cbiAgZHJhZ2dpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICBzdGFydChpdGVtOiBFbGVtZW50KTogdm9pZCB7XG4gICAgdGhpcy5kcmFnZ2luZyA9IHRydWU7XG4gIH1cbiAgLyogRG9lcyBub3RoaW5nIHVzZWZ1bC4gKi9cbiAgZW5kKCk6IHZvaWQge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuICAvKiBEb2VzIG5vdGhpbmcgdXNlZnVsLiAqL1xuICBjYW5jZWwocmV2ZXJ0OiBib29sZWFuKTogdm9pZDtcbiAgY2FuY2VsKCk6IHZvaWQ7XG4gIGNhbmNlbChyZXZlcnQ/OiBhbnkpIHtcbiAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2U7XG4gIH1cbiAgLyogRG9lcyBub3RoaW5nIHVzZWZ1bC4gKi9cbiAgcmVtb3ZlKCk6IHZvaWQge1xuICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIEJhc2ljIGJ1dCBmdWxseSBmdW5jdGlvbmFsIGV2ZW50IGVtaXR0ZXIgc2hpbVxuICBwcml2YXRlIGVtaXR0ZXIkID0gbmV3IFN1YmplY3Q8eyBldmVudFR5cGU6IEV2ZW50VHlwZXMsIGFyZ3M6IGFueVtdIH0+KCk7XG5cbiAgcHJpdmF0ZSBzdWJzID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IGFueSB7XG4gICAgdGhpcy5zdWJzLmFkZCh0aGlzLmVtaXR0ZXIkXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKCh7IGV2ZW50VHlwZSB9KSA9PiBldmVudFR5cGUgPT09IGV2ZW50KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoeyBhcmdzIH0pID0+IHtcbiAgICAgICAgY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICB9KSk7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vicy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIG1vc3QgdXNlZnVsIG1ldGhvZC4gWW91IGNhbiB1c2UgaXQgdG8gbWFudWFsbHkgZmlyZSBldmVudHMgdGhhdCB3b3VsZCBub3JtYWxseVxuICAgKiBiZSBmaXJlZCBieSBhIHJlYWwgZHJha2UuXG4gICAqXG4gICAqIFlvdSdyZSBsaWtlbHkgbW9zdCBpbnRlcmVzdGVkIGluIGZpcmluZyBgZHJhZ2AsIGByZW1vdmVgIGFuZCBgZHJvcGAsIHRoZSB0aHJlZSBldmVudHNcbiAgICogRHJhZ3VsYVNlcnZpY2UgdXNlcyB0byBpbXBsZW1lbnQgW2RyYWd1bGFNb2RlbF0uXG4gICAqXG4gICAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYmV2YWNxdWEvZHJhZ3VsYSNkcmFrZW9uLWV2ZW50cyBmb3Igd2hhdCB5b3Ugc2hvdWxkIGVtaXQgKGFuZCBpbiB3aGF0IG9yZGVyKS5cbiAgICpcbiAgICogKE5vdGUgYWxzbywgZmlyaW5nIGRyb3BNb2RlbCBhbmQgcmVtb3ZlTW9kZWwgd29uJ3Qgd29yay4gWW91IHdvdWxkIGhhdmUgdG8gbW9jayBEcmFndWxhU2VydmljZSBmb3IgdGhhdC4pXG4gICAqL1xuICBlbWl0KGV2ZW50VHlwZTogRXZlbnRUeXBlcywgLi4uYXJnczogYW55W10pIHtcbiAgICB0aGlzLmVtaXR0ZXIkLm5leHQoeyBldmVudFR5cGUsIGFyZ3MgfSlcbiAgfVxuXG59XG4iXSwibmFtZXMiOlsiKC8qKiBAdHlwZSB7P30gKi8gKGRyYWd1bGFFeHB0KSkuZGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxJQUFBO0lBRUUsZUFDUyxNQUNBLE9BQ0E7UUFGQSxTQUFJLEdBQUosSUFBSTtRQUNKLFVBQUssR0FB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