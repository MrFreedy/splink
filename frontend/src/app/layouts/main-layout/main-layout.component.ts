import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeadbarComponent } from "../../headbar/headbar.component";

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, HeadbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
