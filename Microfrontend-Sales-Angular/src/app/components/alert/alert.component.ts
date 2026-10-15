import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { State } from '../../interfaces/state.interface';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  imports: [CommonModule],
})
export class AlertComponent {
  @Input() alertState: State = 'init';
  @Input() text = '';

  getClass(state: State): string {
    const alertClassMap: Record<State, string> = {
      init: 'alert-light',
      loading: 'alert-info',
      success: 'alert-success',
      error: 'alert-danger',
    };

    return alertClassMap[state] ?? 'alert-light';
  }
}
