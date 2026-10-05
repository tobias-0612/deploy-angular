import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { from } from 'rxjs';
import { CarService } from 'src/app/car.service';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let carService: jasmine.SpyObj<CarService>;

  beforeEach(async () => {
    carService = jasmine.createSpyObj<CarService>('CarService', ['getAllCars', 'getCarsByMake', 'clear']);
    carService.getAllCars.and.returnValue(from([{ make: 'Ford' }, { make: 'GMC' }]) as any);

    await TestBed.configureTestingModule({
      declarations: [ FilterComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [{ provide: CarService, useValue: carService }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an option for each make', () => {
    const options: HTMLOptionElement[] = Array.from(fixture.nativeElement.querySelectorAll('option'));
    expect(options.map(o => o.textContent)).toEqual(['Ford', 'GMC']);
  });

  it('should filter by the selected make', () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'GMC';
    select.dispatchEvent(new Event('change'));

    expect(carService.getCarsByMake).toHaveBeenCalledOnceWith('GMC');
  });

  it('should reset the form and clear the filter when Clear is clicked', () => {
    component.selectMakeForm.setValue({ make: 'GMC' });

    fixture.nativeElement.querySelector('button').click();

    expect(component.selectMakeForm.value.make).toBeNull();
    expect(carService.clear).toHaveBeenCalled();
  });
});
