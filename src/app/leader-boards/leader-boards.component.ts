import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
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
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import {MatButton} from '@angular/material/button';

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
    NgClass,
    MatIcon,
    MatSortHeader,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatButton,
  ],
  templateUrl: './leader-boards.component.html',
  styleUrl: './leader-boards.component.scss',
})
export class LeaderBoardsComponent implements OnInit, AfterViewInit {
  userDataService = inject(UserDataService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  displayedColumns = ['id', 'name', 'general-score', 'advanced-score'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChildren(MatRow, { read: ElementRef }) matRows!: QueryList<MatRow>;

  ngOnInit(): void {
    this.userDataService.user.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
      this.dataSource.data = response;
      this.sortData();
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  sortData(): void {
    this.sort.active = 'score';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit();
  }

  get topScore():User[] {
    if (this.sort.active === 'score') {
      let scoreSet = new Set(this.dataSource.data.sort((a, b) => b.score - a.score).slice(0, 3));
      return Array.from(scoreSet);
    } else {
      let scoreSet = new Set(this.dataSource.data.sort((a, b) => b.olderScore - a.olderScore).slice(0, 3));
      return Array.from(scoreSet);
    }
  }

  isTopScore(id: string):boolean {
    return this.topScore.some(user => user.id === id);
  }

  isFirstAndSecond():boolean {
    if(this.sort.active==='score'){
      return this.topScore[0].score === this.topScore[1].score
    }else {
      return this.topScore[0].olderScore === this.topScore[1].olderScore;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
