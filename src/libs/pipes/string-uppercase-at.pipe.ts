import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stringUppercaseAt' })
export class StringUppercaseAtPipe implements PipeTransform {

	transform(value: string, index: number = 0): string {

		var word = value.charAt(index);
		var reg = new RegExp(word);
		var result = value.replace(word, word.toUpperCase());
		return result;
	}
}