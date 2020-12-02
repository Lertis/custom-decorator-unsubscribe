import { ɵComponentDef, ɵComponentType } from "@angular/core";
import { Subject } from "rxjs";

// We need this interface override the readonly keyword
// on the properties that we want to re-assign.
export interface ComponentDef<T> extends ɵComponentDef<T> {
	factory: FactoryFn<T>;
	onDestroy: (() => void) | null;
}

export interface FactoryFn<T> {
	<U extends T>(t: ComponentType<U>): U;
	(t?: undefined): T;
}

export type ComponentType<T> = ɵComponentType<T>;

export function Unsubscriber(): any {
	return (cmpType: ComponentType<any>) => {
		const cmp: ComponentDef<typeof cmpType> = getComponentProp(cmpType, "ɵcmp");
		const cmpOndestroy: (() => void) | null = cmp.onDestroy;
		cmpType.prototype.destroyed$ = new Subject<void>();
		cmp.onDestroy = function() {
			this.destroyed$.next();
			this.destroyed$.complete();
			if (cmpOndestroy !== null) {
				cmpOndestroy.apply(this);
			}
		};
	};
}

function getComponentProp<T, K extends keyof T>(t: ComponentType<T>, key: string): T[K] {
	if (t.hasOwnProperty(key)) {
		return t[key];
	}

	throw new Error("No Angular property found for " + t.name);
}
