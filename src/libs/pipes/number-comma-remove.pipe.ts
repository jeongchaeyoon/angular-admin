import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberCommaRemove' })
export class NumberCommaRemovePipe implements PipeTransform {

	transform(value: string): string {

		if (!value) {
			return '';
		}

		var sNum = value.toString().replace(/[\s+]/, '').trim();
		var reg = new RegExp(/[^\d]+/);
		sNum = sNum.replace(reg, '');		
		return sNum;
	}
}