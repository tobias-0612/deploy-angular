import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DATA } from 'src/app/MOCK_DATA';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  const car = DATA[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    component.car = car;
    fixture.detectChanges();
  });

  function text(selector: string): string {
    return fixture.debugElement.query(By.css(selector)).nativeElement.textContent.trim();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the make, model, vin and year of the car', () => {
    expect(text('.make')).toBe(car.make);
    expect(text('.model')).toBe(car.model);
    expect(text('.vin')).toBe(String(car.vin));
    expect(text('.year')).toBe(String(car.year));
  });

  it('should emit the car id when Remove is clicked', () => {
    let emitted: string | undefined;
    component.remove.subscribe((id: string) => emitted = id);

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(emitted).toBe(car.id);
  });
});
