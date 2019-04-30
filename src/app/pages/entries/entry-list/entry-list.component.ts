import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(
    private entryService: EntryService
  ) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(entries => {
      console.log('entr', entries)
      this.entries = entries.map(e => Object.assign(new Entry(), e));
    });
  }

  deleteEntry(id) {
    const mustDelele = confirm('Are you sure to delete this entry?')
    if(mustDelele) {
      this.entryService.delete(id).subscribe(() => {
        this.entries = this.entries.filter(e => e.id !== id)
      });
    }
  }

}
