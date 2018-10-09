import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringSplit' })
export class StringSplitPipe implements PipeTransform {

	transform(value: string, condition: any ): string {
		var tempArray = value.split(condition.mark);
		return tempArray[condition.index];
	}
}