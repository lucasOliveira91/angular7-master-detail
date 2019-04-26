import {InMemoryDbService} from 'angular-in-memory-web-api';
export class InMemoryDataBase implements InMemoryDbService {

    createDb() {
        const categories = [
            {
                id: 1,
                name: 'Laisure',
                description: 'Movies, Park, Beach, etc'
            },
            {
                id: 2,
                name: 'Health',
                description: 'Health insurence, medicines'
            },
            {
                id: 3,
                name: 'Wege',
                description: 'Wage ticket'
            }    
        ];

        return {categories};
    }

}
