import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberCommaAdd' })
export class NumberCommaAddPipe implements PipeTransform {

	transform(value: number, cond: any[] = []): string {

		if (!value && isNaN(value)) {
			return '';
		}

		var glue = ',';
		var limit = 3;

		if (cond[0]) {
			glue = cond[0];
		}

		if (cond[1]) {
			limit = cond[1];
		}

		var sNum = value.toString().replace(/[\s+]/, '').trim();
		var reg = new RegExp(/(\d)(?=(?:\d{3})+(?!\d))/);
		while (reg.test(sNum)) {
			sNum = sNum.replace(reg, '$1,');			
		}		
		return sNum;
	}
}