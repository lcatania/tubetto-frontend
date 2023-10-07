import { ApplicationRef, ComponentRef, Directive, ElementRef, EmbeddedViewRef, HostListener, Input, ViewContainerRef } from '@angular/core';
import { TooltipPosition } from './tooltip.enum';
import { TooltipComponent } from './tooltip.component';

@Directive({
    standalone: true,
    selector: '[tooltip]'
})
export class TooltipDirective {
    @Input() tooltip = '';
    @Input() position: TooltipPosition = 'DEFAULT';
    @Input() showDelay = 0;
    @Input() hideDelay = 0;
    @Input() refreshRate = 0

    private componentRef: ComponentRef<any> | null = null;
    private showTimeout?: number;
    private hideTimeout?: number;
    private touchTimeout?: number;
    private refreshInterval?: number;


    constructor(private elementRef: ElementRef, private appRef: ApplicationRef, private viewContainerRef: ViewContainerRef
    ) {
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        this.initializeTooltip();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        this.setHideTooltipTimeout();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove($event: MouseEvent): void {
        if (this.componentRef !== null && this.position === 'DYNAMIC') {
            this.componentRef.instance.left = $event.clientX;
            this.componentRef.instance.top = $event.clientY;
            this.componentRef.instance.tooltip = this.tooltip;
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart($event: TouchEvent): void {
        $event.preventDefault();
        window.clearTimeout(this.touchTimeout);
        this.touchTimeout = window.setTimeout(this.initializeTooltip.bind(this), 500);
    }

    @HostListener('touchend')
    onTouchEnd(): void {
        window.clearTimeout(this.touchTimeout);
        this.setHideTooltipTimeout();
    }

    private initializeTooltip() {
        if (this.componentRef === null) {
            window.clearInterval(this.hideDelay);
            this.componentRef = this.viewContainerRef.createComponent(TooltipComponent)

            if (this.appRef.components.findIndex(c => c.componentType === this.componentRef?.componentType) > -1)
                this.appRef.attachView(this.componentRef.hostView);
            const [tooltipDOMElement] = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes;

            this.setTooltipComponentProperties();

            document.body.appendChild(tooltipDOMElement);
            this.showTimeout = window.setTimeout(this.showTooltip.bind(this), this.showDelay);
            if(this.refreshRate > 0)
                this.refreshInterval = window.setInterval(this.setTooltipContent.bind(this), this.refreshRate)
        }
    }

    private setTooltipComponentProperties() {
        if (this.componentRef !== null) {
            this.componentRef.instance.tooltip = this.tooltip;
            this.componentRef.instance.position = this.position;

            const { left, right, top, bottom } = this.elementRef.nativeElement.getBoundingClientRect();

            switch (this.position) {
                case 'BELOW': {
                    this.componentRef.instance.left = Math.round((right - left) / 2 + left);
                    this.componentRef.instance.top = Math.round(bottom);
                    break;
                }
                case 'ABOVE': {
                    this.componentRef.instance.left = Math.round((right - left) / 2 + left) + 10;
                    this.componentRef.instance.top = Math.round(top) - 5;
                    break;
                }
                case 'RIGHT': {
                    this.componentRef.instance.left = Math.round(right);
                    this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
                    break;
                }
                case 'LEFT': {
                    this.componentRef.instance.left = Math.round(left);
                    this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    private setTooltipContent() {
        if (this.componentRef !== null) {
            this.componentRef.instance.tooltip = this.tooltip;
        }
    }

    private showTooltip() {
        if (this.componentRef !== null) {
            this.componentRef.instance.visible = true;
        }
    }

    private setHideTooltipTimeout() {
        this.hideTimeout = window.setTimeout(this.destroy.bind(this), this.hideDelay);
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    destroy(): void {
        if (this.componentRef !== null) {
            window.clearTimeout(this.showTimeout);
            window.clearTimeout(this.hideDelay);
            window.clearInterval(this.refreshInterval);
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}