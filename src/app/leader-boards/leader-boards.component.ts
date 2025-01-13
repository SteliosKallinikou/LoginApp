import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../shared/service/user-data.service';
import { User } from '../shared/models';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Location, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-leader-boards',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRow,
    MatHeaderRow,
    MatSort,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatCellDef,
    MatRowDef,
    NgClass,
    MatIcon,
    MatSortHeader,
  ],
  templateUrl: './leader-boards.component.html',
  styleUrl: './leader-boards.component.scss',
})
export class LeaderBoardsComponent implements OnInit, AfterViewInit {
  userDataService = inject(UserDataService);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  displayedColumns = ['id', 'name', 'general-score', 'advanced-score'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.userDataService.getUser().subscribe(response => {
      this.dataSource.data = response;
      this.sortData();
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  isTop(index: number): boolean {
    return index < 3;
  }

  sortData(): void {
    this.sort.active = 'score';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  sortScores(): void {
    const isDesc = this.sort.direction === 'desc';
     this.dataSource.data.slice().sort((a, b) => {
      if (this.sort.active === 'score') {
        return this.compare(parseInt(a.score), parseInt(b.score), isDesc);
      }
      if (this.sort.active === 'olderScore') {
        return this.compare(parseInt(a.score), parseInt(b.score), isDesc);
      } else {
        return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isDesc: boolean): number {
    return (a < b ? -1 : 1) * (isDesc ? 1 : -1);
  }

  goBack(): void {
    this.location.back();
  }
}
