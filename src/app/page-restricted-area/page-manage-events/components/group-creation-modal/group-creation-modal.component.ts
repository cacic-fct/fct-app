import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-creation-modal',
  templateUrl: './group-creation-modal.component.html',
  styleUrls: ['./group-creation-modal.component.scss'],
})
export class GroupCreationModalComponent implements OnInit {
  @Input() groupList!: Array<any>;
  constructor() {}

  ngOnInit() {}
}
