import { OnInit, Injector } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

    resources: T[] = [];

    constructor(
        protected resourceService: BaseResourceService<T>
    ) { }

    ngOnInit() {
        this.resourceService.getAll().subscribe(resources => {
            this.resources = resources;
        });
    }

    deleteResource(id) {
        const mustDelele = confirm('Are you sure to delete this resource?')
        if (mustDelele) {
            this.resourceService.delete(id).subscribe(() => {
                this.resources = this.resources.filter(e => e.id !== id)
            });
        }
    }
}
