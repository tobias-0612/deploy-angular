import { TestBed } from '@angular/core/testing';

import { Car, CarService } from './car.service';
import { DATA } from './MOCK_DATA';

describe('CarService', () => {
  let service: CarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarService);
  });

  // BehaviorSubject emits synchronously, so the latest value is available right away
  function latest(): ReadonlyArray<Car> {
    let value: ReadonlyArray<Car> = [];
    service.getCars().subscribe(v => value = v).unsubscribe();
    return value;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCars should emit all cars initially', () => {
    expect(latest()).toEqual(DATA);
  });

  it('getCarsByMake should emit only cars of that make, ignoring case', () => {
    service.getCarsByMake('gmc');

    const cars = latest();
    expect(cars.length).toBeGreaterThan(0);
    expect(cars).toEqual(DATA.filter(c => c.make === 'GMC'));
  });

  it('getCarsByMake should emit an empty list for an unknown make', () => {
    service.getCarsByMake('NoSuchMake');
    expect(latest()).toEqual([]);
  });

  it('clear should emit all cars again after filtering', () => {
    service.getCarsByMake('GMC');
    service.clear();
    expect(latest()).toEqual(DATA);
  });

  it('remove should emit the cars without the removed car', () => {
    const id = DATA[0].id;

    service.remove(id);

    const cars = latest();
    expect(cars.length).toBe(DATA.length - 1);
    expect(cars.some(c => c.id === id)).toBeFalse();
    expect(service.data).toEqual(cars);
  });

  it('clear after remove currently brings the removed car back', () => {
    // clear() emits DATA rather than this.data - documenting current behaviour
    service.remove(DATA[0].id);
    service.clear();
    expect(latest()).toEqual(DATA);
  });

  it('getAllCars should emit each make exactly once', () => {
    const makes: string[] = [];
    service.getAllCars().subscribe(c => makes.push(c.make)).unsubscribe();

    const expected = DATA.map(c => c.make).filter((make, i, all) => all.indexOf(make) === i);
    expect(makes).toEqual(expected);
  });
});
