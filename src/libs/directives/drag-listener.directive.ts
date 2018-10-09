import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
	selector: '[dragListener]'
})
export class DragListenerDirective {
	
	@Output() dragEventRequest = new EventEmitter();

	@HostListener('mousedown', ['$event']) onMouseDown(e) {
		this.onDragListener(e);
	}

	@HostListener('window:mousemove', ['$event']) onMouseMove(e) {
		this.onDragListener(e);
	}

	@HostListener('window:mouseup', ['$event']) onMouseUp(e) {
		this.onDragListener(e);
	}

	@HostListener('touchstart', ['$event']) onTouchStart(e) {
		this.onDragListener(e);
	}

	@HostListener('touchmove', ['$event']) onTouchMove(e) {
		this.onDragListener(e);
	}

	@HostListener('touchend', ['$event']) onTouchEnd(e) {
		this.onDragListener(e);
	}

	onDragListener(e): void {
		this.dragEventRequest.emit(e);
	}
}