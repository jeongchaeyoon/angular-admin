
export class StringUtilService {

	digit(value: number): string {
		return (value < 10) ? '0'+value : ''+value;
	}

	getYesterday(date): string {
		
		var selectDate = date.split("-");
		var changeDate = new Date();
		changeDate.setFullYear(selectDate[0], selectDate[1]-1, selectDate[2]-1);
		
		var y = changeDate.getFullYear();
		var m = changeDate.getMonth() + 1;
		var d = changeDate.getDate();
		
		var resultDate = y + "-" + this.digit(m) + "-" +  this.digit(d);
		return resultDate;
	}

	validateEmail(value: string): boolean {
		var reg = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		return reg.test(value);
	}
}