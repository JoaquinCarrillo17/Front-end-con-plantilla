import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrl: './range-slider.component.scss'
})
export class RangeSliderComponent implements OnInit {
  @Input() min: number = 0;
  @Input() max: number = 1000;
  @Input() initialMinValue: any;
  @Input() initialMaxValue: any;
  @Output() rangeChange = new EventEmitter<{ min: number; max: number }>();

  minValue: number;
  maxValue: number;

  constructor() {

  }

  ngOnInit(): void {
    this.minValue = this.initialMinValue;
    this.maxValue = this.initialMaxValue;
    setTimeout(() => this.updateRange(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialMinValue'] || changes['initialMaxValue']) {
      this.minValue = this.initialMinValue;
      this.maxValue = this.initialMaxValue;
      this.updateRange();
    }
  }

  updateRange(): void {
    // Emit the updated values whenever the range is changed
    this.rangeChange.emit({ min: this.minValue, max: this.maxValue });

    // Calculate the width and position of the slider track
    const track = document.querySelector('.slider-track') as HTMLElement;
    if (track) {
      const minPercent = ((this.minValue - this.min) / (this.max - this.min)) * 100;
      const maxPercent = ((this.maxValue - this.min) / (this.max - this.min)) * 100;
      track.style.left = `${minPercent}%`;
      track.style.width = `${maxPercent - minPercent}%`;
    }
  }
}
