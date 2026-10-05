import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';

describe('AppComponent', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lesson07-exercise'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('lesson07-exercise');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toBe('Cars');
  });

  // The list module is lazy loaded with a real import(), so these tests use
  // async/await instead of fakeAsync
  it('should redirect the empty path to /list', async () => {
    TestBed.createComponent(AppComponent);
    await router.navigate(['']);
    expect(location.path()).toBe('/list');
  });

  it('should lazy load the list page when navigating to /list', async () => {
    const fixture = TestBed.createComponent(AppComponent);

    const success = await router.navigateByUrl('/list');
    fixture.detectChanges();

    expect(success).toBeTrue();
    expect(location.path()).toBe('/list');
    expect(fixture.debugElement.query(By.directive(ListComponent))).toBeTruthy();
  });

  it('should navigate to /list when the List link is clicked', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('a').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(location.path()).toBe('/list');
    expect(fixture.debugElement.query(By.directive(ListComponent))).toBeTruthy();
  });
});
