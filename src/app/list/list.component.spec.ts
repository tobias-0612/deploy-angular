import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Car, CarService } from '../car.service';
import { DATA } from '../MOCK_DATA';
import { ItemComponent } from './item/item.component';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let fixture: ComponentFixture<ListComponent>;
  let carService: jasmine.SpyObj<CarService>;
  const testCars: ReadonlyArray<Car> = DATA.slice(0, 3);

  function setup(cars: ReadonlyArray<Car>) {
    carService = jasmine.createSpyObj<CarService>('CarService', ['getCars', 'remove']);
    carService.getCars.and.returnValue(of(cars) as any);

    TestBed.configureTestingModule({
      declarations: [ ListComponent, ItemComponent ],
      providers: [{ provide: CarService, useValue: carService }],
      // <app-filter> is not under test here
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    fixture.detectChanges();
  }

  function items() {
    return fixture.debugElement.queryAll(By.directive(ItemComponent));
  }

  it('should create', () => {
    setup(testCars);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the heading', () => {
    setup(testCars);
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Available cars');
  });

  it('should render one item per car, in order', () => {
    setup(testCars);

    const rendered = items();
    expect(rendered.length).toBe(testCars.length);
    rendered.forEach((item, i) => {
      expect(item.componentInstance.car).toEqual(testCars[i]);
      expect(item.nativeElement.querySelector('.make').textContent).toBe(testCars[i].make);
      expect(item.nativeElement.querySelector('.model').textContent).toBe(testCars[i].model);
    });
  });

  it('should render no items when there are no cars', () => {
    setup([]);
    expect(items().length).toBe(0);
  });

  it('should remove a car through the service when an item emits remove', () => {
    setup(testCars);

    items()[1].nativeElement.querySelector('button').click();

    expect(carService.remove).toHaveBeenCalledOnceWith(testCars[1].id);
  });
});
