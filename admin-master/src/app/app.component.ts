import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { GlobalService } from "./@theme/services/global.service";
declare var ClientJS: any;
@Component({
  selector: "ngx-app",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit, OnDestroy {
  routerSub: Subscription;
  title = "Caregiver";
  routeOptions: any;
  deviceId: string = "";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private analytics: AnalyticsService,
    private global: GlobalService
  ) {
    // Generate Fingerprint Starts
    const client = new ClientJS();
    const ua = client.getBrowserData().ua;
    const canvasPrint = client.getCanvasPrint();
    const fingerprint = client.getCustomFingerprint(ua, canvasPrint);
    this.global.deviceId = fingerprint;
    // Generate Fingerprint Ends
  }

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.runOnRouteChange();
      }
    });
    this.analytics.trackPageViews();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  runOnRouteChange(): void {
    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.routeOptions = activeRoute.snapshot.data;
    });

    if (this.routeOptions) {
      if (this.routeOptions.hasOwnProperty("title")) {
        this.setTitle(this.routeOptions.title);
      }
    }
  }

  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle + " | Caregiver");
  }
}
