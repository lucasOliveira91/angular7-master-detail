import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toastr } from 'toastr';
import { switchMap } from 'rxjs/operators';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string = 'new';
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected fb: FormBuilder;
    protected route: ActivatedRoute;
    protected router: Router;

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData) => T
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.fb = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction !== 'edit') {
            this.createResource();
            return;
        }

        this.updateResource();
    }

    // Protected Methods
    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.create(resource).subscribe(
            resource => this.acttionForSuccess(resource),
            error => this.actionsForError(error)
        );
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.update(resource).subscribe(
            resource => this.acttionForSuccess(resource),
            error => this.actionsForError(error)
        );
    }

    protected acttionForSuccess(resource: T) {
        // toastr.success('Solicitação processada com sucesso.');

        //It doen't add to navigate history
        const baseComponentPath = this.route.snapshot.parent.url[0].path;
        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(() => {
            this.router.navigate([baseComponentPath, resource.id, 'edit']);
        });
    }

    protected actionsForError(error) {
        toastr.error(`Error em sua solicitação. ${error}`)
        this.submittingForm = false;

        if (error.status === '422') {
            this.serverErrorMessages = JSON.parse(error._body).erros;
        } else {
            this.serverErrorMessages = ['Falha na comunicação.'];
        }
    }


    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path !== 'new') {
            this.currentAction = 'edit'
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(switchMap(params => this.resourceService.getById(+params.get('id')))).subscribe(resource => {
                this.resource = resource;
                this.resourceForm.patchValue(this.resource);
            }, error => alert('Ocorreu um erro'));
        }
    }

    protected setPageTitle() {
        if (this.currentAction === 'edit' && this.resource) {
            this.pageTitle = this.editionPageTitle();
        } else {
            this.pageTitle = this.creationPageTitle();
        }
    }

    protected creationPageTitle(): string {
        return 'Novo';
    }

    protected editionPageTitle() {
        return 'Edição';
    }
    
    protected abstract buildResourceForm(): void;
}
