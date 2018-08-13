import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { DropdownComponent } from './dropdown.component';

@NgModule({
  declarations: [DropdownComponent],
  exports: [DropdownComponent],
  imports: [ClarityModule, CommonModule]
})
export class DropdownModule {}
