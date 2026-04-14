import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageResizerPage } from './image-resizer.page';

describe('ImageResizerPage', () => {
  let component: ImageResizerPage;
  let fixture: ComponentFixture<ImageResizerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageResizerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
