import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-foto-recorte',
  standalone: true,
  imports: [],
  templateUrl: './foto-recorte.component.html',
  styleUrls: ['./foto-recorte.component.css'],
})
export class FotoRecorteComponent implements OnInit {
  @Input() imagen = '';
  @Output() aplicada = new EventEmitter<string>();
  @Output() cerrada = new EventEmitter<void>();

  private readonly S = 300;
  private readonly OUT = 400;

  imgW = 0;
  imgH = 0;
  zoom = 1;
  panX = 0;
  panY = 0;
  dragging = false;
  private startX = 0;
  private startY = 0;
  private startPanX = 0;
  private startPanY = 0;

  ngOnInit(): void {
    const img = new Image();
    img.onload = () => {
      this.imgW = img.naturalWidth;
      this.imgH = img.naturalHeight;
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
    };
    img.src = this.imagen;
  }

  get baseScale(): number {
    const min = Math.min(this.imgW, this.imgH);
    return min > 0 ? this.S / min : 1;
  }

  get displayedW(): number {
    return this.imgW * this.baseScale * this.zoom;
  }

  get displayedH(): number {
    return this.imgH * this.baseScale * this.zoom;
  }

  get left(): number {
    let l = (this.S - this.displayedW) / 2 + this.panX;
    l = Math.min(0, l);
    l = Math.max(this.S - this.displayedW, l);
    return l;
  }

  get top(): number {
    let t = (this.S - this.displayedH) / 2 + this.panY;
    t = Math.min(0, t);
    t = Math.max(this.S - this.displayedH, t);
    return t;
  }

  onPointerDown(e: PointerEvent): void {
    this.dragging = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startPanX = this.panX;
    this.startPanY = this.panY;
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    this.panX = this.startPanX + (e.clientX - this.startX);
    this.panY = this.startPanY + (e.clientY - this.startY);
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  onZoomChange(valor: string): void {
    const z = parseFloat(valor);
    if (!isNaN(z)) {
      this.zoom = z;
    }
  }

  aplicar(): void {
    const scaleImg = this.baseScale * this.zoom;
    if (scaleImg <= 0 || !this.imgW || !this.imgH) {
      return;
    }
    const x0 = -this.left / scaleImg;
    const y0 = -this.top / scaleImg;
    const size = this.S / scaleImg;

    const canvas = document.createElement('canvas');
    canvas.width = this.OUT;
    canvas.height = this.OUT;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, x0, y0, size, size, 0, 0, this.OUT, this.OUT);
      this.aplicada.emit(canvas.toDataURL('image/png'));
    };
    img.src = this.imagen;
  }

  cerrar(): void {
    this.cerrada.emit();
  }
}
