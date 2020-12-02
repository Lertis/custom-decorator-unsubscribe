import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Unsubscriber } from "./decorators/unsubscriber";

@Component({
	templateUrl: "./app.component.html"
})
// To be able to provide unsubscription destroyed$ property should be declared
@Unsubscriber()
export class AppComponent {
	private readonly destroyed$ = new Subject<void>();

	constructor(private readonly http: HttpClient) {
		this.http.get(`https://jsonplaceholder.typicode.com/users`).pipe(
			takeUntil(this.destroyed$)
		).subscribe((users) => {
			console.log(`Users: ${users}`);
		});
	}

}
