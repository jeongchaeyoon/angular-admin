import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringCompare' })
export class StringComparePipe implements PipeTransform {

	transform(value: string, compare: string): boolean {

		value = value.replace(/[\s+]/, '').trim();
		compare = compare.replace(/[\s+]/, '').trim();

		var reg = new RegExp(value,'gi');
		return reg.test(compare);
	}
}